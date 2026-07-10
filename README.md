# OmniLead — Plataforma Multi-Tenant SaaS Omnicanal & CRM Inteligente

OmniLead é uma plataforma modular de alta performance projetada para orquestrar canais de comunicação (**WhatsApp, E-mail, Telegram**), chatbot inteligente com inteligência artificial, automação flexível de estágios de CRM no formato Kanban, ingestão reativa de logs e agendamento integrado de visitas e compromissos comerciais.

Este repositório contém o protótipo funcional de alta fidelidade completo (UX de alta densidade + blueprint arquitetural de microsserviços integrados).

---

## 🎯 Objetivo & Casos de Uso

A plataforma serve como um centro unificado de operações comerciais para médias e grandes empresas corporativas (ex: distribuidoras de madeira nobre como a *ProMadeira Ltda*, empresas de BI como *SmartData*, etc.):
1. **Atendimento Centralizado (Unified Inbox):** Consolida conversas de múltiplos canais em uma interface única para operadores humanos.
2. **Chatbots Híbridos:** Responde automaticamente via menu determinístico de opções ou delega inteligência interpretativa ao modelo de linguagem Gemini.
3. **CRM de Alta Conversão:** Gerencia a movimentação visual de leads no Kanban e executa tarefas automáticas em lote toda vez que um negócio troca de estágio.
4. **Motor de Automação Visual (Workflows):** Permite criar fluxos de lógica reativa com gatilhos de tempo, condições lógicas, processamento de dados por IA e disparos de integrações externas (Zapier, n8n, webhooks genéricos).

---

## 🔐 Novidade: Gateway de Login Multi-Tenant & Controle de Identidade

Para garantir a simulação perfeita e realista de um ecossistema SaaS multi-empresas, implementamos um **Portal de Login de Alta Fidelidade** totalmente integrado:

*   **Simulador de Subdomínio Dinâmico:** Ao escolher uma organização (tenant) para logar, o portal simula visualmente a resolução do DNS dedicada para a empresa (ex: `promadeira.omnilead.com.br` ou `smartdatabi.omnilead.com.br`).
*   **Perfis Rápidos de Demonstração:**
    *   **CEO Master Admin:** Usuário global supervisor (`sb4fun88@gmail.com`) com acesso irrestrito para criar novos inquilinos, visualizar MRR de faturamento unificado e monitorar a saúde global.
    *   **Administrador da Empresa:** Gerenciamento administrativo completo dentro da ProMadeira Ltda.
    *   **Gerente de Vendas / CRM:** Edição e calibração de fluxos automáticos e triggers de estágios.
    *   **Agente Atendente:** Foco exclusivo na triagem rápida e resposta de mensagens na Caixa de Entrada Unificada.
*   **Controle de Bloqueio & Logout:** O cabeçalho principal da aplicação exibe a identidade do operador conectado e inclui um botão de fechamento seguro (lock) para retornar à tela de login a qualquer momento.

---

## 🏗️ Visão Geral da Arquitetura

O blueprint adota uma estrutura **monolítica modular** de baixo custo e alta eficiência, otimizada para implantações de baixo recurso (1 única máquina virtual pequena):

```
                        ┌──────────────────────────────────────────┐
                        │        Cliente Web (React + Vite)        │
                        └────────────────────┬─────────────────────┘
                                             │  WebSockets / REST
                                             ▼
                        ┌──────────────────────────────────────────┐
                        │       Servidor Express (server.ts)       │
                        └────────────────────┬─────────────────────┘
                                             │  Isolamento por Tenant
                                             ▼
                        ┌──────────────────────────────────────────┐
                        │        Banco de Dados PostgreSQL         │
                        │      (Isolamento Multi-tenant RLS)       │
                        └──────────────────────────────────────────┘
```

### Módulos Principais do Sistema

1.  **Orquestrador de Canais (EntryPoints):** Mapeia cada número de WhatsApp, token do Telegram ou caixa IMAP para uma empresa (tenant) e define qual fluxo de chatbot responderá por ele.
2.  **Motor Lógico de Workflows:** Lê árvores lógicas complexas salvas em formato JSON de forma recursiva e executa nós sequenciais.
3.  **Cofre de Integrações Seguras (Credentials Vault):** Armazena tokens sensíveis de terceiros com criptografia robusta (AES-256-GCM) no banco de dados.

---

## 🗄️ Esquema de Dados Relacional (PostgreSQL + Prisma)

As tabelas utilizam um identificador comum `tenantId` para garantir o isolamento absoluto de dados usando **Row Level Security (RLS)** direto no PostgreSQL:

```prisma
// Exemplo de política de isolamento para a tabela de Negócios (Deal)
model Deal {
  id           String   @id @default(uuid())
  tenantId     String
  pipelineId   String
  stageId      String
  title        String
  contactName  String
  contactPhone String?
  value        Decimal  @db.Decimal(12, 2)
  metadata     Json     // Configurações e histórico flexíveis
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

Toda consulta de API injeta a variável de ambiente do tenant ativo, garantindo que nenhum operador tenha acesso a dados de outros inquilinos comerciais:
```sql
ALTER TABLE "Deal" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "Deal" 
USING ("tenantId" = current_setting('app.current_tenant_id'));
```

---

## ⚙️ Scripts de Inicialização e Desenvolvimento

O repositório está configurado com ferramentas modernas de compilação rápida utilizando Vite e esbuild para produzir pacotes otimizados para produção:

### Pré-requisitos
*   Node.js v18 ou superior instalado.

### Desenvolvimento Local
Para iniciar o servidor de desenvolvimento e a interface em tempo real:
```bash
npm install
npm run dev
```
O servidor Express subirá escutando na porta padrão unificada `3000` com suporte automático para transpilação TypeScript no ar via `tsx`.

### Compilação de Produção
Para gerar o servidor otimizado em CommonJS e os arquivos estáticos compilados do frontend:
```bash
npm run build
```
O comando gerará o servidor consolidado na pasta `dist/server.cjs` pronto para deployment em containers Cloud Run.

### Executar em Produção
```bash
npm start
```

---

## 🤝 Contribuição e Licença

Desenvolvido com foco em alta fidelidade, design de interface limpo e arquitetura SaaS escalável de microsserviços. 

*Todos os direitos reservados para OmniLead Enterprise Software © 2026.*
