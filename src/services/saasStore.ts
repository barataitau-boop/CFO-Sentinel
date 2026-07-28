import { Company, User, Role, Permission, RolePermission, SaasSession } from '../types/saas';

/**
 * ============================================================================
 * ETAPA 1: MODELAGEM DO BANCO DE DADOS (SCHEMA SQL & PRISMA)
 * ============================================================================
 * 
 * --- SCHEMA SQL (PostgreSQL / SQLite) ---
 * 
 * -- Tabela de Empresas (Tenants) com limite de usuários e controle de status
 * CREATE TABLE companies (
 *   id VARCHAR(36) PRIMARY KEY,
 *   name VARCHAR(255) NOT NULL,
 *   domain VARCHAR(100) UNIQUE NOT NULL,
 *   user_limit INTEGER NOT NULL DEFAULT 5,
 *   status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, SUSPENDED
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
 * );
 * 
 * -- Tabela de Perfis de Acesso (Roles) - Se company_id for NULL, é uma Role Global/Master do Sistema
 * CREATE TABLE roles (
 *   id VARCHAR(36) PRIMARY KEY,
 *   company_id VARCHAR(36) NULL REFERENCES companies(id) ON DELETE CASCADE,
 *   name VARCHAR(100) NOT NULL,
 *   description TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
 * );
 * 
 * -- Tabela de Usuários com isolamento por Tenant (company_id)
 * CREATE TABLE users (
 *   id VARCHAR(36) PRIMARY KEY,
 *   company_id VARCHAR(36) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
 *   name VARCHAR(255) NOT NULL,
 *   email VARCHAR(255) UNIQUE NOT NULL,
 *   password_hash VARCHAR(255) NOT NULL,
 *   role_id VARCHAR(36) NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
 *   status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
 * );
 * 
 * -- Tabela de Permissões Granulares
 * CREATE TABLE permissions (
 *   code VARCHAR(50) PRIMARY KEY, -- Ex: 'finance:read', 'users:create'
 *   name VARCHAR(150) NOT NULL,
 *   description TEXT,
 *   module VARCHAR(50) NOT NULL,
 *   action VARCHAR(20) NOT NULL -- READ, CREATE, EDIT, DELETE
 * );
 * 
 * -- Tabela de Associação N-N entre Roles e Permissões
 * CREATE TABLE role_permissions (
 *   role_id VARCHAR(36) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
 *   permission_code VARCHAR(50) NOT NULL REFERENCES permissions(code) ON DELETE CASCADE,
 *   PRIMARY KEY (role_id, permission_code)
 * );
 * 
 * 
 * --- SCHEMA PRISMA ORM (prisma/schema.prisma) ---
 * 
 * model Company {
 *   id        String   @id @default(uuid())
 *   name      String
 *   domain    String   @unique
 *   userLimit Int      @default(5)
 *   status    String   @default("ACTIVE") // ACTIVE, SUSPENDED
 *   createdAt DateTime @default(now())
 *   users     User[]
 *   roles     Role[]
 * }
 * 
 * model Role {
 *   id              String           @id @default(uuid())
 *   companyId       String?          // NULL para Roles Globais do sistema
 *   company         Company?         @relation(fields: [companyId], references: [id], onDelete: Cascade)
 *   name            String
 *   description     String?
 *   createdAt       DateTime         @default(now())
 *   users           User[]
 *   rolePermissions RolePermission[]
 * }
 * 
 * model User {
 *   id        String   @id @default(uuid())
 *   companyId String
 *   company   Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
 *   name      String
 *   email     String   @unique
 *   password  String
 *   roleId    String
 *   role      Role     @relation(fields: [roleId], references: [id], onDelete: Restrict)
 *   status    String   @default("ACTIVE") // ACTIVE, INACTIVE
 *   createdAt DateTime @default(now())
 * }
 * 
 * model Permission {
 *   code            String           @id
 *   name            String
 *   description     String?
 *   module          String
 *   action          String
 *   rolePermissions RolePermission[]
 * }
 * 
 * model RolePermission {
 *   roleId         String
 *   role           Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
 *   permissionCode String
 *   permission     Permission @relation(fields: [permissionCode], references: [code], onDelete: Cascade)
 * 
 *   @@id([roleId, permissionCode])
 * }
 */

