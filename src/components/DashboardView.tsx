import React from 'react';
import { TrendingUp, Users, MessageSquare, Zap, Activity, AlertCircle, ArrowUpRight, BarChart3, Star, Clock } from 'lucide-react';
import { Tenant } from '../types';

interface DashboardViewProps {
  currentTenant: Tenant;
}

export default function DashboardView({ currentTenant }: DashboardViewProps) {
  // Stat cards
  const stats = [
    { name: 'Receita Recorrente Mensal (MRR)', value: 'R$ 42.500', change: '+12.5%', type: 'up', color: 'text-amber-600', bg: 'bg-amber-50' },
    { name: 'Conversas Omnicanal Ativas', value: '184', change: '+8.2%', type: 'up', color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Valor Total no Pipeline CRM', value: 'R$ 348.200', change: '+18.4%', type: 'up', color: 'text-purple-600', bg: 'bg-purple-50' },
    { name: 'Automações de Workflows Executadas', value: '14.821', change: '+24.1%', type: 'up', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const channelStats = [
    { name: 'WhatsApp (Twilio/API)', volume: 8420, active: 112, color: 'bg-amber-600' },
    { name: 'Roteador de Entrada de E-mails', volume: 3210, active: 45, color: 'bg-slate-800' },
    { name: 'Bot Automatizado do Telegram', volume: 1480, active: 27, color: 'bg-amber-500' },
  ];

  const recentEvents = [
    { id: '1', source: 'Entrada de WhatsApp', status: 'success', time: '1 min atrás', desc: 'Mensagem de +55 11 99876-1234 correspondeu ao onboarding de leads' },
    { id: '2', source: 'Supabase Auth Gateway', status: 'success', time: '5 mins atrás', desc: 'Novo usuário cadastrado e disparado via gatilho de autenticação do Supabase' },
    { id: '3', source: 'Webhook da Vercel', status: 'success', time: '12 mins atrás', desc: 'Deploy em produção concluído com sucesso e limpa-logs acionado' },
    { id: '4', source: 'E-mail Recebido', status: 'success', time: '20 mins atrás', desc: 'Dúvida de jorge@woodco.com encaminhada ao funil VIP do CRM' },
    { id: '5', source: 'Bot do Telegram', status: 'failed', time: '30 mins atrás', desc: 'Tempo limite de execução no nó de condição: verificação de orçamento' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner - Solid deep slate theme with white & amber details */}
      <div className="bg-slate-900 border border-slate-900 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
              Inquilino Ativo: {currentTenant.name} ({currentTenant.subdomain}.seu-saas.com)
            </span>
            <h1 className="text-2xl font-black text-white mt-2 tracking-tight">Painel de Controle de Inteligência Operacional</h1>
            <p className="text-slate-400 text-xs mt-1">
              Indicadores consolidados em tempo real de canais de atendimento, funis de negócios ativos e logs de automação do Supabase + Vercel.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md text-xs text-white border border-white/10 font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            AMBIENTE: SUPABASE + VERCEL (ATIVO)
          </div>
        </div>
      </div>

      {/* Grid Stats matching Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition duration-200">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.name}</span>
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                <Star className="w-4 h-4 fill-current" />
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight font-sans">{stat.value}</h2>
              <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-1">
                <span>{stat.change}</span>
                <span className="text-slate-400 font-normal">este mês</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Channel Distribution Bento Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="font-extrabold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                <BarChart3 className="w-4 h-4 text-amber-600" />
                Volume e Desempenho de Canais
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[9px] font-mono font-bold uppercase">
                Ativo
              </span>
            </div>

            <div className="space-y-4">
              {channelStats.map((channel, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700">{channel.name}</span>
                    <span className="text-slate-400 font-mono">{channel.volume} msgs ({channel.active} ativos)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`${channel.color} h-full rounded-full transition-all duration-1000`}
                      style={{ width: `${(channel.volume / 13110) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100/50 text-xs text-slate-600 mt-4 leading-relaxed">
            <strong className="text-amber-800">Diagnóstico de Transição:</strong> 72% de todas as interações de entrada são resolvidas pelo Chatbot inteligente. 28% foram escaladas com sucesso para agentes humanos com metadados do CRM.
          </div>
        </div>

        {/* Live Automated Execution Logs Bento Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="font-extrabold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                <Activity className="w-4 h-4 text-amber-600 animate-pulse" />
                Logs de Automação e Ingestão em Tempo Real
              </h3>
              <span className="text-slate-400 text-[10px] font-mono uppercase tracking-widest">
                escuta ativa
              </span>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar">
              {recentEvents.map((event) => (
                <div key={event.id} className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start justify-between gap-3 hover:border-slate-200 transition">
                  <div className="flex gap-2">
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${event.status === 'success' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                    <div className="text-xs">
                      <span className="font-bold text-slate-800 font-mono mr-2">[{event.source}]</span>
                      <span className="text-slate-600">{event.desc}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0 font-mono font-medium">{event.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400 pt-4 border-t border-slate-100 mt-4 font-medium">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Exibindo os últimos 5 logs ativos
            </span>
            <span className="text-amber-600 font-bold hover:underline cursor-pointer">
              Ver log completo de auditoria de webhooks →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
