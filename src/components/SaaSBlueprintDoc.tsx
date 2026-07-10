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
              Design de sistema multi-tenant e manual de implementação pronto para produção com nuvem resiliente e PostgreSQL integrado
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
              1. Estrutura UX &amp; Hierarquias de Páginas (Frontend)
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              A plataforma é hospedada de forma ultra-rápida em rede de distribuição global altamente escalável. O painel centralizado foi projetado para operações de alta densidade e multi-inquilinato (multi-tenant), permitindo alternar de forma transparente entre empresas clientes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <h3 className="font-bold text-slate-200 text-sm mb-2">Visões Principais da Aplicação</h3>
                <ul className="space-y-3 text-xs text-slate-400">
                  <li>
                    <strong className="text-slate-200">Painel Operacional:</strong> Indicadores de saúde em tempo real, volume de conversas por canal, faturamento mensal estimado (MRR), contagem de automações executadas e registros de auditoria imediata de eventos do sistema.
                  </li>
                  <li>
                    <strong className="text-slate-200">Caixa de Entrada Unificada:</strong> Tela dividida em três colunas com a lista de chats ativos, linha do tempo da conversa e painel lateral de contexto de leads para mover etapas do funil de vendas e agendar horários em tempo real.
                  </li>
                  <li>
                    <strong className="text-slate-200">Painel de Pipelines CRM (Kanban):</strong> Quadro interativo com suporte para arrastar e soltar (drag-and-drop). Cada estágio possui regras de automação específicas (ex: acionar webhooks, enviar mensagens pelo WhatsApp ou criar tickets).
                  </li>
                  <li>
                    <strong className="text-slate-200">Editor Visual de Workflows:</strong> Interface baseada em nós lógicos para mapeamento de ações que guiam os gatilhos, condições, IA com Gemini e atrasos temporais.
                  </li>
                  <li>
                    <strong className="text-slate-200">Central de Integrações:</strong> Configuração rápida de credenciais seguras para canais de mensageria (WhatsApp, E-mail), ferramentas de automação (Zapier, n8n) e hooks REST.
                  </li>
                  <li>
                    <strong className="text-slate-200">Agenda &amp; Contatos:</strong> Armazenamento estruturado de metadados de leads diretamente conectado ao banco de dados relacional.
                  </li>
                </ul>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-200 text-sm mb-2">Papéis de Usuários &amp; Controle de Acesso</h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-start gap-2">
                      <Shield className="text-violet-500 w-4 h-4 mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-slate-200">Master Admin (CEO da Plataforma):</strong> Acesso administrativo global completo de todos os tenants da plataforma, com estatísticas agregadas de MRR, limites globais de faturamento e criação manual de empresas no sistema.
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Shield className="text-rose-500 w-4 h-4 mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-slate-200">Administrador do Tenant:</strong> Acesso completo ao faturamento, convite de novos usuários de suporte, gerenciamento de credenciais e integrações locais da empresa no sistema.
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
                  O roteador de borda utiliza middleware para isolar subdomínios dinamicamente (ex: <code className="text-amber-400 font-mono">promadeira.seu-saas.com</code>) e encaminhar a requisição com o ID do tenant correto ao banco.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Server className="text-amber-500 w-5 h-5" />
              2. Arquitetura de Serviços Integrada (PostgreSQL + Servidor em Nuvem)
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Consolida o controle de dados no <strong className="text-white">PostgreSQL</strong> com Row-Level Security e utiliza servidores altamente performáticos para atingir tempos de resposta de milissegundos a um custo operacional mínimo.
            </p>

            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <h3 className="font-bold text-slate-200 text-sm mb-2">Princípios Tecnológicos</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400">
                  <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <h4 className="font-bold text-slate-200 mb-1">Isolamento Multi-tenant no Banco</h4>
                    O banco de dados aplica isolamento rigoroso por inquilino nas tabelas através de identificadores estruturais por ID de inquilino. Toda query enviada é filtrada automaticamente, impedindo de forma absoluta o vazamento de dados entre inquilinos (tenants).
                  </div>
                  <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <h4 className="font-bold text-slate-200 mb-1">Execução Serverless &amp; Cloud</h4>
                    As rotas de API, motor de workflows e o proxy da IA Gemini rodam de forma auto-escalável na nuvem do provedor. Não há consumo ocioso de CPU quando o painel não está sendo usado.
                  </div>
                  <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <h4 className="font-bold text-slate-200 mb-1">Tempo Real (Websockets)</h4>
                    Notificações de mensagens instantâneas e a movimentação visual de cards Kanban sincronizam de forma instantânea através de WebSockets resilientes e serviços de broadcast em tempo real.
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
                    <span className="text-amber-400 font-mono text-[10px]">ChatbotService.ts</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded flex justify-between items-center">
                    <span>
                      <strong className="text-slate-200">Orquestrador de Workflows</strong>
                      <span className="text-slate-500 block">Varre as configurações JSON de fluxos salvos. Executa nós recursivamente, aplica condições lógicas e aciona integrações.</span>
                    </span>
                    <span className="text-amber-400 font-mono text-[10px]">WorkflowEngine.ts</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded flex justify-between items-center">
                    <span>
                      <strong className="text-slate-200">Gatilhos PostgreSQL e Webhooks do Sistema</strong>
                      <span className="text-slate-500 block">Dispara requisições HTTP para funções específicas do sistema de automação no momento em que eventos são consolidados.</span>
                    </span>
                    <span className="text-amber-400 font-mono text-[10px]">Database Triggers</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded flex justify-between items-center">
                    <span>
                      <strong className="text-slate-200">Central Segura de Credenciais de Integração</strong>
                      <span className="text-slate-500 block">Armazena de forma criptografada as chaves de API (ex: Zapier, n8n, WhatsApp API, credenciais de E-mail) e as carrega de forma isolada em runtime.</span>
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
              3. Esquema de Banco de Dados PostgreSQL &amp; Prisma ORM (Database Host)
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              A modelagem de dados abaixo foi criada usando o Prisma ORM e mapeia perfeitamente tabelas relacionais eficientes no banco gerenciado PostgreSQL. O uso intensivo de colunas <code className="text-amber-400 font-mono text-xs">Json</code> permite alta flexibilidade para automações personalizadas sem necessidade de migrations repetitivas.
            </p>

            <div className="relative">
              <pre className="bg-slate-950 p-4 rounded-lg text-xs font-mono overflow-x-auto text-emerald-400 border border-slate-800 max-h-[450px]">
{`datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL") // Conexão via Pool (porta 5432)
  directUrl = env("DIRECT_URL")   // Conexão direta para migrations
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

// 2. Autenticação Integrada ao PostgreSQL
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

// 8. Chaves de Integrações com Criptografia Segura
model Integration {
  id          String   @id @default(uuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  providerId  String   // "zapier" | "n8n" | "webhook" | "twilio" | "telegram"
  name        String
  status      String   @default("connected")
  credentials String   // Chaves criptografadas seguras
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
  source     String   // ex: "WhatsApp Webhook", "n8n Trigger Event"
  payload    String   // String do payload original para auditoria
  matchedWorkflowId String?
  status     String   @default("none") // "success" | "failed" | "none"
}`}
              </pre>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs leading-relaxed">
              <span className="text-amber-500 font-bold block mb-1">Como habilitar Row Level Security (RLS) no PostgreSQL:</span>
              <pre className="text-slate-400 font-mono text-[10px] bg-slate-900 p-2 rounded border border-slate-800 mt-1">
{`ALTER TABLE "Deal" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "Deal" 
USING ("tenantId" = current_setting('app.current_tenant_id'));`}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'workflows' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Workflow className="text-amber-500 w-5 h-5" />
              4. Design do Motor de Execução de Workflows
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              O motor de workflows é completamente reativo. Processamentos de rotas em nuvem executam recursivamente os nós lógicos salvos em formato JSON, realizando operações complexas e salvando o estado de progresso das execuções na tabela <code className="text-amber-400 font-mono">InboundLog</code>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-400">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-4">
                <h3 className="font-bold text-slate-200 text-sm">Tipos de Nós do JSON Config</h3>
                <div className="space-y-3">
                  <div className="border-l-2 border-amber-500 pl-3">
                    <strong className="text-slate-200 block">Trigger (Gatilho)</strong>
                    <div>Inicia o fluxo com base em eventos: nova mensagem no WhatsApp, alteração de etapa no Kanban, ou webhook POST.</div>
                  </div>
                  <div className="border-l-2 border-blue-500 pl-3">
                    <strong className="text-slate-200 block">Condition (Condição)</strong>
                    <div>Desvia a árvore de execução com base no valor de variáveis no contexto do lead (ex: valor do pedido &gt; R$ 5.000).</div>
                  </div>
                  <div className="border-l-2 border-violet-500 pl-3">
                    <strong className="text-slate-200 block">AI Logic (Processamento IA)</strong>
                    <div>Processa o payload ou texto do chat com o Gemini para extrair informações importantes em formato JSON estruturado.</div>
                  </div>
                  <div className="border-l-2 border-emerald-500 pl-3">
                    <strong className="text-slate-200 block">Action (Ação Externa)</strong>
                    <div>Efetua chamadas externas de integração como disparos de mensagens do WhatsApp, e-mails comerciais ou disparo de Webhook REST.</div>
                  </div>
                  <div className="border-l-2 border-rose-500 pl-3">
                    <strong className="text-slate-200 block">Delay (Temporizador)</strong>
                    <div>Agenda cronômetros para pausar e retomar a execução do fluxo após minutos, horas ou dias.</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-200 text-sm mb-3">Exemplo de Payload Salvo em "Workflow.nodes"</h3>
                  <pre className="text-emerald-400 font-mono text-[10px] bg-slate-900 p-3 rounded border border-slate-800 max-h-[300px] overflow-y-auto custom-scrollbar">
{`{
  "node_start_1": {
    "id": "node_start_1",
    "type": "trigger",
    "name": "Mensagem Recebida",
    "nextId": "node_ai_2"
  },
  "node_ai_2": {
    "id": "node_ai_2",
    "type": "ai",
    "name": "Classificar com Gemini",
    "config": {
      "prompt": "Identifique o tipo de madeira requisitado e converta para volume em m3.",
      "outputKey": "extracao_ia"
    },
    "nextId": "node_cond_3"
  },
  "node_cond_3": {
    "id": "node_cond_3",
    "type": "condition",
    "name": "Compra Grande?",
    "config": {
      "variable": "extracao_ia.volume_m3",
      "operator": "greater_than",
      "compareValue": 50,
      "trueId": "node_action_alto_volume",
      "falseId": "node_action_padrao"
    }
  },
  "node_action_alto_volume": {
    "id": "node_action_alto_volume",
    "type": "action",
    "name": "Gera Oportunidade Alta Prioridade",
    "config": {
      "providerId": "crm_pipeline",
      "actionId": "create_deal",
      "params": {
        "priority": "high",
        "stage": "stage-new"
      }
    }
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
              <GitFork className="text-amber-500 w-5 h-5" />
              5. Conexão de Integrações (Cofre de Credenciais de Nuvem)
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              O ecossistema utiliza uma estrutura plugável baseada em interfaces abstratas. As chaves de acesso críticas (tokens, urls do banco, API keys de WhatsApp e E-mail, webhooks Zapier/n8n) são salvas com criptografia robusta de nível militar e repassadas de forma segura para as funções do sistema no momento da chamada da API.
            </p>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-4 text-xs text-slate-400">
              <h3 className="font-bold text-slate-200 text-sm">Interface do Provedor de Integração</h3>
              <p>
                Cada provedor de integração deve implementar a interface abaixo para garantir extensibilidade do core comercial do SaaS:
              </p>
              <pre className="text-emerald-400 font-mono text-[10px] bg-slate-900 p-3 rounded border border-slate-800">
{`interface IntegrationProvider {
  id: string;          // ex: "zapier", "n8n", "whatsapp", "email"
  name: string;        // Nome amigável de exibição
  description: string; // Descrição de escopo de automação
  status: 'connected' | 'not_connected' | 'error';
  credentials: Record<string, string>; // Tokens criptografados
  supportedActions: {
    id: string;
    name: string;
    fields: { id: string; label: string; type: 'text' | 'number' | 'boolean' }[];
  }[];
}

export abstract class BaseIntegrationService {
  abstract executeAction(
    tenantId: string, 
    actionId: string, 
    payload: Record<string, any>, 
    decryptedCreds: Record<string, string>
  ): Promise<{ success: boolean; data?: any; error?: string }>;
}`}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'flows' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
              <ArrowRight className="text-amber-500 w-5 h-5" />
              6. Fluxos de Eventos de Ponta a Ponta
            </h2>

            <div className="space-y-4 text-xs text-slate-400">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
                <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <CheckCircle2 className="text-emerald-500 w-4 h-4" />
                  Fluxo de Contato pelo WhatsApp → Registro no CRM → Resposta Inteligente
                </h3>
                <ol className="list-decimal pl-4 space-y-2 leading-relaxed">
                  <li>
                    <span>Um lead envia mensagem de interesse em madeira no WhatsApp: "Preciso de 30 metros cúbicos de eucalipto tratado para entrega na sexta."</span>
                  </li>
                  <li>
                    <span>A API do WhatsApp envia um Webhook POST direcionado ao endpoint <code className="text-amber-400 font-mono">/api/events</code> do SaaS.</span>
                  </li>
                  <li>
                    <span>O sistema recebe o payload, localiza o inquilino dono do canal correspondente e valida a autenticidade da chave.</span>
                  </li>
                  <li>
                    <span>Uma nova linha é criada na tabela de oportunidades (<code className="text-amber-400 bg-slate-900 px-1 py-0.5 rounded">Deal</code>) do banco de dados na coluna "Novo Lead". Os navegadores dos agentes na Caixa Unificada piscam instantaneamente devido ao Canal Realtime do sistema.</span>
                  </li>
                  <li>
                    <span>Simultaneamente, o motor de chatbot é disparado. Como o canal está configurado em <strong className="text-white">Modo Híbrido</strong>, a IA Gemini analisa a mensagem do cliente, extrai as entidades necessárias e classifica que o cliente deseja agendar uma demonstração.</span>
                  </li>
                  <li>
                    <span>A IA sugere horários disponíveis, gera o compromisso na agenda do vendedor e envia uma resposta educada via WhatsApp ao cliente confirmando os dados técnicos de forma humanizada.</span>
                  </li>
                </ol>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
                <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <CheckCircle2 className="text-amber-500 w-4 h-4" />
                  Automação de Logs e Ingestão de Webhooks Externos (ex: Alerta de Servidor)
                </h3>
                <ol className="list-decimal pl-4 space-y-2 leading-relaxed">
                  <li>
                    <span>Um sistema corporativo externo (ex: webhook de inventário ou alerta de pátio) realiza uma chamada de API avisando sobre alteração no estoque de madeira.</span>
                  </li>
                  <li>
                    <span>O evento é persistido imediatamente na tabela <code className="text-blue-400 bg-slate-900 px-1 py-0.5 rounded">InboundLog</code>. O gatilho de insert do banco de dados dispara uma rotina de monitoramento.</span>
                  </li>
                  <li>
                    <span>O motor lógicos de Workflows localiza o fluxo ativo: "Resolução Automática de Sobrecarga/Estoque Crítico".</span>
                  </li>
                  <li>
                    <span>O nó condicional lê o payload JSON do evento e confirma que o limite foi excedido.</span>
                  </li>
                  <li>
                    <span>O motor encaminha o processo para o nó de ação integrado que dispara um e-mail urgente para o gerente de compras e uma mensagem de aviso rápida para o grupo de logística no Telegram.</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Terminal className="text-amber-500 w-5 h-5" />
              7. Especificações de Endpoints REST (API do SaaS)
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Toda a comunicação do frontend com a nuvem é baseada em JSON e autenticada por chaves e tokens nos cabeçalhos de requisição. O gateway unificado isola os escopos de acordo com o inquilino (Tenant) autenticado.
            </p>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-4 text-xs text-slate-400 font-mono">
              <div className="space-y-2">
                <div className="text-slate-200 font-bold border-b border-slate-800 pb-1 flex items-center gap-2 font-sans">
                  <span className="px-2 py-0.5 bg-emerald-600/20 text-emerald-400 rounded text-[10px]">POST</span>
                  <span>/api/events</span>
                </div>
                <div className="font-sans text-slate-400 text-[11px]">Endpoint principal de recepção de webhooks externos. Recebe dados do WhatsApp, Telegram, n8n ou Zapier.</div>
                <pre className="text-emerald-400 bg-slate-900 p-2.5 rounded border border-slate-850 text-[10px]">
{`headers: {
  "Content-Type": "application/json",
  "X-Webhook-Secret": "seu_token_seguro_por_tenant"
}
payload: {
  "source": "whatsapp",
  "contact": "+5511999999999",
  "event_type": "message",
  "message": { "text": "Olá, qual a cotação do eucalipto hoje?" }
}`}
                </pre>
              </div>

              <div className="space-y-2 mt-4">
                <div className="text-slate-200 font-bold border-b border-slate-800 pb-1 flex items-center gap-2 font-sans">
                  <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded text-[10px]">GET</span>
                  <span>/api/conversations</span>
                </div>
                <div className="font-sans text-slate-400 text-[11px]">Busca conversas ativas vinculadas ao inquilino autenticado no sistema. Permite paginação.</div>
              </div>

              <div className="space-y-2 mt-4">
                <div className="text-slate-200 font-bold border-b border-slate-800 pb-1 flex items-center gap-2 font-sans">
                  <span className="px-2 py-0.5 bg-amber-600/20 text-amber-400 rounded text-[10px]">PATCH</span>
                  <span>/api/deals/:id/stage</span>
                </div>
                <div className="font-sans text-slate-400 text-[11px]">Movimenta o negócio no Kanban. Dispara as ações do estágio configuradas no banco de dados da empresa.</div>
                <pre className="text-emerald-400 bg-slate-900 p-2.5 rounded border border-slate-850 text-[10px]">
{`payload: {
  "targetStageId": "stage-negotiating"
}`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-800 bg-slate-950 p-4 flex justify-between items-center px-6">
        <span className="text-xs text-slate-400 font-mono font-bold">Infraestrutura: Nuvem Enterprise Segura</span>
        <span className="text-xs text-slate-400">© 2026 Todos os direitos reservados.</span>
      </div>
    </div>
  );
}