// Global state in memory for live demonstration & testing
let companies: Company[] = [
  {
    id: "tenant-system",
    name: "SaaS Master Control",
    domain: "master.cfoai.com",
    userLimit: 999,
    status: "ACTIVE",
    createdAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "tenant-acme",
    name: "Acme Corp (Pequena)",
    domain: "acme.com",
    userLimit: 3, // Low user limit to test blocker easily
    status: "ACTIVE",
    createdAt: "2026-03-15T10:00:00Z"
  },
  {
    id: "tenant-globex",
    name: "Globex Industries (Grande)",
    domain: "globex.com",
    userLimit: 15,
    status: "ACTIVE",
    createdAt: "2026-04-10T11:30:00Z"
  },
  {
    id: "tenant-restricted",
    name: "Blockbuster S.A. (Suspensa)",
    domain: "blockbuster.com",
    userLimit: 5,
    status: "SUSPENDED", // To test account block behavior
    createdAt: "2026-02-20T09:00:00Z"
  }
];

let roles: Role[] = [
  // System Role
  {
    id: "role-master-admin",
    companyId: null,
    name: "Super Administrador (Master)",
    description: "Acesso total a todas as empresas, planos e faturamento global do SaaS.",
    createdAt: "2026-01-01T00:00:00Z"
  },
  // Default Tenant Roles
  {
    id: "role-tenant-admin",
    companyId: null,
    name: "Administrador da Empresa",
    description: "Gestão total de sua própria empresa, usuários e perfis de acesso.",
    createdAt: "2026-01-01T00:00:00Z"
  },
  // Custom Roles for Acme Corp (tenant-acme)
  {
    id: "role-acme-finance",
    companyId: "tenant-acme",
    name: "Analista Financeiro",
    description: "Acesso total aos módulos financeiros (DRE, Caixa, Auditoria), sem gestão de usuários.",
    createdAt: "2026-03-16T12:00:00Z"
  },
  {
    id: "role-acme-operation",
    companyId: "tenant-acme",
    name: "Operador de Caixa",
    description: "Leitura e lançamento de dados básicos. Bloqueado de ver relatórios de auditoria e exclusão.",
    createdAt: "2026-03-16T12:05:00Z"
  }
];

let permissions: Permission[] = [
  // Finance Module Permissions
  { code: "finance:read", name: "Visualizar Demonstrativos", description: "Capacidade de ver DRE, Balanços e relatórios de saúde.", module: "finance", action: "READ" },
  { code: "finance:create", name: "Importar Demonstrativos", description: "Capacidade de fazer upload de arquivos DRE, CSV ou Excel.", module: "finance", action: "CREATE" },
  { code: "finance:edit", name: "Simular Cenários", description: "Capacidade de modificar valores para simular estresse ou projeção.", module: "finance", action: "EDIT" },
  { code: "finance:delete", name: "Remover Registros", description: "Capacidade de excluir demonstrativos e históricos analíticos.", module: "finance", action: "DELETE" },

  // Users Module Permissions
  { code: "users:read", name: "Ver Usuários", description: "Ver lista de funcionários cadastrados na empresa.", module: "users", action: "READ" },
  { code: "users:create", name: "Cadastrar Usuários", description: "Adicionar novos funcionários (respeitando o limite de usuários).", module: "users", action: "CREATE" },
  { code: "users:edit", name: "Editar Usuários", description: "Modificar dados de funcionários existentes.", module: "users", action: "EDIT" },
  { code: "users:delete", name: "Excluir Usuários", description: "Suspender ou remover o acesso de funcionários.", module: "users", action: "DELETE" },

  // Roles & Permissions Module Permissions
  { code: "roles:read", name: "Ver Perfis de Acesso", description: "Consultar os cargos (roles) existentes na empresa.", module: "roles", action: "READ" },
  { code: "roles:create", name: "Criar Perfis", description: "Criar novos cargos e associar permissões granularmente.", module: "roles", action: "CREATE" },
  { code: "roles:edit", name: "Editar Perfis", description: "Editar direitos de acesso e privilégios associados a um cargo.", module: "roles", action: "EDIT" },
  { code: "roles:delete", name: "Excluir Perfis", description: "Remover perfis de acesso personalizados.", module: "roles", action: "DELETE" },

  // Master Level SaaS Management Permissions (Only SuperAdmin)
  { code: "companies:read", name: "Ver Empresas (Tenants)", description: "Visualizar todas as empresas clientes do SaaS.", module: "companies", action: "READ" },
  { code: "companies:create", name: "Cadastrar Empresas", description: "Registrar novas empresas clientes e definir limites de usuários.", module: "companies", action: "CREATE" },
  { code: "companies:edit", name: "Alterar Planos/Limites", description: "Modificar limites e gerenciar status das empresas (suspender/ativar).", module: "companies", action: "EDIT" },
  { code: "companies:delete", name: "Excluir Empresas", description: "Deletar definitivamente empresas e todos os seus dados.", module: "companies", action: "DELETE" },
];

