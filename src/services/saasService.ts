import { SaasSession, Company, User, Role, Permission } from '../types/saas';

// Store the token in memory/localStorage for request headers
let activeToken: string | null = null;

export function setSaasToken(token: string | null) {
  activeToken = token;
  if (token) {
    localStorage.setItem('saas_token', token);
  } else {
    localStorage.removeItem('saas_token');
  }
}

export function getSaasToken(): string | null {
  if (!activeToken) {
    activeToken = localStorage.getItem('saas_token');
  }
  return activeToken;
}

// Custom fetch wrapper that automatically includes the simulated Bearer JWT token
async function apiFetch(url: string, options: RequestInit = {}): Promise<any> {
  const token = getSaasToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro de rede: Código ${response.status}`);
  }

  return response.json();
}

export const saasService = {
  // Login simulated API call
  async login(email: string): Promise<SaasSession> {
    const session = await apiFetch('/api/saas/login', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    setSaasToken(session.token);
    return session;
  },

  // Get active session
  async getMe(): Promise<SaasSession> {
    return apiFetch('/api/saas/me');
  },

  // 1. Companies Endpoints (Master Admin only)
  async getCompanies(): Promise<Company[]> {
    return apiFetch('/api/saas/companies');
  },

  async createCompany(name: string, domain: string, userLimit: number): Promise<Company> {
    return apiFetch('/api/saas/companies', {
      method: 'POST',
      body: JSON.stringify({ name, domain, userLimit })
    });
  },

  async updateCompany(id: string, updates: Partial<Company>): Promise<Company> {
    return apiFetch(`/api/saas/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async deleteCompany(id: string): Promise<{ message: string }> {
    return apiFetch(`/api/saas/companies/${id}`, {
      method: 'DELETE'
    });
  },

  // 2. Users Endpoints (Tenant Admin/Authorized User)
  async getUsers(): Promise<User[]> {
    return apiFetch('/api/saas/users');
  },

  async createUser(name: string, email: string, roleId: string): Promise<User> {
    return apiFetch('/api/saas/users', {
      method: 'POST',
      body: JSON.stringify({ name, email, roleId })
    });
  },

  async updateUser(id: string, name: string, roleId: string, status: 'ACTIVE' | 'INACTIVE'): Promise<User> {
    return apiFetch(`/api/saas/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, roleId, status })
    });
  },

  async deleteUser(id: string): Promise<{ message: string }> {
    return apiFetch(`/api/saas/users/${id}`, {
      method: 'DELETE'
    });
  },

  // 3. Roles and Permissions Endpoints
  async getRoles(): Promise<Role[]> {
    return apiFetch('/api/saas/roles');
  },

  async createRole(name: string, description: string, selectedPermissions: string[]): Promise<Role> {
    return apiFetch('/api/saas/roles', {
      method: 'POST',
      body: JSON.stringify({ name, description, selectedPermissions })
    });
  },

  async updateRolePermissions(roleId: string, selectedPermissions: string[]): Promise<{ message: string }> {
    return apiFetch(`/api/saas/roles/${roleId}`, {
      method: 'PUT',
      body: JSON.stringify({ selectedPermissions })
    });
  },

  async deleteRole(roleId: string): Promise<{ message: string }> {
    return apiFetch(`/api/saas/roles/${roleId}`, {
      method: 'DELETE'
    });
  },

  async getPermissions(): Promise<Permission[]> {
    return apiFetch('/api/saas/permissions');
  },

  async getRolePermissions(roleId: string): Promise<string[]> {
    return apiFetch(`/api/saas/role-permissions/${roleId}`);
  }
};
