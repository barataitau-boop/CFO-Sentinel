import { FinancialReport } from "../types";

export const mockJSReport: FinancialReport = {
  healthStatus: "EM ALERTA",
  healthScore: "B",
  summary: "A J.S. Transporte e Serviço Ltda. apresenta uma operação robusta de grande porte no transporte rodoviário de GLP com faturamento anual de R$ 16,2M e margem líquida de 19,0%. Contudo, pontos críticos de atenção foram identificados na auditoria de liquidez e alavancagem, notadamente o expressivo serviço da dívida mensal de R$ 412k e a concentração de recebíveis com 33% em atraso.",
  kpis: [
    {
      label: "Faturamento Anual (2025)",
      value: "R$ 16.216.756",
      status: "SAUDÁVEL",
      description: "Operação de grande porte com forte posicionamento regional e clientes de alta capacidade."
    },
    {
      label: "Resultado Líquido Anual",
      value: "R$ 3.081.552",
      status: "SAUDÁVEL",
      description: "Margem líquida saudável de 19,00%, gerando média de R$ 256.795 de resultado líquido por mês."
    },
    {
      label: "Liquidez Corrente",
      value: "0,74x",
      status: "EM ALERTA",
      description: "Ativo circulante de R$ 4,3M vs Passivo circulante de R$ 5,9M. Necessidade de otimizar capital de giro."
    },
    {
      label: "Alavancagem (Dívida / EBITDA)",
      value: "2,1x",
      status: "SAUDÁVEL",
      description: "Indicador adequado, inferior ao limite de referência de mercado de 3,0x."
    }
  ],
  redFlags: [
    {
      title: "Serviço da Dívida Elevado",
      severity: "high",
      description: "O serviço mensal da dívida de R$ 412.000 representa 160,6% do resultado líquido mensal de R$ 256.796. Há dependência extrema de fluxo de caixa operacional contínuo e rolagem de linhas."
    },
    {
      title: "Atrasos na Carteira de Recebíveis",
      severity: "high",
      description: "Do saldo de R$ 4.213.663 de Contas a Receber, 33,03% (R$ 1.391.679) estão em atraso, impactando diretamente a liquidez de curto prazo."
    },
    {
      title: "Incompatibilidade de Prazos",
      severity: "medium",
      description: "O passivo circulante possui R$ 4.944.000 em parcelas de financiamento vencendo nos próximos 12 meses, pressionando o caixa corrente."
    },
    {
      title: "Alta Concentração de Custos",
      severity: "medium",
      description: "O custo com Combustível representa 42,55% da receita bruta total (R$ 6,9M), tornando a operação altamente vulnerável a flutuações de preços do diesel."
    }
  ],
  forecast: [
    { month: "Jan", projectedCash: 150000, revenue: 1350000, expenses: 1100000 },
    { month: "Fev", projectedCash: 180000, revenue: 1350000, expenses: 1090000 },
    { month: "Mar", projectedCash: 220000, revenue: 1380000, expenses: 1100000 },
    { month: "Abr", projectedCash: 260000, revenue: 1400000, expenses: 1120000 },
    { month: "Mai", projectedCash: 210000, revenue: 1350000, expenses: 1150000 },
    { month: "Jun", projectedCash: 250000, revenue: 1420000, expenses: 1130000 },
    { month: "Jul", projectedCash: 290000, revenue: 1450000, expenses: 1140000 },
    { month: "Ago", projectedCash: 330000, revenue: 1480000, expenses: 1150000 },
    { month: "Set", projectedCash: 300000, revenue: 1400000, expenses: 1180000 },
    { month: "Out", projectedCash: 350000, revenue: 1460000, expenses: 1160000 },
    { month: "Nov", projectedCash: 400000, revenue: 1500000, expenses: 1170000 },
    { month: "Dez", projectedCash: 450000, revenue: 1550000, expenses: 1180000 }
  ],
  recommendation: "Adotar estratégias imediatas de alongamento de dívidas para mitigar a pressão do serviço da dívida mensal de R$ 412 mil. Recomenda-se estruturar um fundo de recebíveis (FIDC) ou operação de antecipação com taxas reduzidas junto ao Itaú S.A., focando no contas a receber de grandes distribuidoras (Supergasbras/Ultragaz) que apresentam baixíssimo risco de crédito, liberando capital de giro e saneando o fluxo de caixa.",
  comparativeReports: [
    {
      indicator: "Receita Bruta",
      year1: "R$ 14.850.000",
      year2: "R$ 16.216.756",
      variance: "+9,2%",
      impact: "Expansão contínua de contratos e fidelização de distribuidoras de GLP."
    },
    {
      indicator: "Custo de Combustível",
      year1: "R$ 6.510.000",
      year2: "R$ 6.900.229",
      variance: "+5,9%",
      impact: "Custos controlados abaixo do crescimento de receita, indicando eficiência de rotas."
    },
    {
      indicator: "Manutenção de Frota",
      year1: "R$ 2.100.000",
      year2: "R$ 2.520.000",
      variance: "+20,0%",
      impact: "Aumento expressivo devido ao desgaste natural e necessidade de renovação de peças."
    },
    {
      indicator: "Resultado Líquido",
      year1: "R$ 2.650.000",
      year2: "R$ 3.081.551",
      variance: "+16,3%",
      impact: "Aumento de rentabilidade com maior diluição de despesas administrativas."
    }
  ],
  sectorAnalysis: [
    {
      sector: "Transporte Rodoviário de Produtos Perigosos (GLP)",
      percentage: 100,
      marketBenchmark: "Margem EBITDA média de 22,5%, Alavancagem média de 1,8x, DSO de 45 dias.",
      strategicInsight: "A J.S. opera com margem líquida competitiva de 19,0%, contudo seu contas a receber apresenta prazo médio elevado e atrasos acima do benchmark do setor."
    }
  ],
  processedFiles: [
    {
      fileName: "DRE_JS_Transporte_2025.xlsx",
      detectedType: "DRE",
      period: "Exercício de 2025"
    },
    {
      fileName: "Balanco_JS_Transporte_2025.xlsx",
      detectedType: "Balancete",
      period: "Posição em 31/12/2025"
    },
    {
      fileName: "Relatorio_Duplicatas_Itaú.pdf",
      detectedType: "Fluxo de Caixa",
      period: "Dezembro/2025"
    }
  ]
};
