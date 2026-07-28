export interface Company {
  id: string;
  name: string;
  domain: string;
  userLimit: number;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
}

export interface User {
  id: string;
  companyId: string; // Tenant Isolation Field
  name: string;
  email: string;
  roleId: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface Role {
  id: string;
  companyId: string | null; // null for global roles (like Master Admin), companyId for custom tenant roles
  name: string;
  description: string;
  createdAt: string;
}

export interface Permission {
  code: string; // e.g. "finance:read", "users:create"
  name: string;
  description: string;
  module: 'finance' | 'users' | 'roles' | 'companies';
  action: 'READ' | 'CREATE' | 'EDIT' | 'DELETE';
}

export interface RolePermission {
  roleId: string;
  permissionCode: string;
}

// Session details for the simulated logged-in user
export interface SaasSession {
  token: string;
  user: User;
  company: Company | null; // null for System Master Admin
  role: Role;
  permissions: string[]; // List of permission codes
}
