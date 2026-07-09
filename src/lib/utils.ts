import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Papa from "papaparse";
import * as XLSX from "xlsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function parseFile(file: File): Promise<{ data: string; isPdf: boolean; fileName: string }> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'pdf') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof reader.result === 'string') {
          const base64Str = reader.result.split(',')[1];
          resolve({
            data: base64Str,
            isPdf: true,
            fileName: file.name
          });
        } else {
          reject(new Error("Erro ao converter arquivo PDF para Base64."));
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    if (extension === 'csv') {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          resolve({
            data: JSON.stringify(results.data),
            isPdf: false,
            fileName: file.name
          });
        },
        error: (err) => reject(err),
      });
    } else if (extension === 'xlsx' || extension === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const allData: Record<string, any[]> = {};
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          allData[sheetName] = XLSX.utils.sheet_to_json(worksheet);
        });
        
        resolve({
          data: JSON.stringify(allData),
          isPdf: false,
          fileName: file.name
        });
      };
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error("Formato de arquivo não suportado. Use CSV, XLSX ou PDF."));
    }
  });
}

export function downloadTemplate() {
  const wb = XLSX.utils.book_new();

  // 1. DRE (Demonstrativo de Resultados)
  const dreData = [
    { Categoria: "Receita", Subcategoria: "Vendas de Produtos", Data: "2026-01-01", Valor: 150000, Descricao: "Venda mensal canal A" },
    { Categoria: "Custo", Subcategoria: "CMV", Data: "2026-01-01", Valor: -60000, Descricao: "Custo de mercadoria soldada" },
    { Categoria: "Despesa", Subcategoria: "Aluguel", Data: "2026-01-01", Valor: -5000, Descricao: "Escritório Central" },
    { Categoria: "Despesa", Subcategoria: "Marketing", Data: "2026-01-01", Valor: -12000, Descricao: "Campanha Social Media" },
    { Categoria: "Despesa", Subcategoria: "Folha de Pagamento", Data: "2026-01-01", Valor: -45000, Descricao: "Salários e Encargos" },
  ];
  const wsDre = XLSX.utils.json_to_sheet(dreData);
  XLSX.utils.book_append_sheet(wb, wsDre, "DRE");

  // 2. Balanço Patrimonial
  const balancoData = [
    { Categoria: "Ativo", Subcategoria: "Caixa e Equivalentes", Valor: 85000, Data: "2026-01-01", Descricao: "Saldo bancário" },
    { Categoria: "Ativo", Subcategoria: "Contas a Receber", Valor: 120000, Data: "2026-01-01", Descricao: "Vendas a prazo" },
    { Categoria: "Ativo", Subcategoria: "Estoques", Valor: 45000, Data: "2026-01-01", Descricao: "Produtos acabados" },
    { Categoria: "Passivo", Subcategoria: "Fornecedores", Valor: -35000, Data: "2026-01-01", Descricao: "Matéria prima" },
    { Categoria: "Passivo", Subcategoria: "Empréstimos Bancários", Valor: -200000, Data: "2026-01-01", Descricao: "Capital de giro" },
    { Categoria: "Patrimônio Líquido", Subcategoria: "Capital Social", Valor: -15000, Data: "2026-01-01", Descricao: "Aportes sócios" },
  ];
  const wsBalanco = XLSX.utils.json_to_sheet(balancoData);
  XLSX.utils.book_append_sheet(wb, wsBalanco, "Balanco");

  // 3. Fluxo de Caixa (Movimentações)
  const caixaData = [
    { Tipo: "Operacional", Descricao: "Recebimento Cliente A", Valor: 12000, Data: "2026-01-05" },
    { Tipo: "Investimento", Descricao: "Compra de Notebooks", Valor: -15000, Data: "2026-01-10" },
    { Tipo: "Financiamento", Descricao: "Aporte Financeiro", Valor: 50000, Data: "2026-01-15" },
  ];
  const wsCaixa = XLSX.utils.json_to_sheet(caixaData);
  XLSX.utils.book_append_sheet(wb, wsCaixa, "Fluxo_Caixa");

  XLSX.writeFile(wb, "Modelo_CFO_Sentinel_AI.xlsx");
}
