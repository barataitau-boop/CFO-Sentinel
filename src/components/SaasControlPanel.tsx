import { useState, useEffect } from 'react';
import React from 'react';
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Key, 
  Plus, 
  Trash2, 
  Edit2, 
  AlertCircle, 
  UserPlus, 
  CheckCircle, 
  Info, 
  Layers, 
  RefreshCw,
  Eye,
  Check,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { saasService } from '../services/saasService';
import { Company, User, Role, Permission, SaasSession } from '../types/saas';

interface SaasControlPanelProps {
  session: SaasSession;
  onRefreshSession: () => void;
}

export default function SaasControlPanel({ session, onRefreshSession }: SaasControlPanelProps) {
  // Tabs for the control panel: Tenants (Master), Users, Roles & Permissions
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'roles' | 'tenants'>('users');
  
  // Loading & error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Data states
  const [companies, setCompanies] = useState<Company[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [systemPermissions, setSystemPermissions] = useState<Permission[]>([]);

  // Modals / forms states
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  // Edit states
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Form Fields
  const [companyForm, setCompanyForm] = useState({ name: '', domain: '', userLimit: 5 });
  const [userForm, setUserForm] = useState({ name: '', email: '', roleId: '' });
  const [roleForm, setRoleForm] = useState({ name: '', description: '', permissions: [] as string[] });

  const isSuperAdmin = session.user.roleId === 'role-master-admin';
  const hasUserRead = session.permissions.includes('users:read');
  const hasUserCreate = session.permissions.includes('users:create');
  const hasUserEdit = session.permissions.includes('users:edit');
  const hasUserDelete = session.permissions.includes('users:delete');

  const hasRoleRead = session.permissions.includes('roles:read');
  const hasRoleCreate = session.permissions.includes('roles:create');
  const hasRoleEdit = session.permissions.includes('roles:edit');
  const hasRoleDelete = session.permissions.includes('roles:delete');

  const hasCompaniesRead = session.permissions.includes('companies:read');

  // Load all necessary data
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (hasCompaniesRead) {
        const comps = await saasService.getCompanies();
        setCompanies(comps);
      }
      if (hasUserRead) {
        const usrs = await saasService.getUsers();
        setUsers(usrs);
      }
      if (hasRoleRead) {
        const rls = await saasService.getRoles();
        setRoles(rls);
      }
      const perms = await saasService.getPermissions();
      setSystemPermissions(perms);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao carregar dados do painel SaaS.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Set active sub-tab based on permissions
    if (isSuperAdmin) {
      setActiveSubTab('tenants');
    } else if (hasUserRead) {
      setActiveSubTab('users');
    } else if (hasRoleRead) {
      setActiveSubTab('roles');
    }
  }, [session]);

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // ============================================================================
  // TENANT ACTIONS (Master Admin)
  // ============================================================================
  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (editingCompany) {
        await saasService.updateCompany(editingCompany.id, {
          name: companyForm.name,
          domain: companyForm.domain,
          userLimit: companyForm.userLimit
        });
        triggerSuccess(`Empresa "${companyForm.name}" atualizada com sucesso!`);
      } else {
        await saasService.createCompany(companyForm.name, companyForm.domain, companyForm.userLimit);
        triggerSuccess(`Empresa "${companyForm.name}" criada com sucesso e administrador auto-configurado!`);
      }
      setIsCompanyModalOpen(false);
      setEditingCompany(null);
      setCompanyForm({ name: '', domain: '', userLimit: 5 });
      loadData();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar empresa.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCompanyStatus = async (company: Company) => {
    setLoading(true);
    setError(null);
    try {
      const nextStatus = company.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
      await saasService.updateCompany(company.id, { status: nextStatus });
      triggerSuccess(`Empresa "${company.name}" ${nextStatus === 'ACTIVE' ? 'reativada' : 'suspensa'} com sucesso!`);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Erro ao alterar status da empresa.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompany = async (id: string) => {
    if (!window.confirm('Aviso Crítico: Deletar esta empresa removerá permanentemente TODOS os usuários e dados associados a este tenant. Tem certeza que deseja prosseguir?')) return;
    setLoading(true);
    setError(null);
    try {
      await saasService.deleteCompany(id);
      triggerSuccess('Empresa removida com sucesso!');
      loadData();
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar empresa.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // USER ACTIONS (Tenant Admin)
  // ============================================================================
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (editingUser) {
        await saasService.updateUser(editingUser.id, userForm.name, userForm.roleId, editingUser.status);
        triggerSuccess(`Usuário "${userForm.name}" editado com sucesso!`);
      } else {
        await saasService.createUser(userForm.name, userForm.email, userForm.roleId);
        triggerSuccess(`Usuário "${userForm.name}" cadastrado com sucesso!`);
      }
      setIsUserModalOpen(false);
      setEditingUser(null);
      setUserForm({ name: '', email: '', roleId: '' });
      loadData();
      onRefreshSession(); // In case we edited ourselves
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar usuário.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (user: User) => {
    setLoading(true);
    setError(null);
    try {
      const nextStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await saasService.updateUser(user.id, user.name, user.roleId, nextStatus);
      triggerSuccess(`Usuário "${user.name}" ${nextStatus === 'ACTIVE' ? 'ativado' : 'desativado'}!`);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Erro ao alterar status do usuário.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (id === session.user.id) {
      alert('Não é possível excluir o próprio usuário logado por razões de segurança.');
      return;
    }
    if (!window.confirm('Tem certeza que deseja excluir permanentemente este usuário da sua equipe?')) return;
    setLoading(true);
    setError(null);
    try {
      await saasService.deleteUser(id);
      triggerSuccess('Usuário removido da empresa com sucesso!');
      loadData();
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar usuário.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // ROLE & GRANULAR PERMISSIONS ACTIONS (Tenant Admin)
  // ============================================================================
  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleForm.name) {
      setError('Nome do perfil é obrigatório.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (editingRole) {
        await saasService.updateRolePermissions(editingRole.id, roleForm.permissions);
        triggerSuccess(`Permissões do cargo "${roleForm.name}" atualizadas!`);
      } else {
        await saasService.createRole(roleForm.name, roleForm.description, roleForm.permissions);
        triggerSuccess(`Perfil de acesso "${roleForm.name}" criado com sucesso!`);
      }
      setIsRoleModalOpen(false);
      setEditingRole(null);
      setRoleForm({ name: '', description: '', permissions: [] });
      loadData();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar cargo.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePermission = (code: string) => {
    setRoleForm(prev => {
      const exists = prev.permissions.includes(code);
      if (exists) {
        return { ...prev, permissions: prev.permissions.filter(c => c !== code) };
      } else {
        return { ...prev, permissions: [...prev.permissions, code] };
      }
    });
  };

  const handleDeleteRole = async (id: string) => {
    if (id === 'role-tenant-admin' || id === 'role-master-admin') {
      alert('Não é possível deletar perfis de acesso padrões de sistema.');
      return;
    }
    if (users.some(u => u.roleId === id)) {
      alert('Não é possível remover este cargo porque ele está atualmente atribuído a um ou mais usuários.');
      return;
    }
    if (!window.confirm('Deseja excluir este perfil personalizado de acesso?')) return;
    setLoading(true);
    setError(null);
    try {
      await saasService.deleteRole(id);
      triggerSuccess('Perfil de acesso removido com sucesso!');
      loadData();
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar cargo.');
    } finally {
      setLoading(false);
    }
  };

  const openEditRoleModal = async (role: Role) => {
    setEditingRole(role);
    setRoleForm({
      name: role.name,
      description: role.description,
      permissions: []
    });
    setLoading(true);
    try {
      const activePerms = await saasService.getRolePermissions(role.id);
      setRoleForm(prev => ({ ...prev, permissions: activePerms }));
      setIsRoleModalOpen(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar permissões do cargo.');
    } finally {
      setLoading(false);
    }
  };

  // Limit Calculation helpers for progress bars
  const tenantCompany = session.company;
  const companyUserLimit = tenantCompany?.userLimit || 0;
  const activeTenantUsersCount = users.filter(u => u.companyId === session.user.companyId).length;
  const isLimitReached = activeTenantUsersCount >= companyUserLimit;
  const limitPercentage = companyUserLimit > 0 ? (activeTenantUsersCount / companyUserLimit) * 100 : 0;

  return (
    <div className="space-y-6" id="saas-panel-root">
      {/* SaaS Status Header banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold tracking-tight font-sans">
              Isolamento de Tenant: {session.company?.name || 'SaaS Control Panel'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl font-mono">
            Tenant Ativo (Company ID): <span className="text-emerald-300 font-bold">{session.user.companyId}</span> | Cargo Atual: <span className="text-emerald-400">{session.role.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 transition rounded-lg text-slate-300 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Recarregar Dados
          </button>
          
          <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
            <ShieldCheck className="w-4 h-4" />
            RBAC Ativo
          </span>
        </div>
      </div>

      {/* Global Alerts or Messages */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg text-red-700 flex items-start gap-2 text-sm"
          >
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-500" />
            <div>
              <span className="font-semibold">Erro de Regra/Segurança:</span> {error}
            </div>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600 font-bold text-xs p-1">
              Fechar
            </button>
          </motion.div>
        )}

        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg text-emerald-800 flex items-center gap-2 text-sm"
          >
            <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500" />
            <div>{successMsg}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUB-TABS SELECTOR FOR SAAS VIEWS */}
      <div className="border-b border-gray-200 flex flex-wrap gap-4">
        {isSuperAdmin && (
          <button
            onClick={() => setActiveSubTab('tenants')}
            className={`pb-3 text-sm font-semibold border-b-2 transition px-1 flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'tenants' 
                ? 'border-emerald-500 text-emerald-600' 
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Gerenciar Tenants (SuperAdmin)
          </button>
        )}
        
        {hasUserRead && (
          <button
            onClick={() => setActiveSubTab('users')}
            className={`pb-3 text-sm font-semibold border-b-2 transition px-1 flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'users' 
                ? 'border-emerald-500 text-emerald-600' 
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4" />
            Usuários da Equipe
          </button>
        )}

        {hasRoleRead && (
          <button
            onClick={() => setActiveSubTab('roles')}
            className={`pb-3 text-sm font-semibold border-b-2 transition px-1 flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'roles' 
                ? 'border-emerald-500 text-emerald-600' 
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Key className="w-4 h-4" />
            Perfis & Permissões (RBAC)
          </button>
        )}
      </div>

      {/* SUB-TABS RENDERING */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-xs overflow-hidden">
        
        {/* TAB 1: TENANTS (MASTER SUPERADMIN ONLY) */}
        {activeSubTab === 'tenants' && isSuperAdmin && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Empresas Contratantes (Tenants)</h3>
                <p className="text-xs text-gray-500 mt-0.5">Visão do Provedor SaaS: Crie e mude planos, suspenda faturas e defina limites.</p>
              </div>
              <button
                onClick={() => {
                  setEditingCompany(null);
                  setCompanyForm({ name: '', domain: '', userLimit: 5 });
                  setIsCompanyModalOpen(true);
                }}
                className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-2 rounded-lg transition font-semibold cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                Nova Empresa
              </button>
            </div>

            <div className="overflow-x-auto border border-gray-100 rounded-lg">
              <table className="min-w-full divide-y divide-gray-100 text-left text-sm">
                <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                  <tr>
                    <th className="px-6 py-4">Nome da Empresa</th>
                    <th className="px-6 py-4">Domínio / Tenant Key</th>
                    <th className="px-6 py-4 text-center">Limite de Usuários</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Criado em</th>
                    <th className="px-6 py-4 text-right">Ações de Gestão</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {companies.map((comp) => (
                    <tr key={comp.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                          {comp.name}
                          {comp.id === 'tenant-system' && (
                            <span className="px-2 py-0.5 text-[9px] bg-indigo-50 text-indigo-600 border border-indigo-100 font-bold rounded-sm">
                              SISTEMA
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-emerald-700">{comp.domain}</td>
                      <td className="px-6 py-4 text-center font-bold text-gray-700">
                        {comp.id === 'tenant-system' ? 'ILIMITADO' : `${comp.userLimit} Usuários`}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border ${
                          comp.status === 'ACTIVE' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                            : 'bg-red-50 text-red-700 border-red-100'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${comp.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                          {comp.status === 'ACTIVE' ? 'Ativo' : 'Suspenso'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {new Date(comp.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {comp.id !== 'tenant-system' && (
                            <>
                              <button 
                                onClick={() => handleToggleCompanyStatus(comp)}
                                title={comp.status === 'ACTIVE' ? 'Suspender Faturamento' : 'Reativar Faturamento'}
                                className={`p-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                                  comp.status === 'ACTIVE'
                                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                                }`}
                              >
                                {comp.status === 'ACTIVE' ? 'Suspender' : 'Ativar'}
                              </button>

                              <button 
                                onClick={() => {
                                  setEditingCompany(comp);
                                  setCompanyForm({
                                    name: comp.name,
                                    domain: comp.domain,
                                    userLimit: comp.userLimit
                                  });
                                  setIsCompanyModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition cursor-pointer"
                                title="Editar Limites"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              <button 
                                onClick={() => handleDeleteCompany(comp.id)}
                                className="p-1.5 rounded-lg border border-red-100 bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                                title="Deletar Tenant"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT (With limit indicator) */}
        {activeSubTab === 'users' && hasUserRead && (
          <div className="p-6 space-y-6">
            
            {/* LIMIT BAR AND ADVICE */}
            {tenantCompany && (
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-5">
                <div className="space-y-1.5 w-full md:w-2/3">
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
                    <span className="flex items-center gap-1">
                      <Layers className="w-4 h-4 text-emerald-500" />
                      Uso de Assentos (Limite do Plano)
                    </span>
                    <span className={isLimitReached ? 'text-red-600 font-bold' : 'text-gray-900 font-bold'}>
                      {activeTenantUsersCount} de {companyUserLimit} usuários cadastrados
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-3.5 rounded-full overflow-hidden flex">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(limitPercentage, 100)}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full rounded-full transition-all ${
                        isLimitReached 
                          ? 'bg-red-500' 
                          : limitPercentage >= 80 
                            ? 'bg-amber-500' 
                            : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1 font-sans">
                    <Info className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    {isLimitReached 
                      ? 'Limite atingido! O back-end irá barrar novos cadastros. Solicite upgrade ao Super Admin.' 
                      : `Você ainda pode cadastrar ${companyUserLimit - activeTenantUsersCount} usuário(s) antes de atingir o limite do plano.`
                    }
                  </p>
                </div>

                <button
                  disabled={isLimitReached && !editingUser}
                  onClick={() => {
                    if (isLimitReached) {
                      alert('Não é possível iniciar o formulário. O limite máximo de usuários foi atingido. Solicite upgrade com o Master Admin ou suspenda um usuário existente.');
                      return;
                    }
                    setEditingUser(null);
                    setUserForm({ name: '', email: '', roleId: roles[0]?.id || '' });
                    setIsUserModalOpen(true);
                  }}
                  className={`flex items-center gap-1.5 text-xs font-bold px-4 py-3 rounded-lg transition shadow-xs cursor-pointer ${
                    isLimitReached 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  Cadastrar Usuário
                </button>
              </div>
            )}

            {/* USERS LIST TABLE */}
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-sm font-semibold text-gray-900">Equipe de Colaboradores</h3>
                <span className="text-xs text-gray-500">Isolamento rigoroso por Tenant</span>
              </div>

              <div className="overflow-x-auto border border-gray-100 rounded-lg">
                <table className="min-w-full divide-y divide-gray-100 text-left text-sm">
                  <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                    <tr>
                      <th className="px-6 py-4">Colaborador</th>
                      <th className="px-6 py-4">E-mail de Acesso</th>
                      <th className="px-6 py-4">Cargo / Função</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Data de Cadastro</th>
                      {hasUserEdit || hasUserDelete ? <th className="px-6 py-4 text-right">Ações</th> : null}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((usr) => {
                      const userRole = roles.find(r => r.id === usr.roleId);
                      return (
                        <tr key={usr.id} className="hover:bg-gray-50/50 transition">
                          <td className="px-6 py-4 font-semibold text-gray-900">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700 uppercase">
                                {usr.name.substring(0, 2)}
                              </div>
                              {usr.name}
                              {usr.id === session.user.id && (
                                <span className="px-1.5 py-0.5 text-[8px] bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold rounded-sm uppercase">
                                  Você
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600 font-mono text-xs">{usr.email}</td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 rounded-md">
                              {userRole?.name || 'Não atribuído'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              disabled={!hasUserEdit || usr.id === session.user.id}
                              onClick={() => handleToggleUserStatus(usr)}
                              title={usr.status === 'ACTIVE' ? 'Inativar Usuário' : 'Ativar Usuário'}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border transition cursor-pointer ${
                                usr.status === 'ACTIVE' 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                  : 'bg-gray-100 text-gray-500 border-gray-200'
                              } ${(!hasUserEdit || usr.id === session.user.id) ? 'cursor-default' : ''}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${usr.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                              {usr.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-500">
                            {new Date(usr.createdAt).toLocaleDateString('pt-BR')}
                          </td>
                          {(hasUserEdit || hasUserDelete) && (
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  disabled={!hasUserEdit}
                                  onClick={() => {
                                    setEditingUser(usr);
                                    setUserForm({
                                      name: usr.name,
                                      email: usr.email,
                                      roleId: usr.roleId
                                    });
                                    setIsUserModalOpen(true);
                                  }}
                                  className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition cursor-pointer disabled:opacity-50"
                                  title="Editar Usuário"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                
                                <button
                                  disabled={!hasUserDelete || usr.id === session.user.id}
                                  onClick={() => handleDeleteUser(usr.id)}
                                  className="p-1.5 rounded-lg border border-red-100 bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer disabled:opacity-40"
                                  title="Remover Usuário"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ROLES & GRANULAR PERMISSIONS */}
        {activeSubTab === 'roles' && hasRoleRead && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Perfis de Acesso Personalizados (RBAC)</h3>
                <p className="text-xs text-gray-500 mt-0.5">Crie perfis sob medida para seu financeiro e operacional com privilégios específicos por módulo.</p>
              </div>

              <button
                disabled={!hasRoleCreate}
                onClick={() => {
                  setEditingRole(null);
                  setRoleForm({ name: '', description: '', permissions: [] });
                  setIsRoleModalOpen(true);
                }}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg transition shadow-xs cursor-pointer ${
                  !hasRoleCreate 
                    ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed' 
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <Plus className="w-4 h-4" />
                Criar Novo Cargo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roles.map((role) => {
                const isSystemDefault = role.companyId === null;
                return (
                  <div key={role.id} className="border border-gray-100 bg-gray-50/20 hover:border-gray-200 hover:shadow-xs p-5 rounded-xl flex flex-col justify-between gap-4 transition">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 flex items-center gap-1.5">
                            {role.name}
                            {isSystemDefault && (
                              <span className="px-2 py-0.5 text-[9px] bg-slate-100 text-slate-600 border border-slate-200 rounded font-bold uppercase font-mono">
                                PADRÃO
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">{role.description}</p>
                        </div>
                      </div>

                      {/* Display summary of modules accessed */}
                      <div className="pt-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1">Módulos Ativos</span>
                        <div className="flex flex-wrap gap-1.5">
                          {role.id === 'role-master-admin' ? (
                            <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 rounded-md">
                              Acesso Total (Master)
                            </span>
                          ) : role.id === 'role-tenant-admin' ? (
                            <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-700 rounded-md">
                              Administração Tenant Completa
                            </span>
                          ) : (
                            // Determine module codes from active role permissions
                            systemPermissions
                              .filter(p => p.module === 'finance')
                              .some(p => p.code === 'finance:read') ? (
                                <span className="px-2 py-0.5 text-[11px] font-medium bg-indigo-50 text-indigo-700 rounded-md">
                                  Financeiro
                                </span>
                              ) : null
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                      <span className="text-xs text-gray-400 font-mono">
                        ID: {role.id}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEditRoleModal(role)}
                          className="flex items-center gap-1 text-xs font-semibold bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          {isSystemDefault ? 'Ver Permissões' : 'Editar Permissões'}
                        </button>

                        {!isSystemDefault && hasRoleDelete && (
                          <button
                            onClick={() => handleDeleteRole(role.id)}
                            className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-100 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================================
          MODALS & DIALOGS SECTION (BEAUTIFUL LIGHTBOX MODALS)
          ============================================================================ */}

      {/* 1. COMPANY MODAL (SuperAdmin Only) */}
      <AnimatePresence>
        {isCompanyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
                <h4 className="font-semibold text-sm tracking-tight flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  {editingCompany ? 'Editar Empresa (Tenant)' : 'Nova Empresa (Tenant)'}
                </h4>
                <button onClick={() => setIsCompanyModalOpen(false)} className="text-slate-400 hover:text-white transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCompany} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Nome da Empresa</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: ACME Ltda"
                    value={companyForm.name}
                    onChange={e => setCompanyForm({...companyForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white transition focus:outline-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Domínio (Tenant Key)</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingCompany}
                    placeholder="Ex: acme.com"
                    value={companyForm.domain}
                    onChange={e => setCompanyForm({...companyForm, domain: e.target.value.toLowerCase()})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white transition focus:outline-emerald-500 disabled:opacity-50"
                  />
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">Utilizado para isolamento no login e chaves de tenant.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Limite de Assentos (Users Limit)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={companyForm.userLimit}
                    onChange={e => setCompanyForm({...companyForm, userLimit: parseInt(e.target.value, 10)})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white transition focus:outline-emerald-500"
                  />
                  <p className="text-[10px] text-amber-600 flex items-center gap-1 mt-0.5">
                    <Lock className="w-3 h-3" /> Regra do Backend: O faturamento bloqueará novos cadastros que ultrapassarem essa cota.
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsCompanyModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition shadow-xs"
                  >
                    {loading ? 'Salvando...' : 'Salvar Empresa'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. USER MODAL (Tenant Admin) */}
      <AnimatePresence>
        {isUserModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
                <h4 className="font-semibold text-sm tracking-tight flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-emerald-400" />
                  {editingUser ? 'Editar Colaborador' : 'Cadastrar Novo Colaborador'}
                </h4>
                <button onClick={() => setIsUserModalOpen(false)} className="text-slate-400 hover:text-white transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveUser} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Nome Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: João da Silva"
                    value={userForm.name}
                    onChange={e => setUserForm({...userForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white transition focus:outline-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">E-mail Corporativo</label>
                  <input
                    type="email"
                    required
                    disabled={!!editingUser}
                    placeholder="Ex: joao@suaempresa.com"
                    value={userForm.email}
                    onChange={e => setUserForm({...userForm, email: e.target.value.toLowerCase()})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white transition focus:outline-emerald-500 disabled:opacity-50"
                  />
                  {!editingUser && (
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">E-mail deve ser único na plataforma.</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Cargo de Acesso (RBAC Role)</label>
                  <select
                    value={userForm.roleId}
                    required
                    onChange={e => setUserForm({...userForm, roleId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white transition focus:outline-emerald-500"
                  >
                    <option value="" disabled>Selecione um perfil...</option>
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name} {r.companyId === null ? '(Padrão)' : '(Customizado)'}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsUserModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition shadow-xs"
                  >
                    {loading ? 'Processando...' : editingUser ? 'Salvar Alterações' : 'Concluir Cadastro'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. ROLE & PERMISSIONS MODAL (RBAC) */}
      <AnimatePresence>
        {isRoleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-xl max-w-2xl w-full overflow-hidden"
            >
              <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
                <h4 className="font-semibold text-sm tracking-tight flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-400" />
                  {editingRole?.companyId === null ? 'Ver Permissões (Padrão de Sistema)' : editingRole ? 'Editar Perfil Customizado' : 'Criar Perfil de Acesso Customizado'}
                </h4>
                <button onClick={() => setIsRoleModalOpen(false)} className="text-slate-400 hover:text-white transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveRole} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Nome do Cargo/Perfil</label>
                    <input
                      type="text"
                      required
                      disabled={editingRole?.companyId === null}
                      placeholder="Ex: Auditor Externo"
                      value={roleForm.name}
                      onChange={e => setRoleForm({...roleForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white transition focus:outline-emerald-500 disabled:opacity-60"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Descrição Prática</label>
                    <input
                      type="text"
                      disabled={editingRole?.companyId === null}
                      placeholder="Ex: Pode ver auditoria mas não altera usuários"
                      value={roleForm.description}
                      onChange={e => setRoleForm({...roleForm, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white transition focus:outline-emerald-500 disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* GRANULAR PERMISSIONS CHECKBOX LIST BY MODULE */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-gray-700 block border-b border-gray-100 pb-1">Direitos de Acesso por Módulo</span>
                  
                  <div className="space-y-5">
                    {/* Module Groups */}
                    {['finance', 'users', 'roles', 'companies'].map(moduleCode => {
                      const modulePerms = systemPermissions.filter(p => p.module === moduleCode);
                      if (modulePerms.length === 0) return null;
                      
                      // Skip companies module for tenant admin roles unless they are Master Admin
                      if (moduleCode === 'companies' && !isSuperAdmin) return null;

                      const moduleNamesMap: any = {
                        finance: 'Saúde Financeira & Auditoria (CFO)',
                        users: 'Gestão de Usuários da Equipe',
                        roles: 'Gestão de Cargos e Permissões (RBAC)',
                        companies: 'Infraestrutura SaaS Global (SuperAdmin)'
                      };

                      return (
                        <div key={moduleCode} className="space-y-2">
                          <span className="text-xs font-semibold text-slate-800 bg-slate-100 px-2 py-1 rounded-sm">
                            {moduleNamesMap[moduleCode] || moduleCode}
                          </span>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {modulePerms.map(perm => {
                              const isChecked = roleForm.permissions.includes(perm.code);
                              const isSystemDefault = editingRole?.companyId === null;
                              return (
                                <label 
                                  key={perm.code} 
                                  onClick={() => {
                                    if (!isSystemDefault) handleTogglePermission(perm.code);
                                  }}
                                  className={`p-2.5 rounded-lg border text-xs flex items-start gap-2.5 transition cursor-pointer select-none ${
                                    isChecked 
                                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-950' 
                                      : 'bg-white border-gray-200 hover:bg-gray-50/50 text-gray-500'
                                  } ${isSystemDefault ? 'cursor-default' : ''}`}
                                >
                                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition ${
                                    isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-300 bg-white'
                                  }`}>
                                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                  </div>
                                  <div className="space-y-0.5">
                                    <div className="font-semibold text-gray-900">{perm.name}</div>
                                    <div className="text-[10px] text-gray-500 leading-tight">{perm.description}</div>
                                    <div className="text-[9px] font-mono font-bold text-indigo-600 uppercase mt-0.5">{perm.code}</div>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsRoleModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg transition"
                  >
                    {editingRole?.companyId === null ? 'Fechar' : 'Cancelar'}
                  </button>
                  {editingRole?.companyId !== null && (
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition shadow-xs"
                    >
                      {loading ? 'Gravando...' : 'Salvar Alterações'}
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