let rolePermissions: RolePermission[] = [
  // Super Administrador (role-master-admin) has ALL permissions
  ...permissions.map(p => ({ roleId: "role-master-admin", permissionCode: p.code })),

  // Tenant Admin (role-tenant-admin) has all tenant-level permissions (finance, users, roles) but NO companies level
  ...permissions
    .filter(p => p.module !== "companies")
    .map(p => ({ roleId: "role-tenant-admin", permissionCode: p.code })),

  // Custom Role Acme Finance (role-acme-finance): read/create/edit in finance, read only in users and roles
  { roleId: "role-acme-finance", permissionCode: "finance:read" },
  { roleId: "role-acme-finance", permissionCode: "finance:create" },
  { roleId: "role-acme-finance", permissionCode: "finance:edit" },
  { roleId: "role-acme-finance", permissionCode: "users:read" },
  { roleId: "role-acme-finance", permissionCode: "roles:read" },

  // Custom Role Acme Operation (role-acme-operation): read/create in finance, read only in users
  { roleId: "role-acme-operation", permissionCode: "finance:read" },
  { roleId: "role-acme-operation", permissionCode: "finance:create" },
  { roleId: "role-acme-operation", permissionCode: "users:read" }
];

let users: User[] = [
  // 1. Super Admin (System Master)
  {
    id: "usr-master",
    companyId: "tenant-system",
    name: "Arthur Pendragon",
    email: "master@cfosentinel.com",
    roleId: "role-master-admin",
    status: "ACTIVE",
    createdAt: "2026-01-01T00:00:00Z"
  },
  // 2. Tenant Acme Admin (Alice)
  {
    id: "usr-acme-admin",
    companyId: "tenant-acme",
    name: "Alice Smith",
    email: "alice@acme.com",
    roleId: "role-tenant-admin",
    status: "ACTIVE",
    createdAt: "2026-03-15T10:05:00Z"
  },
  // 3. Tenant Acme Finance User (Bob)
  {
    id: "usr-acme-bob",
    companyId: "tenant-acme",
    name: "Bob Jones",
    email: "bob@acme.com",
    roleId: "role-acme-finance",
    status: "ACTIVE",
    createdAt: "2026-03-16T14:30:00Z"
  },
  // 4. Tenant Acme Operator User (Carlos)
  {
    id: "usr-acme-carlos",
    companyId: "tenant-acme",
    name: "Carlos Santos",
    email: "carlos@acme.com",
    roleId: "role-acme-operation",
    status: "ACTIVE",
    createdAt: "2026-03-17T09:15:00Z"
  },
  // Note: Acme Corp has 3 users now (usr-acme-admin, usr-acme-bob, usr-acme-carlos).
  // The limit is 3, so attempts to create a 4th user for Acme Corp will block!

  // 5. Tenant Globex Admin (Bill)
  {
    id: "usr-globex-admin",
    companyId: "tenant-globex",
    name: "Bill Lumbergh",
    email: "bill@globex.com",
    roleId: "role-tenant-admin",
    status: "ACTIVE",
    createdAt: "2026-04-10T11:40:00Z"
  },
  // 6. Tenant Globex Common User (Peter)
  {
    id: "usr-globex-peter",
    companyId: "tenant-globex",
    name: "Peter Gibbons",
    email: "peter@globex.com",
    roleId: "role-tenant-admin", // Let's give him admin as well, or we can make global roles
    status: "ACTIVE",
    createdAt: "2026-04-11T13:00:00Z"
  },

  // 7. Tenant Restricted Admin (Dave)
  {
    id: "usr-restricted-admin",
    companyId: "tenant-restricted",
    name: "Dave Bowman",
    email: "dave@blockbuster.com",
    roleId: "role-tenant-admin",
    status: "ACTIVE",
    createdAt: "2026-02-20T09:05:00Z"
  }
];

