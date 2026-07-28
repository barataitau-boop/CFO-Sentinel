import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { saasStore } from "./src/services/saasStore.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const REPORT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    healthStatus: { type: Type.STRING, description: "One of [SAUDÁVEL], [EM ALERTA], [CRÍTICO]" },
    healthScore: { type: Type.STRING, description: "A, B, C, or D" },
    summary: { type: Type.STRING },
    kpis: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          value: { type: Type.STRING },
          status: { type: Type.STRING },
          description: { type: Type.STRING }
        },
        required: ["label", "value", "status"]
      }
    },
    redFlags: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          severity: { type: Type.STRING }
        }
      }
    },
    forecast: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          month: { type: Type.STRING },
          projectedCash: { type: Type.NUMBER },
          revenue: { type: Type.NUMBER },
          expenses: { type: Type.NUMBER }
        }
      }
    },
    recommendation: { type: Type.STRING },
    comparativeReports: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          indicator: { type: Type.STRING, description: "Nome do indicador comparado, ex: Receita Líquida, Margem EBITDA, Ativo Total" },
          year1: { type: Type.STRING, description: "Valor ou percentual do ano anterior" },
          year2: { type: Type.STRING, description: "Valor ou percentual do ano recente" },
          variance: { type: Type.STRING, description: "Variação nominal ou percentual, ex: +15.4%" },
          impact: { type: Type.STRING, description: "Impacto estratégico da variação no negócio" }
        },
        required: ["indicator", "year1", "year2", "variance", "impact"]
      }
    },
    sectorAnalysis: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          sector: { type: Type.STRING },
          percentage: { type: Type.NUMBER },
          marketBenchmark: { type: Type.STRING, description: "Benchmarking ou indicador médio de mercado para este ramo específico" },
          strategicInsight: { type: Type.STRING, description: "Insight estratégico focado na representatividade informada" }
        },
        required: ["sector", "percentage", "marketBenchmark", "strategicInsight"]
      }
    },
    processedFiles: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          fileName: { type: Type.STRING },
          detectedType: { type: Type.STRING, description: "Identificação estrita do tipo do demonstrativo: DRE, Balancete, Fluxo de Caixa ou Não identificado" },
          period: { type: Type.STRING, description: "Período ou anos/meses identificados no arquivo, ex: 'Jan-Dez/2025' ou 'Ano de 2024'" }
        },
        required: ["fileName", "detectedType", "period"]
      }
    }
  },
  required: ["healthStatus", "healthScore", "summary", "kpis", "redFlags", "forecast", "recommendation"]
};

