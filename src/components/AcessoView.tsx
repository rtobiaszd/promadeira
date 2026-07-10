import React, { useState } from 'react';
import { Lock, User, ShieldAlert, Key, Building, CheckCircle, HelpCircle } from 'lucide-react';
import { Role } from '../types';

interface AcessoViewProps {
  currentRole: Role;
  onChangeRole: (role: Role) => void;
  subdomain: string;
}

export default function AcessoView({ currentRole, onChangeRole, subdomain }: AcessoViewProps) {
  const [tokenExp, setTokenExp] = useState('2026-07-11T12:00:00Z');
  const [showTokenPayload, setShowTokenPayload] = useState(false);

  // Simulated active user
  const activeUser = {
    id: 'usr_81239281',
    name: 'Carlos Alberto Souza',
    email: 'carlos@promadeira.com.br',
    phone: '+55 11 99876-1234',
    mfaEnabled: true,
  };

  const rlsRules = [
    {
      table: 'wood_manifests',
      policy: 'tenants_isolation_policy',
      status: 'enabled',
      expression: 'tenant_id = auth.jwt() ->> "tenant_id"',
    },
    {
      table: 'financial_ledger',
      policy: 'managers_only_ledger_access',
      status: 'enabled',
      expression: 'auth.jwt() ->> "role" IN ("admin", "manager")',
    },
    {
      table: 'commissions',
      policy: 'representatives_view_own_commissions',
      status: 'enabled',
      expression: 'rep_email = auth.jwt() ->> "email" OR auth.jwt() ->> "role" = "admin"',
    },
  ];

  return (
    <div className="space-y-6" id="view-acesso">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Acesso do Usuário e Políticas de Segurança (RLS)</h2>
            <p className="text-slate-400 text-xs mt-0.5">Gerenciamento de credenciais JWT, MFA e Row Level Security (RLS) por inquilino no Supabase.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-xs">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 text-sm font-bold">
                  CS
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{activeUser.name}</h3>
                  <p className="text-[10px] text-slate-400 font-mono">{activeUser.email}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold font-mono">
                MFA ATIVADO
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs pt-2">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[9px] text-slate-400 uppercase block font-mono">Inquilino Atual (Tenant Subdomain)</span>
                <span className="font-mono font-bold text-slate-800 block mt-0.5">https://{subdomain}.smartdatabi.com.br</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[9px] text-slate-400 uppercase block font-mono">Nível de Acesso (JWT Claim)</span>
                <span className="font-mono font-bold text-amber-700 block mt-0.5 uppercase">{currentRole}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs pt-1.5">
              <label className="text-[10px] text-slate-400 font-mono font-bold uppercase block">Troca Rápida de Perfil (Simulação Dev)</label>
              <div className="flex flex-wrap gap-2">
                {(['admin', 'manager', 'agent'] as Role[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => onChangeRole(role)}
                    className={`px-3 py-1.5 rounded-lg border font-bold text-[10px] uppercase font-mono cursor-pointer transition ${
                      currentRole === role
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    {role === 'admin' ? 'Administrador' : role === 'manager' ? 'Gerente' : 'Agente'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row Level Security Status */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3.5 shadow-xs">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Políticas RLS Ativas (Supabase Engine)</h3>
            <div className="space-y-2.5">
              {rlsRules.map((rule, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-slate-800 text-[10px] uppercase">TABELA: {rule.table}</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/10 text-[9px] font-bold uppercase font-mono">ATIVADA</span>
                  </div>
                  <div className="text-[10px] text-slate-500">Política: <strong className="text-slate-700">{rule.policy}</strong></div>
                  <div className="bg-slate-950 text-emerald-400 p-2 rounded border border-slate-800 text-[10px] select-all font-bold">
                    {rule.expression}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Token JWT Claims Visualizer */}
        <div className="space-y-4">
          <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl border border-slate-800 space-y-3 shadow-xs">
            <h4 className="text-[10px] font-extrabold uppercase font-mono text-amber-500 tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Visualizador JWT Claims (Supabase Auth)
            </h4>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[9px] text-slate-400 space-y-2 min-h-[140px] overflow-x-auto">
              <div>-- Decoded Access Token --</div>
              <div>{`{`}</div>
              <div className="pl-3">"iss": "https://{subdomain}.supabase.co/auth/v1",</div>
              <div className="pl-3">"sub": "{activeUser.id}",</div>
              <div className="pl-3">"email": "{activeUser.email}",</div>
              <div className="pl-3">"role": "{currentRole}",</div>
              <div className="pl-3">"tenant_id": "tenant-1",</div>
              <div className="pl-3">"exp": 1783684800</div>
              <div>{`}`}</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2.5 text-xs shadow-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wide font-mono">Auditoria do Canal de Acesso</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Cada transação efetuada nos módulos de Financeiro, Romaneios, Comissões e Compras assina digitalmente a requisição enviando o Hash do usuário logado via protocolo seguro do inquilino.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
