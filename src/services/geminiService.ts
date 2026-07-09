import { FinancialReport } from "../types";

export interface FileData {
  data: string;
  isPdf: boolean;
  fileName: string;
}

export interface ClientSector {
  name: string;
  percentage: number;
}

export async function analyzeFinancialData(
  files: FileData[],
  sectors: ClientSector[]
): Promise<FinancialReport> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ files, sectors }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Erro ao analisar dados financeiros.");
  }

  return response.json();
}
