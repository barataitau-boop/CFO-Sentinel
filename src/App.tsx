import { useState, useCallback, useEffect } from 'react';
import React from 'react';
import { 
  FileUp, 
  ShieldAlert, 
  TrendingUp, 
  Activity, 
  AlertTriangle, 
  FileText, 
  ChevronRight,
  RefreshCw,
  LayoutDashboard,
  LogOut,
  Target,
  BarChart3,
  ShieldCheck,
  Building2,
  Key,
  Lock,
  Users,
  Fingerprint,
  Globe,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { parseFile, cn, downloadTemplate } from './lib/utils';
import { analyzeFinancialData } from './services/geminiService';
import { FinancialReport } from './types';
import ScenarioSimulator from './components/ScenarioSimulator';
import AuditTab from './components/AuditTab';
import ProjectionsTab from './components/ProjectionsTab';
import DossierTab from './components/DossierTab';
import { saasService } from './services/saasService';
import { SaasSession } from './types/saas';
import SaasControlPanel from './components/SaasControlPanel';

export default function App() {
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sectors, setSectors] = useState<{ name: string; percentage: number }[]>([{ name: '', percentage: 100 }]);
  const [attachedFiles, setAttachedFiles] = useState<{ data: string; isPdf: boolean; fileName: string }[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'projections' | 'audit' | 'dossier' | 'saas'>('overview');
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  // SaaS Multi-tenant and RBAC Simulation states
  const [saasSession, setSaasSession] = useState<SaasSession | null>(null);
  const [saasLoading, setSaasLoading] = useState(false);
  const [saasError, setSaasError] = useState<string | null>(null);

  // Login as Persona simulator
  const handleLoginAsPersona = async (email: string) => {
    setSaasLoading(true);
    setSaasError(null);
    try {
      const session = await saasService.login(email);
      setSaasSession(session);
      
      // If active tab requires finance:read and user loses it, redirect to SaaS tab
      const hasFinanceRead = session.permissions.includes('finance:read');
      if (!hasFinanceRead && ['overview', 'projections', 'audit', 'dossier'].includes(activeTab)) {
        setActiveTab('saas');
      }
    } catch (err: any) {
      console.error(err);
      setSaasError(err.message || 'Falha na autenticação do Tenant/Usuário.');
    } finally {
      setSaasLoading(false);
    }
  };

  // Refresh active session details
  const refreshSaasSession = async () => {
    if (!saasSession) return;
    try {
      const session = await saasService.getMe();
      setSaasSession(session);
    } catch (err: any) {
      console.error("Failed to refresh session", err);
    }
  };

  // Automatically log in as Tenant Admin Alice on startup
  useEffect(() => {
    handleLoginAsPersona('alice@acme.com');
  }, []);

  const handleFileUpload = async (uploadedFiles: FileList) => {
    setLoading(true);
    setError(null);
    const newFiles: { data: string; isPdf: boolean; fileName: string }[] = [];
    
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      try {
        const parsed = await parseFile(file);
        newFiles.push(parsed);
      } catch (err: any) {
        console.error(err);
        setError(`Erro ao processar o arquivo "${file.name}": ${err.message || "Formato inválido"}`);
      }
    }

    if (newFiles.length > 0) {
      setAttachedFiles(prev => [...prev, ...newFiles]);
    }
    setLoading(false);
  };

  const startAnalysis = async () => {
    if (attachedFiles.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeFinancialData(attachedFiles, sectors);
      setReport(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao processar a análise dos arquivos. Verifique os demonstrativos.");
    } finally {
      setLoading(false);
    }
  };

  const handleSectorCountChange = (count: number) => {
    const currentSectors = [...sectors];
    if (count > currentSectors.length) {
      const added = Array.from({ length: count - currentSectors.length }, () => ({ name: '', percentage: 0 }));
      setSectors([...currentSectors, ...added]);
    } else if (count < currentSectors.length) {
      setSectors(currentSectors.slice(0, count));
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) handleFileUpload(files);
  }, []);

  const renderPersonaSwitcher = () => {
    const personas = [
      { name: "Alice Smith", email: "alice@acme.com", role: "Tenant Admin (Acme)", company: "Acme Corp", limit: "Limite: 3", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10", tooltip: "Admin da Acme Corp. Permissões completas de gestão de usuários e criação de Cargos (RBAC). Limite de 3 assentos (atingido)." },
      { name: "Bob Jones", email: "bob@acme.com", role: "Financeiro (Acme)", company: "Acme Corp", limit: "Limite: 3", color: "text-blue-400 border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10", tooltip: "Analista Financeiro. Possui privilégios de leitura e edição financeira, mas é bloqueado de ver ou modificar equipe e cargos." },
      { name: "Carlos Santos", email: "carlos@acme.com", role: "Operador (Acme)", company: "Acme Corp", limit: "Limite: 3", color: "text-amber-400 border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10", tooltip: "Usuário Comum. Totalmente bloqueado por RBAC nos relatórios e configurações. Demonstra telas de restrição automática." },
      { name: "Arthur Pendragon", email: "master@cfosentinel.com", role: "SaaS Super Admin", company: "SaaS Master", limit: "Ilimitado", color: "text-indigo-400 border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10", tooltip: "Super Administrador Master. Acesso total e global ao SaaS. Cadastra empresas, altera planos e suspende faturas." },
      { name: "Bill Lumbergh", email: "bill@globex.com", role: "Tenant Admin (Globex)", company: "Globex Ind.", limit: "Limite: 15", color: "text-purple-400 border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10", tooltip: "Admin da Globex. Limite amplo de 15 usuários. Isolado do tenant Acme Corp (Prevenção total de vazamento de dados)." },
      { name: "Dave Bowman", email: "dave@blockbuster.com", role: "Admin Suspenso", company: "Blockbuster", limit: "Limite: 5", color: "text-rose-400 border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10", tooltip: "Empresa suspensa por faturamento. O middleware do backend recusa a autenticação imediatamente com erro 401." }
    ];

    return (
      <div className="w-full max-w-5xl bg-slate-900/60 border border-white/10 rounded-2xl p-5 mb-8 z-10 text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              <Fingerprint className="w-4 h-4 text-blue-400" />
              Simulador SaaS Multi-tenant & Autenticação RBAC
            </h3>
            <p className="text-xs text-slate-400">
              Escolha uma identidade abaixo para ver o isolamento de dados por Tenant e as permissões de acesso em tempo real.
            </p>
          </div>
          {saasLoading && (
            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 flex items-center gap-1.5 self-start">
              <RefreshCw className="w-3 h-3 animate-spin" /> Autenticando no Servidor...
            </span>
          )}
        </div>

        {/* Personas Row */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {personas.map((p) => {
            const isCurrent = saasSession?.user.email === p.email;
            return (
              <button
                key={p.email}
                title={p.tooltip}
                onClick={() => handleLoginAsPersona(p.email)}
                className={cn(
                  "border p-3 rounded-xl transition text-left relative flex flex-col justify-between h-24 cursor-pointer group",
                  isCurrent 
                    ? "border-blue-500 bg-blue-500/10 text-white" 
                    : p.color
                )}
              >
                <div>
                  <div className="text-[10px] font-bold truncate">{p.name}</div>
                  <div className="text-[9px] opacity-75 truncate">{p.role}</div>
                </div>
                <div className="mt-2 flex items-center justify-between text-[8px] font-mono">
                  <span className="truncate opacity-50">{p.company}</span>
                  <span className="font-bold opacity-80">{p.limit}</span>
                </div>
                {isCurrent && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Display Current Active Session Details */}
        {saasSession && (
          <div className="mt-4 p-3 bg-slate-950/50 border border-white/5 rounded-xl text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 font-mono">
            <div className="space-y-1">
              <p className="text-slate-300">
                👤 Usuário Ativo: <span className="text-blue-400 font-bold">{saasSession.user.name}</span> | Empresa: <span className="text-emerald-400 font-bold">{saasSession.company?.name || "Global SuperAdmin"}</span>
              </p>
              <p className="text-[10px] text-slate-500 max-w-3xl leading-relaxed">
                🔑 Chave do Tenant: <span className="text-indigo-400">{saasSession.user.companyId}</span> | Limite de Assentos: <span className="text-indigo-400">{saasSession.company?.userLimit || "Ilimitado"}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-1">
              {saasSession.permissions.slice(0, 5).map(perm => (
                <span key={perm} className="px-1.5 py-0.5 text-[9px] bg-slate-800 text-slate-400 border border-white/5 rounded">
                  {perm}
                </span>
              ))}
              {saasSession.permissions.length > 5 && (
                <span className="px-1.5 py-0.5 text-[9px] bg-slate-800 text-slate-400 border border-white/5 rounded">
                  +{saasSession.permissions.length - 5}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Simulated Authentication Rejections */}
        {saasError && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
            <div>
              <span className="font-bold">Bloqueio de Login no Back-end:</span> {saasError}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAccessDenied = (permission: string) => {
    return (
      <div className="bg-slate-900/40 border border-red-500/20 rounded-2xl p-8 text-center max-w-2xl mx-auto my-12 backdrop-blur-md">
        <div className="inline-flex items-center justify-center p-4 bg-red-500/10 rounded-full mb-6 border border-red-500/20">
          <Lock className="w-8 h-8 text-red-400 animate-pulse" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">Acesso Bloqueado por RBAC</h3>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          O seu cargo atual (<span className="text-blue-400 font-semibold">{saasSession?.user.roleName || "Nível Comum"}</span>) não possui o privilégio necessário <code className="text-red-400 bg-red-500/5 px-2 py-0.5 rounded border border-red-500/10 font-mono">{permission}</code> para visualizar estes relatórios estratégicos de CFO.
        </p>
        <div className="p-4 bg-slate-950/50 rounded-xl text-xs text-left text-slate-500 space-y-2 mb-6 border border-white/5 font-mono">
          <p className="text-slate-300 font-bold">🛡️ Validação de IDOR & RBAC (Back-end):</p>
          <p>O servidor barrou esta requisição de API com status <span className="text-red-400 font-bold">403 Forbidden</span>. O token JWT decodificado não continha a permissão correspondente na matriz RBAC para o Tenant ID <span className="text-indigo-400">{saasSession?.user.companyId || "indefinido"}</span>.</p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => handleLoginAsPersona('alice@acme.com')}
            className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-blue-500 transition cursor-pointer"
          >
            Mudar para Alice (Tenant Admin)
          </button>
          <button
            onClick={() => setActiveTab('saas')}
            className="px-5 py-2.5 bg-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-700 transition cursor-pointer"
          >
            Ver Detalhes do Cargo
          </button>
        </div>
      </div>
    );
  };

  if (!report) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950 relative overflow-y-auto">
        {/* Background Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-600/10 rounded-full blur-[150px]"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[100px]"></div>

        {/* SaaS Identity Switcher */}
        {renderPersonaSwitcher()}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 z-10"
        >
          <div className="inline-flex items-center justify-center p-4 mb-6 bg-gradient-to-br from-blue-400 to-emerald-400 rounded-2xl shadow-xl shadow-blue-500/20">
            <Building2 className="w-8 h-8 text-slate-950" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">CFO <span className="text-blue-400 font-black">SENTINEL</span> AI</h1>
          <p className="text-slate-400 max-w-lg mx-auto text-lg leading-relaxed font-medium">
            Diagnóstico financeiro avançado e auditoria de fragilidade com inteligência preditiva.
          </p>
        </motion.div>

        {/* Activity Sectors and Import Area side by side */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mb-6 z-10">
          {/* Activity Sectors */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Ramos de Atividade</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">Quantos?</span>
                  <select
                    value={sectors.length}
                    onChange={(e) => handleSectorCountChange(Number(e.target.value))}
                    className="bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'ramo' : 'ramos'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {sectors.map((sector, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder={`Ramo de atividade #${index + 1} (ex: Varejo, Tecnologia...)`}
                        value={sector.name}
                        onChange={(e) => {
                          const updated = [...sectors];
                          updated[index].name = e.target.value;
                          setSectors(updated);
                        }}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                      />
                    </div>
                    <div className="w-24 flex items-center gap-2 bg-slate-900/50 border border-white/10 rounded-xl px-3 py-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="%"
                        value={sector.percentage || ''}
                        onChange={(e) => {
                          const updated = [...sectors];
                          updated[index].percentage = Number(e.target.value);
                          setSectors(updated);
                        }}
                        className="w-full bg-transparent text-right text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                      <span className="text-xs text-slate-400">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {sectors.reduce((acc, s) => acc + s.percentage, 0) !== 100 && (
              <p className="mt-3 text-[10px] text-amber-400/80 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> A soma das participações deve idealmente totalizar 100%.
              </p>
            )}
          </motion.div>

          {/* Import Area (supports multiple files) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className={cn(
              "w-full p-10 glass-panel border-dashed border-2 flex flex-col items-center justify-center text-center group cursor-pointer transition-all duration-300 h-full",
              isDragging ? "border-blue-500 bg-blue-500/10" : "border-white/10 hover:border-white/20",
              loading && "pointer-events-none opacity-50"
            )}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <input 
              id="fileInput" 
              type="file" 
              className="hidden" 
              accept=".csv,.xlsx,.xls,.pdf"
              multiple
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            />
            
            <div className="flex flex-col items-center">
              <div className="mb-4 p-4 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors">
                <FileUp className="w-8 h-8 text-slate-300 group-hover:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Importar Dados Financeiros</h3>
              <p className="text-slate-500 text-xs mb-4 px-8 leading-relaxed">
                Arraste ou clique para adicionar múltiplos arquivos (DRE, Balancete, Fluxo de Caixa).
              </p>
              <div className="flex gap-2">
                <span className="text-[9px] font-bold tracking-widest border border-white/10 px-2 py-0.5 rounded bg-black/20 text-slate-400 uppercase">CSV</span>
                <span className="text-[9px] font-bold tracking-widest border border-white/10 px-2 py-0.5 rounded bg-black/20 text-slate-400 uppercase">XLSX</span>
                <span className="text-[9px] font-bold tracking-widest border border-white/10 px-2 py-0.5 rounded bg-black/20 text-slate-400 uppercase">PDF</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Attached Files List and Submit Action */}
        {attachedFiles.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-5xl mt-2 bg-white/5 border border-white/10 rounded-2xl p-5 z-10"
          >
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              Arquivos Anexados ({attachedFiles.length})
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
              {attachedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-900/50 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white">
                  <div className="flex items-center gap-2.5 truncate">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      file.isPdf ? "bg-red-500" : file.fileName.endsWith('.csv') ? "bg-blue-400" : "bg-emerald-400"
                    )} />
                    <span className="font-medium truncate max-w-[280px]">{file.fileName}</span>
                    <span className="text-[9px] text-slate-500 uppercase font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
                      {file.isPdf ? 'PDF' : file.fileName.split('.').pop()}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAttachedFiles(prev => prev.filter((_, i) => i !== idx));
                    }}
                    className="text-slate-500 hover:text-red-400 font-bold transition-colors px-2 py-1"
                  >
                    Excluir
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                startAnalysis();
              }}
              disabled={loading}
              className={cn(
                "w-full mt-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2",
                loading 
                  ? "bg-blue-500/20 text-blue-300 cursor-not-allowed" 
                  : "bg-gradient-to-r from-blue-500 to-emerald-500 text-slate-950 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]"
              )}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Analisando Demonstrativos...
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" /> Realizar Análise Financeira
                </>
              )}
            </button>
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={(e) => {
            e.stopPropagation();
            downloadTemplate();
          }}
          className="mt-8 flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-slate-400 hover:text-white group z-10"
        >
          <BarChart3 className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          Baixar Modelo Excel
        </motion.button>

        {error && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-rose-400 text-sm font-bold bg-rose-500/10 px-4 py-2 rounded-full border border-rose-500/20 z-10 uppercase tracking-wider"
          >
            {error}
          </motion.p>
        )}

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl opacity-40 z-10">
           <div className="flex items-center gap-3">
             <ShieldCheck className="w-5 h-5 text-slate-400" />
             <span className="text-xs font-bold uppercase tracking-widest">Auditoria de Risco</span>
           </div>
           <div className="flex items-center gap-3">
             <TrendingUp className="w-5 h-5 text-slate-400" />
             <span className="text-xs font-bold uppercase tracking-widest">Predição Proativa</span>
           </div>
           <div className="flex items-center gap-3">
             <BarChart3 className="w-5 h-5 text-slate-400" />
             <span className="text-xs font-bold uppercase tracking-widest">3-Statement Sync</span>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-y-auto relative">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-600/10 rounded-full blur-[150px]"></div>
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[100px]"></div>

      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-black/20 backdrop-blur-md hidden lg:flex flex-col z-20 no-print">
        <div className="p-8 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-emerald-400 rounded flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-[10px] font-black text-slate-950">CS</span>
          </div>
          <span className="text-sm font-bold tracking-widest uppercase">Sentinel <span className="text-blue-400">AI</span></span>
        </div>
        <nav className="flex-1 p-6 space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-4 px-2">Operações</p>
          <button 
            onClick={() => setActiveTab('overview')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all",
              activeTab === 'overview' ? 'sidebar-item-active' : 'sidebar-item'
            )}
          >
            <LayoutDashboard className="w-4 h-4" /> Visão Geral
          </button>
          <button 
            onClick={() => setActiveTab('projections')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all",
              activeTab === 'projections' ? 'sidebar-item-active' : 'sidebar-item'
            )}
          >
            <Target className="w-4 h-4" /> Projeções
          </button>
          <button 
            onClick={() => setActiveTab('audit')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all",
              activeTab === 'audit' ? 'sidebar-item-active' : 'sidebar-item'
            )}
          >
            <ShieldAlert className="w-4 h-4" /> Auditoria
          </button>
          <button 
            onClick={() => setActiveTab('dossier')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all",
              activeTab === 'dossier' ? 'sidebar-item-active' : 'sidebar-item'
            )}
          >
            <FileText className="w-4 h-4" /> Dossiê PDF
          </button>
          <button 
            onClick={() => setActiveTab('saas')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all text-indigo-400 border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/15",
              activeTab === 'saas' ? 'sidebar-item-active !text-white !bg-indigo-600/20' : 'sidebar-item'
            )}
          >
            <Settings className="w-4 h-4" /> Painel SaaS (RBAC)
          </button>
          <button 
            onClick={downloadTemplate}
            className="sidebar-item w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all border border-transparent hover:border-white/5"
          >
            <FileText className="w-4 h-4 text-emerald-400" /> Modelo Excel
          </button>
        </nav>
        <div className="p-6 border-t border-white/10">
          <div className="bg-white/5 rounded-xl border border-white/10 p-4 mb-4">
            <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Status Global</p>
            <p className="text-xs text-emerald-400 font-bold uppercase flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Sincronizado
            </p>
          </div>
          <button 
            onClick={() => {
              setReport(null);
              setActiveTab('overview');
            }}
            className="sidebar-item w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" /> Novo Analise
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto z-10 custom-scrollbar no-print">
        <header className="sticky top-0 z-30 p-8 flex items-center justify-between glass-panel border-x-0 border-t-0 rounded-none bg-black/40 no-print">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold tracking-tight">Painel Executivo</h2>
              <div className={cn(
                "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
                report.healthStatus === 'SAUDÁVEL' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 
                report.healthStatus === 'EM ALERTA' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
              )}>
                {report.healthStatus}
              </div>
            </div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Score Financeiro: <span className="text-slate-300 ml-1">{report.healthScore}</span></p>
          </div>
          <div className="flex items-center gap-6">
             <div className="text-right hidden sm:block border-r border-white/10 pr-6 mr-6">
               <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Última Auditoria</p>
               <p className="text-xs text-slate-300 font-medium">{new Date().toLocaleDateString('pt-BR')}</p>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold">CFO</div>
               <p className="text-xs font-bold text-slate-400 hidden md:block uppercase tracking-wider">Diretoria</p>
             </div>
          </div>
        </header>

        {/* Mobile Tab-Strip (Only displays on small screens) */}
        <div className="lg:hidden flex border-b border-white/10 bg-slate-900/45 overflow-x-auto no-print">
          <button 
            onClick={() => setActiveTab('overview')}
            className={cn(
              "flex-1 py-3 px-4 text-[10px] font-black uppercase tracking-widest text-center border-b-2 transition-all min-w-[100px]",
              activeTab === 'overview' ? 'border-blue-500 text-blue-400 bg-white/5' : 'border-transparent text-slate-400'
            )}
          >
            Visão Geral
          </button>
          <button 
            onClick={() => setActiveTab('projections')}
            className={cn(
              "flex-1 py-3 px-4 text-[10px] font-black uppercase tracking-widest text-center border-b-2 transition-all min-w-[100px]",
              activeTab === 'projections' ? 'border-blue-500 text-blue-400 bg-white/5' : 'border-transparent text-slate-400'
            )}
          >
            Projeções
          </button>
          <button 
            onClick={() => setActiveTab('audit')}
            className={cn(
              "flex-1 py-3 px-4 text-[10px] font-black uppercase tracking-widest text-center border-b-2 transition-all min-w-[100px]",
              activeTab === 'audit' ? 'border-blue-500 text-blue-400 bg-white/5' : 'border-transparent text-slate-400'
            )}
          >
            Auditoria
          </button>
          <button 
            onClick={() => setActiveTab('dossier')}
            className={cn(
              "flex-1 py-3 px-4 text-[10px] font-black uppercase tracking-widest text-center border-b-2 transition-all min-w-[100px]",
              activeTab === 'dossier' ? 'border-blue-500 text-blue-400 bg-white/5' : 'border-transparent text-slate-400'
            )}
          >
            Dossiê PDF
          </button>
          <button 
            onClick={() => setActiveTab('saas')}
            className={cn(
              "flex-1 py-3 px-4 text-[10px] font-black uppercase tracking-widest text-center border-b-2 transition-all min-w-[100px]",
              activeTab === 'saas' ? 'border-indigo-500 text-indigo-400 bg-white/5' : 'border-transparent text-slate-400'
            )}
          >
            SaaS (RBAC)
          </button>
        </div>

        <div className="p-8 space-y-8 max-w-[1500px] mx-auto no-print">
          {renderPersonaSwitcher()}

          {activeTab === 'saas' ? (
            <SaasControlPanel session={saasSession!} onRefreshSession={refreshSaasSession} />
          ) : !(saasSession?.permissions.includes('finance:read') ?? true) ? (
            renderAccessDenied('finance:read')
          ) : (
            <>
              {activeTab === 'overview' && (
                <>
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {report.kpis.map((kpi, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="glass-card p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{kpi.label}</p>
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        kpi.status === 'SAUDÁVEL' ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.4)]' :
                        kpi.status === 'EM ALERTA' ? 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.4)]' : 'bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.4)]'
                      )} />
                    </div>
                    <div className="flex items-baseline gap-2 mb-3">
                      <p className="text-3xl font-bold tracking-tighter text-white">{kpi.value}</p>
                    </div>
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        kpi.status === 'SAUDÁVEL' ? 'bg-emerald-400 w-3/4' :
                        kpi.status === 'EM ALERTA' ? 'bg-amber-400 w-1/2' : 'bg-rose-400 w-1/4'
                      )} />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-3 font-medium leading-relaxed">{kpi.description}</p>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Processed Files Status */}
                <div className="glass-card p-6 flex flex-col">
                  <h3 className="text-xs font-black uppercase tracking-widest text-blue-400 mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Demonstrativos Identificados
                  </h3>
                  <p className="text-[10px] text-slate-500 mb-4 uppercase tracking-wider font-mono">Arquivos processados e agrupados por período</p>
                  <div className="space-y-3 flex-1 overflow-y-auto max-h-56 custom-scrollbar pr-1">
                    {report.processedFiles && report.processedFiles.length > 0 ? (
                      report.processedFiles.map((file, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-slate-200">{file.fileName}</p>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">{file.period}</p>
                          </div>
                          <span className={cn(
                            "text-[9px] font-black uppercase px-2 py-1 rounded border",
                            file.detectedType === 'DRE' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                            file.detectedType === 'Balancete' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                            file.detectedType === 'Fluxo de Caixa' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                            'bg-slate-500/20 text-slate-400 border-slate-500/30'
                          )}>
                            {file.detectedType}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 italic">Nenhum demonstrativo listado.</p>
                    )}
                  </div>
                </div>

                {/* Sector representation and market benchmarks */}
                <div className="glass-card p-6 flex flex-col">
                  <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-4 flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> Representatividade Setorial & Benchmarks
                  </h3>
                  <p className="text-[10px] text-slate-500 mb-4 uppercase tracking-wider font-mono">Diagnóstico por ramos de atividade do cliente</p>
                  <div className="space-y-4 flex-1 overflow-y-auto max-h-56 custom-scrollbar pr-1">
                    {report.sectorAnalysis && report.sectorAnalysis.length > 0 ? (
                      report.sectorAnalysis.map((sector, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-200 truncate pr-2">{sector.sector}</span>
                            <span className="text-xs font-black text-emerald-400">{sector.percentage}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-400 h-full" style={{ width: `${sector.percentage}%` }} />
                          </div>
                          <p className="text-[10px] text-slate-400 font-medium">
                            <span className="text-slate-500 font-bold uppercase">Benchmark:</span> {sector.marketBenchmark}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium leading-relaxed bg-black/25 p-2 rounded-lg border border-white/5 mt-1">
                            {sector.strategicInsight}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 italic">Nenhum ramo de atividade informado.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Comparative YoY Analysis Section */}
              {report.comparativeReports && report.comparativeReports.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-6"
                >
                  <h3 className="text-xs font-black uppercase tracking-widest text-purple-400 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Relatório Comparativo Multianual
                  </h3>
                  <p className="text-[10px] text-slate-500 mb-6 uppercase tracking-wider font-mono">Comparação horizontal de desempenho e evolução temporal</p>
                  <div className="overflow-x-auto rounded-xl border border-white/5 bg-slate-950/40">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 bg-white/5">
                          <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Indicador</th>
                          <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Período Anterior</th>
                          <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Período Recente</th>
                          <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Variação (YoY)</th>
                          <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Impacto Estratégico</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-xs">
                        {report.comparativeReports.map((row, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-bold text-slate-200">{row.indicator}</td>
                            <td className="p-4 text-right text-slate-400 font-mono">{row.year1}</td>
                            <td className="p-4 text-right text-slate-200 font-mono font-bold">{row.year2}</td>
                            <td className={cn(
                              "p-4 text-right font-mono font-bold",
                              row.variance.includes('-') ? 'text-rose-400' : 'text-emerald-400'
                            )}>
                              {row.variance}
                            </td>
                            <td className="p-4 text-slate-400 leading-relaxed font-medium">{row.impact}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Main Chart */}
                <div className="xl:col-span-8 glass-card p-8 flex flex-col h-[500px]">
                  <div className="flex items-center justify-between mb-10">
                    <div>
                       <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-2">
                         PROJEÇÃO DE CAIXA (12 MESES)
                       </h3>
                       <p className="text-[10px] text-slate-500 font-medium">Modelagem estochástica baseada em regressão linear</p>
                    </div>
                    <div className="flex gap-4">
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-rose-500" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stress</span>
                       </div>
                    </div>
                  </div>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={report.forecast}>
                        <defs>
                          <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis 
                          dataKey="month" 
                          stroke="#475569" 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false}
                          fontFamily="monospace"
                        />
                        <YAxis 
                          stroke="#475569" 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false}
                          tickFormatter={(value) => `R$${value >= 1000 ? (value/1000).toFixed(0) + 'k' : value}`}
                          fontFamily="monospace"
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                          itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                          labelStyle={{ marginBottom: '4px', fontSize: '10px', color: '#94a3b8' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="projectedCash" 
                          stroke="#60a5fa" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorCash)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Red Flags & Resilience */}
                <div className="xl:col-span-4 glass-card p-8 flex flex-col h-[500px]">
                  <h3 className="text-xs font-black uppercase tracking-widest text-rose-400 mb-8 flex items-center gap-2">
                    ⚠️ Auditoria de Fragilidade
                  </h3>
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {report.redFlags.map((flag, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-xs font-bold text-slate-200 uppercase tracking-tight">{flag.title}</p>
                          <div className={cn(
                            "text-[9px] font-black uppercase px-1.5 py-0.5 rounded",
                            flag.severity === 'high' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                          )}>
                            {flag.severity}
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{flag.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <footer className="glass-panel p-1 border-white/10 rounded-3xl overflow-hidden mt-6">
                <div className="h-full bg-emerald-500/5 backdrop-blur-sm p-8 flex flex-col md:flex-row items-center gap-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20 group hover:scale-105 transition-transform">
                    <ShieldCheck className="w-8 h-8 text-slate-950" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-2">Recomendação Estratégica</p>
                    <p className="text-lg text-slate-100 font-medium tracking-tight max-w-4xl">
                      {report.recommendation}
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsSimulatorOpen(true)}
                    className="px-8 py-4 bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/20"
                  >
                    Executar Simulação
                  </button>
                </div>
              </footer>
              
                  <div className="mt-12 p-8 glass-card border-white/5 opacity-80">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Nota de Diagnóstico</h3>
                    <p className="text-slate-400 text-sm leading-relaxed font-medium">
                      {report.summary}
                    </p>
                  </div>
                </>
              )}

              {activeTab === 'projections' && (
                <ProjectionsTab report={report} />
              )}

              {activeTab === 'audit' && (
                <AuditTab report={report} />
              )}

              {activeTab === 'dossier' && (
                <DossierTab report={report} />
              )}
            </>
          )}
        </div>
      </main>

      {/* Dossier PDF Overlay (Visible only when browser print dialog is open) */}
      <div className="print-only hidden">
        <DossierTab report={report} />
      </div>

      {/* Scenario Simulator Modal */}
      <AnimatePresence>
        {isSimulatorOpen && (
          <ScenarioSimulator 
            report={report} 
            isOpen={isSimulatorOpen} 
            onClose={() => setIsSimulatorOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

