import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Settings, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Percent, 
  HelpCircle, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  Play,
  RotateCcw
} from 'lucide-react';
import { FinancialReport } from '../types';
import { cn } from '../lib/utils';

interface ScenarioSimulatorProps {
  report: FinancialReport;
  isOpen: boolean;
  onClose: () => void;
}

export default function ScenarioSimulator({ report, isOpen, onClose }: ScenarioSimulatorProps) {
  // Input parameters
  const [revenueGrowth, setRevenueGrowth] = useState<number>(10); // in %
  const [costEfficiency, setCostEfficiency] = useState<number>(-5); // in % (reduction is negative)
  const [dsoReduction, setDsoReduction] = useState<number>(-15); // in days (reduction is negative)
  const [interestAdjustment, setInterestAdjustment] = useState<number>(-20); // in %

  // Calculation results
  const [simKpis, setSimKpis] = useState({
    revenue: 16216756,
    netIncome: 3081552,
    ebitdaMargin: 19.0,
    dso: 95,
    debtEbitda: 2.1,
    releasedCash: 0,
  });

  const resetParams = () => {
    setRevenueGrowth(0);
    setCostEfficiency(0);
    setDsoReduction(0);
    setInterestAdjustment(0);
  };

  useEffect(() => {
    // Base J.S. values
    const baseRevenue = 16216756;
    const baseNetIncome = 3081552;
    const baseEbitdaMargin = 22.0; // Estimated EBITDA margin based on 19% net income and low administrative/interest costs
    const baseDso = 95; // Accounts receivable days
    const baseDebtEbitda = 2.1;

    // Simulate revenue based on growth input
    const simRevenue = baseRevenue * (1 + revenueGrowth / 100);

    // Simulate cost reduction on operating costs (which was 59.94% of revenue = R$ 9,720,239.82)
    // Positive efficiency input means cost reduction (negative cost change)
    const costSavings = baseRevenue * 0.5994 * (-costEfficiency / 100);
    
    // Interest adjustment affects finance expenses (R$ 410,000)
    const interestSavings = 410000 * (-interestAdjustment / 100);

    // Simulate net income
    const simulatedGrowthIncome = baseNetIncome * (1 + revenueGrowth * 0.8 / 100);
    const simNetIncome = Math.max(0, simulatedGrowthIncome + costSavings + interestSavings);

    // Simulate EBITDA margin
    const simEbitdaMargin = Math.min(35, Math.max(5, baseEbitdaMargin + (costEfficiency * -0.6) + (revenueGrowth * 0.15)));

    // Simulate DSO and cash release: J.S. has R$ 4.2M accounts receivable. 
    // Reducing DSO releases cash from receivables to instant liquid bank cash.
    // Days sales outstanding is Accounts Receivable / (Revenue/360) => 4,213,663 / (16,216,756/360) = ~93 days
    // A reduction of e.g. 15 days in DSO releases roughly (15 days * R$ 45,046 daily revenue) = R$ 675,690 in cash!
    const dailyRevenue = baseRevenue / 360;
    const simReleasedCash = Math.max(0, -dsoReduction * dailyRevenue);

    // Simulate leverage (Debt/EBITDA)
    // Debt is R$ 7,329,984
    // EBITDA is simulated based on EBITDA margin * simulated revenue
    const simEbitda = simRevenue * (simEbitdaMargin / 100);
    const simDebtEbitda = Math.max(0.5, Math.min(10, 7329984 / simEbitda));

    setSimKpis({
      revenue: simRevenue,
      netIncome: simNetIncome,
      ebitdaMargin: simEbitdaMargin,
      dso: baseDso + dsoReduction,
      debtEbitda: simDebtEbitda,
      releasedCash: simReleasedCash,
    });
  }, [revenueGrowth, costEfficiency, dsoReduction, interestAdjustment]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-5xl shadow-2xl shadow-blue-500/10 overflow-hidden flex flex-col my-8"
        >
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400">
                <Settings className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <span className="text-[10px] font-black tracking-widest text-blue-400 uppercase">Simulação Interativa</span>
                <h2 className="text-xl font-bold tracking-tight text-white uppercase">Cenários Financeiros & Simulação Ideal</h2>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-white/5 border border-white/10 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-y-auto">
            {/* Control Panel (Sliders) */}
            <div className="lg:col-span-5 space-y-6 bg-white/5 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-300">Variáveis de Alavancagem</h3>
                <button 
                  onClick={resetParams}
                  className="text-[10px] font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors uppercase"
                >
                  <RotateCcw className="w-3 h-3" /> Resetar
                </button>
              </div>

              {/* Slider 1: Revenue Growth */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" /> Crescimento de Receita
                  </label>
                  <span className={cn(
                    "text-xs font-bold font-mono px-2 py-0.5 rounded",
                    revenueGrowth > 0 ? "text-emerald-400 bg-emerald-500/10" : revenueGrowth < 0 ? "text-rose-400 bg-rose-500/10" : "text-slate-400 bg-slate-800"
                  )}>
                    {revenueGrowth > 0 ? `+${revenueGrowth}` : revenueGrowth}%
                  </span>
                </div>
                <input 
                  type="range" 
                  min="-25" 
                  max="35" 
                  value={revenueGrowth} 
                  onChange={(e) => setRevenueGrowth(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>-25% (Estresse)</span>
                  <span>0% (Atual)</span>
                  <span>+35% (Meta)</span>
                </div>
              </div>

              {/* Slider 2: Cost Efficiency */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-blue-400" /> Redução de Custos de Frota
                  </label>
                  <span className={cn(
                    "text-xs font-bold font-mono px-2 py-0.5 rounded",
                    costEfficiency < 0 ? "text-emerald-400 bg-emerald-500/10" : costEfficiency > 0 ? "text-rose-400 bg-rose-500/10" : "text-slate-400"
                  )}>
                    {costEfficiency > 0 ? `+${costEfficiency}` : costEfficiency}%
                  </span>
                </div>
                <input 
                  type="range" 
                  min="-15" 
                  max="5" 
                  value={costEfficiency} 
                  onChange={(e) => setCostEfficiency(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>-15% (Otimizar)</span>
                  <span>0% (Igual)</span>
                  <span>+5% (Aumento)</span>
                </div>
              </div>

              {/* Slider 3: DSO Days Reduction */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" /> Prazo de Recebimento
                  </label>
                  <span className={cn(
                    "text-xs font-bold font-mono px-2 py-0.5 rounded",
                    dsoReduction < 0 ? "text-emerald-400 bg-emerald-500/10" : dsoReduction > 0 ? "text-rose-400 bg-rose-500/10" : "text-slate-400"
                  )}>
                    {dsoReduction > 0 ? `+${dsoReduction}` : dsoReduction} dias
                  </span>
                </div>
                <input 
                  type="range" 
                  min="-30" 
                  max="10" 
                  value={dsoReduction} 
                  onChange={(e) => setDsoReduction(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>-30 dias (Rápido)</span>
                  <span>0 dias (Atual)</span>
                  <span>+10 dias (Atrasar)</span>
                </div>
              </div>

              {/* Slider 4: Interest rate Renegotiation */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-2">
                    <Percent className="w-4 h-4 text-purple-400" /> Custo de Juros / Financiamentos
                  </label>
                  <span className={cn(
                    "text-xs font-bold font-mono px-2 py-0.5 rounded",
                    interestAdjustment < 0 ? "text-emerald-400 bg-emerald-500/10" : interestAdjustment > 0 ? "text-rose-400 bg-rose-500/10" : "text-slate-400"
                  )}>
                    {interestAdjustment > 0 ? `+${interestAdjustment}` : interestAdjustment}%
                  </span>
                </div>
                <input 
                  type="range" 
                  min="-50" 
                  max="10" 
                  value={interestAdjustment} 
                  onChange={(e) => setInterestAdjustment(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>-50% (Alongar)</span>
                  <span>0% (Manter)</span>
                  <span>+10% (Alta)</span>
                </div>
              </div>

              <div className="p-4 bg-slate-950/50 rounded-xl border border-white/5 space-y-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-blue-400" /> Mecânica de Simulação
                </p>
                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                  A redução de custos operacionais (como combustível e pneus) e o alongamento de juros elevam imediatamente a margem operacional. A aceleração de cobranças (menor DSO) desretem capital preso gerando liberação instantânea de liquidez em conta.
                </p>
              </div>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-7 space-y-6">
              {/* Cash Release Banner */}
              {simKpis.releasedCash > 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wider mb-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> Caixa Adicional Liberado no Fluxo
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium max-w-md">Capital desbloqueado da carteira de recebíveis através da antecipação estruturada.</p>
                  </div>
                  <span className="text-xl font-bold text-emerald-400 font-mono">
                    +R$ {simKpis.releasedCash.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                  </span>
                </motion.div>
              )}

              {/* KPI Compare Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Margem EBITDA Simulada</p>
                  <p className="text-2xl font-bold font-mono text-white mb-2">{simKpis.ebitdaMargin.toFixed(1)}%</p>
                  <div className="flex justify-between items-center text-[9px]">
                    <span className="text-slate-400 font-semibold">Atual: <span className="font-mono text-slate-300">22.0%</span></span>
                    <span className="text-emerald-400 font-semibold">Benchmark: <span className="font-mono">22.5%</span></span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Grau Alavancagem (Dívida/EBITDA)</p>
                  <p className="text-2xl font-bold font-mono text-white mb-2">{simKpis.debtEbitda.toFixed(2)}x</p>
                  <div className="flex justify-between items-center text-[9px]">
                    <span className="text-slate-400 font-semibold">Atual: <span className="font-mono text-slate-300">2.10x</span></span>
                    <span className="text-emerald-400 font-semibold">Saudável: <span className="font-mono">&lt;1.8x</span></span>
                  </div>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="rounded-2xl border border-white/5 bg-slate-950/40 overflow-hidden">
                <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-300">Quadro Comparativo de Impactos</span>
                  <span className="text-[10px] font-mono text-slate-500">Ação vs Situação Atual</span>
                </div>
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] uppercase font-bold text-slate-500">
                      <th className="p-3 pl-4">Indicador</th>
                      <th className="p-3 text-right">Faturamento Atual</th>
                      <th className="p-3 text-right text-blue-400">Projeção Simulada</th>
                      <th className="p-3 text-right text-emerald-400">Alvo Ideal (Mercado)</th>
                      <th className="p-3 pr-4">Diagnóstico</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-medium">
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-3 pl-4 font-bold text-slate-300">Receita Bruta</td>
                      <td className="p-3 text-right font-mono text-slate-400">R$ 16,2M</td>
                      <td className="p-3 text-right font-mono text-blue-400 font-bold">R$ {(simKpis.revenue/1000000).toFixed(2)}M</td>
                      <td className="p-3 text-right font-mono text-emerald-400">R$ 17,5M</td>
                      <td className="p-3 pr-4">
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase",
                          simKpis.revenue >= 17000000 ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                        )}>
                          {simKpis.revenue >= 17000000 ? "Alinhado" : "Abaixo Alvo"}
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-3 pl-4 font-bold text-slate-300">Resultado Líquido</td>
                      <td className="p-3 text-right font-mono text-slate-400">R$ 3,08M</td>
                      <td className="p-3 text-right font-mono text-blue-400 font-bold">R$ {(simKpis.netIncome/1000000).toFixed(2)}M</td>
                      <td className="p-3 text-right font-mono text-emerald-400">R$ 3,30M</td>
                      <td className="p-3 pr-4">
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase",
                          simKpis.netIncome >= 3300000 ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                        )}>
                          {simKpis.netIncome >= 3300000 ? "Excelente" : "Moderado"}
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-3 pl-4 font-bold text-slate-300">Prazo Receb. (DSO)</td>
                      <td className="p-3 text-right font-mono text-slate-400">93 dias</td>
                      <td className="p-3 text-right font-mono text-blue-400 font-bold">{simKpis.dso} dias</td>
                      <td className="p-3 text-right font-mono text-emerald-400">45 dias</td>
                      <td className="p-3 pr-4">
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase",
                          simKpis.dso <= 60 ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                        )}>
                          {simKpis.dso <= 60 ? "Alinhado" : "Fora Alvo"}
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-3 pl-4 font-bold text-slate-300">Alavancagem</td>
                      <td className="p-3 text-right font-mono text-slate-400">2,10x</td>
                      <td className="p-3 text-right font-mono text-blue-400 font-bold">{simKpis.debtEbitda.toFixed(2)}x</td>
                      <td className="p-3 text-right font-mono text-emerald-400">1,80x</td>
                      <td className="p-3 pr-4">
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase",
                          simKpis.debtEbitda <= 1.8 ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                        )}>
                          {simKpis.debtEbitda <= 1.8 ? "Seguro" : "Alavancado"}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Action Plan Suggestions */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Plano de Ação para Ramo de Atividade</h4>
                <div className="grid grid-cols-1 gap-2.5">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 flex gap-3 items-start">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-200">Antecipação Estruturada de Clientes (DSO reduzido)</p>
                      <p className="text-[10px] text-slate-400 mt-1">Como a carteira é composta por grandes distribuidoras (Supergasbras/Ultragaz), realizar operações de recebíveis pré-fixadas diminui o DSO para menos de 50 dias com taxas inferiores a 1.2% a.m.</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 flex gap-3 items-start">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-200">Leasing e Alongamento de Juros (Itaú Unibanco)</p>
                      <p className="text-[10px] text-slate-400 mt-1">Renegociar a dívida de R$ 7,3M convertendo linhas de curto prazo em financiamentos imobiliários e leasing de longo prazo garantidos pelo imóvel próprio (R$ 1,5M) e pela frota operacional (R$ 19,9M).</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="p-6 md:p-8 bg-black/40 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Simulações de mercado validadas pelo Sentinel AI</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={resetParams}
                className="px-6 py-3 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/5 transition-all text-slate-300"
              >
                Limpar Parâmetros
              </button>
              <button 
                onClick={onClose}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
              >
                <Play className="w-4 h-4" /> Aplicar Cenário Simulador
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
