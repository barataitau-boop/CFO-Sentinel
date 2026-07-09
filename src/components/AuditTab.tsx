import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  DollarSign, 
  Clock, 
  Percent, 
  HelpCircle, 
  CheckCircle,
  Building,
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { FinancialReport } from '../types';
import { cn } from '../lib/utils';

interface AuditTabProps {
  report: FinancialReport;
}

export default function AuditTab({ report }: AuditTabProps) {
  // 1. Chart Data: Receivables (J.S. specific)
  const receivablesData = [
    { name: 'Em Dia / Programados', value: 2821984, color: '#10b981' }, // 66.97%
    { name: 'Atrasados (+30 dias)', value: 1391679, color: '#f43f5e' }   // 33.03%
  ];

  // 2. Chart Data: Debt service vs Income (monthly)
  const monthlyLiquidityData = [
    { name: 'Serviço Mensal da Dívida', valor: 412000, color: '#f43f5e' },
    { name: 'Resultado Líquido Médio', valor: 256796, color: '#10b981' },
    { name: 'Mensalidade de Combustível', valor: 575019, color: '#3b82f6' }
  ];

  // 3. Operational Costs breakdown
  const costsBreakdown = [
    { name: 'Combustível', valor: 42.55, color: '#3b82f6' },
    { name: 'Manutenção', valor: 15.54, color: '#8b5cf6' },
    { name: 'Tributos', valor: 11.35, color: '#f59e0b' },
    { name: 'Administrativas', valor: 7.18, color: '#64748b' },
    { name: 'Juros', valor: 2.53, color: '#ec4899' },
    { name: 'Outros', valor: 20.85, color: '#475569' }
  ];

  const totalOverdue = 1391679;
  const overduePercent = 33.03;

  return (
    <div className="space-y-8">
      {/* Risk Level Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-rose-500/20 border border-rose-500/30 rounded-2xl text-rose-400 flex-shrink-0 mt-1 md:mt-0">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest bg-rose-500/10 px-2 py-0.5 rounded">Risco Alto</span>
              <h3 className="text-base font-bold text-white uppercase tracking-tight">ALERTA DE FLUXO DE CAIXA: Serviço da Dívida e Recebíveis Atrasados</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-4xl font-medium">
              A auditoria minuciosa do Sentinel AI identificou um descompasso de liquidez imediata. Embora a empresa possua faturamento robusto de R$ 16.2M, o serviço mensal da dívida (R$ 412k) consome 160% do seu resultado operacional líquido (R$ 256k), gerando extrema vulnerabilidade financeira de curto prazo combinada com 33% da carteira de cobrança vencida.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Audit Dashboards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Widget 1: Receivables Overdue */}
        <div className="glass-card p-6 flex flex-col h-[400px]">
          <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-2 flex items-center gap-2">
            📊 Auditoria de Recebíveis (Duplicatas)
          </h4>
          <p className="text-[10px] text-slate-500 font-mono uppercase mb-4">Concentração de crédito e adimplemento da carteira</p>
          
          <div className="flex-1 min-h-0 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={receivablesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {receivablesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <p className="text-3xl font-extrabold text-rose-500">{overduePercent.toFixed(1)}%</p>
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Atrasados</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-400 font-medium">Em Dia / Programados</span>
              </div>
              <span className="font-bold text-slate-200">R$ 2,82M (67%)</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-slate-400 font-medium">Overdue (+30 dias)</span>
              </div>
              <span className="font-bold text-rose-400">R$ 1,39M (33%)</span>
            </div>
          </div>
        </div>

        {/* Widget 2: Cash Burn & Debt Service mismatch */}
        <div className="glass-card p-6 flex flex-col h-[400px]">
          <h4 className="text-xs font-black uppercase tracking-widest text-rose-400 mb-2 flex items-center gap-2">
            📉 Descompasso de Caixa Mensal (R$)
          </h4>
          <p className="text-[10px] text-slate-500 font-mono uppercase mb-4">Serviço da dívida vs rentabilidade mensal do negócio</p>

          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyLiquidityData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" fontSize={9} stroke="#475569" tickLine={false} />
                <YAxis fontSize={9} stroke="#475569" tickLine={false} tickFormatter={(val) => `R$${val/1000}k`} />
                <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
                <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                  {monthlyLiquidityData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 p-3 bg-black/30 rounded-xl border border-white/5">
            <p className="text-[9px] text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Alerta de Liquidez Crítica
            </p>
            <p className="text-[10px] text-slate-400 mt-1 font-medium leading-relaxed">
              O pagamento mensal de amortização de parcelas de R$ 412k supera o resultado líquido mensal em R$ 155k. Essa quebra é atualmente compensada por rolagem de crédito e antecipações pontuais cara.
            </p>
          </div>
        </div>

        {/* Widget 3: Fuel Exposure & Cost Concentration */}
        <div className="glass-card p-6 flex flex-col h-[400px]">
          <h4 className="text-xs font-black uppercase tracking-widest text-blue-400 mb-2 flex items-center gap-2">
            🚛 Concentração de Custos Operacionais
          </h4>
          <p className="text-[10px] text-slate-500 font-mono uppercase mb-4">Composição percentual dos custos na receita bruta (%)</p>

          <div className="flex-1 min-h-0 space-y-3 overflow-y-auto custom-scrollbar pr-1">
            {costsBreakdown.map((cost, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-300">{cost.name}</span>
                  <span className="font-mono text-slate-400 font-bold">{cost.valor}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${cost.valor}%`, backgroundColor: cost.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
            <p className="text-[9px] text-blue-400 font-bold uppercase tracking-wide">Exposição de Combustível</p>
            <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Combustível representa R$ 6.9M anuais. Flutuações de 5% no preço do diesel causam impacto de R$ 345k no caixa.</p>
          </div>
        </div>
      </div>

      {/* Critical Points & Recommendations Table */}
      <div className="glass-card p-8">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-300 mb-2 flex items-center gap-2">
          🔍 Detalhamento dos Pontos Críticos de Auditoria
        </h3>
        <p className="text-[10px] text-slate-500 mb-6 uppercase tracking-wider font-mono">Dossiê de não conformidades financeiras analisado em 100% de precisão</p>

        <div className="space-y-4">
          {/* Finding 1: Debt Mismatch */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">Ref: F01 - Serviço da Dívida e Liquidez de Caixa</h4>
              </div>
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">Risco Crítico</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Constatação de Auditoria</p>
                <p className="text-slate-300 leading-relaxed font-medium">
                  A empresa possui R$ 7.329.983 em endividamento total (SCR Banco Central), dos quais R$ 4.944.000 são parcelas de curto prazo vencendo em 12 meses. O caixa líquido operacional (DRE) anual é de R$ 3.081.551. O serviço da dívida consome 160.6% do caixa disponível de forma insolvente a menos que haja refinanciamento ativo.
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-wider mb-1">Ação de Mitigação Recomendada</p>
                <p className="text-slate-300 leading-relaxed font-medium">
                  <strong>Alongamento de Perfil:</strong> Realizar cessão de carteira estruturada (antecipação de contratos longos com a Supergasbras e Ultragaz) para liquidar as parcelas caras de curto prazo de R$ 412k. Apresentar o patrimônio imobiliário de R$ 1,5M (três matrículas limpas em Duque de Caxias) ao Itaú para alongar a dívida restante para 60 meses com taxa de juros imobiliária (home equity), reduzindo a parcela mensal para R$ 150k.
                </p>
              </div>
            </div>
          </div>

          {/* Finding 2: Overdue Receivables */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">Ref: F02 - Atraso de 33,03% no Recebimento de Clientes</h4>
              </div>
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">Risco Crítico</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Constatação de Auditoria</p>
                <p className="text-slate-300 leading-relaxed font-medium">
                  O contas a receber soma R$ 4.213.663 (relação direta de transporte de GLP). Desse total, R$ 1.391.679 está com prazo vencido e retido. Isso se concentra na Supergasbras Energia Ltda. (70,5% da carteira) e Ultragaz (24,8% da carteira). O prazo estendido das distribuidoras está asfixiando o caixa operacional da J.S.
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-wider mb-1">Ação de Mitigação Recomendada</p>
                <p className="text-slate-300 leading-relaxed font-medium">
                  <strong>Fomento Comercial / Operação de Risco Sacado:</strong> Negociar operação de risco sacado diretamente no portal financeiro das distribuidoras de GLP (Itaú ou Bradesco). Como o risco de crédito é das multinacionais de energia, a taxa de desconto da antecipação é baixíssima (menos de 1.0% a.m.), o que libera R$ 1.3M imediatos para recompor o fluxo sem incorrer em novas dívidas SCR.
                </p>
              </div>
            </div>
          </div>

          {/* Finding 3: Fleet Maintenance and Diesel Risk */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">Ref: F03 - Desgaste de Frota e Dependência de Diesel</h4>
              </div>
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">Risco Moderado</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Constatação de Auditoria</p>
                <p className="text-slate-300 leading-relaxed font-medium">
                  Os custos com combustível de R$ 6.900.229 (42,55% da receita) e manutenção de R$ 2.520.000 (15,54%) consomem somados 58,09% da receita total. A frota possui 76 veículos (18 cavalos-mecânicos MB e carretas 1983 a 2025). Carretas e cavalos mais antigos geram alto custo de reposição de pneus e manutenção preventiva.
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-wider mb-1">Ação de Mitigação Recomendada</p>
                <p className="text-slate-300 leading-relaxed font-medium">
                  <strong>Renovação Parcial de Frota via Leasing:</strong> Desmobilizar e vender os 5 cavalos de manobra antigos e veículos de apoio depreciados para levantar capital emergencial. Adotar telemetria avançada de rotas (SAS) com metas de consumo para motoristas autônomos. Ingressar em um plano de leasing operacional para renovação gradual das carretas antigas de 1983, reduzindo custo de manutenção preventiva em 20%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
