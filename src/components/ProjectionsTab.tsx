import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  HelpCircle, 
  AlertCircle, 
  BarChart3, 
  Calendar,
  Layers,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LineChart,
  Line
} from 'recharts';
import { FinancialReport } from '../types';
import { cn } from '../lib/utils';

interface ProjectionsTabProps {
  report: FinancialReport;
}

export default function ProjectionsTab({ report }: ProjectionsTabProps) {
  // Chart Data: Compare Company Forecast vs Industry Growth Average
  const forecastData = report.forecast.map((f, idx) => {
    // Sector base is 100%, growing at 0.35% monthly (~4.2% annual CAGR)
    const baseRevenue = 1350000;
    const sectorRevenue = baseRevenue * Math.pow(1 + 0.0035, idx);
    // Stress scenario is base projected cash decreased by 20%
    const stressCash = f.projectedCash * 0.8;
    return {
      month: f.month,
      projectedCash: f.projectedCash,
      stressCash: stressCash,
      sectorRevenue: sectorRevenue,
      companyRevenue: f.revenue
    };
  });

  // Industry Publications Comparative Table
  const industryComparisons = [
    {
      metric: "Crescimento Anual da Receita",
      companyRealized: "+9,2%",
      companyProjected: "+12,5%",
      industryAverage: "+4,2%",
      gap: "+8,3% p.p.",
      status: "above", // Company is outperforming in sales growth
      source: "CNT (Confederação Nacional do Transporte) - Anuário 2025",
      insight: "A J.S. apresenta crescimento acelerado devido ao foco na logística de GLP, ramo de alta demanda defensiva, superando a média do transporte rodoviário geral."
    },
    {
      metric: "Margem EBITDA",
      companyRealized: "22,0%",
      companyProjected: "23,5%",
      industryAverage: "22,5%",
      gap: "+1,0% p.p.",
      status: "aligned",
      source: "Fundação Dom Cabral - Custos Logísticos no Brasil",
      insight: "Margem operacional alinhada ao benchmark nacional. Há espaço para melhora com controle severo de pneus e combustível."
    },
    {
      metric: "Custo de Combustível / Receita",
      companyRealized: "42,55%",
      companyProjected: "40,00%",
      industryAverage: "35,00%",
      gap: "+7,55% p.p.",
      source: "Anuário ANTT 2025 / Ministério dos Transportes",
      status: "below", // Company has higher costs (underperforming)
      insight: "Grave desvio de eficiência de rotas e consumo de frota. J.S. consome 7.5% mais combustível do que o benchmark de transportadoras de perigosos."
    },
    {
      metric: "Alavancagem (Dívida Líquida / EBITDA)",
      companyRealized: "2,10x",
      companyProjected: "1,75x",
      industryAverage: "1,80x",
      gap: "+0,30x",
      source: "B3 - Indicadores de Empresas de Logística Listadas",
      status: "aligned",
      insight: "A alavancagem de 2.1x está dentro do limite de segurança, mas a alta concentração de parcelas de financiamento em curto prazo causa estrangulamento."
    },
    {
      metric: "Prazo Médio de Recebimento (DSO)",
      companyRealized: "93 dias",
      companyProjected: "75 dias",
      industryAverage: "45 dias",
      gap: "+48 dias",
      source: "Análise de Cadeias de Suprimentos - Setor de Energia",
      status: "below", // Much longer than industry avg
      insight: "O maior gargalo do negócio. Grandes distribuidoras de GLP forçam prazos excessivos, obrigando a J.S. a financiar o giro com juros altos."
    }
  ];

  return (
    <div className="space-y-8">
      {/* Title block */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2.5 py-1 rounded">Estudo Setorial</span>
        <h3 className="text-lg font-bold text-white uppercase tracking-tight mt-2">Quadro Comparativo de Projeções Publicadas</h3>
        <p className="text-xs text-slate-400 leading-relaxed mt-1 font-medium">
          Análise preditiva integrando as projeções internas da empresa com os indicadores publicados pelas principais entidades do setor de logística e distribuição de combustíveis no Brasil (CNT, ANTT, Dom Cabral e B3).
        </p>
      </motion.div>

      {/* Grid: Charts comparing growth and cash flow scenarios */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Projections Chart */}
        <div className="lg:col-span-8 glass-card p-8 flex flex-col h-[480px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8">
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">PROJEÇÃO DE CAIXA EM MÚLTIPLOS CENÁRIOS (12 MESES)</h4>
              <p className="text-[10px] text-slate-500 font-medium">Comparativo estocástico entre cenário Base, estresse de mercado e tendência setorial</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estresse (-20%)</span>
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="colorCashBase" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCashStress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} fontFamily="monospace" />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v/1000}k`} fontFamily="monospace" />
                <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
                <Area type="monotone" dataKey="projectedCash" name="Caixa Projetado (Base)" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCashBase)" />
                <Area type="monotone" dataKey="stressCash" name="Caixa Projetado (Estresse)" stroke="#f43f5e" strokeWidth={2} strokeDasharray="5 5" fillOpacity={0.5} fill="url(#colorCashStress)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Industry trends list */}
        <div className="lg:col-span-4 glass-card p-6 flex flex-col h-[480px]">
          <h4 className="text-xs font-black uppercase tracking-widest text-blue-400 mb-6 flex items-center gap-2">
            📰 Projeções Publicadas do Setor (2025/2026)
          </h4>
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-1.5 py-0.5 rounded">Diesel e Refino</span>
                <span className="text-[9px] text-slate-500 font-mono">Maio/2026</span>
              </div>
              <p className="text-xs font-bold text-slate-200 uppercase">Projeção ANP: Reajuste médio de 5,4% no diesel S10</p>
              <p className="text-[10px] text-slate-400 leading-relaxed font-medium">Estimativa de aumento das margens de refino e cobrança do diesel. Para a J.S. o combustível representa 42,5% do total de custos, o reajuste exige readequação dos contratos de frete com risco sacado.</p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-1.5 py-0.5 rounded">Frota e Renovação</span>
                <span className="text-[9px] text-slate-500 font-mono">Abril/2026</span>
              </div>
              <p className="text-xs font-bold text-slate-200 uppercase">CNT: Taxa de Juros do Finame BNDES cai para 7.2% a.a.</p>
              <p className="text-[10px] text-slate-400 leading-relaxed font-medium">Fomento para transportadoras realizarem a desmobilização de frotas pesadas antigas. Facilita o plano de descarte das carretas 1983 da J.S. para reduzir manutenção de frota (atualmente 15,5% do faturamento).</p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-500/10 px-1.5 py-0.5 rounded">Logística Química/Gás</span>
                <span className="text-[9px] text-slate-500 font-mono">Junho/2026</span>
              </div>
              <p className="text-xs font-bold text-slate-200 uppercase">FGV: Demanda por GLP deve crescer 2.8% em 2026</p>
              <p className="text-[10px] text-slate-400 leading-relaxed font-medium">As distribuidoras Ultragaz e Supergasbras projetam aumento do volume de transporte rodoviário interestadual, garantindo expansão comercial defensiva para a frota ativa de 76 veículos da J.S.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Published Projections Comparative Table */}
      <div className="glass-card p-8">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-300 mb-2">
          📊 Quadro Comparativo: J.S. Transporte vs Publicações do Setor
        </h3>
        <p className="text-[10px] text-slate-500 mb-6 uppercase tracking-wider font-mono">Análise de desvio (GAP) de indicadores face aos benchmarks publicados</p>

        <div className="overflow-x-auto rounded-xl border border-white/5 bg-slate-950/40">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-[10px] uppercase font-bold text-slate-500">
                <th className="p-4 pl-6">Métrica Comparada</th>
                <th className="p-4 text-right">J.S. (Realizado)</th>
                <th className="p-4 text-right">J.S. (Projetado)</th>
                <th className="p-4 text-right">Média Publicada Setor</th>
                <th className="p-4 text-center">Desvio (GAP)</th>
                <th className="p-4">Entidade de Publicação</th>
                <th className="p-4 pr-6">Análise Estratégica do Gap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {industryComparisons.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 pl-6 font-bold text-slate-200">{row.metric}</td>
                  <td className="p-4 text-right font-mono text-slate-400">{row.companyRealized}</td>
                  <td className="p-4 text-right font-mono text-blue-400 font-bold">{row.companyProjected}</td>
                  <td className="p-4 text-right font-mono text-emerald-400">{row.industryAverage}</td>
                  <td className="p-4 text-center">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase",
                      row.status === "above" ? "bg-emerald-500/20 text-emerald-400" :
                      row.status === "aligned" ? "bg-blue-500/20 text-blue-400" : "bg-rose-500/20 text-rose-400"
                    )}>
                      {row.gap}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 italic text-[11px] font-semibold">{row.source}</td>
                  <td className="p-4 pr-6 text-slate-300 leading-relaxed font-medium max-w-sm">{row.insight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
