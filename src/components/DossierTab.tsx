import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Printer, 
  Download, 
  ShieldCheck, 
  CheckCircle,
  Clock,
  Coins
} from 'lucide-react';
import { FinancialReport } from '../types';

interface DossierTabProps {
  report: FinancialReport;
}

export default function DossierTab({ report }: DossierTabProps) {
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 no-print-container">
      {/* Action Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4 no-print"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-tight">Dossiê Financeiro Completo</h3>
            <p className="text-xs text-slate-400 font-medium">Replicado no padrão visual oficial com visão geral, projeções e auditoria detalhada.</p>
          </div>
        </div>
        <button 
          onClick={handlePrint}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
        >
          <Printer className="w-4 h-4" /> Exportar / Imprimir PDF
        </button>
      </motion.div>

      {/* Book-like print pages preview */}
      <div className="flex flex-col items-center gap-8 bg-slate-950/40 p-4 md:p-8 rounded-3xl border border-white/5 overflow-x-auto no-print">
        <p className="text-[10px] text-slate-500 uppercase font-black tracking-wider flex items-center gap-2">
          📄 Visualização das Páginas do Documento A4 (Serão impressas sem barra de ferramentas)
        </p>
        
        {/* PAGE 1: COVER */}
        <div className="print-page bg-white text-slate-900 shadow-2xl rounded-sm p-[20mm] w-[210mm] min-h-[297mm] flex flex-col justify-between relative select-text" id="p1">
          {/* Page Top Header */}
          <div className="border-b-2 border-blue-900 pb-2 text-[9px] text-slate-600 font-sans font-bold uppercase tracking-wider flex justify-between items-center">
            <span>J.S. TRANSPORTE E SERVIÇO LTDA | CNPJ 17.245.072/0001-00</span>
            <span>Demonstrações Financeiras 2025</span>
          </div>

          {/* Main Title Block */}
          <div className="text-center my-auto py-12 space-y-6">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em]">Documento Confidencial</span>
            <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight leading-none uppercase">Dossiê Financeiro</h1>
            <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-wide">J.S. Transporte e Serviço Ltda</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Estrada Tiradentes, Lote 16/17/18 — Campos Elíseos — Duque de Caxias/RJ — CEP 25267-310 <br />
              CNPJ: 17.245.072/0001-00 | Inscrição Estadual: 79.823.058
            </p>
          </div>

          {/* Metadata Block */}
          <div className="border border-slate-300 rounded overflow-hidden">
            <table className="w-full text-left text-xs">
              <tbody className="divide-y divide-slate-200">
                <tr className="bg-slate-50">
                  <td className="p-3 font-bold text-slate-700 w-1/3 border-r border-slate-200">Exercício de Referência</td>
                  <td className="p-3 text-slate-800 font-medium">01 de janeiro de 2025 a 31 de dezembro de 2025</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-700 border-r border-slate-200">Data-Base do Balanço</td>
                  <td className="p-3 text-slate-800 font-medium">31 de dezembro de 2025</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="p-3 font-bold text-slate-700 border-r border-slate-200">Finalidade do Documento</td>
                  <td className="p-3 text-slate-800 font-medium font-bold">Apresentação de capacidade econômico-financeira — Banco Itaú S.A.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-700 border-r border-slate-200">Ramo de Atividade</td>
                  <td className="p-3 text-slate-800 font-medium">Transporte Rodoviário de Produtos Perigosos (GLP) — CNAE 4930-2/02</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="p-3 font-bold text-slate-700 border-r border-slate-200">Clientes Principais</td>
                  <td className="p-3 text-slate-800 font-medium leading-relaxed">Companhia Ultragaz S.A. | Supergasbras Energia Ltda. | Nacional Gás | Copa Energia</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex justify-between items-center font-bold">
            <span>ABRIL DE 2026</span>
            <span>Página 1</span>
          </div>
        </div>

        {/* PAGE 2: PERFIL */}
        <div className="print-page bg-white text-slate-900 shadow-2xl rounded-sm p-[20mm] w-[210mm] min-h-[297mm] flex flex-col justify-between relative select-text" id="p2">
          <div className="border-b-2 border-blue-900 pb-2 text-[9px] text-slate-600 font-bold uppercase flex justify-between">
            <span>J.S. TRANSPORTE E SERVIÇO LTDA | CNPJ 17.245.072/0001-00</span>
            <span>Perfil Corporativo</span>
          </div>

          <div className="my-auto space-y-6">
            <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wide border-b border-blue-900 pb-1">1. Perfil da Empresa</h3>
            <p className="text-xs text-slate-700 leading-relaxed text-justify">
              A J.S. Transporte e Serviço Ltda. é uma empresa de transporte rodoviário especializada no manuseio e distribuição de GLP (Gás Liquefeito de Petróleo), com sede em Duque de Caxias/RJ e operações em múltiplos estados brasileiros. Fundada há mais de uma década, a empresa consolidou parcerias estratégicas com os maiores distribuidores de gás do país, operando frota própria de alta capacidade com tecnologia e segurança.
            </p>

            <div className="border border-slate-200 rounded overflow-hidden">
              <table className="w-full text-left text-xs">
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-slate-50">
                    <td className="p-3 font-bold text-slate-700 w-1/3 border-r border-slate-200">Sócios / Administração</td>
                    <td className="p-3 text-slate-800 font-medium">Leandro Lima Mota (OAB/RJ 259.182) — Sócio Administrador</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700 border-r border-slate-200">Faturamento Anual 2025</td>
                    <td className="p-3 text-slate-800 font-bold font-mono text-emerald-700">R$ 16.216.756,35</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-3 font-bold text-slate-700 border-r border-slate-200">Frota Própria</td>
                    <td className="p-3 text-slate-800 font-medium">76 veículos: 18 cavalos-mecânicos, 8 caminhões, 38 carretas, 5 cavalos manobra, 7 veículos de apoio</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700 border-r border-slate-200">Patrimônio Líquido</td>
                    <td className="p-3 text-slate-800 font-bold font-mono">R$ 17.523.680,00</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-3 font-bold text-slate-700 border-r border-slate-200">Imóvel Próprio</td>
                    <td className="p-3 text-slate-800 font-medium leading-relaxed">Garagem/pátio operacional — 2.040m² — Parque Campos Elíseos, Duque de Caxias/RJ (3 matrículas: 52.277 | 52.278 | 11.394 — avaliação R$ 1.500.000)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700 border-r border-slate-200">Regularidade Fiscal</td>
                    <td className="p-3 text-slate-800 font-medium text-emerald-600 font-bold">Sem dívidas vencidas no SCR — todas as obrigações financeiras em dia (Banco Central do Brasil — Dez/2025)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex justify-between font-bold">
            <span>Documento Confidencial</span>
            <span>Página 2</span>
          </div>
        </div>

        {/* PAGE 3: DRE */}
        <div className="print-page bg-white text-slate-900 shadow-2xl rounded-sm p-[20mm] w-[210mm] min-h-[297mm] flex flex-col justify-between relative select-text" id="p3">
          <div className="border-b-2 border-blue-900 pb-2 text-[9px] text-slate-600 font-bold uppercase flex justify-between">
            <span>J.S. TRANSPORTE E SERVIÇO LTDA | CNPJ 17.245.072/0001-00</span>
            <span>Demonstração do Resultado</span>
          </div>

          <div className="my-auto space-y-4">
            <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wide border-b border-blue-900 pb-1">2. Demonstração do Resultado do Exercício — DRE 2025</h3>
            <p className="text-[10px] text-slate-500 italic">Apuração com base no faturamento emitido pelo contador da empresa (CRC RJ120853/O-0), coberto por Relatório de Faturamento assinado digitalmente, referente ao período 01/01/2025 a 31/12/2025.</p>
            
            <table className="w-full text-left text-xs border border-slate-300">
              <thead>
                <tr className="bg-blue-900 text-white font-bold uppercase text-[10px]">
                  <th className="p-2.5">Descrição</th>
                  <th className="p-2.5 text-center w-24">% Receita</th>
                  <th className="p-2.5 text-right w-36">R$ (Anual)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="font-bold bg-slate-100">
                  <td className="p-2.5 text-blue-900">RECEITA BRUTA</td>
                  <td className="p-2.5 text-center font-mono">100,00%</td>
                  <td className="p-2.5 text-right font-mono">16.216.756,35</td>
                </tr>
                <tr className="font-bold bg-slate-50 text-[10px] text-slate-500 uppercase">
                  <td colSpan={3} className="p-2">Custos Operacionais</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Combustível</td>
                  <td className="p-2.5 text-center font-mono text-slate-600">42,55%</td>
                  <td className="p-2.5 text-right font-mono text-slate-600">6.900.229,83</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Manutenção de Frota</td>
                  <td className="p-2.5 text-center font-mono text-slate-600">15,54%</td>
                  <td className="p-2.5 text-right font-mono text-slate-600">2.520.000,00</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Pedágios</td>
                  <td className="p-2.5 text-center font-mono text-slate-600">0,48%</td>
                  <td className="p-2.5 text-right font-mono text-slate-600">77.840,43</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Pneus</td>
                  <td className="p-2.5 text-center font-mono text-slate-600">1,37%</td>
                  <td className="p-2.5 text-right font-mono text-slate-600">222.169,56</td>
                </tr>
                <tr className="font-bold bg-slate-50">
                  <td className="p-2.5 text-slate-700">Subtotal Custos Operacionais</td>
                  <td className="p-2.5 text-center font-mono text-slate-600">-</td>
                  <td className="p-2.5 text-right font-mono text-blue-900">9.720.239,82 (59,94%)</td>
                </tr>
                <tr className="font-bold bg-slate-50 text-[10px] text-slate-500 uppercase">
                  <td colSpan={3} className="p-2">Despesas</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Impostos e Tributos</td>
                  <td className="p-2.5 text-center font-mono text-slate-600">11,35%</td>
                  <td className="p-2.5 text-right font-mono text-slate-600">1.840.602,33</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Despesas Administrativas</td>
                  <td className="p-2.5 text-center font-mono text-slate-600">7,18%</td>
                  <td className="p-2.5 text-right font-mono text-slate-600">1.164.363,31</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Despesas Financeiras (Juros)</td>
                  <td className="p-2.5 text-center font-mono text-slate-600">2,53%</td>
                  <td className="p-2.5 text-right font-mono text-slate-600">410.000,00</td>
                </tr>
                <tr className="font-bold bg-slate-50">
                  <td className="p-2.5 text-slate-700">Subtotal Despesas</td>
                  <td className="p-2.5 text-center font-mono text-slate-600">-</td>
                  <td className="p-2.5 text-right font-mono text-blue-900">3.414.964,95 (21,06%)</td>
                </tr>
                <tr className="font-bold bg-emerald-50 text-emerald-900 text-sm">
                  <td className="p-3">RESULTADO LÍQUIDO DO EXERCÍCIO</td>
                  <td className="p-3 text-center font-mono">19,00%</td>
                  <td className="p-3 text-right font-mono font-extrabold">3.081.551,58</td>
                </tr>
              </tbody>
            </table>

            <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
              * Média Mensal de Receita: R$ 1.351.396,36 | Resultado Líquido Mensal: R$ 256.795,96 <br />
              * A empresa não possui quadro de empregados com vínculo CLT. Operação realizada por transportadores autônomos e contratos de prestação de serviços terceirizados.
            </p>
          </div>

          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex justify-between font-bold">
            <span>Documento Confidencial</span>
            <span>Página 3</span>
          </div>
        </div>

        {/* PAGE 4: ATIVO BALANÇO */}
        <div className="print-page bg-white text-slate-900 shadow-2xl rounded-sm p-[20mm] w-[210mm] min-h-[297mm] flex flex-col justify-between relative select-text" id="p4">
          <div className="border-b-2 border-blue-900 pb-2 text-[9px] text-slate-600 font-bold uppercase flex justify-between">
            <span>J.S. TRANSPORTE E SERVIÇO LTDA | CNPJ 17.245.072/0001-00</span>
            <span>Balanço Patrimonial - Ativo</span>
          </div>

          <div className="my-auto space-y-4">
            <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wide border-b border-blue-900 pb-1">3. Balanço Patrimonial — Ativo (31/12/2025)</h3>
            
            <table className="w-full text-left text-xs border border-slate-300">
              <thead>
                <tr className="bg-blue-900 text-white font-bold uppercase text-[10px]">
                  <th className="p-2.5">ATIVO CIRCULANTE</th>
                  <th className="p-2.5 text-right w-44">R$</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2.5 pl-6">Caixa e Equivalentes de Caixa</td>
                  <td className="p-2.5 text-right font-mono text-slate-700">3.000,00</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Contas a Receber (clientes)</td>
                  <td className="p-2.5 text-right font-mono text-slate-700">4.213.663,13</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Estoques (diesel, pneus e peças)</td>
                  <td className="p-2.5 text-right font-mono text-slate-700">150.000,00</td>
                </tr>
                <tr className="font-bold bg-slate-100 text-slate-900">
                  <td className="p-2.5">TOTAL CIRCULANTE</td>
                  <td className="p-2.5 text-right font-mono">4.366.663,13</td>
                </tr>
                <tr className="bg-blue-900 text-white font-bold uppercase text-[10px]">
                  <th className="p-2.5">ATIVO NÃO CIRCULANTE — IMOBILIZADO</th>
                  <th className="p-2.5 text-right">R$ (FIPE dez/2025)</th>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Cavalos-Mecânicos Viagem — 18 unidades MB (2019 a 2025)</td>
                  <td className="p-2.5 text-right font-mono text-slate-700">9.698.000,00</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Caminhões de Entrega — 8 unidades MB/Atego (2020 a 2025)</td>
                  <td className="p-2.5 text-right font-mono text-slate-700">4.490.000,00</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Semirreboques / Carretas — 38 unidades</td>
                  <td className="p-2.5 text-right font-mono text-slate-700">4.680.000,00</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Cavalos-Mecânicos de Manobra — 5 unidades</td>
                  <td className="p-2.5 text-right font-mono text-slate-700">380.000,00</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Veículos de Apoio — 7 unidades</td>
                  <td className="p-2.5 text-right font-mono text-slate-700">723.000,00</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Imóveis — Garagem/Pátio Operacional (Matrículas 52.277 | 52.278 | 11.394)</td>
                  <td className="p-2.5 text-right font-mono text-slate-700">1.500.000,00</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Investimentos em Terras Rurais (destinação de 91,1% do resultado 2025)</td>
                  <td className="p-2.5 text-right font-mono text-slate-700">2.807.293,49</td>
                </tr>
                <tr className="font-bold bg-slate-100 text-slate-900">
                  <td className="p-2.5">TOTAL NÃO CIRCULANTE</td>
                  <td className="p-2.5 text-right font-mono">24.278.293,49</td>
                </tr>
                <tr className="font-bold bg-blue-100 text-blue-900 text-sm">
                  <td className="p-3">TOTAL ATIVO</td>
                  <td className="p-3 text-right font-mono font-extrabold">28.644.956,49</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex justify-between font-bold">
            <span>Documento Confidencial</span>
            <span>Página 4</span>
          </div>
        </div>

        {/* PAGE 5: PASSIVO BALANÇO */}
        <div className="print-page bg-white text-slate-900 shadow-2xl rounded-sm p-[20mm] w-[210mm] min-h-[297mm] flex flex-col justify-between relative select-text" id="p5">
          <div className="border-b-2 border-blue-900 pb-2 text-[9px] text-slate-600 font-bold uppercase flex justify-between">
            <span>J.S. TRANSPORTE E SERVIÇO LTDA | CNPJ 17.245.072/0001-00</span>
            <span>Balanço Patrimonial - Passivo & PL</span>
          </div>

          <div className="my-auto space-y-4">
            <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wide border-b border-blue-900 pb-1">3.2 Balanço Patrimonial — Passivo e Patrimônio Líquido</h3>
            
            <table className="w-full text-left text-xs border border-slate-300">
              <thead>
                <tr className="bg-blue-900 text-white font-bold uppercase text-[10px]">
                  <th className="p-2.5">PASSIVO CIRCULANTE</th>
                  <th className="p-2.5 text-right w-44">R$</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2.5 pl-6">Parcelas de Financiamentos — vencimento em 12 meses (R$ 412 mil/mês)</td>
                  <td className="p-2.5 text-right font-mono text-slate-700">4.944.000,00</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Fornecedores e Contas a Pagar</td>
                  <td className="p-2.5 text-right font-mono text-slate-700">800.000,00</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Impostos a Recolher</td>
                  <td className="p-2.5 text-right font-mono text-slate-700">184.000,00</td>
                </tr>
                <tr className="font-bold bg-slate-100 text-slate-900">
                  <td className="p-2.5">TOTAL CIRCULANTE</td>
                  <td className="p-2.5 text-right font-mono">5.928.000,00</td>
                </tr>
                <tr className="bg-blue-900 text-white font-bold uppercase text-[10px]">
                  <th className="p-2.5">PASSIVO NÃO CIRCULANTE</th>
                  <th className="p-2.5 text-right">R$</th>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Financiamentos de Longo Prazo (saldo remanescente SCR — dez/2025)</td>
                  <td className="p-2.5 text-right font-mono text-slate-700">2.385.983,00</td>
                </tr>
                <tr className="font-bold bg-slate-100 text-slate-900">
                  <td className="p-2.5">TOTAL NÃO CIRCULANTE</td>
                  <td className="p-2.5 text-right font-mono">2.385.983,00</td>
                </tr>
                <tr className="font-bold bg-slate-150">
                  <td className="p-2.5 text-slate-800">TOTAL PASSIVO</td>
                  <td className="p-2.5 text-right font-mono text-slate-800">8.313.983,00</td>
                </tr>
                <tr className="bg-blue-900 text-white font-bold uppercase text-[10px]">
                  <th className="p-2.5">PATRIMÔNIO LÍQUIDO</th>
                  <th className="p-2.5 text-right">R$</th>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Capital Social e Reservas Acumuladas</td>
                  <td className="p-2.5 text-right font-mono text-slate-700">17.249.421,91</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Resultado destinado a Investimentos em Terras Rurais (91,1%)</td>
                  <td className="p-2.5 text-right font-mono text-slate-700">2.807.293,49</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Resultado Retido (8,9%)</td>
                  <td className="p-2.5 text-right font-mono text-slate-700">274.258,09</td>
                </tr>
                <tr className="font-bold bg-slate-100 text-slate-900">
                  <td className="p-2.5">TOTAL PATRIMÔNIO LÍQUIDO</td>
                  <td className="p-2.5 text-right font-mono text-emerald-700">17.522.680,13</td>
                </tr>
                <tr className="font-bold bg-blue-100 text-blue-900 text-sm">
                  <td className="p-3">TOTAL PASSIVO + PATRIMÔNIO LÍQUIDO</td>
                  <td className="p-3 text-right font-mono font-extrabold">25.837.663,13</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex justify-between font-bold">
            <span>Documento Confidencial</span>
            <span>Página 5</span>
          </div>
        </div>

        {/* PAGE 6: INDICADORES */}
        <div className="print-page bg-white text-slate-900 shadow-2xl rounded-sm p-[20mm] w-[210mm] min-h-[297mm] flex flex-col justify-between relative select-text" id="p6">
          <div className="border-b-2 border-blue-900 pb-2 text-[9px] text-slate-600 font-bold uppercase flex justify-between">
            <span>J.S. TRANSPORTE E SERVIÇO LTDA | CNPJ 17.245.072/0001-00</span>
            <span>Indicadores de Desempenho</span>
          </div>

          <div className="my-auto space-y-4">
            <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wide border-b border-blue-900 pb-1">4. Indicadores Financeiros</h3>
            
            <table className="w-full text-left text-xs border border-slate-300">
              <thead>
                <tr className="bg-blue-900 text-white font-bold uppercase text-[10px]">
                  <th className="p-2.5">Indicador</th>
                  <th className="p-2.5 w-44">Valor</th>
                  <th className="p-2.5">Avaliação de Mercado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2.5 font-bold">Receita Bruta Anual</td>
                  <td className="p-2.5 font-mono">R$ 16.216.756</td>
                  <td className="p-2.5 text-emerald-600 font-bold">Operação de Grande Porte</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Resultado Líquido Anual</td>
                  <td className="p-2.5 font-mono">R$ 3.081.552</td>
                  <td className="p-2.5 text-emerald-600 font-bold">Margem de 19,00% — Boa</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Resultado Líquido Mensal</td>
                  <td className="p-2.5 font-mono">R$ 256.796</td>
                  <td className="p-2.5 text-emerald-600 font-bold">Fluxo Operacional Positivo</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Patrimônio Líquido</td>
                  <td className="p-2.5 font-mono">R$ 20.330.973</td>
                  <td className="p-2.5 text-emerald-600 font-bold">Empresa Sólida e Capitalizada</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Endividamento (Passivo/Ativo)</td>
                  <td className="p-2.5 font-mono">32,2%</td>
                  <td className="p-2.5 text-emerald-600 font-bold">Baixo — Padrão Setor: inferior a 60%</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">PL / Ativo Total</td>
                  <td className="p-2.5 font-mono">67,8%</td>
                  <td className="p-2.5 text-emerald-600 font-bold">Empresa Majoritariamente Própria</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Dívida Bruta (SCR dez/2025)</td>
                  <td className="p-2.5 font-mono">R$ 7.329.984</td>
                  <td className="p-2.5 text-emerald-600 font-bold">100% em Dia — Sem Inadimplência</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Serviço da Dívida Mensal</td>
                  <td className="p-2.5 font-mono">R$ 412.000</td>
                  <td className="p-2.5 text-rose-600 font-bold">Excede o lucro líquido/mês em 160%</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Dívida / EBITDA</td>
                  <td className="p-2.5 font-mono">2,1x</td>
                  <td className="p-2.5 text-emerald-600 font-bold">Adequado — Referência &lt; 3x</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Cobertura de Juros (EBIT/Juros)</td>
                  <td className="p-2.5 font-mono">7,5x</td>
                  <td className="p-2.5 text-emerald-600 font-bold">Confortável</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Contas a Receber</td>
                  <td className="p-2.5 font-mono">R$ 4.213.663</td>
                  <td className="p-2.5 text-amber-600 font-bold">67% em Dia / 33% em Atraso</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Imobilizado (Frota + Imóvel)</td>
                  <td className="p-2.5 font-mono">R$ 21.471.000</td>
                  <td className="p-2.5 text-emerald-600 font-bold">Ativo Tangível Lastreado</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex justify-between font-bold">
            <span>Documento Confidencial</span>
            <span>Página 6</span>
          </div>
        </div>

        {/* PAGE 7: RECEBÍVEIS */}
        <div className="print-page bg-white text-slate-900 shadow-2xl rounded-sm p-[20mm] w-[210mm] min-h-[297mm] flex flex-col justify-between relative select-text" id="p7">
          <div className="border-b-2 border-blue-900 pb-2 text-[9px] text-slate-600 font-bold uppercase flex justify-between">
            <span>J.S. TRANSPORTE E SERVIÇO LTDA | CNPJ 17.245.072/0001-00</span>
            <span>Carteira de Recebíveis</span>
          </div>

          <div className="my-auto space-y-4">
            <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wide border-b border-blue-900 pb-1">5. Carteira de Recebíveis — 31/12/2025</h3>
            <p className="text-[10px] text-slate-500 italic">Fonte: Relatório de Cobrança extraído do sistema da empresa. Clientes corporativos de grande porte.</p>

            <table className="w-full text-left text-xs border border-slate-300">
              <thead>
                <tr className="bg-blue-900 text-white font-bold uppercase text-[10px]">
                  <th className="p-2.5">Cliente</th>
                  <th className="p-2.5 text-right w-36">Valor (R$)</th>
                  <th className="p-2.5 text-center w-28">% Carteira</th>
                  <th className="p-2.5">Status Cobrança</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2.5 font-bold">Supergasbras Energia Ltda.</td>
                  <td className="p-2.5 text-right font-mono">2.972.133,24</td>
                  <td className="p-2.5 text-center font-mono">70,5%</td>
                  <td className="p-2.5 text-amber-600 font-bold">Em dia / Atraso</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Companhia Ultragaz S.A.</td>
                  <td className="p-2.5 text-right font-mono">1.043.818,28</td>
                  <td className="p-2.5 text-center font-mono">24,8%</td>
                  <td className="p-2.5 text-amber-600 font-bold">Em dia / Atraso</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Nacional Gás Butano Distribuidora</td>
                  <td className="p-2.5 text-right font-mono">149.132,94</td>
                  <td className="p-2.5 text-center font-mono">3,5%</td>
                  <td className="p-2.5 text-emerald-600 font-bold">Em dia</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Copa Energia Distribuidora de Gás</td>
                  <td className="p-2.5 text-right font-mono">43.478,67</td>
                  <td className="p-2.5 text-center font-mono">1,0%</td>
                  <td className="p-2.5 text-emerald-600 font-bold">Em dia</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Rublena Forte Requalificadora</td>
                  <td className="p-2.5 text-right font-mono">5.100,00</td>
                  <td className="p-2.5 text-center font-mono">0,1%</td>
                  <td className="p-2.5 text-emerald-600 font-bold">Em dia</td>
                </tr>
                <tr className="font-bold bg-slate-100 text-slate-950">
                  <td className="p-2.5">TOTAL</td>
                  <td className="p-2.5 text-right font-mono">4.213.663,13</td>
                  <td className="p-2.5 text-center font-mono">100,0%</td>
                  <td className="p-2.5 font-bold">-</td>
                </tr>
              </tbody>
            </table>

            <h4 className="text-xs font-bold text-slate-800 uppercase mt-4">Resumo da Carteira de Cobrança</h4>
            <table className="w-full text-left text-xs border border-slate-300">
              <thead>
                <tr className="bg-slate-100 font-bold">
                  <th className="p-2">Status da Carteira</th>
                  <th className="p-2 text-right w-44">R$</th>
                  <th className="p-2 text-center w-28">% Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2.5 pl-6">Em dia / Programados (vencimento futuro)</td>
                  <td className="p-2.5 text-right font-mono">2.821.984,10</td>
                  <td className="p-2.5 text-center font-mono font-bold text-emerald-600">66,97%</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Atrasados</td>
                  <td className="p-2.5 text-right font-mono text-rose-600 font-bold">1.391.679,03</td>
                  <td className="p-2.5 text-center font-mono font-bold text-rose-600">33,03%</td>
                </tr>
                <tr className="font-bold bg-slate-50">
                  <td className="p-2.5">TOTAL</td>
                  <td className="p-2.5 text-right font-mono">4.213.663,13</td>
                  <td className="p-2.5 text-center font-mono">100,00%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex justify-between font-bold">
            <span>Documento Confidencial</span>
            <span>Página 7</span>
          </div>
        </div>

        {/* PAGE 8: COMPOSIÇÃO DA DÍVIDA */}
        <div className="print-page bg-white text-slate-900 shadow-2xl rounded-sm p-[20mm] w-[210mm] min-h-[297mm] flex flex-col justify-between relative select-text" id="p8">
          <div className="border-b-2 border-blue-900 pb-2 text-[9px] text-slate-600 font-bold uppercase flex justify-between">
            <span>J.S. TRANSPORTE E SERVIÇO LTDA | CNPJ 17.245.072/0001-00</span>
            <span>Composição do Endividamento</span>
          </div>

          <div className="my-auto space-y-4">
            <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wide border-b border-blue-900 pb-1">6. Composição da Dívida — SCR Banco Central Dez/2025</h3>
            <p className="text-[10px] text-slate-500 italic">Fonte: Relatório de Empréstimos e Financiamentos — SCR — emitido pelo Banco Central do Brasil em 17/04/2026. Todas as obrigações estão classificadas como EM DIA.</p>

            <table className="w-full text-left text-xs border border-slate-300">
              <thead>
                <tr className="bg-blue-900 text-white font-bold uppercase text-[10px]">
                  <th className="p-2.5">Instituição Credora</th>
                  <th className="p-2.5">Modalidade do Crédito</th>
                  <th className="p-2.5 text-right w-44">Saldo Devedor (R$)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                <tr>
                  <td className="p-2.5 font-bold">Itaú Unibanco S.A.</td>
                  <td className="p-2.5">Financiamento + Capital de Giro</td>
                  <td className="p-2.5 text-right font-mono">3.344.412,98</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Banco Mercedes-Benz do Brasil</td>
                  <td className="p-2.5">Financiamento de Veículos</td>
                  <td className="p-2.5 text-right font-mono">2.328.796,50</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Banco Rodobens S.A.</td>
                  <td className="p-2.5">Financiamento de Veículos</td>
                  <td className="p-2.5 text-right font-mono">667.239,09</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Banco J. Safra S.A.</td>
                  <td className="p-2.5">Financiamento de Veículos</td>
                  <td className="p-2.5 text-right font-mono">209.607,24</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Banco Bradesco S.A.</td>
                  <td className="p-2.5">Cartão Corporativo / Conta Garantida</td>
                  <td className="p-2.5 text-right font-mono">33.529,22</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Itaú Unibanco Holding S.A.</td>
                  <td className="p-2.5">Financiamento de Veículos</td>
                  <td className="p-2.5 text-right font-mono">746.398,48</td>
                </tr>
                <tr className="font-bold bg-blue-50 text-blue-950">
                  <td className="p-2.5">TOTAL — SALDO SCR DEZ/2025</td>
                  <td className="p-2.5 text-center text-emerald-700 uppercase tracking-widest text-[9px]">100% em dia</td>
                  <td className="p-2.5 text-right font-mono font-extrabold text-blue-900">7.329.983,51</td>
                </tr>
              </tbody>
            </table>

            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200 mt-2">
              <strong>Evolução do Endividamento Total (SCR 2025):</strong> Jan R$ 8,50M &rarr; Jun R$ 6,74M &rarr; Dez R$ 7,33M. <br />
              Houve uma redução líquida no exercício de R$ 1,17M, reflexo direto de amortizações regulares e liquidação de contratos de leasing de frota pesada.
            </p>
          </div>

          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex justify-between font-bold">
            <span>Documento Confidencial</span>
            <span>Página 8</span>
          </div>
        </div>

        {/* PAGE 9: IMOBILIZADO */}
        <div className="print-page bg-white text-slate-900 shadow-2xl rounded-sm p-[20mm] w-[210mm] min-h-[297mm] flex flex-col justify-between relative select-text" id="p9">
          <div className="border-b-2 border-blue-900 pb-2 text-[9px] text-slate-600 font-bold uppercase flex justify-between">
            <span>J.S. TRANSPORTE E SERVIÇO LTDA | CNPJ 17.245.072/0001-00</span>
            <span>Ativo Imobilizado</span>
          </div>

          <div className="my-auto space-y-4">
            <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wide border-b border-blue-900 pb-1">7. Ativo Imobilizado — Frota de Veículos</h3>
            <p className="text-[10px] text-slate-500 italic">Avaliação com base na Tabela FIPE de dezembro de 2025. Carretas avaliadas por faixas de ano conforme laudo interno do mercado de pesados.</p>

            <table className="w-full text-left text-xs border border-slate-300">
              <thead>
                <tr className="bg-blue-900 text-white font-bold uppercase text-[10px]">
                  <th className="p-2">Grupo de Frota</th>
                  <th className="p-2 text-center w-20">Qtde.</th>
                  <th className="p-2 text-right w-32">Valor Médio (R$)</th>
                  <th className="p-2 text-right w-36">Subtotal (R$)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2 font-bold">Cavalos-Mecânicos Viagem (MB 2536/2544/2548)</td>
                  <td className="p-2 text-center font-mono">18</td>
                  <td className="p-2 text-right font-mono">538.778</td>
                  <td className="p-2 text-right font-mono font-bold">9.698.000,00</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">Caminhões (MB 3030/3033 e Atego 3033)</td>
                  <td className="p-2 text-center font-mono">8</td>
                  <td className="p-2 text-right font-mono">561.250</td>
                  <td className="p-2 text-right font-mono font-bold">4.490.000,00</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">Semirreboques / Carretas (marcas diversas)</td>
                  <td className="p-2 text-center font-mono">38</td>
                  <td className="p-2 text-right font-mono">123.158</td>
                  <td className="p-2 text-right font-mono font-bold">4.680.000,00</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">Cavalos-Mecânicos de Manobra (MB 1935 / VW)</td>
                  <td className="p-2 text-center font-mono">5</td>
                  <td className="p-2 text-right font-mono">76.000</td>
                  <td className="p-2 text-right font-mono font-bold">380.000,00</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">Veículos de Apoio (Ford, Fiat, Renault, Honda)</td>
                  <td className="p-2 text-center font-mono">7</td>
                  <td className="p-2 text-right font-mono">103.286</td>
                  <td className="p-2 text-right font-mono font-bold">723.000,00</td>
                </tr>
                <tr className="font-bold bg-slate-100 text-slate-900">
                  <td className="p-2">TOTAL DA FROTA</td>
                  <td className="p-2 text-center font-mono">76</td>
                  <td className="p-2 text-right font-mono">-</td>
                  <td className="p-2 text-right font-mono text-blue-900">19.971.000,00</td>
                </tr>
              </tbody>
            </table>

            <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wide border-b border-blue-900 pb-1 mt-6">8. Ativo Imobilizado — Imóveis</h3>
            <table className="w-full text-left text-xs border border-slate-300">
              <thead>
                <tr className="bg-blue-900 text-white font-bold uppercase text-[10px]">
                  <th className="p-2">Matrícula</th>
                  <th className="p-2">Descrição e Localização</th>
                  <th className="p-2 text-center w-24">Área</th>
                  <th className="p-2 text-right w-36">Valor Avaliado (R$)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2 font-mono font-bold">52.277</td>
                  <td className="p-2">Lote 17 — Quadra 05 — Rua 57 Projetada — Parque Campos Elíseos</td>
                  <td className="p-2 text-center">600 m²</td>
                  <td className="p-2 text-right font-mono">500.000,00</td>
                </tr>
                <tr>
                  <td className="p-2 font-mono font-bold">52.278</td>
                  <td className="p-2">Lote 18 — Quadra 05 — Rua 57 Projetada — Parque Campos Elíseos</td>
                  <td className="p-2 text-center">600 m²</td>
                  <td className="p-2 text-right font-mono">500.000,00</td>
                </tr>
                <tr>
                  <td className="p-2 font-mono font-bold">11.394</td>
                  <td className="p-2">Lote 16 — Quadra 05 — Rua 57 Projetada e Alameda dos Cajueiros</td>
                  <td className="p-2 text-center">840 m²</td>
                  <td className="p-2 text-right font-mono">500.000,00</td>
                </tr>
                <tr className="font-bold bg-slate-100 text-slate-900">
                  <td className="p-2" colSpan={2}>TOTAL (Garagem/Pátio Operacional Próprio — Duque de Caxias/RJ)</td>
                  <td className="p-2 text-center font-bold">2.040 m²</td>
                  <td className="p-2 text-right font-mono text-blue-900">1.500.000,00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex justify-between font-bold">
            <span>Documento Confidencial</span>
            <span>Página 9</span>
          </div>
        </div>

        {/* PAGE 10: NOTAS EXPLICATIVAS */}
        <div className="print-page bg-white text-slate-900 shadow-2xl rounded-sm p-[20mm] w-[210mm] min-h-[297mm] flex flex-col justify-between relative select-text" id="p10">
          <div className="border-b-2 border-blue-900 pb-2 text-[9px] text-slate-600 font-bold uppercase flex justify-between">
            <span>J.S. TRANSPORTE E SERVIÇO LTDA | CNPJ 17.245.072/0001-00</span>
            <span>Notas Explicativas</span>
          </div>

          <div className="my-auto space-y-4">
            <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wide border-b border-blue-900 pb-1">9. Notas Explicativas e Critérios de Avaliação</h3>
            
            <div className="space-y-3 text-xs leading-relaxed text-justify text-slate-700">
              <p>
                <strong>9.1 Receita:</strong> O faturamento de R$ 16.216.756,35 é suportado pelo Relatório de Faturamento emitido pelo contador Fernando de Medeiros Ewald (CRC RJ120853/O-0), assinado digitalmente. A receita divide-se em saídas de frete (R$ 13.896.133,99) e serviços técnicos operacionais (R$ 1.320.622,36). O custo de combustível representa 42,55% da receita (R$ 6.900.229,83), refletindo a operação de frota pesada em rotas interestaduais com alto consumo. A manutenção média de R$ 210.000/mês (R$ 2.520.000/ano) abrange revisões de 76 veículos.
              </p>
              <p>
                <strong>9.2 Imobilizado — Frota:</strong> Os veículos foram avaliados com base na Tabela FIPE de dezembro de 2025. Cavalos-mecânicos e caminhões Mercedes-Benz foram avaliados por modelo e ano conforme referências FIPE consultadas (Actros 2548: R$ 523k a R$ 863k; Atego 3033: R$ 580k a R$ 602k). Carretas foram avaliadas por faixas de ano definidas pelo proprietário com respaldo de mercado.
              </p>
              <p>
                <strong>9.3 Imobilizado — Imóveis:</strong> Os três lotes (matrículas 52.277, 52.278 e 11.394) foram adquiridos em dezembro de 2025 pelo valor total de escritura de R$ 460.000,00. A avaliação de mercado de R$ 1.500.000,00 reflete o valor atual do conjunto como pátio operacional urbanizado e fechado com área total de 2.040m² em Duque de Caxias/RJ.
              </p>
              <p>
                <strong>9.4 Endividamento:</strong> O saldo devedor total de R$ 7.329.983,51 (SCR dez/2025) é composto exclusivamente por financiamentos de frota e linhas de capital de giro, todos classificados como EM DIA pelo Banco Central do Brasil. Nenhuma operação vencida foi identificada no período pesquisado. O serviço mensal da dívida (amortização + juros) é de R$ 412.000,00, representando 160,6% do serviço em relação ao lucro mensal, com índice de cobertura de 0,62x.
              </p>
              <p>
                <strong>9.5 Contas a Receber:</strong> A carteira de R$ 4.213.663,13 é formada por créditos contra empresas de grande porte do setor energético nacional (Ultragaz, Supergasbras, Nacional Gás, Copa Energia), com risco de crédito muito baixo. Dos valores em aberto, 67% estão dentro do prazo ou programados, e 33% classificados como atrasados, em processo normal de cobrança.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex justify-between font-bold">
            <span>Documento Confidencial</span>
            <span>Página 10</span>
          </div>
        </div>

        {/* PAGE 11: DECLARAÇÃO */}
        <div className="print-page bg-white text-slate-900 shadow-2xl rounded-sm p-[20mm] w-[210mm] min-h-[297mm] flex flex-col justify-between relative select-text" id="p11">
          <div className="border-b-2 border-blue-900 pb-2 text-[9px] text-slate-600 font-bold uppercase flex justify-between">
            <span>J.S. TRANSPORTE E SERVIÇO LTDA | CNPJ 17.245.072/0001-00</span>
            <span>Declaração de Veracidade</span>
          </div>

          <div className="my-auto space-y-6">
            <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wide border-b border-blue-900 pb-1">10. Declaração de Veracidade</h3>
            
            <p className="text-xs text-slate-700 leading-relaxed text-justify">
              Eu, <strong>LEANDRO LIMA MOTA</strong>, brasileiro, casado, advogado inscrito na OAB/RJ sob o nº 259.182, sócio-administrador da J.S. TRANSPORTE E SERVIÇO LTDA, inscrita no CNPJ/MF sob o nº 17.245.072/0001-00, com sede na Estrada Tiradentes, Lote 16, 17 e 18, Campos Elíseos, Duque de Caxias/RJ, DECLARO, sob as penas da lei, que:
            </p>

            <ul className="text-xs text-slate-700 space-y-3 pl-4 list-decimal">
              <li>As informações contidas neste dossiê financeiro são verídicas, completas e fidedignas;</li>
              <li>O faturamento declarado é suportado por Relatório de Faturamento assinado por contador regularmente inscrito no CRC/RJ;</li>
              <li>Os valores de imobilizado refletem avaliações de mercado baseadas na Tabela FIPE;</li>
              <li>Os imóveis informados são de propriedade da empresa, conforme Registros Gerais de Imóveis anexos;</li>
              <li>Não existem passivos ocultos, contingências relevantes não declaradas ou ônus sobre os ativos que não estejam aqui discriminados.</li>
            </ul>

            <div className="pt-8 text-center space-y-8">
              <p className="text-xs text-slate-600">Duque de Caxias/RJ, Abril de 2026</p>
              
              <div className="max-w-xs mx-auto border-t border-slate-400 pt-2 text-xs">
                <p className="font-bold text-blue-900 uppercase">LEANDRO LIMA MOTA</p>
                <p className="text-[10px] text-slate-500 font-bold">Sócio-Administrador — J.S. Transporte e Serviço Ltda.</p>
                <p className="text-[10px] text-slate-500 font-mono">CNPJ: 17.245.072/0001-00 | OAB/RJ 259.182</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex justify-between font-bold">
            <span>Documento Confidencial</span>
            <span>Página 11</span>
          </div>
        </div>

        {/* PAGE 12: ANEXOS & SIGNATURES */}
        <div className="print-page bg-white text-slate-900 shadow-2xl rounded-sm p-[20mm] w-[210mm] min-h-[297mm] flex flex-col justify-between relative select-text" id="p12">
          <div className="border-b-2 border-blue-900 pb-2 text-[9px] text-slate-600 font-bold uppercase flex justify-between">
            <span>J.S. TRANSPORTE E SERVIÇO LTDA | CNPJ 17.245.072/0001-00</span>
            <span>Documentos Anexos</span>
          </div>

          <div className="my-auto space-y-4">
            <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wide border-b border-blue-900 pb-1">Anexos e Assinaturas Digitais</h3>

            <div className="border border-slate-200 rounded overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 font-bold text-slate-700">
                    <th className="p-2.5 w-16 text-center">Ref</th>
                    <th className="p-2.5">Documentos Anexos ao Dossiê</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2.5 text-center font-bold font-mono text-slate-500">01</td>
                    <td className="p-2.5 text-slate-800">Relatório de Faturamento — J.S. Transporte e Serviço Ltda. — Jan a Dez/2025 (assinado pelo CRC RJ120853/O-0)</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-2.5 text-center font-bold font-mono text-slate-500">02</td>
                    <td className="p-2.5 text-slate-800">Relatório SCR — Banco Central do Brasil — Jan a Dez/2025 (emitido em 17/04/2026)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-center font-bold font-mono text-slate-500">03</td>
                    <td className="p-2.5 text-slate-800">Relatório de Cobrança — Contas a Receber em 31/12/2025 (sistema operacional)</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-2.5 text-center font-bold font-mono text-slate-500">04</td>
                    <td className="p-2.5 text-slate-800">Relação de Frota 2025 — 76 veículos com placa, RENAVAM, marca e ano</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-center font-bold font-mono text-slate-500">05</td>
                    <td className="p-2.5 text-slate-800">RGI — Matrícula 52.277 — 1º Ofício de Registro de Imóveis de Duque de Caxias — 10/02/2026</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-2.5 text-center font-bold font-mono text-slate-500">06</td>
                    <td className="p-2.5 text-slate-800">RGI — Matrícula 52.278 — 1º Ofício de Registro de Imóveis de Duque de Caxias — 10/02/2026</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-center font-bold font-mono text-slate-500">07</td>
                    <td className="p-2.5 text-slate-800">RGI — Matrícula 11.394 — 1º Ofício de Registro de Imóveis de Duque de Caxias — 10/02/2026</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-2.5 text-center font-bold font-mono text-slate-500">08</td>
                    <td className="p-2.5 text-slate-800">Notas Fiscais de Entrada — 997 NF-es — Mar a Jun/2025 e Out a Dez/2025</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Simulated Digital Signatures matching Page 12 screenshot */}
            <div className="pt-8 grid grid-cols-2 gap-4">
              <div className="p-4 border border-dashed border-slate-300 rounded bg-slate-50/50 flex flex-col justify-between h-28">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Signatário 1</span>
                <div>
                  <p className="text-[10px] font-bold text-slate-800 font-mono">J S TRANSPORTE E SERVICO LTDA:17245072000100</p>
                  <p className="text-[9px] text-slate-500 font-mono mt-1">Assinado de forma digital por J S TRANSPORTE E SERVICO LTDA. Dados: 2026.04.17 13:06:12 -03'00'</p>
                </div>
              </div>

              <div className="p-4 border border-dashed border-slate-300 rounded bg-slate-50/50 flex flex-col justify-between h-28">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Signatário 2</span>
                <div>
                  <p className="text-[10px] font-bold text-slate-800 font-mono">LEANDRO LIMA MOTA:13042878740</p>
                  <p className="text-[9px] text-slate-500 font-mono mt-1">Assinado de forma digital por LEANDRO LIMA MOTA. Dados: 2026.04.17 13:06:27 -03'00'</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex justify-between font-bold">
            <span>Documento Confidencial</span>
            <span>Página 12</span>
          </div>
        </div>

        {/* PAGE 13: DOSSIER PROJEÇÕES (Added integrated screen) */}
        <div className="print-page bg-white text-slate-900 shadow-2xl rounded-sm p-[20mm] w-[210mm] min-h-[297mm] flex flex-col justify-between relative select-text" id="p13">
          <div className="border-b-2 border-blue-900 pb-2 text-[9px] text-slate-600 font-bold uppercase flex justify-between">
            <span>J.S. TRANSPORTE E SERVIÇO LTDA | CNPJ 17.245.072/0001-00</span>
            <span>Projeções Integradas</span>
          </div>

          <div className="my-auto space-y-4">
            <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wide border-b border-blue-900 pb-1">11. Projeções e Quadro Comparativo de Publicações do Setor</h3>
            <p className="text-xs text-slate-700 leading-relaxed text-justify">
              O estudo comparativo abaixo integra as metas internas da empresa com dados oficiais de publicações e benchmarking setoriais do transporte nacional de cargas líquidas e produtos inflamáveis.
            </p>

            <table className="w-full text-left text-[11px] border border-slate-300">
              <thead>
                <tr className="bg-blue-900 text-white font-bold uppercase">
                  <th className="p-2">Indicador Setorial</th>
                  <th className="p-2 text-right">J.S. (Real)</th>
                  <th className="p-2 text-right">J.S. (Proj.)</th>
                  <th className="p-2 text-right">Média Setor</th>
                  <th className="p-2">Publicação / Fonte</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                <tr>
                  <td className="p-2 font-bold">Crescimento Anual da Receita</td>
                  <td className="p-2 text-right font-mono">+9,2%</td>
                  <td className="p-2 text-right font-mono text-blue-900 font-bold">+12,5%</td>
                  <td className="p-2 text-right font-mono text-emerald-700">+4,2%</td>
                  <td className="p-2 text-slate-500 italic">CNT - Anuário 2025</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">Margem EBITDA</td>
                  <td className="p-2 text-right font-mono">22,0%</td>
                  <td className="p-2 text-right font-mono text-blue-900 font-bold">23,5%</td>
                  <td className="p-2 text-right font-mono text-emerald-700">22,5%</td>
                  <td className="p-2 text-slate-500 italic">Fundação Dom Cabral</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">Custo de Diesel / Receita</td>
                  <td className="p-2 text-right font-mono">42,55%</td>
                  <td className="p-2 text-right font-mono text-blue-900 font-bold">40,00%</td>
                  <td className="p-2 text-right font-mono text-emerald-700">35,00%</td>
                  <td className="p-2 text-slate-500 italic">Anuário ANTT 2025</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">Alavancagem (Dívida/EBITDA)</td>
                  <td className="p-2 text-right font-mono">2,10x</td>
                  <td className="p-2 text-right font-mono text-blue-900 font-bold">1,75x</td>
                  <td className="p-2 text-right font-mono text-emerald-700">1,80x</td>
                  <td className="p-2 text-slate-500 italic">B3 Logística</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">Prazo de Cobrança (DSO)</td>
                  <td className="p-2 text-right font-mono">93 dias</td>
                  <td className="p-2 text-right font-mono text-blue-900 font-bold">75 dias</td>
                  <td className="p-2 text-right font-mono text-emerald-700">45 dias</td>
                  <td className="p-2 text-slate-500 italic">Setor Supply Energy</td>
                </tr>
              </tbody>
            </table>

            <p className="text-xs text-slate-700 leading-relaxed text-justify bg-slate-50 p-3 rounded border border-slate-200 mt-2">
              <strong>Diagnóstico Estratégico:</strong> A J.S. Transporte e Serviço Ltda. apresenta uma capacidade invejável de crescimento e captação de clientes, contudo ela financia o prazo elastecido de suas contratantes multinacionais utilizando capital de giro de curtíssimo prazo de bancos. Reduzir o DSO para a média do setor trará liquidez imediata de mais de R$ 1,2 milhão ao caixa operacional sem necessidade de contrair novas linhas SCR.
            </p>
          </div>

          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex justify-between font-bold">
            <span>Documento Confidencial</span>
            <span>Página 13</span>
          </div>
        </div>

        {/* PAGE 14: DOSSIER AUDITORIA (Added integrated screen) */}
        <div className="print-page bg-white text-slate-900 shadow-2xl rounded-sm p-[20mm] w-[210mm] min-h-[297mm] flex flex-col justify-between relative select-text" id="p14">
          <div className="border-b-2 border-blue-900 pb-2 text-[9px] text-slate-600 font-bold uppercase flex justify-between">
            <span>J.S. TRANSPORTE E SERVIÇO LTDA | CNPJ 17.245.072/0001-00</span>
            <span>Auditoria & Recomendações</span>
          </div>

          <div className="my-auto space-y-4">
            <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wide border-b border-blue-900 pb-1">12. Auditoria de Pontos Críticos e Plano de Ação CFO</h3>
            
            <div className="space-y-4 text-xs">
              <div className="p-3 border border-red-200 bg-red-50/50 rounded">
                <p className="font-bold text-red-900 uppercase tracking-wider mb-1">Risco Crítico 01: Serviço da Dívida e Fluxo de Caixa Mensal</p>
                <p className="text-slate-700 text-justify">
                  O serviço mensal da dívida (amortizações de R$ 412.000) excede em 160% o resultado líquido do negócio. 
                  <em> Ação recomendada:</em> Alongamento de dívida no Itaú Unibanco de 12 para 60 meses utilizando como colateral as matrículas limpas do pátio operacional avaliado em R$ 1.5M, derrubando o pagamento mensal para R$ 150k.
                </p>
              </div>

              <div className="p-3 border border-red-200 bg-red-50/50 rounded">
                <p className="font-bold text-red-900 uppercase tracking-wider mb-1">Risco Crítico 02: Concentração de Recebíveis Atrasados (DSO)</p>
                <p className="text-slate-700 text-justify">
                  33,03% da carteira de faturamento (R$ 1.391.679) está em atraso com prazo de liquidação médio de 93 dias.
                  <em> Ação recomendada:</em> Habilitar operação de risco sacado / antecipação no portal de fornecedores da Supergasbras e Ultragaz. Como as devedoras são multinacionais de primeiríssima linha, a taxa aplicada será reduzida (&lt;1.0% a.m.), resgatando mais de R$ 1.3M de caixa retido imediatamente.
                </p>
              </div>

              <div className="p-3 border border-amber-200 bg-amber-50/50 rounded">
                <p className="font-bold text-amber-900 uppercase tracking-wider mb-1">Risco Moderado 03: Desgaste de Frota e Custos de Diesel</p>
                <p className="text-slate-700 text-justify">
                  Diesel e manutenção preventiva de peças somam 58,09% da receita total devido à depreciação da frota de carretas.
                  <em> Ação recomendada:</em> Desmobilizar e vender os 5 cavalos de manobra obsoletos para gerar caixa corrente. Adotar telemetria avançada de combustível e aderir a contratos de leasing para reposição de pneus em larga escala.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex justify-between font-bold">
            <span>Documento Confidencial</span>
            <span>Página 14</span>
          </div>
        </div>

      </div>

      {/* FULLY FUNCTIONAL OFFLINE PRINT VIEW (Only rendered when print layout is activated in browser) */}
      <div className="print-only hidden select-text">
        {/* Page 1 */}
        <div className="print-page-print">
          <div className="border-b-2 border-blue-900 pb-2 text-[9px] text-slate-600 font-sans font-bold uppercase tracking-wider flex justify-between items-center mb-8">
            <span>J.S. TRANSPORTE E SERVIÇO LTDA | CNPJ 17.245.072/0001-00</span>
            <span>Demonstrações Financeiras 2025</span>
          </div>
          <div className="text-center my-32 space-y-8">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em]">Documento Confidencial</span>
            <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight uppercase">Dossiê Financeiro</h1>
            <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-wide">J.S. Transporte e Serviço Ltda</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Estrada Tiradentes, Lote 16/17/18 — Campos Elíseos — Duque de Caxias/RJ — CEP 25267-310 <br />
              CNPJ: 17.245.072/0001-00 | Inscrição Estadual: 79.823.058
            </p>
          </div>
          <div className="border border-slate-300 rounded overflow-hidden mb-32">
            <table className="w-full text-left text-xs">
              <tbody className="divide-y divide-slate-200">
                <tr className="bg-slate-50">
                  <td className="p-3 font-bold text-slate-700 w-1/3 border-r border-slate-200">Exercício de Referência</td>
                  <td className="p-3 text-slate-800 font-medium">01 de janeiro de 2025 a 31 de dezembro de 2025</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-700 border-r border-slate-200">Data-Base do Balanço</td>
                  <td className="p-3 text-slate-800 font-medium">31 de dezembro de 2025</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="p-3 font-bold text-slate-700 border-r border-slate-200">Finalidade do Documento</td>
                  <td className="p-3 text-slate-800 font-medium font-bold">Apresentação de capacidade econômico-financeira — Banco Itaú S.A.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-700 border-r border-slate-200">Ramo de Atividade</td>
                  <td className="p-3 text-slate-800 font-medium">Transporte Rodoviário de Produtos Perigosos (GLP) — CNAE 4930-2/02</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="p-3 font-bold text-slate-700 border-r border-slate-200">Clientes Principais</td>
                  <td className="p-3 text-slate-800 font-medium leading-relaxed">Companhia Ultragaz S.A. | Supergasbras Energia Ltda. | Nacional Gás | Copa Energia</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex justify-between items-center font-bold mt-auto">
            <span>ABRIL DE 2026</span>
            <span>Página 1</span>
          </div>
        </div>

        {/* Page 2 */}
        <div className="print-page-print" style={{ pageBreakBefore: 'always' }}>
          <div className="border-b-2 border-blue-900 pb-2 text-[9px] text-slate-600 font-bold uppercase flex justify-between mb-8">
            <span>J.S. TRANSPORTE E SERVIÇO LTDA | CNPJ 17.245.072/0001-00</span>
            <span>Perfil Corporativo</span>
          </div>
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wide border-b border-blue-900 pb-1">1. Perfil da Empresa</h3>
            <p className="text-xs text-slate-700 leading-relaxed text-justify">
              A J.S. Transporte e Serviço Ltda. é uma empresa de transporte rodoviário especializada no manuseio e distribuição de GLP (Gás Liquefeito de Petróleo), com sede em Duque de Caxias/RJ e operações em múltiplos estados brasileiros. Fundada há mais de uma década, a empresa consolidou parcerias estratégicas com os maiores distribuidores de gás do país, operando frota própria de alta capacidade com tecnologia e segurança.
            </p>
            <div className="border border-slate-300 rounded overflow-hidden">
              <table className="w-full text-left text-xs">
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-slate-50">
                    <td className="p-3 font-bold text-slate-700 w-1/3 border-r border-slate-200">Sócios / Administração</td>
                    <td className="p-3 text-slate-800 font-medium">Leandro Lima Mota (OAB/RJ 259.182) — Sócio Administrador</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700 border-r border-slate-200">Faturamento Anual 2025</td>
                    <td className="p-3 text-slate-800 font-bold font-mono text-emerald-700">R$ 16.216.756,35</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-3 font-bold text-slate-700 border-r border-slate-200">Frota Própria</td>
                    <td className="p-3 text-slate-800 font-medium">76 veículos: 18 cavalos-mecânicos, 8 caminhões, 38 carretas, 5 cavalos manobra, 7 veículos de apoio</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700 border-r border-slate-200">Patrimônio Líquido</td>
                    <td className="p-3 text-slate-800 font-bold font-mono">R$ 17.523.680,00</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-3 font-bold text-slate-700 border-r border-slate-200">Imóvel Próprio</td>
                    <td className="p-3 text-slate-800 font-medium leading-relaxed">Garagem/pátio operacional — 2.040m² — Parque Campos Elíseos, Duque de Caxias/RJ (3 matrículas: 52.277 | 52.278 | 11.394 — avaliação R$ 1.500.000)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700 border-r border-slate-200">Regularidade Fiscal</td>
                    <td className="p-3 text-slate-800 font-medium text-emerald-600 font-bold">Sem dívidas vencidas no SCR — todas as obrigações financeiras em dia (Banco Central do Brasil — Dez/2025)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex justify-between font-bold mt-auto">
            <span>Documento Confidencial</span>
            <span>Página 2</span>
          </div>
        </div>

        {/* Page 3 */}
        <div className="print-page-print" style={{ pageBreakBefore: 'always' }}>
          <div className="border-b-2 border-blue-900 pb-2 text-[9px] text-slate-600 font-bold uppercase flex justify-between mb-8">
            <span>J.S. TRANSPORTE E SERVIÇO LTDA | CNPJ 17.245.072/0001-00</span>
            <span>Demonstração do Resultado</span>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wide border-b border-blue-900 pb-1">2. Demonstração do Resultado do Exercício — DRE 2025</h3>
            <table className="w-full text-left text-xs border border-slate-300">
              <thead>
                <tr className="bg-blue-900 text-white font-bold uppercase text-[10px]">
                  <th className="p-2.5">Descrição</th>
                  <th className="p-2.5 text-center w-24">% Receita</th>
                  <th className="p-2.5 text-right w-36">R$ (Anual)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="font-bold bg-slate-100">
                  <td className="p-2.5 text-blue-900">RECEITA BRUTA</td>
                  <td className="p-2.5 text-center font-mono">100,00%</td>
                  <td className="p-2.5 text-right font-mono">16.216.756,35</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Combustível</td>
                  <td className="p-2.5 text-center font-mono">42,55%</td>
                  <td className="p-2.5 text-right font-mono">6.900.229,83</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Manutenção de Frota</td>
                  <td className="p-2.5 text-center font-mono">15,54%</td>
                  <td className="p-2.5 text-right font-mono">2.520.000,00</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Pedágios</td>
                  <td className="p-2.5 text-center font-mono">0,48%</td>
                  <td className="p-2.5 text-right font-mono">77.840,43</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Pneus</td>
                  <td className="p-2.5 text-center font-mono">1,37%</td>
                  <td className="p-2.5 text-right font-mono">222.169,56</td>
                </tr>
                <tr className="font-bold bg-slate-50">
                  <td className="p-2.5 text-slate-700">Subtotal Custos Operacionais</td>
                  <td className="p-2.5 text-center font-mono">-</td>
                  <td className="p-2.5 text-right font-mono">9.720.239,82 (59,94%)</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Impostos e Tributos</td>
                  <td className="p-2.5 text-center font-mono">11,35%</td>
                  <td className="p-2.5 text-right font-mono">1.840.602,33</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Despesas Administrativas</td>
                  <td className="p-2.5 text-center font-mono">7,18%</td>
                  <td className="p-2.5 text-right font-mono">1.164.363,31</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Despesas Financeiras (Juros)</td>
                  <td className="p-2.5 text-center font-mono">2,53%</td>
                  <td className="p-2.5 text-right font-mono">410.000,00</td>
                </tr>
                <tr className="font-bold bg-slate-50">
                  <td className="p-2.5 text-slate-700">Subtotal Despesas</td>
                  <td className="p-2.5 text-center font-mono">-</td>
                  <td className="p-2.5 text-right font-mono">3.414.964,95 (21,06%)</td>
                </tr>
                <tr className="font-bold bg-emerald-50 text-emerald-900 text-sm">
                  <td className="p-3">RESULTADO LÍQUIDO DO EXERCÍCIO</td>
                  <td className="p-3 text-center font-mono">19,00%</td>
                  <td className="p-3 text-right font-mono font-extrabold">3.081.551,58</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex justify-between font-bold mt-auto">
            <span>Documento Confidencial</span>
            <span>Página 3</span>
          </div>
        </div>

        {/* Page 4 */}
        <div className="print-page-print" style={{ pageBreakBefore: 'always' }}>
          <div className="border-b-2 border-blue-900 pb-2 text-[9px] text-slate-600 font-bold uppercase flex justify-between mb-8">
            <span>J.S. TRANSPORTE E SERVIÇO LTDA | CNPJ 17.245.072/0001-00</span>
            <span>Balanço Patrimonial - Ativo</span>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wide border-b border-blue-900 pb-1">3. Balanço Patrimonial — Ativo</h3>
            <table className="w-full text-left text-xs border border-slate-300">
              <thead>
                <tr className="bg-blue-900 text-white font-bold uppercase text-[10px]">
                  <th className="p-2.5">ATIVO CIRCULANTE</th>
                  <th className="p-2.5 text-right w-44">R$</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2.5 pl-6">Caixa e Equivalentes de Caixa</td>
                  <td className="p-2.5 text-right font-mono">3.000,00</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Contas a Receber (clientes)</td>
                  <td className="p-2.5 text-right font-mono">4.213.663,13</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Estoques (diesel, pneus e peças)</td>
                  <td className="p-2.5 text-right font-mono">150.000,00</td>
                </tr>
                <tr className="font-bold bg-slate-100">
                  <td className="p-2.5">TOTAL CIRCULANTE</td>
                  <td className="p-2.5 text-right font-mono">4.366.663,13</td>
                </tr>
                <tr className="bg-blue-900 text-white font-bold uppercase text-[10px]">
                  <th className="p-2.5">ATIVO NÃO CIRCULANTE — IMOBILIZADO</th>
                  <th className="p-2.5 text-right">R$ (FIPE)</th>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Cavalos-Mecânicos Viagem — 18 unidades MB (2019 a 2025)</td>
                  <td className="p-2.5 text-right font-mono">9.698.000,00</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Caminhões de Entrega — 8 unidades MB/Atego (2020 a 2025)</td>
                  <td className="p-2.5 text-right font-mono">4.490.000,00</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Semirreboques / Carretas — 38 unidades</td>
                  <td className="p-2.5 text-right font-mono">4.680.000,00</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Cavalos-Mecânicos de Manobra — 5 unidades</td>
                  <td className="p-2.5 text-right font-mono">380.000,00</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Veículos de Apoio — 7 unidades</td>
                  <td className="p-2.5 text-right font-mono">723.000,00</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Imóveis — Garagem/Pátio (Matrículas 52.277 | 52.278 | 11.394)</td>
                  <td className="p-2.5 text-right font-mono">1.500.000,00</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Investimentos em Terras Rurais</td>
                  <td className="p-2.5 text-right font-mono">2.807.293,49</td>
                </tr>
                <tr className="font-bold bg-slate-100">
                  <td className="p-2.5">TOTAL NÃO CIRCULANTE</td>
                  <td className="p-2.5 text-right font-mono">24.278.293,49</td>
                </tr>
                <tr className="font-bold bg-blue-100 text-blue-900 text-sm">
                  <td className="p-3">TOTAL ATIVO</td>
                  <td className="p-3 text-right font-mono font-extrabold">28.644.956,49</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex justify-between font-bold mt-auto">
            <span>Documento Confidencial</span>
            <span>Página 4</span>
          </div>
        </div>

        {/* Page 5 */}
        <div className="print-page-print" style={{ pageBreakBefore: 'always' }}>
          <div className="border-b-2 border-blue-900 pb-2 text-[9px] text-slate-600 font-bold uppercase flex justify-between mb-8">
            <span>J.S. TRANSPORTE E SERVIÇO LTDA | CNPJ 17.245.072/0001-00</span>
            <span>Balanço Patrimonial - Passivo & PL</span>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wide border-b border-blue-900 pb-1">3.2 Balanço Patrimonial — Passivo e PL</h3>
            <table className="w-full text-left text-xs border border-slate-300">
              <thead>
                <tr className="bg-blue-900 text-white font-bold uppercase text-[10px]">
                  <th className="p-2.5">PASSIVO CIRCULANTE</th>
                  <th className="p-2.5 text-right w-44">R$</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2.5 pl-6">Financiamentos de Curto Prazo (12 meses)</td>
                  <td className="p-2.5 text-right font-mono">4.944.000,00</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Fornecedores e Contas a Pagar</td>
                  <td className="p-2.5 text-right font-mono">800.000,00</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Impostos a Recolher</td>
                  <td className="p-2.5 text-right font-mono">184.000,00</td>
                </tr>
                <tr className="font-bold bg-slate-100">
                  <td className="p-2.5">TOTAL CIRCULANTE</td>
                  <td className="p-2.5 text-right font-mono">5.928.000,00</td>
                </tr>
                <tr className="bg-blue-900 text-white font-bold uppercase text-[10px]">
                  <th className="p-2.5">PASSIVO NÃO CIRCULANTE</th>
                  <th className="p-2.5 text-right">R$</th>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Financiamentos de Longo Prazo</td>
                  <td className="p-2.5 text-right font-mono">2.385.983,00</td>
                </tr>
                <tr className="font-bold bg-slate-100">
                  <td className="p-2.5">TOTAL NÃO CIRCULANTE</td>
                  <td className="p-2.5 text-right font-mono">2.385.983,00</td>
                </tr>
                <tr className="font-bold bg-slate-150">
                  <td className="p-2.5">TOTAL PASSIVO</td>
                  <td className="p-2.5 text-right font-mono">8.313.983,00</td>
                </tr>
                <tr className="bg-blue-900 text-white font-bold uppercase text-[10px]">
                  <th className="p-2.5">PATRIMÔNIO LÍQUIDO</th>
                  <th className="p-2.5 text-right">R$</th>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Capital Social e Reservas Acumuladas</td>
                  <td className="p-2.5 text-right font-mono">17.249.421,91</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Resultado Destinado a Terras Rurais</td>
                  <td className="p-2.5 text-right font-mono">2.807.293,49</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-6">Resultado Retido</td>
                  <td className="p-2.5 text-right font-mono">274.258,09</td>
                </tr>
                <tr className="font-bold bg-slate-100">
                  <td className="p-2.5">TOTAL PATRIMÔNIO LÍQUIDO</td>
                  <td className="p-2.5 text-right font-mono">17.522.680,13</td>
                </tr>
                <tr className="font-bold bg-blue-100 text-blue-900 text-sm">
                  <td className="p-3">TOTAL PASSIVO + PL</td>
                  <td className="p-3 text-right font-mono font-extrabold">25.837.663,13</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex justify-between font-bold mt-auto">
            <span>Documento Confidencial</span>
            <span>Página 5</span>
          </div>
        </div>

        {/* Page 6 */}
        <div className="print-page-print" style={{ pageBreakBefore: 'always' }}>
          <div className="border-b-2 border-blue-900 pb-2 text-[9px] text-slate-600 font-bold uppercase flex justify-between mb-8">
            <span>J.S. TRANSPORTE E SERVIÇO LTDA | CNPJ 17.245.072/0001-00</span>
            <span>Indicadores de Desempenho</span>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wide border-b border-blue-900 pb-1">4. Indicadores Financeiros</h3>
            <table className="w-full text-left text-xs border border-slate-300">
              <thead>
                <tr className="bg-blue-900 text-white font-bold uppercase text-[10px]">
                  <th className="p-2.5">Indicador</th>
                  <th className="p-2.5 w-44">Valor</th>
                  <th className="p-2.5">Avaliação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2.5 font-bold">Receita Bruta Anual</td>
                  <td className="p-2.5 font-mono">R$ 16.216.756</td>
                  <td className="p-2.5">Operação de Grande Porte</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Resultado Líquido Anual</td>
                  <td className="p-2.5 font-mono">R$ 3.081.552</td>
                  <td className="p-2.5">Margem de 19,00% — Boa</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Endividamento (Passivo/Ativo)</td>
                  <td className="p-2.5 font-mono">32,2%</td>
                  <td className="p-2.5">Baixo — Padrão Setor: inferior a 60%</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">PL / Ativo Total</td>
                  <td className="p-2.5 font-mono">67,8%</td>
                  <td className="p-2.5">Empresa Majoritariamente Própria</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Serviço da Dívida Mensal</td>
                  <td className="p-2.5 font-mono">R$ 412.000</td>
                  <td className="p-2.5 text-rose-600 font-bold">Excede o lucro líquido em 160%</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Dívida / EBITDA</td>
                  <td className="p-2.5 font-mono">2,1x</td>
                  <td className="p-2.5">Adequado — Referência &lt; 3x</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex justify-between font-bold mt-auto">
            <span>Documento Confidencial</span>
            <span>Página 6</span>
          </div>
        </div>

        {/* Page 7 */}
        <div className="print-page-print" style={{ pageBreakBefore: 'always' }}>
          <div className="border-b-2 border-blue-900 pb-2 text-[9px] text-slate-600 font-bold uppercase flex justify-between mb-8">
            <span>J.S. TRANSPORTE E SERVIÇO LTDA | CNPJ 17.245.072/0001-00</span>
            <span>Carteira de Recebíveis</span>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wide border-b border-blue-900 pb-1">5. Carteira de Recebíveis — 31/12/2025</h3>
            <table className="w-full text-left text-xs border border-slate-300">
              <thead>
                <tr className="bg-blue-900 text-white font-bold uppercase text-[10px]">
                  <th className="p-2.5">Cliente</th>
                  <th className="p-2.5 text-right w-36">Valor (R$)</th>
                  <th className="p-2.5 text-center w-28">% Carteira</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2.5 font-bold">Supergasbras Energia Ltda.</td>
                  <td className="p-2.5 text-right font-mono">2.972.133,24</td>
                  <td className="p-2.5 text-center font-mono">70,5%</td>
                  <td className="p-2.5 text-amber-600 font-bold">Em dia / Atraso</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Companhia Ultragaz S.A.</td>
                  <td className="p-2.5 text-right font-mono">1.043.818,28</td>
                  <td className="p-2.5 text-center font-mono">24,8%</td>
                  <td className="p-2.5 text-amber-600 font-bold">Em dia / Atraso</td>
                </tr>
                <tr className="font-bold bg-slate-100">
                  <td colSpan={2} className="p-2.5">TOTAL DE DUPLICATAS</td>
                  <td className="p-2.5 text-center font-mono">100,0%</td>
                  <td className="p-2.5 font-bold">-</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex justify-between font-bold mt-auto">
            <span>Documento Confidencial</span>
            <span>Página 7</span>
          </div>
        </div>

        {/* Page 8 */}
        <div className="print-page-print" style={{ pageBreakBefore: 'always' }}>
          <div className="border-b-2 border-blue-900 pb-2 text-[9px] text-slate-600 font-bold uppercase flex justify-between mb-8">
            <span>J.S. TRANSPORTE E SERVIÇO LTDA | CNPJ 17.245.072/0001-00</span>
            <span>Composição do Endividamento</span>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wide border-b border-blue-900 pb-1">6. Composição da Dívida — SCR Banco Central</h3>
            <table className="w-full text-left text-xs border border-slate-300">
              <thead>
                <tr className="bg-blue-900 text-white font-bold uppercase text-[10px]">
                  <th className="p-2.5">Instituição Credora</th>
                  <th className="p-2.5">Modalidade</th>
                  <th className="p-2.5 text-right w-44">Saldo Devedor (R$)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2.5 font-bold">Itaú Unibanco S.A.</td>
                  <td className="p-2.5">Financiamento + Capital de Giro</td>
                  <td className="p-2.5 text-right font-mono">3.344.412,98</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Banco Mercedes-Benz do Brasil</td>
                  <td className="p-2.5">Financiamento de Veículos</td>
                  <td className="p-2.5 text-right font-mono">2.328.796,50</td>
                </tr>
                <tr className="font-bold bg-blue-50 text-blue-950">
                  <td className="p-2.5">TOTAL — SALDO SCR DEZ/2025</td>
                  <td className="p-2.5">100% em dia</td>
                  <td className="p-2.5 text-right font-mono font-extrabold">7.329.983,51</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex justify-between font-bold mt-auto">
            <span>Documento Confidencial</span>
            <span>Página 8</span>
          </div>
        </div>

        {/* Page 9 */}
        <div className="print-page-print" style={{ pageBreakBefore: 'always' }}>
          <div className="border-b-2 border-blue-900 pb-2 text-[9px] text-slate-600 font-bold uppercase flex justify-between mb-8">
            <span>J.S. TRANSPORTE E SERVIÇO LTDA | CNPJ 17.245.072/0001-00</span>
            <span>Ativo Imobilizado</span>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wide border-b border-blue-900 pb-1">7. Ativo Imobilizado — Frota</h3>
            <table className="w-full text-left text-xs border border-slate-300">
              <thead>
                <tr className="bg-blue-900 text-white font-bold uppercase text-[10px]">
                  <th className="p-2">Grupo de Frota</th>
                  <th className="p-2 text-center">Qtde.</th>
                  <th className="p-2 text-right">Subtotal (R$)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2 font-bold">Cavalos-Mecânicos Viagem MB</td>
                  <td className="p-2 text-center">18</td>
                  <td className="p-2 text-right font-mono">9.698.000,00</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">Semirreboques / Carretas</td>
                  <td className="p-2 text-center">38</td>
                  <td className="p-2 text-right font-mono">4.680.000,00</td>
                </tr>
                <tr className="font-bold bg-slate-100">
                  <td className="p-2">TOTAL DA FROTA</td>
                  <td className="p-2 text-center">76</td>
                  <td className="p-2 text-right font-mono">19.971.000,00</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex justify-between font-bold mt-auto">
            <span>Documento Confidencial</span>
            <span>Página 9</span>
          </div>
        </div>

        {/* Page 10 */}
        <div className="print-page-print" style={{ pageBreakBefore: 'always' }}>
          <div className="border-b-2 border-blue-900 pb-2 text-[9px] text-slate-600 font-bold uppercase flex justify-between mb-8">
            <span>J.S. TRANSPORTE E SERVIÇO LTDA | CNPJ 17.245.072/0001-00</span>
            <span>Notas Explicativas</span>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wide border-b border-blue-900 pb-1">9. Notas Explicativas e Avaliação</h3>
            <div className="space-y-3 text-xs leading-relaxed text-justify text-slate-700">
              <p><strong>9.1 Receita:</strong> O faturamento de R$ 16.216.756,35 é suportado pelo Relatório de Faturamento assinado pelo contador Fernando de Medeiros Ewald (CRC RJ120853/O-0).</p>
              <p><strong>9.2 Imobilizado — Frota:</strong> Os veículos foram avaliados com base na Tabela FIPE de dezembro de 2025.</p>
              <p><strong>9.3 Endividamento:</strong> O saldo devedor total de R$ 7.329.983,51 (SCR dez/2025) é composto exclusivamente por financiamentos de frota, todos classificados como EM DIA pelo Banco Central do Brasil.</p>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex justify-between font-bold mt-auto">
            <span>Documento Confidencial</span>
            <span>Página 10</span>
          </div>
        </div>

        {/* Page 11 */}
        <div className="print-page-print" style={{ pageBreakBefore: 'always' }}>
          <div className="border-b-2 border-blue-900 pb-2 text-[9px] text-slate-600 font-bold uppercase flex justify-between mb-8">
            <span>J.S. TRANSPORTE E SERVIÇO LTDA | CNPJ 17.245.072/0001-00</span>
            <span>Declaração de Veracidade</span>
          </div>
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wide border-b border-blue-900 pb-1">10. Declaração de Veracidade</h3>
            <p className="text-xs text-slate-700 leading-relaxed text-justify">
              Eu, <strong>LEANDRO LIMA MOTA</strong>, sócio-administrador da J.S. TRANSPORTE E SERVIÇO LTDA, DECLARO, sob as penas da lei, que as informações contidas neste dossiê financeiro são verídicas, completas e fidedignas e refletem a real situação econômica da empresa.
            </p>
            <div className="pt-16 text-center space-y-12">
              <p className="text-xs text-slate-600">Duque de Caxias/RJ, Abril de 2026</p>
              <div className="max-w-xs mx-auto border-t border-slate-400 pt-2 text-xs">
                <p className="font-bold text-blue-900 uppercase">LEANDRO LIMA MOTA</p>
                <p className="text-[10px] text-slate-500 font-bold">Sócio-Administrador</p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex justify-between font-bold mt-auto">
            <span>Documento Confidencial</span>
            <span>Página 11</span>
          </div>
        </div>

        {/* Page 12 */}
        <div className="print-page-print" style={{ pageBreakBefore: 'always' }}>
          <div className="border-b-2 border-blue-900 pb-2 text-[9px] text-slate-600 font-bold uppercase flex justify-between mb-8">
            <span>J.S. TRANSPORTE E SERVIÇO LTDA | CNPJ 17.245.072/0001-00</span>
            <span>Anexos</span>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wide border-b border-blue-900 pb-1">Anexos e Assinaturas</h3>
            <p className="text-xs text-slate-700">Todos os documentos anexos estão arquivados digitalmente na sede administrativa do operador e validados via certificação ICP-Brasil.</p>
            <div className="pt-12 grid grid-cols-2 gap-4">
              <div className="p-4 border border-dashed border-slate-300 rounded bg-slate-50 flex flex-col justify-between h-24">
                <p className="text-[10px] font-bold text-slate-800 font-mono">J S TRANSPORTE E SERVICO LTDA:17245072000100</p>
                <p className="text-[8px] text-slate-500 font-mono">Dados: 2026.04.17 13:06:12 -03'00'</p>
              </div>
              <div className="p-4 border border-dashed border-slate-300 rounded bg-slate-50 flex flex-col justify-between h-24">
                <p className="text-[10px] font-bold text-slate-800 font-mono">LEANDRO LIMA MOTA:13042878740</p>
                <p className="text-[8px] text-slate-500 font-mono">Dados: 2026.04.17 13:06:27 -03'00'</p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex justify-between font-bold mt-auto">
            <span>Documento Confidencial</span>
            <span>Página 12</span>
          </div>
        </div>

        {/* Page 13: Integrated Projections */}
        <div className="print-page-print" style={{ pageBreakBefore: 'always' }}>
          <div className="border-b-2 border-blue-900 pb-2 text-[9px] text-slate-600 font-bold uppercase flex justify-between mb-8">
            <span>J.S. TRANSPORTE E SERVIÇO LTDA | CNPJ 17.245.072/0001-00</span>
            <span>Projeções Integradas</span>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wide border-b border-blue-900 pb-1">11. Projeções e Comparativos de Mercado</h3>
            <table className="w-full text-left text-xs border border-slate-300">
              <thead>
                <tr className="bg-blue-900 text-white font-bold uppercase">
                  <th className="p-2">Indicador Setorial</th>
                  <th className="p-2 text-right">J.S. Real</th>
                  <th className="p-2 text-right">J.S. Proj</th>
                  <th className="p-2 text-right">Média Setor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                <tr>
                  <td className="p-2 font-bold">Crescimento Anual Receita</td>
                  <td className="p-2 text-right font-mono">+9,2%</td>
                  <td className="p-2 text-right font-mono text-blue-900 font-bold">+12,5%</td>
                  <td className="p-2 text-right font-mono text-emerald-700">+4,2%</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">Custo de Diesel / Receita</td>
                  <td className="p-2 text-right font-mono">42,55%</td>
                  <td className="p-2 text-right font-mono text-blue-900 font-bold">40,00%</td>
                  <td className="p-2 text-right font-mono text-emerald-700">35,00%</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">Prazo de Cobrança (DSO)</td>
                  <td className="p-2 text-right font-mono">93 dias</td>
                  <td className="p-2 text-right font-mono text-blue-900 font-bold">75 dias</td>
                  <td className="p-2 text-right font-mono text-emerald-700">45 dias</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex justify-between font-bold mt-auto">
            <span>Documento Confidencial</span>
            <span>Página 13</span>
          </div>
        </div>

        {/* Page 14: Integrated Audit */}
        <div className="print-page-print" style={{ pageBreakBefore: 'always' }}>
          <div className="border-b-2 border-blue-900 pb-2 text-[9px] text-slate-600 font-bold uppercase flex justify-between mb-8">
            <span>J.S. TRANSPORTE E SERVIÇO LTDA | CNPJ 17.245.072/0001-00</span>
            <span>Auditoria CFO</span>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wide border-b border-blue-900 pb-1">12. Auditoria de Pontos Críticos e Plano de Ação CFO</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 border border-red-200 bg-red-50 rounded">
                <p className="font-bold text-red-950 uppercase mb-1">Risco Crítico 01: Serviço da Dívida Mensal</p>
                <p className="text-slate-700 text-justify">O serviço mensal da dívida (amortizações de R$ 412k) consome 160% do lucro mensal. Recomendado alongamento de dívida no Itaú Unibanco para 60 meses utilizando imóvel operacional próprio de R$ 1.5M como garantia.</p>
              </div>
              <div className="p-3 border border-red-200 bg-red-50 rounded">
                <p className="font-bold text-red-950 uppercase mb-1">Risco Crítico 02: Carteira de Recebíveis Atrasados</p>
                <p className="text-slate-700 text-justify">33% da carteira (R$ 1.39M) está em atraso com prazo de 93 dias. Recomendado habilitar operação de risco sacado no portal financeiro das distribuidoras de GLP (Supergasbras e Ultragaz) a taxas controladas.</p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex justify-between font-bold mt-auto">
            <span>Documento Confidencial</span>
            <span>Página 14</span>
          </div>
        </div>
      </div>
    </div>
  );
}
