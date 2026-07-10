import React, { useState } from 'react';
import { Lock, ShieldCheck, Key, Settings, UserCheck, AlertTriangle } from 'lucide-react';
import { Role } from '../types';

interface AcessoViewProps {
  currentRole: Role;
  onChangeRole: (role: Role) => void;
  subdomain: string;
}

export default function AcessoView({ currentRole, onChangeRole, subdomain }: AcessoViewProps) {
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [showTokenPayload, setShowTokenPayload] = useState(false);

  const activeUser = {
    id: 'usr_81239281',
    name: 'Carlos Alberto Souza',
    email: 'carlos@promadeira.com.br',
    phone: '+55 11 99876-1234',
  };

  const permissionsList: Record<Role, string[]> = {
    master_admin: [
      'Visão Geral Consolidada da Plataforma (CEO)',
      'Gerenciamento Global de Empresas (Tenants)',
      'Configurações Globais de Gateway (WhatsApp, Email)',
      'Relatórios de Faturamento da Plataforma',
      'Configuração de Políticas e Limites do Sistema'
    ],
    admin: [
      'Configuração de Integrações do Tenant',
      'Configuração de Fluxos de Automação',
      'Configuração de Pipelines e Etapas do CRM',
      'Gerenciamento de Usuários e Atendentes',
      'Visualização Completa de Relatórios de Venda'
    ],
    manager: [
      'Visualização do Funil CRM e Negócios',
      'Edição de Contatos e Leads do CRM',
      'Acesso à Caixa Unificada (WhatsApp/Email)',
      'Agendamentos de Compromissos na Agenda',
      'Visualização Parcial de Relatórios de Vendas'
    ],
    agent: [
      'Acesso à Caixa Unificada (Atendimento ao Cliente)',
      'Movimentação de Cards no CRM das suas próprias contas',
      'Criação de Contatos e Clientes',
      'Visualização de Agenda de Atendimentos Pessoais'
    ]
  };

  return (
    <div className="space-y-6" id="view-acesso">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Controle de Acesso e Permissões</h2>
            <p className="text-slate-400 text-xs mt-0.5">Gerencie os perfis de acesso, credenciais e políticas de segurança dos usuários de sua empresa.</p>
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
              <button 
                onClick={() => setMfaEnabled(!mfaEnabled)}
                className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono transition cursor-pointer border ${
                  mfaEnabled 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {mfaEnabled ? 'MFA AUTENTICADO' : 'MFA DESATIVADO'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[9px] text-slate-400 uppercase block font-mono font-bold">Subdomínio de Acesso (Inquilino)</span>
                <span className="font-mono font-bold text-slate-800 block mt-0.5">https://{subdomain}.smartdatabi.com.br</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[9px] text-slate-400 uppercase block font-mono font-bold">Cargo / Perfil de Acesso</span>
                <span className="font-mono font-bold text-amber-700 block mt-0.5 uppercase font-black">
                  {currentRole === 'master_admin' ? 'ADMIN MASTER (CEO)' : currentRole === 'admin' ? 'ADMINISTRADOR' : currentRole === 'manager' ? 'GERENTE' : 'AGENTE'}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs pt-2">
              <label className="text-[10px] text-slate-400 font-mono font-bold uppercase block">Troca de Perfil de Usuário (Simulador de Ambientes)</label>
              <div className="flex flex-wrap gap-2">
                {(['master_admin', 'admin', 'manager', 'agent'] as Role[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => onChangeRole(role)}
                    className={`px-3 py-1.5 rounded-lg border font-bold text-[10px] uppercase font-mono cursor-pointer transition ${
                      currentRole === role
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    {role === 'master_admin' ? 'Master (CEO)' : role === 'admin' ? 'Administrador' : role === 'manager' ? 'Gerente' : 'Agente'}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 leading-normal italic mt-1.5">
                * Mudar o perfil altera instantaneamente suas permissões e libera recursos adicionais no menu lateral do sistema.
              </p>
            </div>
          </div>

          {/* Active Security Permissions Map */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3.5 shadow-xs">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Permissões Ativas para Perfil Atual
            </h3>
            <div className="space-y-2">
              {permissionsList[currentRole]?.map((perm, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium py-1.5 px-3 bg-slate-50 rounded-lg border border-slate-200/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  {perm}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Stats */}
        <div className="space-y-4">
          <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl border border-slate-800 space-y-3 shadow-xs">
            <h4 className="text-[10px] font-extrabold uppercase font-mono text-amber-500 tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Histórico de Acessos Recentes (Audit Trail)
            </h4>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[9px] text-slate-400 space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar">
              <div>-- Auditoria de Autenticações --</div>
              <div className="text-emerald-400">[SUCESSO] login carlos@promadeira.com.br - IP: 187.54.92.12 - 08:31</div>
              <div className="text-emerald-400">[SUCESSO] login mfa carlos@promadeira.com.br - 08:31</div>
              <div className="text-slate-500">[INFO] alteração de pipeline por admin - 08:15</div>
              <div className="text-slate-500">[INFO] nova integração de n8n cadastrada - 07:44</div>
              <div className="text-emerald-400">[SUCESSO] login elena@rostovadesigns.org - IP: 200.19.82.44 - 07:12</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2.5 text-xs shadow-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wide font-mono flex items-center gap-1">
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              Políticas de Segurança do Portal
            </h4>
            <div className="space-y-2">
              <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between">
                <span className="text-slate-600 font-medium text-[11px]">Complexidade de Senha</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">ALTA</span>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between">
                <span className="text-slate-600 font-medium text-[11px]">Sessão Ativa Máxima</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded font-bold font-mono">12 HORAS</span>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between">
                <span className="text-slate-600 font-medium text-[11px]">Bloqueio de IP Suspeito</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">ATIVO</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
