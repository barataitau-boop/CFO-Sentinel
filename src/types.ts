/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FinancialKPI {
  label: string;
  value: string | number;
  status: 'SAUDÁVEL' | 'EM ALERTA' | 'CRÍTICO';
  description: string;
}

export interface RedFlag {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

export interface ForecastData {
  month: string;
  projectedCash: number;
  revenue: number;
  expenses: number;
}

export interface ComparativeReportRow {
  indicator: string;
  year1: string;
  year2: string;
  variance: string;
  impact: string;
}

export interface SectorAnalysisResult {
  sector: string;
  percentage: number;
  marketBenchmark: string;
  strategicInsight: string;
}

export interface ProcessedFileSummary {
  fileName: string;
  detectedType: 'DRE' | 'Balancete' | 'Fluxo de Caixa' | 'Não identificado';
  period: string; // e.g. "Jan/2025 - Dez/2025"
}

export interface FinancialReport {
  healthStatus: 'SAUDÁVEL' | 'EM ALERTA' | 'CRÍTICO';
  healthScore: 'A' | 'B' | 'C' | 'D';
  summary: string;
  kpis: FinancialKPI[];
  redFlags: RedFlag[];
  forecast: ForecastData[];
  recommendation: string;
  comparativeReports?: ComparativeReportRow[];
  sectorAnalysis?: SectorAnalysisResult[];
  processedFiles?: ProcessedFileSummary[];
}

export interface FinancialDataRow {
  date: string;
  description: string;
  value: number;
  category: 'Ativo' | 'Passivo' | 'Receita' | 'Custo' | 'Despesa' | 'Outros';
}
