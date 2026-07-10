import React, { useState } from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  Columns,
  GitFork,
  Calendar,
  Users,
  Terminal,
  BookOpen,
  UserCheck,
  Building2,
  Workflow,
  Truck,
  Package,
  Receipt,
  Coins,
  ShoppingBag,
  Headphones,
  Settings,
  FileText,
  Hash,
  Lock,
  LogOut
} from 'lucide-react';
import { Tenant, Role, EntryPoint, Pipeline, Deal, Workflow as WorkflowType, IntegrationProvider, Contact, Appointment, InboundLog, StageAction, WorkflowNode, User } from './types';

// Views
import DashboardView from './components/DashboardView';
import InboxView from './components/InboxView';
import CrmPipelineView from './components/CrmPipelineView';
import WorkflowEditor from './components/WorkflowEditor';
import IntegrationManager from './components/IntegrationManager';
import CalendarScheduler from './components/CalendarScheduler';
import ContactsView from './components/ContactsView';
import LogIngestionView from './components/LogIngestionView';
import SaaSBlueprintDoc from './components/SaaSBlueprintDoc';
import MasterCEOView from './components/MasterCEOView';
import LoginView from './components/LoginView';

// New Views from Legacy Sidebar Navigation
import RequisicaoCompraView from './components/RequisicaoCompraView';
import ComissoesVendasView from './components/ComissoesVendasView';
import RomaneiosView from './components/RomaneiosView';
import EstoqueView from './components/EstoqueView';
import FinanceiroView from './components/FinanceiroView';
import SmartdeskView from './components/SmartdeskView';
import CadastrosView from './components/CadastrosView';
import HistoricoView from './components/HistoricoView';
import ContadoresView from './components/ContadoresView';
import AcessoView from './components/AcessoView';

