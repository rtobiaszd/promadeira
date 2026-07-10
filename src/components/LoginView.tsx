import React, { useState } from 'react';
import { Shield, Key, Mail, Building2, User, Globe, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Tenant, Role } from '../types';

interface LoginViewProps {
  tenants: Tenant[];
  onLoginSuccess: (tenantId: string, role: Role, email: string) => void;
  userEmailMetadata?: string;
}

export default function LoginView({ tenants, onLoginSuccess, userEmailMetadata = 'sb4fun88@gmail.com' }: LoginViewProps) {
  const [selectedTenantId, setSelectedTenantId] = useState<string>('tenant-1');
  const [customSubdomain, setCustomSubdomain] = useState<string>('');
  const [role, setRole] = useState<Role>('admin');
  const [email, setEmail] = useState<string>('admin@promadeira.com.br');
  const [password, setPassword] = useState<string>('••••••••');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Predefined users for quick testing/demo
  const loginPresets = [
    {
      title: 'CEO Master Admin',
      email: userEmailMetadata,
      role: 'master_admin' as Role,
      tenantId: 'tenant-1', // Will ignore tenant level isolation
      description: 'Acesso total a todas as empresas inquilinas',
      icon: Sparkles,
      color: 'from-violet-500 to-indigo-600',
      badgeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/20'
    },
    {
      title: 'Administrador',
      email: 'admin@promadeira.com.br',
      role: 'admin' as Role,
      tenantId: 'tenant-1',
      description: 'Gerenciamento completo de ProMadeira Ltda',
      icon: Shield,
      color: 'from-amber-500 to-orange-600',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    },
    {
      title: 'Gerente CRM',
      email: 'gerente@promadeira.com.br',
      role: 'manager' as Role,
      tenantId: 'tenant-1',
      description: 'Automação de fluxos e visualização comercial',
      icon: User,
      color: 'from-blue-500 to-sky-600',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
    {
      title: 'Agente Atendente',
      email: 'atendente@promadeira.com.br',
      role: 'agent' as Role,
      tenantId: 'tenant-1',
      description: 'Caixa unificada e suporte ao cliente final',
      icon: User,
      color: 'from-emerald-500 to-teal-600',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    }
  ];

  const handleApplyPreset = (preset: typeof loginPresets[0]) => {
    setEmail(preset.email);
    setRole(preset.role);
    setSelectedTenantId(preset.tenantId);
    setPassword('••••••••');
    setError(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Por favor, informe seu e-mail de acesso.');
      return;
    }
    if (!password) {
      setError('Por favor, informe sua senha secreta.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Simulate server side verification
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        onLoginSuccess(selectedTenantId, role, email);
      }, 800);
    }, 1200);
  };

  const currentTenantObj = tenants.find(t => t.id === selectedTenantId) || tenants[0];
  const activeSubdomain = role === 'master_admin' ? 'ceo.omnilead' : currentTenantObj.subdomain;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row font-sans text-slate-300">
      
      {/* Left Column: Visual Brand Sidebar with dynamic telemetry */}
      <div className="md:w-1/2 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-8 flex flex-col justify-between relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl"></div>
        
        {/* Logo and Brand header */}
        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-violet-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white uppercase tracking-wider">OMNILEAD</h1>
              <span className="text-[10px] text-amber-500 font-mono font-bold tracking-widest uppercase">Multi-Tenant SaaS Platform</span>
            </div>
          </div>
        </div>

        {/* Dynamic Architectural Sandbox Mockup */}
        <div className="my-12 relative z-10 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none">
              A Nova Era da Comunicação Multi-Tenant.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Uma única infraestrutura inteligente, isolada por políticas de banco de dados robustas, conectando canais omnichannel e inteligência artificial de ponta.
            </p>
          </div>

          {/* Interactive URL Simulator Card */}
          <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="text-amber-500 w-4 h-4" />
                <span className="text-xs font-mono font-extrabold text-slate-400 uppercase tracking-wider">Gateway do Inquilino</span>
              </div>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[9px] font-mono font-bold text-emerald-400">DNS RESOLVIDO</span>
              </span>
            </div>

            <div className="font-mono text-xs text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-850 truncate select-all">
              <span className="text-slate-500">https://</span>
              <span className="text-amber-400 font-bold">{activeSubdomain}</span>
              <span className="text-slate-300">.omnilead.com.br/painel</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400 font-mono">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-850">
                <span className="text-slate-500 block">ORGANIZAÇÃO</span>
                <span className="text-white font-bold truncate block mt-0.5">
                  {role === 'master_admin' ? 'Global SaaS' : currentTenantObj.name}
                </span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-850">
                <span className="text-slate-500 block">CONEXÃO</span>
                <span className="text-emerald-400 font-bold block mt-0.5">POSTGRESQL</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-850">
                <span className="text-slate-500 block">SESSÃO</span>
                <span className="text-amber-500 font-bold block mt-0.5 uppercase">{role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-[11px] text-slate-500 font-mono flex flex-wrap gap-x-4 gap-y-1">
          <span>AMBAR ORCHESTRATOR v2.4</span>
          <span>•</span>
          <span>SSL 256-BIT ENCRYPTION</span>
          <span>•</span>
          <span>CLOUD RUN SECURE AGENT</span>
        </div>
      </div>

      {/* Right Column: High-fidelity Login Card & Form */}
      <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-slate-950">
        <div className="max-w-md w-full mx-auto space-y-8">
          
          {/* Header instructions */}
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight uppercase">Acessar Painel</h2>
            <p className="text-sm text-slate-400 mt-1">
              Escolha um perfil rápido de testes abaixo ou preencha as credenciais.
            </p>
          </div>

          {/* Quick Access Presets Grid */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-mono font-extrabold text-amber-500 tracking-wider block">
              Acesso Rápido de Demonstração
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {loginPresets.map((preset) => {
                const Icon = preset.icon;
                const isSelected = email === preset.email;
                return (
                  <button
                    key={preset.title}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className={`text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-900 border-amber-500/60 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/30'
                        : 'bg-slate-900/40 border-slate-850 hover:bg-slate-900 hover:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-bold text-xs text-white block">{preset.title}</span>
                      <span className={`text-[8px] font-bold uppercase font-mono px-1.5 py-0.5 rounded border ${preset.badgeColor}`}>
                        {preset.role.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 truncate block w-full">
                      {preset.email}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Separation line */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-900"></div>
            <span className="flex-shrink mx-3 text-[10px] font-mono text-slate-500 uppercase">Ou digite manualmente</span>
            <div className="flex-grow border-t border-slate-900"></div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* Error Message */}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-xl text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Animation Container */}
            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3.5 rounded-xl text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span className="font-semibold">Autenticado com sucesso! Carregando painel corporativo...</span>
              </div>
            )}

            {/* Tenant Selection Dropdown */}
            {role !== 'master_admin' && (
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono font-bold text-slate-400 block">
                  Selecione sua Empresa (Tenant)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <select
                    value={selectedTenantId}
                    onChange={(e) => setSelectedTenantId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition cursor-pointer"
                  >
                    {tenants.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.subdomain})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono font-bold text-slate-400 block">
                E-mail Corporativo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                    // Match preset roles automatically to make typing cool
                    if (e.target.value === userEmailMetadata) setRole('master_admin');
                    else if (e.target.value.includes('gerente')) setRole('manager');
                    else if (e.target.value.includes('atendente')) setRole('agent');
                    else if (e.target.value.includes('admin')) setRole('admin');
                  }}
                  placeholder="exemplo@promadeira.com.br"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase font-mono font-bold text-slate-400 block">
                  Chave de Acesso / Senha
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Modo Sandbox: clique em um dos perfis rápidos acima para preencher automaticamente.'); }} className="text-[10px] font-semibold text-amber-500 hover:underline">
                  Esqueceu a chave?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition"
                />
              </div>
            </div>

            {/* Role Switcher Selector inside login form to display complete transparency of simulation */}
            <div className="space-y-1.5 bg-slate-900/30 border border-slate-900 p-3 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-500">Nível Simulado:</span>
                <span className="text-xs font-bold text-slate-300 uppercase font-mono">{role.replace('_', ' ')}</span>
              </div>
              <div className="flex gap-1.5 mt-2">
                {(['master_admin', 'admin', 'manager', 'agent'] as Role[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setRole(r);
                      if (r === 'master_admin') {
                        setEmail(userEmailMetadata);
                      } else if (email === userEmailMetadata) {
                        setEmail('admin@promadeira.com.br');
                      }
                    }}
                    className={`flex-1 py-1 text-[9px] font-mono font-bold uppercase rounded border transition cursor-pointer text-center ${
                      role === r
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-slate-900/20 text-slate-500 border-transparent hover:border-slate-850 hover:text-slate-400'
                    }`}
                  >
                    {r.split('_')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || success}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                success
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/10'
                  : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-98'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  VALIDANDO CREDENCIAIS...
                </span>
              ) : success ? (
                <span className="flex items-center gap-1.5 animate-pulse">
                  <CheckCircle2 className="w-4 h-4" />
                  ACESSO AUTORIZADO!
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  ENTRAR NA PLATAFORMA
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

        </div>
      </div>

    </div>
  );
}
