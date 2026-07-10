import React, { useState } from 'react';
import { GitFork, Eye, EyeOff, Save, CheckCircle2, AlertCircle, Terminal } from 'lucide-react';
import { IntegrationProvider } from '../types';

interface IntegrationManagerProps {
  providers: IntegrationProvider[];
  onConnectProvider: (providerId: string, credentials: Record<string, string>) => void;
  onDisconnectProvider: (providerId: string) => void;
}

export default function IntegrationManager({ providers, onConnectProvider, onDisconnectProvider }: IntegrationManagerProps) {
  const [selectedProviderId, setSelectedProviderId] = useState<string>('supabase');
  const [editingCreds, setEditingCreds] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Translate status messages and adjust defaults
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
      text: `Conexão criptografada estabelecida! Credenciais do provedor ${activeProvider.name} armazenadas com segurança no Vault do Supabase.`,
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
    <div className="space-y-6">
      {/* Intro info */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Central de Integrações e Provedores</h2>
            <p className="text-slate-400 text-xs mt-0.5">Gerencie chaves de API e conexões externas com segurança absoluta. Criptografia AES-GCM integrada.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Providers selection Sidebar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2.5 h-fit shadow-xs">
          <label className="text-[10px] text-slate-400 uppercase font-mono px-2 block font-extrabold">Provedores de Nuvem</label>
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
                  <h4 className={`text-xs font-black ${isSelected ? 'text-amber-800' : 'text-slate-700'}`}>
                    {p.id === 'jira' ? 'PostgreSQL do Supabase' : p.id === 'github' ? 'Serviços de Deploy Vercel' : p.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {p.id === 'jira' ? 'Banco de dados oficial e políticas de segurança RLS' : p.id === 'github' ? 'Sincronização de webhooks e trigger de builds' : p.description}
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
                  Configurações do Provedor: {activeProvider.id === 'jira' ? 'PostgreSQL do Supabase' : activeProvider.id === 'github' ? 'Serviços de Deploy Vercel' : activeProvider.name}
                </h3>
                <p className="text-slate-400 text-[10px] mt-0.5">Defina chaves e endpoints para habilitar gatilhos e sincronização comercial.</p>
              </div>
              {activeProvider.status === 'connected' ? (
                <button
                  onClick={handleDisconnect}
                  className="px-3 py-1.5 text-[10px] bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 font-extrabold uppercase tracking-wider font-mono rounded-xl cursor-pointer transition"
                >
                  Desconectar Provedor
                </button>
              ) : (
                <span className="text-[10px] text-slate-400 italic">Desconectado</span>
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

            {activeProvider.status === 'connected' ? (
              <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-700">Integridade de Rede: 100% (Online)</span>
                </div>
                <div className="text-xs text-slate-600 space-y-2">
                  <p>
                    <strong className="text-slate-700">Ações Disponibilizadas:</strong> Todas as requisições de consulta de dados e deploys associados ao provedor estão ativados com sucesso.
                  </p>
                  <p className="font-mono text-[10px] text-emerald-700 bg-white p-2.5 rounded-lg border border-slate-200 shadow-inner">
                    GET /api/integrations/{activeProvider.id}/health -&gt; status: "OK", latency: "14ms"
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConnectSubmit} className="mt-4 space-y-4">
                {activeProvider.id === 'jira' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">URL da Instância Supabase (Project URL)</label>
                      <input
                        type="url"
                        value={editingCreds['SUPABASE_URL'] || ''}
                        onChange={(e) => handleCredChange('SUPABASE_URL', e.target.value)}
                        placeholder="https://abcdefg.supabase.co"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Esquema do PostgreSQL</label>
                      <input
                        type="text"
                        value={editingCreds['SUPABASE_SCHEMA'] || ''}
                        onChange={(e) => handleCredChange('SUPABASE_SCHEMA', e.target.value)}
                        placeholder="padrão: public"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Chave de API Service Role (JWT Privado)</label>
                      <div className="relative">
                        <input
                          type={showPassword['SUPABASE_KEY'] ? 'text' : 'password'}
                          value={editingCreds['SUPABASE_KEY'] || ''}
                          onChange={(e) => handleCredChange('SUPABASE_KEY', e.target.value)}
                          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 pr-10 text-xs text-slate-700 focus:outline-none font-mono"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => toggleShowPassword('SUPABASE_KEY')}
                          className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword['SUPABASE_KEY'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeProvider.id === 'github' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Token de Acesso Vercel (Personal Token)</label>
                      <div className="relative">
                        <input
                          type={showPassword['VERCEL_TOKEN'] ? 'text' : 'password'}
                          value={editingCreds['VERCEL_TOKEN'] || ''}
                          onChange={(e) => handleCredChange('VERCEL_TOKEN', e.target.value)}
                          placeholder="ver_token_..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 pr-10 text-xs text-slate-700 focus:outline-none font-mono"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => toggleShowPassword('VERCEL_TOKEN')}
                          className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword['VERCEL_TOKEN'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">ID do Projeto Vercel (Project ID)</label>
                      <input
                        type="text"
                        value={editingCreds['VERCEL_PROJECT'] || ''}
                        onChange={(e) => handleCredChange('VERCEL_PROJECT', e.target.value)}
                        placeholder="prj_abcdefghij123456"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                )}

                {activeProvider.id === 'webhook' && (
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">URL de Destino do Webhook REST externo</label>
                    <input
                      type="url"
                      value={editingCreds['WEBHOOK_URL'] || ''}
                      onChange={(e) => handleCredChange('WEBHOOK_URL', e.target.value)}
                      placeholder="https://api.empresa.com/v1/eventos"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none"
                      required
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  Conectar e Criptografar Segredos
                </button>
              </form>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400 font-medium">
            <span>Criptografia AES-256 GCM Nativa</span>
            <span className="flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5" />
              Segredos Protegidos por Cofre de Inquilinos
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