export default function App() {
  // Navigation
  const [currentView, setCurrentView] = useState<
    | 'dashboard'
    | 'inbox'
    | 'crm'
    | 'workflows'
    | 'integrations'
    | 'calendar'
    | 'contacts'
    | 'logs'
    | 'blueprint'
    | 'requisicao_compra'
    | 'comissoes_vendas'
    | 'romaneios'
    | 'estoque'
    | 'financeiro_apagar'
    | 'financeiro_areceber'
    | 'smartdesk'
    | 'cadastros'
    | 'historico_romaneios'
    | 'historico_ordens'
    | 'contador_romaneio'
    | 'contador_ordem'
    | 'acesso_usuario'
    | 'master_ceo'
  >('dashboard');

  // Navigation Bar Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Multi-tenant States (Editable by CEO)
  const [tenants, setTenants] = useState<Tenant[]>([
    { id: 'tenant-1', name: 'ProMadeira Ltda', subdomain: 'promadeira' },
    { id: 'tenant-2', name: 'SmartData BI Solutions', subdomain: 'smartdatabi' },
  ]);
  const [currentTenantId, setCurrentTenantId] = useState<string>('tenant-1');
  const currentTenant = tenants.find((t) => t.id === currentTenantId) || tenants[0];

  // Users State
  const [users, setUsers] = useState<User[]>([
    { id: 'usr-1', name: 'Carlos Alberto Souza', email: 'admin@promadeira.com.br', role: 'admin', tenantId: 'tenant-1' },
    { id: 'usr-2', name: 'Juliana Mendes', email: 'gerente@promadeira.com.br', role: 'manager', tenantId: 'tenant-1' },
    { id: 'usr-3', name: 'Marcos Atendente', email: 'atendente@promadeira.com.br', role: 'agent', tenantId: 'tenant-1' },
    { id: 'usr-4', name: 'Elena Rostova', email: 'admin@smartdatabi.com.br', role: 'admin', tenantId: 'tenant-2' },
  ]);

  const handleAddTenant = (name: string, subdomain: string, adminName?: string, adminEmail?: string) => {
    const newTenantId = `tenant-${Date.now()}`;
    setTenants((prev) => [
      ...prev,
      {
        id: newTenantId,
        name,
        subdomain,
      },
    ]);

    if (adminName && adminEmail) {
      setUsers((prev) => [
        ...prev,
        {
          id: `usr-${Date.now()}`,
          name: adminName,
          email: adminEmail,
          role: 'admin',
          tenantId: newTenantId,
        },
      ]);
    }
  };

  const handleAddUser = (name: string, email: string, role: Role) => {
    setUsers((prev) => [
      ...prev,
      {
        id: `usr-${Date.now()}`,
        name,
        email,
        role,
        tenantId: currentTenantId,
      },
    ]);
  };

  const handleDeleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  // User Roles Simulation States
  const roles: Role[] = ['master_admin', 'admin', 'manager', 'agent'];
  const [currentRole, setCurrentRole] = useState<Role>('admin');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authenticatedEmail, setAuthenticatedEmail] = useState<string>('admin@promadeira.com.br');

  // Unified channels EntryPoints State
  const [entryPoints, setEntryPoints] = useState<EntryPoint[]>([
    {
      id: 'ep-1',
      tenantId: 'tenant-1',
      channel: 'whatsapp',
      name: 'Central de Atendimento ProMadeira',
      identifier: '+55 (11) 99876-1234',
      status: 'active',
      chatbotMode: 'hybrid',
      chatbotConfig: {
        aiPrompt: 'Você é o consultor de vendas inteligente da ProMadeira. Identifique o plano ideal de madeira (Premium vs Standard) e se o orçamento for maior de R$5.000, indique que encaminhará para o consultor humano (estágio de Negociação).',
        menuFlow: {
          initialStepId: 'step-start',
          steps: {
            'step-start': {
              id: 'step-start',
              text: 'Seja bem-vindo à ProMadeira! Selecione uma opção:\n1 - Catálogo de Madeira Nobre\n2 - Falar com Consultor\n3 - Agendar Visita Técnica',
              options: [
                { key: '1', label: 'Ver Planos', nextStepId: 'step-plans' },
                { key: '2', label: 'Falar com Consultor', moveToStageId: 'stage-negotiating' },
                { key: '3', label: 'Agendar Horário' },
              ],
            },
          },
        },
      },
      mappedPipelineId: 'pipe-sales-1',
      mappedStageId: 'stage-new',
    },
    {
      id: 'ep-2',
      tenantId: 'tenant-1',
      channel: 'email',
      name: 'Suporte & Orçamentos',
      identifier: 'vendas@promadeira.com.br',
      status: 'active',
      chatbotMode: 'ai',
      chatbotConfig: {
        aiPrompt: 'Você é o assistente de orçamentos da ProMadeira. Ajude respondendo sobre pranchas de pinus autoclavado e eucalipto.',
      },
      mappedPipelineId: 'pipe-sales-1',
      mappedStageId: 'stage-new',
    },
  ]);

  // CRM Pipelines State
  const [pipelines, setPipelines] = useState<Pipeline[]>([
    {
      id: 'pipe-sales-1',
      name: 'Funil de Vendas Promadeira',
      stages: [
        {
          id: 'stage-new',
          name: 'Novo Lead',
          order: 1,
          automation: {
            onEnterActions: [
              { type: 'send_message', config: { text: 'Olá! Recebemos seu interesse em madeira sob demanda. Seu contato foi registrado no CRM!' } },
            ],
            conditions: [],
          },
        },
        {
          id: 'stage-negotiating',
          name: 'Negociação ativa',
          order: 2,
          automation: {
            onEnterActions: [
              { type: 'create_jira_issue', config: { summary: 'Sincronizar Lead com ERP Geral', projectKey: 'ERP' } },
            ],
            conditions: [],
          },
        },
        {
          id: 'stage-closed',
          name: 'Closed-Won (Fechado)',
          order: 3,
          automation: {
            onEnterActions: [
              { type: 'call_webhook', config: { url: 'https://api.empresa.com/v1/integrations/workflow', method: 'POST' } },
            ],
            conditions: [],
          },
        },
      ],
    },
  ]);

  // CRM Deals State
  const [deals, setDeals] = useState<Deal[]>([
    {
      id: 'deal-1',
      title: 'Lote Pinus Autoclavado 40m³',
      contactName: 'João Silva',
      contactPhone: '+55 11 99876-1234',
      value: 12500,
      pipelineId: 'pipe-sales-1',
      stageId: 'stage-new',
      createdAt: '2026-07-10',
      updatedAt: '2026-07-10',
      metadata: {},
    },
    {
      id: 'deal-2',
      title: 'Fornecimento Eucalipto Tratado',
      contactName: 'Carlos Souza',
      contactPhone: '+55 19 98877-6655',
      value: 4500,
      pipelineId: 'pipe-sales-1',
      stageId: 'stage-negotiating',
      createdAt: '2026-07-09',
      updatedAt: '2026-07-10',
      metadata: {},
    },
  ]);

  // Workflow State Machine configs
  const [workflows, setWorkflows] = useState<WorkflowType[]>([
    {
      id: 'wf-lead-onboarding',
      name: 'Roteamento WhatsApp Lead Alto Valor',
      description: 'Verifica orçamentos de chats recebidos via Gemini e envia alertas no canal comercial VIP',
      isActive: true,
      triggerType: 'message_received',
      triggerConfig: {},
      startNodeId: 'node-1',
      nodes: {
        'node-1': {
          id: 'node-1',
          type: 'trigger',
          name: 'WhatsApp Mensagem de Entrada',
          config: {},
          nextId: 'node-2',
        },
        'node-2': {
          id: 'node-2',
          type: 'ai',
          name: 'Classificar Valor via Gemini',
          config: {
            prompt: 'Identifique o orçamento estimado para fornecimento de madeira na conversa. Retorne um campo JSON "orcamento".',
            outputKey: 'aiResult',
          },
          nextId: 'node-3',
        },
        'node-3': {
          id: 'node-3',
          type: 'condition',
          name: 'Orçamento Maior que R$ 5.000',
          config: {
            field: 'aiResult.orcamento',
            operator: 'greater_than',
            compareValue: 5000,
            trueId: 'node-4',
            falseId: 'node-5',
          },
        },
        'node-4': {
          id: 'node-4',
          type: 'action',
          name: 'Notificar Canal VIP',
          config: {
            providerId: 'webhook',
            url: 'https://hooks.slack.com/services/VIP',
            body: '🔥 Alerta de Lead Premium: {{contactName}} com orçamento estimado maior que R$ 5.000.',
          },
        },
        'node-5': {
          id: 'node-5',
          type: 'action',
          name: 'Enviar Catálogo Padrão',
          config: {
            providerId: 'whatsapp',
            text: 'Olá! Segue nosso catálogo de madeiras tratadas.',
          },
        },
      },
    },
  ]);

  // Pluggable integration providers mapped around external services
  const [providers, setProviders] = useState<IntegrationProvider[]>([
    {
      id: 'zapier',
      name: 'Integração Zapier',
      description: 'Conecte leads e envie webhooks para milhares de ferramentas através do Zapier.',
      icon: 'zap',
      status: 'connected',
      credentials: { ZAPIER_WEBHOOK_URL: 'https://hooks.zapier.com/hooks/catch/...' },
      supportedActions: [
        { id: 'call_webhook', name: 'Enviar Webhook Zapier', fields: [{ id: 'url', label: 'URL do Webhook', type: 'text' }] },
      ],
    },
    {
      id: 'n8n',
      name: 'Integração n8n',
      description: 'Dispare fluxos de automação auto-hospedados ou na nuvem no n8n.',
      icon: 'git-pull-request',
      status: 'not_connected',
      credentials: {},
      supportedActions: [
        { id: 'trigger_workflow', name: 'Disparar Workflow n8n', fields: [{ id: 'workflow_id', label: 'ID do Fluxo', type: 'text' }] },
      ],
    },
    {
      id: 'webhook',
      name: 'Webhooks REST Externos',
      description: 'Dispare chamadas HTTP POST, GET ou PUT estruturadas para sistemas de faturamento.',
      icon: 'webhook',
      status: 'connected',
      credentials: { WEBHOOK_URL: 'https://api.promadeira.com.br/financeiro/faturar' },
      supportedActions: [
        { id: 'webhook_call', name: 'Chamar Endpoint POST', fields: [{ id: 'url', label: 'URL de Destino', type: 'text' }] },
      ],
    },
  ]);

  // Contacts DB
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 'contact-1',
      name: 'João Silva',
      email: 'joao.silva@woodworks.com',
      phone: '+55 11 99876-1234',
      companyName: 'Movelaria Silva S/A',
      tags: ['marceneiro', 'premium-wood', 'vip'],
      notes: 'Marceneiro profissional interessado em eucalipto seco em estufa para móveis finos.',
    },
    {
      id: 'contact-2',
      name: 'Elena Rostova',
      email: 'elena@rostovadesigns.org',
      phone: '+55 11 90123-4567',
      companyName: 'Rostova Architectural Panels',
      tags: ['exportação', 'pinus'],
    },
    {
      id: 'contact-3',
      name: 'Carlos Souza',
      email: 'carlos@souzaesquadrias.com.br',
      phone: '+55 19 98877-6655',
      companyName: 'Souza Esquadrias de Madeira',
      tags: ['eucalipto', 'lead-onboarding'],
    },
  ]);

  // Appointments State
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'appt-1',
      title: 'Alinhamento Comercial Lote Pinus',
      contactId: 'contact-1',
      date: '2026-07-12',
      time: '14:00',
      durationMinutes: 45,
      notes: 'Apresentação das amostras tratadas em autoclave e condições de pagamento.',
    },
  ]);

  // Ingestion Webhook Logs State
  const [logs, setLogs] = useState<InboundLog[]>([
    {
      id: 'log-1',
      timestamp: '10:42',
      source: 'Monitoramento Alerta Servidor',
      payload: JSON.stringify({ type: 'alerta_infraestrutura', servidor: 'instancia-promadeira-producao', uso_disco_porcento: 92, telefone_administrador: '+55 11 99876-1234' }, null, 2),
      workflowStatus: 'success',
    },
  ]);

  // Actions implementations
  const handleMoveDeal = (dealId: string, targetStageId: string) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stageId: targetStageId, updatedAt: new Date().toISOString() } : d))
    );
  };

  const handleMoveDealStage = (contactName: string, stageId: string) => {
    setDeals((prev) =>
      prev.map((d) => (d.contactName === contactName ? { ...d, stageId, updatedAt: new Date().toISOString() } : d))
    );
  };

  const handleUpdateStageAutomation = (pipelineId: string, stageId: string, actions: StageAction[]) => {
    setPipelines((prev) =>
      prev.map((p) => {
        if (p.id === pipelineId) {
          return {
            ...p,
            stages: p.stages.map((s) => (s.id === stageId ? { ...s, automation: { onEnterActions: actions, conditions: [] } } : s)),
          };
        }
        return p;
      })
    );
  };

  const handleUpdateWorkflowNode = (workflowId: string, nodeId: string, updatedNode: WorkflowNode) => {
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === workflowId) {
          return {
            ...w,
            nodes: {
              ...w.nodes,
              [nodeId]: updatedNode,
            },
          };
        }
        return w;
      })
    );
  };

  const handleConnectProvider = (providerId: string, credentials: Record<string, string>) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, credentials, status: 'connected' } : p))
    );
  };

  const handleDisconnectProvider = (providerId: string) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, credentials: {}, status: 'not_connected' } : p))
    );
  };

  const handleAddAppointment = (appt: { title: string; contactId: string; date: string; time: string }) => {
    const newAppt: Appointment = {
      id: `appt-${Date.now()}`,
      title: appt.title,
      contactId: appt.contactId,
      date: appt.date,
      time: appt.time,
      durationMinutes: 30,
    };
    setAppointments([newAppt, ...appointments]);
  };

  const handleAddContact = (c: Omit<Contact, 'id'>) => {
    const newC: Contact = {
      id: `contact-${Date.now()}`,
      ...c,
    };
    setContacts([newC, ...contacts]);
  };

  // Database Query Translation Simulation (Filters client-side state dynamically)
  const filteredSearchDeals = searchQuery.trim() === '' ? [] : deals.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.contactPhone && d.contactPhone.includes(searchQuery))
  );

  const filteredSearchContacts = searchQuery.trim() === '' ? [] : contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone && c.phone.includes(searchQuery))
  );

  const filteredSearchWorkflows = searchQuery.trim() === '' ? [] : workflows.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasSearchQuery = searchQuery.trim() !== '';

  if (!isAuthenticated) {
    return (
      <LoginView
        tenants={tenants}
        onLoginSuccess={(tenantId, role, email) => {
          setCurrentTenantId(tenantId);
          setCurrentRole(role);
          setAuthenticatedEmail(email);
          setIsAuthenticated(true);
          // Set a default view the role has access to
          if (role === 'master_admin') {
            setCurrentView('master_ceo');
          } else if (role === 'agent') {
            setCurrentView('inbox');
          } else {
            setCurrentView('dashboard');
          }
        }}
        userEmailMetadata="sb4fun88@gmail.com"
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {/* Top command & global header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40 px-6 py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-white font-black shadow-sm">
            P
          </div>
          <div>
            <span className="text-[10px] text-amber-600 font-extrabold uppercase tracking-wider font-mono">
              Plataforma SaaS Omnicanal
            </span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-slate-800 tracking-tight">PRO<span className="text-amber-600">MADEIRA</span></span>
              <span className="text-slate-300">|</span>
              <span className="text-xs font-semibold text-slate-500 tracking-tight">Console de Orquestração</span>
            </div>
          </div>
        </div>

        {/* Unified Search Input Form with Material layout classes & styles requested */}
        <form className="navbar-form esconder" style={{ marginRight: '20px' }} onSubmit={(e) => e.preventDefault()}>
          <span className="bmd-form-group">
            <div className="input-group no-border relative flex items-center bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-amber-500/30 focus-within:border-amber-500 transition duration-150">
              <input 
                type="text" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="form-control bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none w-44 sm:w-56 font-bold" 
                placeholder="Pesquisar..." 
              />
              <button type="submit" className="btn btn-white btn-round btn-just-icon p-1 hover:bg-white rounded-lg text-slate-500 hover:text-amber-600 cursor-pointer transition">
                <span className="material-icons text-sm block">🔍</span>
                <div className="ripple-container"></div>
              </button>

              {/* Floating Real-time Results Overlay */}
              {isSearchFocused && hasSearchQuery && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 text-slate-200 rounded-2xl p-4 shadow-2xl z-50 text-xs space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="font-extrabold text-[10px] text-amber-500 uppercase tracking-wider font-mono flex items-center gap-1.5 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Resposta do Servidor (Banco de Dados)
                    </span>
                    <button 
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setIsSearchFocused(false);
                      }}
                      className="text-[10px] text-slate-400 hover:text-white uppercase font-mono font-bold cursor-pointer"
                    >
                      Fechar
                    </button>
                  </div>

                  {/* API and Database logs */}
                  <div className="space-y-1.5 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 font-mono text-[9px] text-slate-400">
                    <div className="text-emerald-400 font-bold">
                      GET /api/search?q={encodeURIComponent(searchQuery)} - 200 OK (18ms)
                    </div>
                    <div className="text-amber-400 mt-1">
                      Filtro de busca aplicado nas coleções ativas de dados.
                    </div>
                    <div className="text-slate-500">
                      Registros encontrados: {filteredSearchDeals.length + filteredSearchContacts.length + filteredSearchWorkflows.length}
                    </div>
                  </div>

                  {/* Results Listings */}
                  <div className="max-h-[220px] overflow-y-auto custom-scrollbar space-y-3">
                    {/* Contacts results */}
                    {filteredSearchContacts.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block border-b border-slate-800 pb-1">Contatos</span>
                        {filteredSearchContacts.map(c => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setCurrentView('contacts');
                              setIsSearchFocused(false);
                            }}
                            className="w-full text-left p-2 hover:bg-slate-800/60 rounded-lg flex justify-between items-center transition cursor-pointer"
                          >
                            <div>
                              <span className="font-bold text-white block">{c.name}</span>
                              <span className="text-[10px] text-slate-500 block font-mono">{c.phone}</span>
                            </div>
                            <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-mono font-bold border border-amber-500/20">IR</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Deals results */}
                    {filteredSearchDeals.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block border-b border-slate-800 pb-1">Negócios (CRM)</span>
                        {filteredSearchDeals.map(d => (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => {
                              setCurrentView('crm');
                              setIsSearchFocused(false);
                            }}
                            className="w-full text-left p-2 hover:bg-slate-800/60 rounded-lg flex justify-between items-center transition cursor-pointer"
                          >
                            <div>
                              <span className="font-bold text-white block truncate max-w-[200px]">{d.title}</span>
                              <span className="text-[10px] text-slate-500 block font-mono">Valor: R$ {d.value.toLocaleString()}</span>
                            </div>
                            <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-mono font-bold border border-amber-500/20">IR</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Workflows results */}
                    {filteredSearchWorkflows.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block border-b border-slate-800 pb-1">Fluxos (Workflows)</span>
                        {filteredSearchWorkflows.map(w => (
                          <button
                            key={w.id}
                            type="button"
                            onClick={() => {
                              setCurrentView('workflows');
                              setIsSearchFocused(false);
                            }}
                            className="w-full text-left p-2 hover:bg-slate-800/60 rounded-lg flex justify-between items-center transition cursor-pointer"
                          >
                            <div>
                              <span className="font-bold text-white block truncate max-w-[200px]">{w.name}</span>
                              <span className="text-[10px] text-slate-500 block font-mono">Gatilho: {w.triggerType}</span>
                            </div>
                            <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-mono font-bold border border-amber-500/20">IR</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {filteredSearchContacts.length === 0 && filteredSearchDeals.length === 0 && filteredSearchWorkflows.length === 0 && (
                      <div className="text-center py-4 text-slate-500 font-medium italic">
                        Nenhum registro encontrado para "{searchQuery}"
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </span>
        </form>

        {/* Global Multi-tenant & Roles read-only indicators */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Tenant Read-only Badge */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-xl text-xs">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Inquilino:</span>
            <span className="text-slate-800 font-bold">
              {currentRole === 'master_admin' ? 'OmniLead Global' : currentTenant.name}
            </span>
          </div>

          {/* User Role Read-only Badge */}
          <div className={`flex items-center gap-1.5 border py-1.5 px-3 rounded-xl text-xs font-semibold ${
            currentRole === 'master_admin'
              ? 'bg-violet-50 border-violet-200 text-violet-700'
              : currentRole === 'admin'
              ? 'bg-amber-50 border-amber-200 text-amber-700'
              : currentRole === 'manager'
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}>
            <UserCheck className="w-3.5 h-3.5" />
            <span>Nível:</span>
            <span className="uppercase font-bold">
              {currentRole === 'master_admin' ? 'CEO MASTER ADMIN' : currentRole === 'admin' ? 'ADMINISTRADOR' : currentRole === 'manager' ? 'GERENTE' : 'AGENTE'}
            </span>
          </div>

          {/* Active User & Logout */}
          <div className="flex items-center gap-2.5 border-l border-slate-200 pl-3">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-[11px] font-bold text-slate-800 max-w-[150px] truncate" title={authenticatedEmail}>{authenticatedEmail}</span>
              <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider">Acesso Autenticado</span>
            </div>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setSearchQuery('');
              }}
              title="Encerrar Sessão Segura (Logout)"
              className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-50 border border-rose-150 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container workspace panel */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left main vertical navigation */}
        <aside className="w-full md:w-64 border-r border-slate-200 bg-white p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-4 max-h-[72vh] overflow-y-auto pr-1.5 custom-scrollbar">
            {/* Category CEO Master Admin */}
            {currentRole === 'master_admin' && (
              <div className="space-y-1">
                <span className="text-[9px] text-violet-600 uppercase font-mono tracking-wider font-bold px-2.5">Master CEO Admin</span>
                <button onClick={() => setCurrentView('master_ceo')} className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${currentView === 'master_ceo' ? 'bg-violet-600 text-white shadow-xs font-semibold' : 'text-violet-600 hover:bg-violet-50 bg-violet-50/10 border border-violet-100/50'}`}>
                  <span className="flex items-center gap-2.5"><Building2 className="w-4 h-4 shrink-0" />Controle Multi-Tenant</span>
                </button>
              </div>
            )}

            {/* Category 1: Painéis & Mensagens */}
            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider font-bold px-2.5">Painéis e Mensagens</span>
              {currentRole !== 'agent' && (
                <button onClick={() => setCurrentView('dashboard')} className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${currentView === 'dashboard' ? 'bg-amber-600 text-white shadow-xs font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <span className="flex items-center gap-2.5"><LayoutDashboard className="w-4 h-4 shrink-0" />Painel Geral</span>
                </button>
              )}
              <button onClick={() => setCurrentView('inbox')} className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${currentView === 'inbox' ? 'bg-amber-600 text-white shadow-xs font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>
                <span className="flex items-center gap-2.5"><MessageSquare className="w-4 h-4 shrink-0" />Caixa Unificada</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${currentView === 'inbox' ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-700'}`}>WPP</span>
              </button>
              <button onClick={() => setCurrentView('calendar')} className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${currentView === 'calendar' ? 'bg-amber-600 text-white shadow-xs font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>
                <span className="flex items-center gap-2.5"><Calendar className="w-4 h-4 shrink-0" />Agenda Comercial</span>
              </button>
            </div>

            {/* Category 2: CRM & Clientes */}
            {currentRole !== 'master_admin' && (
              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider font-bold px-2.5">CRM & Clientes</span>
                <button onClick={() => setCurrentView('contacts')} className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${currentView === 'contacts' ? 'bg-amber-600 text-white shadow-xs font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <span className="flex items-center gap-2.5"><Users className="w-4 h-4 shrink-0" />Clientes</span>
                </button>
                <button onClick={() => setCurrentView('crm')} className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${currentView === 'crm' ? 'bg-amber-600 text-white shadow-xs font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <span className="flex items-center gap-2.5"><Columns className="w-4 h-4 shrink-0" />CRM Funis Kanban</span>
                </button>
                {currentRole !== 'agent' && (
                  <button onClick={() => setCurrentView('comissoes_vendas')} className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${currentView === 'comissoes_vendas' ? 'bg-amber-600 text-white shadow-xs font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>
                    <span className="flex items-center gap-2.5"><Coins className="w-4 h-4 shrink-0" />Comissões Vendas</span>
                  </button>
                )}
              </div>
            )}

            {/* Category 3: Produção & Pátio */}
            {(currentRole === 'admin' || currentRole === 'manager') && (
              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider font-bold px-2.5">Produção & Pátio</span>
                {currentRole === 'admin' && (
                  <button onClick={() => setCurrentView('requisicao_compra')} className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${currentView === 'requisicao_compra' ? 'bg-amber-600 text-white shadow-xs font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>
                    <span className="flex items-center gap-2.5"><ShoppingBag className="w-4 h-4 shrink-0" />Requisição Compra</span>
                  </button>
                )}
                <button onClick={() => setCurrentView('romaneios')} className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${currentView === 'romaneios' ? 'bg-amber-600 text-white shadow-xs font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <span className="flex items-center gap-2.5"><Truck className="w-4 h-4 shrink-0" />Romaneios</span>
                </button>
                <button onClick={() => setCurrentView('estoque')} className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${currentView === 'estoque' ? 'bg-amber-600 text-white shadow-xs font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <span className="flex items-center gap-2.5"><Package className="w-4 h-4 shrink-0" />Estoque</span>
                </button>
              </div>
            )}

            {/* Category 4: Financeiro & Suporte */}
            {currentRole === 'admin' && (
              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider font-bold px-2.5">Financeiro & Suporte</span>
                <button onClick={() => setCurrentView('financeiro_apagar')} className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${currentView === 'financeiro_apagar' ? 'bg-amber-600 text-white shadow-xs font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <span className="flex items-center gap-2.5"><Receipt className="w-4 h-4 shrink-0" />Contas a Pagar</span>
                </button>
                <button onClick={() => setCurrentView('financeiro_areceber')} className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${currentView === 'financeiro_areceber' ? 'bg-amber-600 text-white shadow-xs font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <span className="flex items-center gap-2.5"><Receipt className="w-4 h-4 shrink-0" />Contas a Receber</span>
                </button>
                <button onClick={() => setCurrentView('smartdesk')} className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${currentView === 'smartdesk' ? 'bg-amber-600 text-white shadow-xs font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <span className="flex items-center gap-2.5"><Headphones className="w-4 h-4 shrink-0" />Smartdesk</span>
                </button>
              </div>
            )}

            {/* Category 5: Configs & Histórico */}
            {currentRole !== 'agent' && (
              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider font-bold px-2.5">Configs & Histórico</span>
                {currentRole !== 'master_admin' && (
                  <button onClick={() => setCurrentView('cadastros')} className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${currentView === 'cadastros' ? 'bg-amber-600 text-white shadow-xs font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>
                    <span className="flex items-center gap-2.5"><Settings className="w-4 h-4 shrink-0" />Cadastros Gerais</span>
                  </button>
                )}
                {currentRole !== 'master_admin' && (
                  <button onClick={() => setCurrentView('historico_romaneios')} className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${currentView === 'historico_romaneios' ? 'bg-amber-600 text-white shadow-xs font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>
                    <span className="flex items-center gap-2.5"><FileText className="w-4 h-4 shrink-0" />Histórico Romaneios</span>
                  </button>
                )}
                {currentRole === 'admin' && (
                  <button onClick={() => setCurrentView('historico_ordens')} className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${currentView === 'historico_ordens' ? 'bg-amber-600 text-white shadow-xs font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>
                    <span className="flex items-center gap-2.5"><FileText className="w-4 h-4 shrink-0" />Histórico Compras</span>
                  </button>
                )}
                {currentRole !== 'master_admin' && (
                  <button onClick={() => setCurrentView('contador_romaneio')} className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${currentView === 'contador_romaneio' ? 'bg-amber-600 text-white shadow-xs font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>
                    <span className="flex items-center gap-2.5"><Hash className="w-4 h-4 shrink-0" />Contador Romaneio</span>
                  </button>
                )}
                {currentRole === 'admin' && (
                  <button onClick={() => setCurrentView('contador_ordem')} className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${currentView === 'contador_ordem' ? 'bg-amber-600 text-white shadow-xs font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>
                    <span className="flex items-center gap-2.5"><Hash className="w-4 h-4 shrink-0" />Contador Compra</span>
                  </button>
                )}
                {(currentRole === 'master_admin' || currentRole === 'admin') && (
                  <button onClick={() => setCurrentView('acesso_usuario')} className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${currentView === 'acesso_usuario' ? 'bg-amber-600 text-white shadow-xs font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>
                    <span className="flex items-center gap-2.5"><Lock className="w-4 h-4 shrink-0" />Acesso: Usuário</span>
                  </button>
                )}
              </div>
            )}

            {/* Category 6: Developer Tools */}
            {(currentRole === 'master_admin' || currentRole === 'admin') && (
              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider font-bold px-2.5">Plataforma & Dev</span>
                <button onClick={() => setCurrentView('workflows')} className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${currentView === 'workflows' ? 'bg-amber-600 text-white shadow-xs font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <span className="flex items-center gap-2.5"><Workflow className="w-4 h-4 shrink-0" />Fluxos n8n/Zapier</span>
                </button>
                <button onClick={() => setCurrentView('integrations')} className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${currentView === 'integrations' ? 'bg-amber-600 text-white shadow-xs font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <span className="flex items-center gap-2.5"><GitFork className="w-4 h-4 shrink-0" />Integrações APIs</span>
                </button>
                <button onClick={() => setCurrentView('logs')} className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${currentView === 'logs' ? 'bg-amber-600 text-white shadow-xs font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <span className="flex items-center gap-2.5"><Terminal className="w-4 h-4 shrink-0" />Logs Webhooks</span>
                </button>
                <button onClick={() => setCurrentView('blueprint')} className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${currentView === 'blueprint' ? 'bg-amber-600 text-white shadow-xs font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <span className="flex items-center gap-2.5"><BookOpen className="w-4 h-4 shrink-0" />Manual Arquitetura</span>
                </button>
              </div>
            )}
          </div>

          {/* Persistent container system diagnostic footer */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-[10px] space-y-2 shadow-xs">
            <div className="flex justify-between items-center text-slate-500">
              <span className="font-semibold">Status do Servidor</span>
              <span className="text-emerald-600 font-extrabold font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                ONLINE
              </span>
            </div>
            <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full w-full" />
            </div>
            <p className="text-slate-400 leading-normal italic font-serif text-[9px]">
              "SaaS Multi-tenant Monolithic Blueprint Ativo"
            </p>
          </div>
        </aside>

        {/* Dynamic content rendering grid */}
        <main className="flex-1 p-6 overflow-y-auto custom-scrollbar max-w-7xl mx-auto w-full">
          {currentView === 'dashboard' && <DashboardView currentTenant={currentTenant} />}
          {currentView === 'inbox' && (
            <InboxView
              entryPoints={entryPoints}
              contacts={contacts}
              onAddAppointment={handleAddAppointment}
              onMoveDealStage={handleMoveDealStage}
            />
          )}
          {currentView === 'crm' && (
            <CrmPipelineView
              pipelines={pipelines}
              deals={deals}
              onMoveDeal={handleMoveDeal}
              onUpdateStageAutomation={handleUpdateStageAutomation}
            />
          )}
          {currentView === 'workflows' && (
            <WorkflowEditor workflows={workflows} onUpdateWorkflowNode={handleUpdateWorkflowNode} />
          )}
          {currentView === 'integrations' && (
            <IntegrationManager
              providers={providers}
              onConnectProvider={handleConnectProvider}
              onDisconnectProvider={handleDisconnectProvider}
            />
          )}
          {currentView === 'calendar' && <CalendarScheduler appointments={appointments} contacts={contacts} />}
          {currentView === 'contacts' && <ContactsView contacts={contacts} onAddContact={handleAddContact} />}
          {currentView === 'logs' && <LogIngestionView logs={logs} onTriggerLogWorkflow={() => {}} />}
          {currentView === 'blueprint' && <SaaSBlueprintDoc />}
          {currentView === 'master_ceo' && (
            <MasterCEOView
              tenants={tenants}
              onAddTenant={handleAddTenant}
              currentRole={currentRole}
              users={users}
            />
          )}

          {/* Legacy navigation views */}
          {currentView === 'requisicao_compra' && <RequisicaoCompraView />}
          {currentView === 'comissoes_vendas' && <ComissoesVendasView />}
          {currentView === 'romaneios' && <RomaneiosView />}
          {currentView === 'estoque' && <EstoqueView />}
          {currentView === 'financeiro_apagar' && <FinanceiroView initialSubView="apagar" />}
          {currentView === 'financeiro_areceber' && <FinanceiroView initialSubView="areceber" />}
          {currentView === 'smartdesk' && <SmartdeskView />}
          {currentView === 'cadastros' && <CadastrosView />}
          {currentView === 'historico_romaneios' && <HistoricoView initialSubView="romaneios" />}
          {currentView === 'historico_ordens' && <HistoricoView initialSubView="ordens" />}
          {currentView === 'contador_romaneio' && <ContadoresView initialSubView="romaneio" />}
          {currentView === 'contador_ordem' && <ContadoresView initialSubView="ordem" />}
          {currentView === 'acesso_usuario' && (
            <AcessoView
              currentRole={currentRole}
              onChangeRole={setCurrentRole}
              subdomain={currentTenant.subdomain}
              users={users}
              onAddUser={handleAddUser}
              onDeleteUser={handleDeleteUser}
              currentTenantId={currentTenantId}
            />
          )}
        </main>
      </div>
    </div>
  );
}
