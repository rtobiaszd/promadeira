import React, { useState } from 'react';
import { BookOpen, Database, Workflow, Terminal, GitFork, Shield, ArrowRight, CheckCircle2, Server, Layers } from 'lucide-react';

export default function SaaSBlueprintDoc() {
  const [activeTab, setActiveTab] = useState<'ux' | 'architecture' | 'database' | 'workflows' | 'integrations' | 'flows' | 'api'>('ux');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="border-b border-slate-800 bg-slate-950/50 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="text-amber-500 w-6 h-6" />
              Manual de Especificação Arquitetural SaaS
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Design de sistema multi-tenant e manual de implementação pronto para produção com Supabase e Vercel
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'ux', label: 'Estrutura UX', icon: Layers },
              { id: 'architecture', label: 'Serviços & Sistema', icon: Server },
              { id: 'database', label: 'Esquema do Banco', icon: Database },
              { id: 'workflows', label: 'Motor de Workflow', icon: Workflow },
              { id: 'integrations', label: 'Integrações', icon: GitFork },
              { id: 'flows', label: 'Fluxos de Usuário', icon: ArrowRight },
              { id: 'api', label: 'Especificação API', icon: Terminal },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                      : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-6 max-h-[750px] overflow-y-auto custom-scrollbar text-slate-300">
        {activeTab === 'ux' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Layers className="text-amber-500 w-5 h-5" />
              1. Estrutura UX &amp; Hierarquias de Páginas (Vercel Frontend)
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              A plataforma é hospedada de forma ultra-rápida na rede global de borda (Edge Network) da <strong className="text-white">Vercel</strong>. O painel centralizado foi projetado para operações de alta densidade e multi-inquilinato (multi-tenant), permitindo alternar de forma transparente entre empresas clientes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <h3 className="font-bold text-slate-200 text-sm mb-2">Visões Principais da Aplicação</h3>
                <ul className="space-y-3 text-xs text-slate-400">
                  <li>
                    <strong className="text-slate-200">Painel Operacional:</strong> Indicadores de saúde em tempo real, volume de conversas por canal, faturamento mensal estimado (MRR), contagem de automações executadas e registros de logs imediatos do Supabase.
                  </li>
                  <li>
                    <strong className="text-slate-200">Caixa de Entrada Unificada:</strong> Tela dividida em três colunas com a lista de chats ativos, linha do tempo da conversa e painel lateral de contexto de leads para mover etapas do funil de vendas e agendar horários em tempo real.
                  </li>
                  <li>
                    <strong className="text-slate-200">Painel de Pipelines CRM (Kanban):</strong> Quadro interativo com suporte para arrastar e soltar (drag-and-drop). Cada estágio possui regras de automação específicas (ex: acionar webhooks, enviar mensagens pelo WhatsApp ou criar tickets).
                  </li>
                  <li>
                    <strong className="text-slate-200">Editor Visual de Workflows:</strong> Interface node-based para mapeamento lógico de ações que guiam os gatilhos, condições, IA com Gemini e atrasos temporais.
                  </li>
                  <li>
                    <strong className="text-slate-200">Central de Integrações:</strong> Configuração rápida de credenciais seguras para canais de mensageria, sistemas externos e hooks REST.
                  </li>
                  <li>
                    <strong className="text-slate-200">Agenda &amp; Contatos:</strong> Armazenamento estruturado de metadados de leads diretamente conectado ao PostgreSQL do Supabase.
                  </li>
                </ul>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-200 text-sm mb-2">Papéis de Usuários &amp; Controle de Acesso</h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-start gap-2">
                      <Shield className="text-rose-500 w-4 h-4 mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-slate-200">Administrador do Tenant:</strong> Acesso completo a faturamento, convite de novos usuários de suporte, gerenciamento de credenciais globais e configurações do banco no Supabase.
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Shield className="text-amber-500 w-4 h-4 mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-slate-200">Gerente do CRM:</strong> Edição de fluxos de automação de vendas, criação de novos funis operacionais, exportação de contatos e análise de indicadores macro.
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Shield className="text-sky-500 w-4 h-4 mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-slate-200">Agente de Atendimento:</strong> Foco exclusivo na Caixa Unificada para responder chats, mover leads manualmente de coluna e registrar agendamentos rápidos de visitas ou demonstrações.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 leading-relaxed">
                  <span className="text-amber-500 font-bold block mb-1">Dica de Deploy:</span>
                  A Vercel utiliza o roteamento de borda (Edge Middleware) para isolar subdomínios dinamicamente (ex: <code className="text-amber-400 font-mono">promadeira.seu-saas.com</code>) e encaminhar a requisição com o ID do tenant correto ao banco.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Server className="text-amber-500 w-5 h-5" />
              2. Arquitetura de Serviços Integrada (Supabase + Vercel Serverless)
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Diferente de arquiteturas legadas e pesadas de microsserviços que demandam VMs de alto custo, este blueprint consolida o controle estático e Serverless na <strong className="text-white">Vercel</strong> e utiliza a infraestrutura em tempo real (Realtime / Webhooks / Postgres) do <strong className="text-white">Supabase</strong> para atingir tempos de resposta de milissegundos a um custo mínimo.
            </p>

            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <h3 className="font-bold text-slate-200 text-sm mb-2">Princípios Tecnológicos</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400">
                  <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <h4 className="font-bold text-slate-200 mb-1">Segurança por RLS (Row Level Security)</h4>
                    O Supabase aplica Row Level Security nativo nas tabelas do PostgreSQL. Toda query enviada pelo frontend cliente é filtrada automaticamente de acordo com o JWT do usuário autenticado, impedindo vazamento de dados entre inquilinos (tenants).
                  </div>
                  <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <h4 className="font-bold text-slate-200 mb-1">Vercel Edge &amp; Serverless</h4>
                    As rotas de API, motor de workflows e o proxy da IA Gemini rodam de forma auto-escalável no Vercel Functions. Não há consumo ocioso de CPU quando o painel não está sendo usado.
                  </div>
                  <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <h4 className="font-bold text-slate-200 mb-1">Supabase Realtime</h4>
                    Notificações de mensagens instantâneas e a movimentação visual de cards Kanban sincronizam automaticamente no navegador dos agentes via websockets nativos do Supabase Realtime.
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <h3 className="font-bold text-slate-200 text-sm mb-2">Módulos de Serviços do Backend</h3>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-900 rounded flex justify-between items-center">
                    <span>
                      <strong className="text-slate-200">Gerenciador de Chatbots Inteligentes</strong>
                      <span className="text-slate-500 block">Identifica payloads de entrada, executa regras de menus fixos e dispara o modelo Gemini para extração de intenções e orçamentos.</span>
                    </span>
                    <span className="text-amber-400 font-mono text-[10px]">ChatbotService.ts (Vercel Serverless)</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded flex justify-between items-center">
                    <span>
                      <strong className="text-slate-200">Orquestrador de Workflows</strong>
                      <span className="text-slate-500 block">Varre as configurações JSON de fluxos salvos. Executa nós recursivamente, aplica condições lógicas e aciona integrações.</span>
                    </span>
                    <span className="text-amber-400 font-mono text-[10px]">WorkflowEngine.ts (Vercel)</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded flex justify-between items-center">
                    <span>
                      <strong className="text-slate-200">Gatilhos PostgreSQL e Webhooks Supabase</strong>
                      <span className="text-slate-500 block">Fires HTTP requests para funções do Vercel quando novas conversas ou atualizações de leads ocorrem no banco.</span>
                    </span>
                    <span className="text-amber-400 font-mono text-[10px]">Database Triggers (Supabase)</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded flex justify-between items-center">
                    <span>
                      <strong className="text-slate-200">Central Segura de Credenciais de Integração</strong>
                      <span className="text-slate-500 block">Armazena de forma criptografada as chaves de API (ex: Twilio, GitHub, Supabase Service Key) e as carrega de forma isolada em runtime.</span>
                    </span>
                    <span className="text-amber-400 font-mono text-[10px]">IntegrationRegistry.ts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'database' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Database className="text-amber-500 w-5 h-5" />
              3. Esquema de Banco de Dados PostgreSQL &amp; Prisma ORM (Supabase Host)
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              A modelagem de dados abaixo foi criada usando o Prisma ORM e mapeia perfeitamente tabelas relacionais eficientes no banco gerenciado da <strong className="text-white">Supabase</strong>. O uso intensivo de colunas <code className="text-amber-400 font-mono text-xs">Json</code> permite alta flexibilidade para automações personalizadas sem necessidade de migrations repetitivas.
            </p>

            <div className="relative">
              <pre className="bg-slate-950 p-4 rounded-lg text-xs font-mono overflow-x-auto text-emerald-400 border border-slate-800 max-h-[450px]">
{`datasource db {
  provider  = "postgresql"
  url       = env("SUPABASE_DATABASE_URL") // Conexão via Pool do Supabase (porta 5432 / 6543)
  directUrl = env("SUPABASE_DIRECT_URL")   // Conexão direta para migrations
}

generator client {
  provider = "prisma-client-js"
}

// 1. Tabela de Inquilinos (Multi-tenant)
model Tenant {
  id          String   @id @default(uuid())
  name        String
  subdomain   String   @unique
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  users       User[]
  pipelines   Pipeline[]
  entryPoints EntryPoint[]
  workflows   Workflow[]
  contacts    Contact[]
  integrations Integration[]
  logs        InboundLog[]
}

// 2. Autenticação integrada ao Supabase Auth
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  role      String   // "admin" | "manager" | "agent"
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deals     Deal[]   // Oportunidades atribuídas
}

// 3. Canais de Comunicação (WhatsApp, Email, Telegram)
model EntryPoint {
  id           String   @id @default(uuid())
  tenantId     String
  tenant       Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  channel      String   // "whatsapp" | "email" | "telegram"
  name         String
  identifier   String   // ex: "+5511999999999", "suporte@empresa.com"
  status       String   @default("active") // "active" | "disconnected"
  chatbotMode  String   @default("menu")   // "menu" | "ai" | "hybrid"
  chatbotConfig Json    // Guarda os passos do chatbot de Menu ou prompts de IA
  mappedPipelineId String
  mappedStageId    String
}

// 4. Pipelines do CRM Kanban
model Pipeline {
  id        String   @id @default(uuid())
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  name      String
  stages    Stage[]
  deals     Deal[]
}

// 5. Estágios do Pipeline com automação acoplada
model Stage {
  id         String    @id @default(uuid())
  pipelineId String
  pipeline   Pipeline  @relation(fields: [pipelineId], references: [id], onDelete: Cascade)
  name       String
  order      Int
  automation Json?     // Lista estruturada de ações (ex: onEnterActions, conditions)
  deals      Deal[]
}

// 6. Negócios (Tickets ou Leads do CRM)
model Deal {
  id         String   @id @default(uuid())
  pipelineId String
  pipeline   Pipeline @relation(fields: [pipelineId], references: [id], onDelete: Cascade)
  stageId    String
  stage      Stage    @relation(fields: [stageId], references: [id])
  title      String
  contactName String
  contactPhone String?
  contactEmail String?
  value      Decimal  @db.Decimal(12, 2)
  assignedAgentId String?
  assignedAgent   User?   @relation(fields: [assignedAgentId], references: [id])
  metadata   Json     // Logs de chat, intenções capturadas pela IA, etc.
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

// 7. Configurações de Automação Visual (Workflows)
model Workflow {
  id            String   @id @default(uuid())
  tenantId      String
  tenant        Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  name          String
  description   String
  isActive      Boolean  @default(true)
  triggerType   String   // "message_received" | "deal_stage_changed" | "webhook"
  triggerConfig Json
  startNodeId   String
  nodes         Json     // Nós do fluxo indexados por ID
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

// 8. Chaves de Integrações com Criptografia AES GCM no Supabase Vault
model Integration {
  id          String   @id @default(uuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  providerId  String   // "supabase" | "vercel" | "webhook" | "twilio" | "telegram"
  name        String
  status      String   @default("connected")
  credentials String   // Chaves criptografadas salvas no Postgres do Supabase
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// 9. Banco de Contatos Compartilhado por Tenant
model Contact {
  id        String   @id @default(uuid())
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  name      String
  email     String
  phone     String
  tags      String[]
  notes     String?
  createdAt DateTime @default(now())
}

// 10. Central de Histórico de Execuções e Webhooks Ingeridos
model InboundLog {
  id         String   @id @default(uuid())
  tenantId   String
  tenant     Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  timestamp  DateTime @default(now())
  source     String   // ex: "Supabase Webhook", "Vercel Deploy Alert"
  payload    String   // String do payload original para auditoria
  matchedWorkflowId String?
  status     String   @default("none") // "success" | "failed" | "none"
}`}
              </pre>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs leading-relaxed">
              <span className="text-amber-500 font-bold block mb-1">Como habilitar Row Level Security (RLS) no Supabase:</span>
              <pre className="text-slate-400 font-mono text-[10px] bg-slate-900 p-2 rounded border border-slate-800 mt-1">
{`ALTER TABLE "Deal" ENABLE ROW LEVEL SECURITY;
CREATE POLICY deal_tenant_isolation ON "Deal" 
  FOR ALL TO authenticated 
  USING (tenant_id = (auth.jwt() ->> 'user_metadata')::jsonb ->> 'tenant_id');`}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'workflows' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Workflow className="text-amber-500 w-5 h-5" />
              4. Arquitetura do Motor de Fluxos (Workflows)
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              O motor de workflows é completamente reativo. Funções serverless rodando na <strong className="text-white">Vercel</strong> executam recursivamente os nós lógicos salvos em formato JSON, realizando processamentos complexos e salvando o estado de progresso das execuções na tabela <code className="text-amber-400 font-mono">InboundLog</code> do <strong className="text-white">Supabase</strong>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <h3 className="font-bold text-slate-200 text-xs mb-2">Tipos de Nós Estruturados</h3>
                  <div className="space-y-2 text-xs text-slate-400 text-left">
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono text-[10px] uppercase h-fit mt-0.5">Gatilho (Trigger)</span>
                      <div>Inicia o fluxo com base em eventos: nova mensagem no WhatsApp, alteração de etapa no Kanban Supabase, ou webhook POST.</div>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 font-mono text-[10px] uppercase h-fit mt-0.5">Condição</span>
                      <div>Verifica filtros e variáveis do payload de entrada (ex: valor de lead &gt; 5000) e divide a execução em ramos Verdadeiro/Falso.</div>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-400 font-mono text-[10px] uppercase h-fit mt-0.5">Ação</span>
                      <div>Chama provedores externos, envia avisos por canais, dispara webhooks estruturados ou altera colunas do Postgres.</div>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 font-mono text-[10px] uppercase h-fit mt-0.5">IA Integrada</span>
                      <div>Chama o modelo inteligente Gemini de forma segura pelo backend para traduzir, categorizar ou resumir logs e mensagens.</div>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 font-mono text-[10px] uppercase h-fit mt-0.5">Atraso (Delay)</span>
                      <div>Agenda cronômetros no Supabase (pg_cron) para pausar e retomar a execução após minutos, horas ou dias.</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <h3 className="font-bold text-slate-200 text-xs mb-2">Estrutura de Configuração JSON do Fluxo</h3>
                <pre className="text-[10px] font-mono text-emerald-500 overflow-x-auto max-h-[300px]">
{`{
  "id": "wf-onboarding-premium",
  "name": "Roteamento WhatsApp Lead Alto Valor",
  "triggerType": "message_received",
  "startNodeId": "node-1",
  "nodes": {
    "node-1": {
      "id": "node-1",
      "type": "ai",
      "name": "Classificação Inteligente via Gemini",
      "config": {
        "prompt": "Identifique o orçamento estimado da mensagem. Retorne JSON com as propriedades 'ePremium' (bool) e 'valor' (number).",
        "outputKey": "extracaoIA"
      },
      "nextId": "node-2"
    },
    "node-2": {
      "id": "node-2",
      "type": "condition",
      "name": "Verifica Limite de R$5.000",
      "config": {
        "field": "extracaoIA.valor",
        "operator": "greater_than",
        "compareValue": 5000,
        "trueId": "node-3",
        "falseId": "node-4"
      }
    },
    "node-3": {
      "id": "node-3",
      "type": "action",
      "name": "Gera Oportunidade Alta Prioridade no Supabase",
      "config": {
        "providerId": "supabase",
        "actionId": "create_row",
        "table": "Deal",
        "payload": {
          "title": "Lead Premium WhatsApp",
          "value": "{{extracaoIA.valor}}"
        }
      }
    },
    "node-4": {
      "id": "node-4",
      "type": "action",
      "name": "Resposta Automática do Catálogo Padrão",
      "config": {
        "providerId": "whatsapp",
        "actionId": "send_message",
        "text": "Obrigado pelo contato! Segue nosso catálogo de produtos digitais."
      }
    }
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
              <GitFork className="text-amber-500 w-5 h-5" />
              5. Conexão de Integrações (Supabase Vault &amp; Vercel Env)
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              O ecossistema utiliza uma estrutura plugável baseada em interfaces abstratas. As chaves de acesso críticas (tokens, urls do banco, API keys) são salvas com criptografia AES-256 no banco do <strong className="text-white">Supabase</strong> e repassadas de forma segura para as funções da <strong className="text-white">Vercel</strong> no momento da chamada da API.
            </p>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
              <h3 className="font-bold text-slate-200 text-sm mb-3">Padrão de Código de Provedores (TypeScript / Vercel Serverless)</h3>
              <pre className="text-xs font-mono text-sky-400 overflow-x-auto max-h-[350px]">
{`// src/server/integrations/ProviderBase.ts
export interface ProviderAction {
  id: string;
  name: string;
  execute(credentials: Record<string, string>, params: Record<string, any>): Promise<any>;
}

export abstract class IntegrationProvider {
  abstract id: string;
  abstract name: string;
  abstract description: string;
  abstract credentialsSchema: string[]; // ex: ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']

  private actions: Map<string, ProviderAction> = new Map();

  registerAction(action: ProviderAction) {
    this.actions.set(action.id, action);
  }

  async runAction(actionId: string, credentials: Record<string, string>, params: Record<string, any>) {
    const action = this.actions.get(actionId);
    if (!action) throw new Error(\`Ação \${actionId} não suportada pelo provedor \${this.name}\`);
    return await action.execute(credentials, params);
  }
}

// Exemplos de Provedores Nativos Implementados:
// 1. Supabase Client: Realiza upserts de leads e sincroniza tabelas adicionais.
// 2. Vercel Hooks: Envia alertas de deployment ou aciona rebuilds quando configurações do tenant mudam.
// 3. Twilio WhatsApp Client: Dispara avisos automáticos em tempo real.
// 4. Webhook Genérico: Dispara requisições REST POST/GET customizadas.`}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'flows' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
              <ArrowRight className="text-amber-500 w-5 h-5" />
              6. Fluxos de Trabalho Práticos do Usuário
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Veja a sequência de eventos passo a passo que ocorre na infraestrutura ao processar mensagens e webhooks.
            </p>

            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <h3 className="font-bold text-slate-200 text-xs mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">1</span>
                  Fluxo de Contato pelo WhatsApp → Registro no CRM no Supabase → Resposta Inteligente
                </h3>
                <div className="space-y-2 text-xs text-slate-400 text-left">
                  <div className="flex gap-4">
                    <span className="w-28 text-slate-300 font-semibold shrink-0">1. Entrada:</span>
                    <span>O cliente envia uma mensagem no WhatsApp: <code className="text-amber-400 bg-slate-900 px-1 py-0.5 rounded">"Quero contratar o plano premium de madeira tratada de 12 mil reais"</code>.</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-28 text-slate-300 font-semibold shrink-0">2. Rota Vercel:</span>
                    <span>A rota da API na Vercel recebe o webhook da Twilio, identifica o Tenant associado ao número do WhatsApp e busca as configurações do chatbot no banco de dados.</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-28 text-slate-300 font-semibold shrink-0">3. IA com Gemini:</span>
                    <span>A função Serverless aciona o Gemini com as diretrizes do tenant, identificando o interesse do lead e extraindo o valor do orçamento de R$ 12.000.</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-28 text-slate-300 font-semibold shrink-0">4. Registro DB:</span>
                    <span>Uma nova linha é criada na tabela de oportunidades (<code className="text-amber-400 bg-slate-900 px-1 py-0.5 rounded">Deal</code>) do Supabase na coluna "Novo Lead". Os navegadores dos agentes na Caixa Unificada piscam instantaneamente devido ao Canal Realtime do Supabase.</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-28 text-slate-300 font-semibold shrink-0">5. Automação:</span>
                    <span>O trigger do estágio identifica que o valor ultrapassa o limite de R$ 5.000, disparando automaticamente uma notificação interna para o time comercial no canal de chat.</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <h3 className="font-bold text-slate-200 text-xs mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold">2</span>
                  Automação de Logs e Ingestão de Webhooks no Supabase
                </h3>
                <div className="space-y-2 text-xs text-slate-400 text-left">
                  <div className="flex gap-4">
                    <span className="w-28 text-blue-400 font-semibold shrink-0">1. Post Inbound:</span>
                    <span>Sistemas externos (ex: monitor de alertas ou gateway de pagamento) realizam um POST para <code className="text-blue-400 bg-slate-900 px-1 py-0.5 rounded">/api/events</code> enviando um payload em formato JSON.</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-28 text-blue-400 font-semibold shrink-0">2. Escrita no Banco:</span>
                    <span>O evento é persistido imediatamente na tabela <code className="text-blue-400 bg-slate-900 px-1 py-0.5 rounded">InboundLog</code> da Supabase. O gatilho de insert do PostgreSQL dispara uma função Edge da Vercel.</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-28 text-blue-400 font-semibold shrink-0">3. Processamento:</span>
                    <span>O motor de Workflows varre as condições lógicas correspondentes e verifica se algum limite crítico (ex: falha de pagamento ou servidor de arquivos lotado) foi atingido.</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-28 text-blue-400 font-semibold shrink-0">4. Resolução:</span>
                    <span>Se verdadeiro, dispara o webhook corretivo imediatamente ou envia SMS emergencial pelo console unificado.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Terminal className="text-amber-500 w-5 h-5" />
              7. Rotas da API REST Prontas para Produção (Vercel API Routes)
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              O servidor serverless expõe endpoints padronizados protegidos por cabeçalhos de autenticação de inquilinos (ex: <code className="text-amber-400 bg-slate-900 px-1 py-0.5 rounded">x-tenant-id</code>).
            </p>

            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs space-y-3">
                <div className="border-b border-slate-800 pb-3 text-left">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px]">GET</span>
                    <span className="font-bold text-slate-200">/api/conversations</span>
                  </div>
                  <span className="text-slate-500 text-[11px] block mt-1">Busca conversas ativas vinculadas ao inquilino autenticado no Supabase. Permite paginação.</span>
                </div>

                <div className="border-b border-slate-800 pb-3 text-left">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 font-bold text-[10px]">POST</span>
                    <span className="font-bold text-slate-200">/api/conversations/:id/messages</span>
                  </div>
                  <span className="text-slate-500 text-[11px] block mt-1">Envia uma resposta manual do agente pelo canal correspondente (WhatsApp/Email/Telegram) através das APIs da Vercel.</span>
                  <pre className="text-[10px] text-blue-400 mt-2">{"{ \"text\": \"Olá João! Seu agendamento foi confirmado para amanhã às 14h.\" }"}</pre>
                </div>

                <div className="border-b border-slate-800 pb-3 text-left">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 font-bold text-[10px]">POST</span>
                    <span className="font-bold text-slate-200">/api/events</span>
                  </div>
                  <span className="text-slate-500 text-[11px] block mt-1">Endpoint de ingestão de webhooks. Ponto de entrada direto para alertas de infraestrutura ou notificações de pagamentos de terceiros.</span>
                  <pre className="text-[10px] text-blue-400 mt-2">{"{ \"source\": \"GitHub Monitor\", \"event\": \"repository_dispatch\", \"payload\": { ... } }"}</pre>
                </div>

                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-400 font-bold text-[10px]">PUT</span>
                    <span className="font-bold text-slate-200">/api/deals/:id/stage</span>
                  </div>
                  <span className="text-slate-500 text-[11px] block mt-1">Movimenta o negócio no Kanban. Dispara as ações do estágio configuradas no banco Supabase.</span>
                  <pre className="text-[10px] text-purple-400 mt-2">{"{ \"stageId\": \"stage-closed-won\", \"value\": 15000 }"}</pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="bg-slate-950 border-t border-slate-800 p-4 flex justify-between items-center">
        <span className="text-xs text-slate-500 flex items-center gap-1 font-bold">
          <CheckCircle2 className="text-amber-500 w-3.5 h-3.5" />
          Blueprint Arquitetural Validado com Sucesso
        </span>
        <span className="text-xs text-slate-400 font-mono font-bold">Infraestrutura: Supabase + Vercel Enterprise</span>
      </div>
    </div>
  );
}
