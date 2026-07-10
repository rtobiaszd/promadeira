import React, { useState } from 'react';
import { Lock, ShieldCheck, Key, Settings, UserCheck, AlertTriangle, UserPlus, Trash2, Users } from 'lucide-react';
import { Role, User } from '../types';

interface AcessoViewProps {
  currentRole: Role;
  onChangeRole: (role: Role) => void;
  subdomain: string;
  users: User[];
  onAddUser: (name: string, email: string, role: Role) => void;
  onDeleteUser: (id: string) => void;
  currentTenantId: string;
}

export default function AcessoView({
  currentRole,
  onChangeRole,
  subdomain,
  users,
  onAddUser,
  onDeleteUser,
  currentTenantId,
}: AcessoViewProps) {
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<Role>('agent');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const activeUser = users.find(u => u.role === currentRole && (currentRole === 'master_admin' ? true : u.tenantId === currentTenantId)) || {
    id: 'usr-default',
    name: 'Carlos Alberto Souza',
    email: 'admin@promadeira.com.br',
  };

  const companyUsers = users.filter(u => u.tenantId === currentTenantId);

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

  const handleRegisterUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    onAddUser(newUserName, newUserEmail, newUserRole);
    setSuccessMsg(`Usuário "${newUserName}" cadastrado com sucesso!`);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('agent');
    setTimeout(() => setSuccessMsg(null), 4000);
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
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Controle de Acesso e Usuários</h2>
            <p className="text-slate-400 text-xs mt-0.5 font-medium">Gerencie os perfis de acesso, credenciais e novos membros da equipe da empresa.</p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-800 font-bold animate-fadeIn">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Card & Simulation Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-xs">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 text-sm font-bold uppercase">
                  {activeUser.name.slice(0, 2)}
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

          {/* User Management Section (Dedicada ao Admin da Empresa) */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-600" />
                  Usuários Ativos da Empresa
                </h3>
                <p className="text-slate-400 text-xs mt-0.5 font-medium">Equipe autorizada a acessar este inquilino do SaaS.</p>
              </div>
              <span className="bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold">
                {companyUsers.length} cadastrados
              </span>
            </div>

            <div className="divide-y divide-slate-150">
              {companyUsers.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  Nenhum usuário cadastrado para esta empresa.
                </div>
              ) : (
                companyUsers.map((u) => (
                  <div key={u.id} className="p-4 flex justify-between items-center text-xs hover:bg-slate-50/50 transition">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{u.name}</span>
                        <span className={`text-[8px] font-bold font-mono px-1.5 py-0.5 rounded border uppercase ${
                          u.role === 'admin'
                            ? 'bg-amber-50 text-amber-700 border-amber-100'
                            : u.role === 'manager'
                            ? 'bg-blue-50 text-blue-700 border-blue-100'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        }`}>
                          {u.role === 'admin' ? 'Admin' : u.role === 'manager' ? 'Gerente' : 'Agente'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">{u.email}</p>
                    </div>

                    {currentRole === 'admin' && activeUser.email !== u.email && (
                      <button
                        onClick={() => onDeleteUser(u.id)}
                        className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition cursor-pointer"
                        title="Remover Usuário"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Form to Create Users (Visible/Accessible to Company Admin) */}
          {currentRole === 'admin' ? (
            <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-xs">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Criar Novo Usuário na Empresa</h3>
                  <p className="text-slate-400 text-[11px] mt-0.5">Cadastre novos cargos administrativos ou de atendimento.</p>
                </div>
              </div>

              <form onSubmit={handleRegisterUser} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Nome Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fernando Santos"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-mono font-bold block">E-mail de Acesso</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. fernando@promadeira.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Cargo (Acesso)</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as Role)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-bold"
                  >
                    <option value="manager">Gerente</option>
                    <option value="agent">Agente Atendente</option>
                  </select>
                </div>

                <div className="sm:col-span-3 flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer text-xs"
                  >
                    Cadastrar Usuário
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3 text-slate-500 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Somente usuários com perfil de <strong className="font-bold text-slate-700">Administrador</strong> possuem autorização para criar Gerentes e Agentes de atendimento.</span>
            </div>
          )}
        </div>

        {/* Permissions & Security Stats */}
        <div className="space-y-4">
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

          <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl border border-slate-800 space-y-3 shadow-xs">
            <h4 className="text-[10px] font-extrabold uppercase font-mono text-amber-500 tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Histórico de Acessos Recentes (Audit Trail)
            </h4>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[9px] text-slate-400 space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar">
              <div>-- Auditoria de Autenticações --</div>
              <div className="text-emerald-400">[SUCESSO] login {activeUser.email} - IP: 187.54.92.12</div>
              <div className="text-emerald-400">[SUCESSO] login mfa {activeUser.email}</div>
              <div className="text-slate-500">[INFO] alteração de pipeline por admin</div>
              <div className="text-slate-500">[INFO] nova integração de n8n cadastrada</div>
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
