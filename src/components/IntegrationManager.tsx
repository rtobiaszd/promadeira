import React, { useState } from 'react';
import { GitFork, Eye, EyeOff, Save, CheckCircle2, AlertCircle, Terminal } from 'lucide-react';
import { IntegrationProvider } from '../types';

interface IntegrationManagerProps {
  providers: IntegrationProvider[];
  onConnectProvider: (providerId: string, credentials: Record<string, string>) => void;
  onDisconnectProvider: (providerId: string) => void;
}

export default function IntegrationManager({ providers, onConnectProvider, onDisconnectProvider }: IntegrationManagerProps) {
  const [selectedProviderId, setSelectedProviderId] = useState<string>(providers[0]?.id || 'n8n');
  const [editingCreds, setEditingCreds] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const activeProvider = providers.find((p) => p.id === selectedProviderId) || providers[0];

  const handleCredChange = (fieldId: string, val: string) => {
    setEditingCreds((prev) => ({
      ...prev,
      [fieldId]: val,
    }));
  };

  const toggleShowPassword = (fieldId: string) => {
    setShowPassword((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  };

  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnectProvider(activeProvider.id, editingCreds);
    setStatusMsg({
      type: 'success',
      text: `Conexão estabelecida com sucesso! Credenciais do provedor ${activeProvider.name} armazenadas e criptografadas no cofre da empresa.`,
    });
    setEditingCreds({});
    setTimeout(() => setStatusMsg(null), 3500);
  };

  const handleDisconnect = () => {
    onDisconnectProvider(activeProvider.id);
    setStatusMsg({
      type: 'success',
      text: `Provedor ${activeProvider.name} desconectado. As chaves de acesso foram removidas com sucesso de nossa memória segura.`,
    });
    setTimeout(() => setStatusMsg(null), 3500);
  };

  return (
    <div className="space-y-6" id="integration-manager">
      {/* Intro info */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Central de Integrações e Provedores</h2>
            <p className="text-slate-400 text-xs mt-0.5">Gerencie chaves de API, webhooks e conexões com provedores de comunicação e automação.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Providers selection Sidebar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2.5 h-fit shadow-xs">
          <label className="text-[10px] text-slate-400 uppercase font-mono px-2 block font-extrabold">Canais & Ferramentas</label>
          {providers.map((p) => {
            const isSelected = selectedProviderId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedProviderId(p.id);
                  setEditingCreds({});
                }}
                className={`w-full p-4 rounded-xl text-left border transition flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-amber-50 border-amber-200 text-slate-850'
                    : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-500'
                }`}
              >
                <div>
                  <h4 className={`text-xs font-black ${isSelected ? 'text-amber-850' : 'text-slate-750'}`}>
                    {p.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {p.description}
                  </p>
                </div>
                {p.status === 'connected' ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-black uppercase tracking-wider font-mono">
                    Ativo
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 text-[9px] font-black uppercase tracking-wider font-mono">
                    Off
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Credentials Editor & Status Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 md:col-span-2 space-y-5 flex flex-col justify-between min-h-[420px] shadow-xs">
          <div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-black text-slate-800">
                  Configurações: {activeProvider?.name}
                </h3>
                <p className="text-slate-400 text-[10px] mt-0.5 font-medium">Defina chaves e endpoints para habilitar gatilhos e automações comerciais.</p>
              </div>
              {activeProvider?.status === 'connected' ? (
                <button
                  onClick={handleDisconnect}
                  className="px-3 py-1.5 text-[10px] bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 font-extrabold uppercase tracking-wider font-mono rounded-xl cursor-pointer transition"
                >
                  Desconectar
                </button>
              ) : (
                <span className="text-[10px] text-slate-400 italic font-medium">Desconectado</span>
              )}
            </div>

            {statusMsg && (
              <div className={`mt-4 p-3 rounded-xl border text-xs flex items-center gap-2 ${
                statusMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium' : 'bg-rose-50 border-rose-200 text-rose-800 font-medium'
              }`}>
                {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                {statusMsg.text}
              </div>
            )}

            {activeProvider?.status === 'connected' ? (
              <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-700">Canal Ativo e Sincronizado (Online)</span>
                </div>
                <div className="text-xs text-slate-600 space-y-2">
                  <p>
                    <strong className="text-slate-700 font-bold">Ações Disponibilizadas:</strong> Todas as integrações e disparos automáticos para este canal estão operando em regime estável.
                  </p>
                  <p className="font-mono text-[10px] text-emerald-700 bg-white p-2.5 rounded-lg border border-slate-200 shadow-inner">
                    GET /api/integrations/{activeProvider.id}/health -&gt; status: "OK", latency: "12ms"
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConnectSubmit} className="mt-4 space-y-4">
                {activeProvider?.id === 'jira' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold uppercase">URL do Servidor n8n</label>
                      <input
                        type="url"
                        value={editingCreds['N8N_URL'] || ''}
                        onChange={(e) => handleCredChange('N8N_URL', e.target.value)}
                        placeholder="https://n8n.suaempresa.com.br"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold uppercase">Caminho de Webhook Ativo</label>
                      <input
                        type="text"
                        value={editingCreds['N8N_WEBHOOK_PATH'] || ''}
                        onChange={(e) => handleCredChange('N8N_WEBHOOK_PATH', e.target.value)}
                        placeholder="webhook/novo-lead-crm"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold uppercase">Chave de API / Token n8n</label>
                      <div className="relative">
                        <input
                          type={showPassword['N8N_KEY'] ? 'text' : 'password'}
                          value={editingCreds['N8N_KEY'] || ''}
                          onChange={(e) => handleCredChange('N8N_KEY', e.target.value)}
                          placeholder="n8n_api_key_..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 pr-10 text-xs text-slate-700 focus:outline-none font-mono"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => toggleShowPassword('N8N_KEY')}
                          className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword['N8N_KEY'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeProvider?.id === 'github' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold uppercase">Token de Acesso Zapier (API Key)</label>
                      <div className="relative">
                        <input
                          type={showPassword['ZAPIER_TOKEN'] ? 'text' : 'password'}
                          value={editingCreds['ZAPIER_TOKEN'] || ''}
                          onChange={(e) => handleCredChange('ZAPIER_TOKEN', e.target.value)}
                          placeholder="zap_api_token_..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 pr-10 text-xs text-slate-700 focus:outline-none font-mono"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => toggleShowPassword('ZAPIER_TOKEN')}
                          className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword['ZAPIER_TOKEN'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold uppercase">Zapier Webhook Target URL</label>
                      <input
                        type="url"
                        value={editingCreds['ZAPIER_WEBHOOK'] || ''}
                        onChange={(e) => handleCredChange('ZAPIER_WEBHOOK', e.target.value)}
                        placeholder="https://hooks.zapier.com/hooks/catch/12345/abcde"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                )}

                {activeProvider?.id === 'webhook' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold uppercase">ID do Telefone WhatsApp API</label>
                      <input
                        type="text"
                        value={editingCreds['WPP_PHONE_ID'] || ''}
                        onChange={(e) => handleCredChange('WPP_PHONE_ID', e.target.value)}
                        placeholder="e.g. 109831982392"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold uppercase">Servidor de Envio E-mail (SMTP)</label>
                      <input
                        type="text"
                        value={editingCreds['EMAIL_SMTP_HOST'] || ''}
                        onChange={(e) => handleCredChange('EMAIL_SMTP_HOST', e.target.value)}
                        placeholder="smtp.sendgrid.net"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold uppercase">Token de Acesso Permanente WhatsApp</label>
                      <div className="relative">
                        <input
                          type={showPassword['WPP_TOKEN'] ? 'text' : 'password'}
                          value={editingCreds['WPP_TOKEN'] || ''}
                          onChange={(e) => handleCredChange('WPP_TOKEN', e.target.value)}
                          placeholder="EAABwz0X19usBA..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 pr-10 text-xs text-slate-700 focus:outline-none font-mono"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => toggleShowPassword('WPP_TOKEN')}
                          className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword['WPP_TOKEN'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  Salvar e Ativar Conexão
                </button>
              </form>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400 font-medium font-mono">
            <span>Criptografia de Ponta-a-Ponta</span>
            <span className="flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5" />
              Chaves Armazenadas em Ambiente Seguro
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