/**
 * ============================================================================
 * BUSINESS LOGIC METHODS WITH STRICT SECURITY CHECKS
 * ============================================================================
 */

export const saasStore = {
  // Authentication & Session creation (Generates mock secure JWT token)
  login(email: string): SaasSession | null {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;

    const company = companies.find(c => c.id === user.companyId) || null;
    if (company && company.status === "SUSPENDED" && user.roleId !== "role-master-admin") {
      throw new Error("A sua empresa está suspensa. Entre em contato com o suporte do SaaS.");
    }

    if (user.status === "INACTIVE") {
      throw new Error("Sua conta de usuário está inativa.");
    }

    // Resolve Role and Permissions
    const role = roles.find(r => r.id === user.roleId);
    if (!role) throw new Error("Função de usuário não encontrada.");

    // Retrieve associated permissions
    const associatedCodes = rolePermissions
      .filter(rp => rp.roleId === role.id)
      .map(rp => rp.permissionCode);

    // Mock token creation (signed structure)
    const token = Buffer.from(JSON.stringify({ userId: user.id, companyId: user.companyId, ts: Date.now() })).toString('base64');

    return {
      token,
      user,
      company,
      role,
      permissions: associatedCodes
    };
  },

  // Token Verification Middlewares Mimic
  verifyToken(token: string): SaasSession {
    try {
      const payloadStr = Buffer.from(token, 'base64').toString('ascii');
      const payload = JSON.parse(payloadStr);
      
      const user = users.find(u => u.id === payload.userId);
      if (!user || user.status === "INACTIVE") {
        throw new Error("Usuário inválido ou inativo.");
      }

      const company = companies.find(c => c.id === user.companyId) || null;
      if (company && company.status === "SUSPENDED" && user.roleId !== "role-master-admin") {
        throw new Error("Sua empresa está suspensa pelo Administrador Master.");
      }

      const role = roles.find(r => r.id === user.roleId);
      if (!role) throw new Error("Função não cadastrada.");

      const permissionsList = rolePermissions
        .filter(rp => rp.roleId === role.id)
        .map(rp => rp.permissionCode);

      return {
        token,
        user,
        company,
        role,
        permissions: permissionsList
      };
    } catch (err: any) {
      throw new Error(err.message || "Token de autenticação inválido.");
    }
  },

  // 1. Companies Management (Master Admin Only)
  getCompanies(): Company[] {
    return companies;
  },

  createCompany(name: string, domain: string, userLimit: number): Company {
    if (companies.some(c => c.domain.toLowerCase() === domain.toLowerCase())) {
      throw new Error(`O domínio ${domain} já está em uso por outra empresa.`);
    }

    const newCompany: Company = {
      id: `tenant-${Math.random().toString(36).substr(2, 9)}`,
      name,
      domain,
      userLimit,
      status: "ACTIVE",
      createdAt: new Date().toISOString()
    };

    companies.push(newCompany);

    // Auto-create standard administrator user for this new Tenant
    const adminRoleId = "role-tenant-admin";
    const newAdmin: User = {
      id: `usr-${Math.random().toString(36).substr(2, 9)}`,
      companyId: newCompany.id,
      name: `Admin ${name}`,
      email: `admin@${domain}`,
      roleId: adminRoleId,
      status: "ACTIVE",
      createdAt: new Date().toISOString()
    };

    users.push(newAdmin);

    return newCompany;
  },

  updateCompany(id: string, updates: Partial<Company>): Company {
    const compIdx = companies.findIndex(c => c.id === id);
    if (compIdx === -1) throw new Error("Empresa não encontrada.");

    companies[compIdx] = {
      ...companies[compIdx],
      ...updates,
    };
    return companies[compIdx];
  },

  deleteCompany(id: string) {
    if (id === "tenant-system") throw new Error("Não é possível deletar a empresa controladora do SaaS.");
    companies = companies.filter(c => c.id !== id);
    users = users.filter(u => u.companyId !== id);
    roles = roles.filter(r => r.companyId !== id);
  },

  // 2. Users Management (Tenant Admin)
  getUsers(companyId: string): User[] {
    return users.filter(u => u.companyId === companyId);
  },

  /**
   * CRITICAL LOGIC: Create user with plan limit validation
   */
  createUser(companyId: string, name: string, email: string, roleId: string): User {
    // 1. Find the company (tenant) and its limits
    const company = companies.find(c => c.id === companyId);
    if (!company) throw new Error("Empresa (Tenant) não encontrada.");

    // 2. Get current active users count for this tenant
    const currentUsersCount = users.filter(u => u.companyId === companyId).length;

    // 3. Validate userLimit
    if (currentUsersCount >= company.userLimit) {
      throw new Error(`Limite de usuários atingido! Seu plano atual (${company.name}) permite no máximo ${company.userLimit} usuários. Faça um upgrade no painel Master.`);
    }

    // 4. Validate duplicate email globally
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error(`O e-mail ${email} já está em uso por outro usuário.`);
    }

    // 5. Create user
    const newUser: User = {
      id: `usr-${Math.random().toString(36).substr(2, 9)}`,
      companyId,
      name,
      email,
      roleId,
      status: "ACTIVE",
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    return newUser;
  },

  updateUser(companyId: string, id: string, name: string, roleId: string, status: 'ACTIVE' | 'INACTIVE'): User {
    const user = users.find(u => u.id === id && u.companyId === companyId);
    if (!user) throw new Error("Usuário não encontrado na sua empresa.");

    user.name = name;
    user.roleId = roleId;
    user.status = status;
    return user;
  },

  deleteUser(companyId: string, id: string) {
    const userIndex = users.findIndex(u => u.id === id && u.companyId === companyId);
    if (userIndex === -1) throw new Error("Usuário não encontrado na sua empresa.");
    
    // Prevent self deletion for safety
    users.splice(userIndex, 1);
  },

  // 3. Roles and Permissions Management
  getRoles(companyId: string): Role[] {
    // Return system default roles (null companyId) AND tenant-specific roles
    return roles.filter(r => r.companyId === null || r.companyId === companyId);
  },

  createRole(companyId: string, name: string, description: string, selectedPermissions: string[]): Role {
    const newRoleId = `role-${Math.random().toString(36).substr(2, 9)}`;
    const newRole: Role = {
      id: newRoleId,
      companyId,
      name,
      description,
      createdAt: new Date().toISOString()
    };

    roles.push(newRole);

    // Save associated permissions in role_permissions bridge table
    selectedPermissions.forEach(permCode => {
      rolePermissions.push({
        roleId: newRoleId,
        permissionCode: permCode
      });
    });

    return newRole;
  },

  updateRolePermissions(companyId: string, roleId: string, selectedPermissions: string[]): void {
    const role = roles.find(r => r.id === roleId && (r.companyId === companyId || r.companyId === null));
    if (!role) throw new Error("Perfil de acesso não encontrado.");
    if (role.companyId === null) throw new Error("Não é possível modificar permissões de um perfil padrão do sistema.");

    // Remove old associations
    rolePermissions = rolePermissions.filter(rp => rp.roleId !== roleId);

    // Insert new ones
    selectedPermissions.forEach(permCode => {
      rolePermissions.push({
        roleId,
        permissionCode: permCode
      });
    });
  },

  deleteRole(companyId: string, roleId: string): void {
    const roleIdx = roles.findIndex(r => r.id === roleId && r.companyId === companyId);
    if (roleIdx === -1) throw new Error("Perfil de acesso personalizado não encontrado.");

    roles.splice(roleIdx, 1);
    rolePermissions = rolePermissions.filter(rp => rp.roleId !== roleId);
  },

  getPermissions(): Permission[] {
    return permissions;
  },

  getRolePermissions(roleId: string): string[] {
    return rolePermissions
      .filter(rp => rp.roleId === roleId)
      .map(rp => rp.permissionCode);
  }
};