async function startServer() {
  const app = express();
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Middleware for parsing JSON and large payloads
  app.use(express.json({ limit: '50mb' }));

  /**
   * ============================================================================
   * ETAPA 2: MIDDLEWARES DE AUTENTICAÇÃO E AUTORIZAÇÃO / RBAC
   * ============================================================================
   */

  // 1. Middleware de Autenticação (Verificação de token JWT simulado)
  const requireAuth = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Acesso negado. Token de autenticação não fornecido." });
    }

    const token = authHeader.split(" ")[1];
    try {
      const session = saasStore.verifyToken(token);
      
      // Adiciona a sessão ativa à requisição para isolamento de tenant
      req.session = session;
      next();
    } catch (err: any) {
      return res.status(401).json({ error: err.message || "Sessão inválida ou expirada." });
    }
  };

  // 2. Middleware de Autorização / RBAC (Verificação de permissão e isolamento de tenant)
  const requirePermission = (permissionCode: string) => {
    return (req: any, res: any, next: any) => {
      if (!req.session) {
        return res.status(401).json({ error: "Usuário não autenticado." });
      }

      const { permissions, user } = req.session;

      // 1. Validação de isolamento do Tenant
      // Se o usuário não for SuperAdmin (Master) e estiver tentando acessar rotas que requerem outra empresa
      if (user.roleId !== "role-master-admin" && req.params.companyId && req.params.companyId !== user.companyId) {
        return res.status(403).json({ error: "Acesso negado. Tentativa de violação de isolamento de Tenant (IDOR)." });
      }

      // 2. Validação da Permissão Granular
      const hasPermission = permissions.includes(permissionCode);
      if (!hasPermission) {
        return res.status(403).json({ 
          error: `Acesso negado. Você não possui privilégios para executar esta ação (${permissionCode}).` 
        });
      }

      next();
    };
  };

  /**
   * ============================================================================
   * CONTROLLERS E ROTAS DO SAAS MULTI-TENANT E RBAC
   * ============================================================================
   */

  // Rota de Login (Simulador de Token JWT)
  app.post("/api/saas/login", (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "E-mail obrigatório." });
    }

    try {
      const session = saasStore.login(email);
      if (!session) {
        return res.status(404).json({ error: "Usuário não cadastrado com este e-mail." });
      }
      res.json(session);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Obter detalhes da sessão atual
  app.get("/api/saas/me", requireAuth, (req: any, res) => {
    res.json(req.session);
  });

  // LISTAR EMPRESAS / TENANTS (Apenas Master Super Admin)
  app.get("/api/saas/companies", requireAuth, requirePermission("companies:read"), (req, res) => {
    res.json(saasStore.getCompanies());
  });

  // CRIAR EMPRESA / TENANT (Apenas Master Super Admin)
  app.post("/api/saas/companies", requireAuth, requirePermission("companies:create"), (req, res) => {
    const { name, domain, userLimit } = req.body;
    if (!name || !domain || !userLimit) {
      return res.status(400).json({ error: "Campos obrigatórios: Nome, Domínio e Limite de Usuários." });
    }

    try {
      const company = saasStore.createCompany(name, domain, parseInt(userLimit, 10));
      res.status(201).json(company);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // ATUALIZAR EMPRESA / TENANT (Apenas Master Super Admin)
  app.put("/api/saas/companies/:id", requireAuth, requirePermission("companies:edit"), (req, res) => {
    const { name, domain, userLimit, status } = req.body;
    try {
      const updated = saasStore.updateCompany(req.params.id, {
        ...(name && { name }),
        ...(domain && { domain }),
        ...(userLimit && { userLimit: parseInt(userLimit, 10) }),
        ...(status && { status })
      });
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // DELETAR EMPRESA / TENANT (Apenas Master Super Admin)
  app.delete("/api/saas/companies/:id", requireAuth, requirePermission("companies:delete"), (req, res) => {
    try {
      saasStore.deleteCompany(req.params.id);
      res.json({ message: "Empresa e todos os seus usuários associados foram removidos com sucesso." });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // LISTAR USUÁRIOS DO TENANT ATIVO
  app.get("/api/saas/users", requireAuth, requirePermission("users:read"), (req: any, res) => {
    const tenantCompanyId = req.session.user.companyId;
    res.json(saasStore.getUsers(tenantCompanyId));
  });

  // CRIAR USUÁRIO DO TENANT COM VALIDAÇÃO DE LIMITE DE PLANO
  app.post("/api/saas/users", requireAuth, requirePermission("users:create"), (req: any, res) => {
    const tenantCompanyId = req.session.user.companyId;
    const { name, email, roleId } = req.body;

    if (!name || !email || !roleId) {
      return res.status(400).json({ error: "Campos obrigatórios: Nome, E-mail e Cargo (Role)." });
    }

    try {
      // Cria o usuário executando a regra crítica de limite de plano do Tenant
      const newUser = saasStore.createUser(tenantCompanyId, name, email, roleId);
      res.status(201).json(newUser);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // EDITAR USUÁRIO DO TENANT ATIVO
  app.put("/api/saas/users/:id", requireAuth, requirePermission("users:edit"), (req: any, res) => {
    const tenantCompanyId = req.session.user.companyId;
    const { name, roleId, status } = req.body;

    if (!name || !roleId || !status) {
      return res.status(400).json({ error: "Campos obrigatórios: Nome, Cargo e Status." });
    }

    try {
      const updated = saasStore.updateUser(tenantCompanyId, req.params.id, name, roleId, status);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // DELETAR USUÁRIO DO TENANT ATIVO
  app.delete("/api/saas/users/:id", requireAuth, requirePermission("users:delete"), (req: any, res) => {
    const tenantCompanyId = req.session.user.companyId;
    try {
      saasStore.deleteUser(tenantCompanyId, req.params.id);
      res.json({ message: "Usuário removido com sucesso." });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // LISTAR ROLES DISPONÍVEIS NO TENANT
  app.get("/api/saas/roles", requireAuth, requirePermission("roles:read"), (req: any, res) => {
    const tenantCompanyId = req.session.user.companyId;
    res.json(saasStore.getRoles(tenantCompanyId));
  });

  // CRIAR ROLE PERSONALIZADA NO TENANT
  app.post("/api/saas/roles", requireAuth, requirePermission("roles:create"), (req: any, res) => {
    const tenantCompanyId = req.session.user.companyId;
    const { name, description, selectedPermissions } = req.body;

    if (!name || !selectedPermissions || !Array.isArray(selectedPermissions)) {
      return res.status(400).json({ error: "Campos obrigatórios: Nome e Lista de Permissões." });
    }

    try {
      const role = saasStore.createRole(tenantCompanyId, name, description || "", selectedPermissions);
      res.status(201).json(role);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // ATUALIZAR PERMISSÕES DE UMA ROLE PERSONALIZADA
  app.put("/api/saas/roles/:id", requireAuth, requirePermission("roles:edit"), (req: any, res) => {
    const tenantCompanyId = req.session.user.companyId;
    const { selectedPermissions } = req.body;

    if (!selectedPermissions || !Array.isArray(selectedPermissions)) {
      return res.status(400).json({ error: "Lista de Permissões obrigatória." });
    }

    try {
      saasStore.updateRolePermissions(tenantCompanyId, req.params.id, selectedPermissions);
      res.json({ message: "Permissões atualizadas com sucesso para este perfil." });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // DELETAR ROLE PERSONALIZADA
  app.delete("/api/saas/roles/:id", requireAuth, requirePermission("roles:delete"), (req: any, res) => {
    const tenantCompanyId = req.session.user.companyId;
    try {
      saasStore.deleteRole(tenantCompanyId, req.params.id);
      res.json({ message: "Perfil de acesso personalizado deletado." });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // OBTER TODAS AS PERMISSÕES DO SISTEMA
  app.get("/api/saas/permissions", requireAuth, (req, res) => {
    res.json(saasStore.getPermissions());
  });

  // OBTER PERMISSÕES ASSOCIADAS A UMA ROLE ESPECÍFICA
  app.get("/api/saas/role-permissions/:roleId", requireAuth, (req, res) => {
    res.json(saasStore.getRolePermissions(req.params.roleId));
  });

  // API routes go here
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.post("/api/analyze", async (req, res) => {
    const { files, data, isPdf, fileName, sectors } = req.body;

    let fileList: any[] = [];
    if (files && Array.isArray(files)) {
      fileList = files;
    } else if (data) {
      fileList = [{ data, isPdf, fileName }];
    }

    if (fileList.length === 0) {
      return res.status(400).json({ error: "Dados financeiros ou arquivos ausentes para análise." });
    }

    const sectorsStr = sectors && sectors.length > 0 
      ? sectors.map((s: any) => `- Ramo: ${s.name} (${s.percentage}%)`).join("\n")
      : "Não especificado";

    let contents: any[] = [];
    
    let promptText = `
Você é o "CFO Sentinel AI", um experiente Diretor Financeiro (CFO) virtual, Analista de Dados Financeiros e Especialista em Modelagem Preditiva.
Seu objetivo é analisar múltiplos arquivos de demonstrações financeiras enviados (DRE, Balancetes, Fluxo de Caixa), agrupá-los por ano e mês, correlacioná-los e gerar um diagnóstico de saúde financeira completo e altamente refinado.

DADOS DE RAMO DE ATIVIDADE DO CLIENTE E REPRESENTATIVIDADE:
${sectorsStr}

INSTRUÇÕES DE ANÁLISE DETALHADA:
1. IDENTIFICAÇÃO E AGRUPAMENTO:
   - Identifique rigorosamente as datas (meses e anos) contidas em cada arquivo.
   - Classifique cada arquivo em um dos tipos: DRE, Balancete, Fluxo de Caixa ou Não identificado.
   - Preencha o campo 'processedFiles' com essas informações.

2. ANÁLISE COMPARATIVA (SE MULTIANUAL):
   - Se os dados abrangerem mais de 1 ano ou múltiplas competências de anos diferentes, calcule e apresente na seção 'comparativeReports' as variações (YoY - Year over Year ou similar) de indicadores cruciais (como Receita, Margem EBITDA, Endividamento, etc.), descrevendo o impacto estratégico de cada variação.
   - Caso contenha informações completas de mais de 1 ano, faça uma comparação robusta entre os anos.

3. ANÁLISE DE RAMO DE ATIVIDADE (SECTOR ANALYSIS):
   - Utilize seu conhecimento sobre os ramos de atividade fornecidos e suas respectivas porcentagens de representação para fornecer análises contextualizadas de acordo com suas representatividades.
   - Forneça referências de mercado (Benchmarks), margens típicas do ramo e insights estratégicos.

4. INTEGRAÇÃO DE DEMONSTRAÇÕES (3-STATEMENT INTEGRATION):
   - Sincronize os dados para que o Lucro Líquido (DRE) alimente o Patrimônio Líquido (Balanço), e construa o Fluxo de Caixa pelo Método Indireto conciliando variações do Capital de Giro.

5. DASHBOARD DE ANÁLISE DE SAÚDE (HEALTH CHECK):
   - Calcule os KPIs principais: Liquidez Corrente, Margem EBITDA, ROE e Endividamento (Dívida Total/EBITDA).
   - Atribua um status de saúde: [SAUDÁVEL], [EM ALERTA] ou [CRÍTICO]. Atribua também uma nota/score de saúde de A a D.

6. AUDITORIA DE FRAGILIDADE:
   - Identifique Red Flags (Sinais de Alerta) como Ciclo Financeiro longo, dependência de terceiros, queima de caixa (Cash Burn) ou descompasso de prazos.

7. ANÁLISE DE FUTURO (FORECASTING):
   - Projete os próximos 12 meses (Cenário Base) estimando a evolução de receitas, despesas e caixa projetado.

8. STRESS TEST:
   - Considere na recomendação o impacto de uma queda de 20% na receita para testar a resiliência do caixa.

CONTEÚDOS DOS ARQUIVOS ENVIADOS:
`;

    // Process all files
    for (const file of fileList) {
      if (file.isPdf) {
        // PDF files are passed as inlineData objects in the contents list
        contents.push({
          inlineData: {
            mimeType: "application/pdf",
            data: file.data
          }
        });
        promptText += `\n* O arquivo PDF "[${file.fileName}]" foi anexado à chamada como dado binário inline. Analise o PDF e identifique seu conteúdo (DRE, Balancete, Fluxo de Caixa), períodos e valores de acordo com as instruções.`;
      } else {
        // CSV or XLSX text contents
        promptText += `\n\n--- INÍCIO DO ARQUIVO: "${file.fileName}" ---
${file.data}
--- FIM DO ARQUIVO: "${file.fileName}" ---`;
      }
    }

    promptText += `\n\nRetorne o relatório estruturado estritamente em formato JSON seguindo o schema fornecido.`;
    
    // We add the promptText to contents as the final instruction text
    contents.push(promptText);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: REPORT_SCHEMA,
        }
      });

      if (!response.text) {
        throw new Error("Resposta vazia retornada pelo modelo Gemini.");
      }

      const report = JSON.parse(response.text);
      res.json(report);
    } catch (error: any) {
      console.error("Erro na chamada de análise do Gemini:", error);
      res.status(500).json({ error: error?.message || "Ocorreu um erro interno durante a análise financeira." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor ouvindo em 0.0.0.0:${port}`);
  });
}

startServer().catch(err => {
  console.error("Critical server error:", err);
  process.exit(1);
});
