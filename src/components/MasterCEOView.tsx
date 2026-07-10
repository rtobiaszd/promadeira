import React, { useState } from 'react';
import { Building2, TrendingUp, Users, Cpu, ShieldAlert, Plus, CheckCircle, Search, Settings, ArrowUpRight, BarChart3, AlertCircle } from 'lucide-react';
import { Tenant, User, Role } from '../types';

interface MasterCEOViewProps {
  tenants: Tenant[];
  onAddTenant: (name: string, subdomain: string, adminName?: string, adminEmail?: string) => void;
  currentRole: string;
  users?: User[];
}

export default function MasterCEOView({ tenants, onAddTenant, currentRole, users = [] }: MasterCEOViewProps) {
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantSubdomain, setNewTenantSubdomain] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Platform global configs
  const [globalLimits, setGlobalLimits] = useState({
    maxWhatsAppMessages: 10000,
    maxWorkflowsPerTenant: 50,
    rateLimitPerMinute: 60,
  });

  const [activeTab, setActiveTab] = useState<'tenants' | 'limits' | 'metrics' | 'db_connect'>('tenants');

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName || !newTenantSubdomain || !newAdminName || !newAdminEmail) return;
    
    onAddTenant(
      newTenantName, 
      newTenantSubdomain.toLowerCase().replace(/\s+/g, '-'),
      newAdminName,
      newAdminEmail
    );
    setStatusMsg(`Empresa "${newTenantName}" provisionada com o administrador "${newAdminName}" criado com sucesso!`);
    setNewTenantName('');
    setNewTenantSubdomain('');
    setNewAdminName('');
    setNewAdminEmail('');
    setShowAddModal(false);
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subdomain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6" id="master-ceo-dashboard">
      {/* CEO Alert Banner if not in master_admin role */}
      {currentRole !== 'master_admin' && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-center gap-3 text-amber-900 text-xs font-bold shadow-xs">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="uppercase tracking-wider">Modo de Segurança Ativo</p>
            <p className="text-slate-500 text-[11px] font-medium mt-0.5">
              Esta é uma visão restrita reservada apenas ao cargo de <span className="text-amber-700">ADMIN MASTER (CEO)</span>. Altere seu perfil de usuário no topo para navegar livremente por esta área.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-600 text-white shadow-md">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Visão Geral Master & CEO da Plataforma</h2>
            <p className="text-slate-400 text-xs mt-0.5">Visão consolidada multi-tenant, provisionamento de empresas e parametrização geral.</p>
          </div>
        </div>
        {currentRole === 'master_admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Nova Empresa (Tenant)
          </button>
        )}
      </div>

      {statusMsg && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          {statusMsg}
        </div>
      )}

      {/* Consolidated Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Faturamento Total SaaS</span>
            <span className="p-1 rounded-lg bg-emerald-50 text-emerald-600"><TrendingUp className="w-3.5 h-3.5" /></span>
          </div>
          <div className="text-slate-800 font-black text-lg">R$ 142.500,00 <span className="text-xs font-bold text-emerald-600 font-sans">/mês</span></div>
          <p className="text-[10px] text-slate-400 leading-normal font-medium">ARR total consolidado da plataforma.</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Empresas (Tenants)</span>
            <span className="p-1 rounded-lg bg-amber-50 text-amber-600"><Building2 className="w-3.5 h-3.5" /></span>
          </div>
          <div className="text-slate-800 font-black text-lg">{tenants.length} Ativas</div>
          <p className="text-[10px] text-slate-400 leading-normal font-medium">Isolamento total por subdomínio.</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Volume de Disparos API</span>
            <span className="p-1 rounded-lg bg-blue-50 text-blue-600"><Cpu className="w-3.5 h-3.5" /></span>
          </div>
          <div className="text-slate-800 font-black text-lg">152k <span className="text-xs font-bold text-slate-400">mensais</span></div>
          <p className="text-[10px] text-slate-400 leading-normal font-medium">WhatsApp e e-mails disparados.</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Clientes Finais</span>
            <span className="p-1 rounded-lg bg-purple-50 text-purple-600"><Users className="w-3.5 h-3.5" /></span>
          </div>
          <div className="text-slate-800 font-black text-lg">24.500</div>
          <p className="text-[10px] text-slate-400 leading-normal font-medium">Contatos totais nos bancos isolados.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-px flex-wrap">
        <button
          onClick={() => setActiveTab('tenants')}
          className={`pb-3 text-xs font-extrabold uppercase tracking-wider transition cursor-pointer px-1 border-b-2 ${
            activeTab === 'tenants' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Empresas Contratantes
        </button>
        <button
          onClick={() => setActiveTab('limits')}
          className={`pb-3 text-xs font-extrabold uppercase tracking-wider transition cursor-pointer px-1 border-b-2 ${
            activeTab === 'limits' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Limites Globais SaaS
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`pb-3 text-xs font-extrabold uppercase tracking-wider transition cursor-pointer px-1 border-b-2 ${
            activeTab === 'metrics' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Distribuição de Recursos
        </button>
        <button
          onClick={() => setActiveTab('db_connect')}
          className={`pb-3 text-xs font-extrabold uppercase tracking-wider transition cursor-pointer px-1 border-b-2 ${
            activeTab === 'db_connect' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Conexão de Banco (ADMIN/CEO)
        </button>
      </div>

      {/* Tenants Management Tab */}
      {activeTab === 'tenants' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Buscar empresa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-700 focus:outline-none"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              <span className="text-slate-400 text-xs font-mono font-medium">{filteredTenants.length} de {tenants.length} empresas</span>
            </div>

            <div className="divide-y divide-slate-150">
              {filteredTenants.map((t) => {
                const tenantAdmin = users.find((u) => u.tenantId === t.id && u.role === 'admin');
                return (
                  <div key={t.id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50 transition">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-sm">{t.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-200/50 text-[9px] text-amber-800 font-extrabold uppercase font-mono">
                          GOLD PLAN
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <span>Inquilino:</span>
                        <strong className="text-slate-600 font-bold">https://{t.subdomain}.smartdatabi.com.br</strong>
                      </div>
                      
                      {/* Admin User Info */}
                      <div className="text-[11px] text-slate-500 font-medium flex flex-wrap items-center gap-1 mt-1.5">
                        <span className="font-bold text-slate-600">Admin Criado:</span>
                        {tenantAdmin ? (
                          <span className="bg-amber-50 text-amber-800 border border-amber-200/50 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                            {tenantAdmin.name} ({tenantAdmin.email})
                          </span>
                        ) : (
                          <span className="text-rose-500 font-mono text-[10px] italic">Sem administrador</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-5 text-xs">
                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 uppercase block font-mono">Integrações</span>
                        <span className="font-bold text-slate-700 font-mono">3 / 3 ativas</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 uppercase block font-mono">Conversas / dia</span>
                        <span className="font-bold text-slate-700 font-mono">~350 chats</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 uppercase block font-mono">Status Faturamento</span>
                        <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-extrabold border border-emerald-100">
                          EM DIA
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Global Limits Configuration Tab */}
      {activeTab === 'limits' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4 md:col-span-2">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Configurações de Quotas de Uso</h3>
              <p className="text-slate-400 text-xs mt-0.5">Defina limites globais do sistema que limitam os recursos que cada empresa pode configurar.</p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-700">Disparos de Mensagens por Empresa (mês)</span>
                  <span className="font-mono text-amber-700">{globalLimits.maxWhatsAppMessages.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="1000"
                  value={globalLimits.maxWhatsAppMessages}
                  onChange={(e) => setGlobalLimits({ ...globalLimits, maxWhatsAppMessages: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-700">Limite de Workflows Ativos por Empresa</span>
                  <span className="font-mono text-amber-700">{globalLimits.maxWorkflowsPerTenant} fluxos</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  value={globalLimits.maxWorkflowsPerTenant}
                  onChange={(e) => setGlobalLimits({ ...globalLimits, maxWorkflowsPerTenant: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-700">Limite Geral de Requisições por Minuto</span>
                  <span className="font-mono text-amber-700">{globalLimits.rateLimitPerMinute} reqs/min</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  step="10"
                  value={globalLimits.rateLimitPerMinute}
                  onChange={(e) => setGlobalLimits({ ...globalLimits, rateLimitPerMinute: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setStatusMsg('Parametrizações globais atualizadas com sucesso para todos os inquilinos!')}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
              >
                Salvar Parâmetros Globais
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Infraestrutura Monolítica</h4>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2.5 text-xs text-slate-600">
              <p>Nossa arquitetura utiliza uma única máquina virtual com instanciamento sob demanda isolado logicamente.</p>
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] font-medium text-slate-500">
                  <span>Uso de CPU do Servidor</span>
                  <span className="font-mono text-emerald-600 font-bold">14%</span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: '14%' }}></div>
                </div>
              </div>
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] font-medium text-slate-500">
                  <span>Consumo de Memória</span>
                  <span className="font-mono text-emerald-600 font-bold">422MB / 1GB</span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: '42.2%' }}></div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 p-3 bg-blue-50 text-blue-800 rounded-xl text-[11px] leading-relaxed border border-blue-100">
              <AlertCircle className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
              <span>O isolamento de banco de dados por empresa é gerenciado logicamente via colunas tenant_id indexadas.</span>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Consolidation Tab */}
      {activeTab === 'metrics' && (
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-5">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Distribuição de Tráfego Omnicanal</h3>
            <p className="text-slate-400 text-xs mt-0.5 font-medium">Métricas de canais em tempo real consolidadas de todas as empresas integradas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-700">Canais de WhatsApp</span>
                <span className="text-emerald-600 font-bold">82% do tráfego</span>
              </div>
              <div className="h-2 bg-slate-250 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: '82%' }}></div>
              </div>
              <span className="text-[10px] text-slate-400 block">WhatsApp domina as comunicações comerciais integradas.</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-700">Canais de E-mail</span>
                <span className="text-amber-600 font-bold">15% do tráfego</span>
              </div>
              <div className="h-2 bg-slate-250 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full" style={{ width: '15%' }}></div>
              </div>
              <span className="text-[10px] text-slate-400 block">E-mails utilizados para envio de faturas e orçamentos estruturados.</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-700">Telegram & Outros</span>
                <span className="text-blue-600 font-bold">3% do tráfego</span>
              </div>
              <div className="h-2 bg-slate-250 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: '3%' }}></div>
              </div>
              <span className="text-[10px] text-slate-400 block">Canais de retaguarda adicionais acionados sob demanda.</span>
            </div>
          </div>
        </div>
      )}

      {/* Database Connection Settings Tab */}
      {activeTab === 'db_connect' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-5 md:col-span-2">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Configurações de Conexão com o PostgreSQL</h3>
              <p className="text-slate-400 text-xs mt-0.5">Parâmetros confidenciais da infraestrutura de banco de dados relacional (Prisma ORM).</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Banco de Dados Relacional</label>
                <input
                  type="text"
                  readOnly
                  value="PostgreSQL (Google Cloud SQL)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-500 font-bold focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Endereço do Host (Host Name)</label>
                <input
                  type="text"
                  readOnly
                  value="gcp-sql-prod.postgres.database.azure.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-500 font-mono font-bold focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Nome do Banco (Database Name)</label>
                <input
                  type="text"
                  readOnly
                  value="omnilead_prod"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-500 font-mono font-bold focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Porta de Conexão</label>
                <input
                  type="text"
                  readOnly
                  value="5432"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-500 font-mono font-bold focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Usuário de Acesso (Username)</label>
                <input
                  type="text"
                  readOnly
                  value="omnilead_admin"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-500 font-mono font-bold focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Senha de Acesso</label>
                <input
                  type="password"
                  readOnly
                  value="••••••••••••••••••••••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-500 font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-2 text-xs">
              <span className="font-bold text-slate-700 block">Isolamento Multi-Tenant Lógico</span>
              <p className="text-slate-400 leading-normal">
                Todas as tabelas do esquema relacional possuem uma coluna chave <code className="bg-slate-250 px-1 py-0.5 rounded font-mono font-bold text-slate-800 text-[10px]">tenant_id</code> indexada. As consultas SQL executadas pelo Prisma ORM aplicam filtros rígidos de inquilinato para assegurar isolamento absoluto de dados entre as empresas.
              </p>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-400 font-medium">Acesso restrito apenas ao Administrador Master / CEO.</span>
              <button
                onClick={() => setStatusMsg('Conexão com o banco de dados PostgreSQL testada com sucesso! Latência: 4ms.')}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer animate-pulse"
              >
                Testar Conexão Ativa
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Status de Infraestrutura</h4>
              
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-400 font-medium">Status do Servidor</span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <strong className="text-emerald-700 font-bold uppercase text-[10px]">OPERANTE</strong>
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-400 font-medium">Pool de Conexões</span>
                  <strong className="text-slate-700 font-mono font-bold">14 / 100 ativas</strong>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-400 font-medium">Criptografia SSL</span>
                  <span className="px-2 py-0.5 rounded bg-violet-50 text-violet-700 text-[10px] font-extrabold border border-violet-100 uppercase font-mono">
                    ATIVA (TLSv1.3)
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5">
                  <span className="text-slate-400 font-medium">Backups Automáticos</span>
                  <strong className="text-slate-700 font-bold">Diários (03:00 UTC)</strong>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 text-slate-300 p-4 rounded-2xl shadow-xs space-y-2 text-xs">
              <span className="font-bold text-white block">Política de Backup &amp; Resiliência</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Toda a infraestrutura é replicada em zonas redundantes e monitorada continuamente. O backup pontual está habilitado para recuperação instantânea em caso de desastre.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add Tenant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide">Nova Empresa (Tenant)</h3>
              <p className="text-slate-400 text-xs mt-0.5">Cadastre uma nova empresa e automatize a geração de subdomínio e banco isolado.</p>
            </div>
            <form onSubmit={handleCreateTenant} className="p-5 space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2.5 border-b border-slate-100 pb-1">1. Dados da Empresa</h4>
                <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1 font-bold">Nome Fantasia da Empresa</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Madeira Nobre do Sul"
                  value={newTenantName}
                  onChange={(e) => setNewTenantName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1 font-bold">Subdomínio Identificador</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    required
                    placeholder="e.g. madeiranobre"
                    value={newTenantSubdomain}
                    onChange={(e) => setNewTenantSubdomain(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-l-xl py-2 px-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                  <span className="bg-slate-100 border border-l-0 border-slate-200 text-slate-500 py-2 px-3 rounded-r-xl font-mono text-[10px] font-bold">
                    .smartdatabi.com.br
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal italic mt-1">
                  * Apenas caracteres alfanuméricos e hifens.
                </p>
              </div>

              <div className="pt-2">
                <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2.5 border-b border-slate-100 pb-1">2. Primeiro Usuário Administrador</h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1 font-bold">Nome Completo do Admin</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Roberto de Almeida"
                      value={newAdminName}
                      onChange={(e) => setNewAdminName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1 font-bold">E-mail de Acesso do Admin</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. roberto@empresa.com.br"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-500 font-bold hover:text-slate-850 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  Criar e Provisionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
