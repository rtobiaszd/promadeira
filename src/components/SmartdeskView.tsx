import React, { useState } from 'react';
import { Search, PlusCircle, Headphones, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

interface Ticket {
  id: string;
  contactName: string;
  subject: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'progress' | 'resolved' | 'closed';
  agentName: string;
  slaLimit: string;
  createdAt: string;
}

export default function SmartdeskView() {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'PROT-2026-101',
      contactName: 'João Silva',
      subject: 'Atraso na entrega do lote de Pinus Autoclavado',
      priority: 'high',
      status: 'progress',
      agentName: 'Aline Souza',
      slaLimit: '2h restantes',
      createdAt: '2026-07-10',
    },
    {
      id: 'PROT-2026-102',
      contactName: 'Elena Rostova',
      subject: 'Dúvidas sobre laudo técnico de imunização CCA',
      priority: 'medium',
      status: 'open',
      agentName: 'Não atribuído',
      slaLimit: '24h restantes',
      createdAt: '2026-07-10',
    },
    {
      id: 'PROT-2026-103',
      contactName: 'Carlos Souza',
      subject: 'Problema no faturamento da NFe de Eucalipto',
      priority: 'critical',
      status: 'resolved',
      agentName: 'Roberto Dias',
      slaLimit: 'Excedido (Resolvido)',
      createdAt: '2026-07-09',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [contactName, setContactName] = useState('');
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');

  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setSimulatedLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 4)]);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !subject) return;

    const newTicket: Ticket = {
      id: `PROT-2026-10${tickets.length + 1}`,
      contactName,
      subject,
      priority,
      status: 'open',
      agentName: 'Não atribuído',
      slaLimit: '24h restantes',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTickets([newTicket, ...tickets]);
    setShowAddModal(false);
    setContactName('');
    setSubject('');

    addLog(`Ticket '${newTicket.id}' aberto para ${contactName}: '${subject}' - Registrado no banco`);
  };

  const handleAssignMe = (id: string) => {
    setTickets(prev =>
      prev.map(t => (t.id === id ? { ...t, agentName: 'Consultor ProMadeira (Você)', status: 'progress' } : t))
    );
    addLog(`Ticket '${id}' atribuído a você - Atendimento iniciado`);
  };

  const handleResolve = (id: string) => {
    setTickets(prev =>
      prev.map(t => (t.id === id ? { ...t, status: 'resolved', slaLimit: 'Resolvido no SLA' } : t))
    );
    addLog(`UPDATE smartdesk_tickets SET status = 'resolved' WHERE id = '${id}'`);
  };

  const filtered = tickets.filter(t =>
    t.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6" id="view-smartdesk">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Smartdesk - Atendimento e Suporte ao Cliente</h2>
            <p className="text-slate-400 text-xs mt-0.5">Chamados técnicos de garantia de autoclave, cubagem divergente, logística e financeiro.</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          Abrir Chamado
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar por cliente, assunto ou número do protocolo..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-mono font-bold uppercase border-b border-slate-200">
                  <th className="p-4 text-[10px]">PROTOCOLO</th>
                  <th className="p-4 text-[10px]">CLIENTE</th>
                  <th className="p-4 text-[10px]">ASSUNTO</th>
                  <th className="p-4 text-[10px]">PRIORIDADE</th>
                  <th className="p-4 text-[10px]">RESPONSÁVEL</th>
                  <th className="p-4 text-[10px]">LIMITE SLA</th>
                  <th className="p-4 text-[10px]">STATUS</th>
                  <th className="p-4 text-[10px] text-right">AÇÕES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition text-xs">
                    <td className="p-4 font-mono font-bold text-amber-700">{t.id}</td>
                    <td className="p-4 font-bold text-slate-900">{t.contactName}</td>
                    <td className="p-4 text-slate-500 max-w-[180px] truncate" title={t.subject}>{t.subject}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold ${
                        t.priority === 'critical' ? 'bg-red-100 text-red-800' :
                        t.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        t.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {t.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 font-bold">{t.agentName}</td>
                    <td className="p-4 font-mono text-slate-400 text-[10px]">{t.slaLimit}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        t.status === 'resolved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        t.status === 'progress' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                        'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {t.status === 'resolved' ? 'Resolvido' : t.status === 'progress' ? 'Em Atendimento' : 'Aberto'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex gap-1 justify-end">
                        {t.agentName === 'Não atribuído' && (
                          <button
                            onClick={() => handleAssignMe(t.id)}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded text-[10px] font-bold cursor-pointer"
                          >
                            Assumir
                          </button>
                        )}
                        {t.status !== 'resolved' && (
                          <button
                            onClick={() => handleResolve(t.id)}
                            className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 px-2 py-1 rounded text-[10px] font-bold cursor-pointer"
                          >
                            Resolver
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Support analytics and webhooks */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-slate-200">
            <h3 className="text-[10px] font-extrabold uppercase font-mono text-amber-500 tracking-wider flex items-center gap-1.5 mb-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Smartdesk Live Logs
            </h3>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[9px] text-slate-400 space-y-1.5 min-h-[140px] max-h-[220px] overflow-y-auto">
              <div>-- Chamadas de Processo Smartdesk --</div>
              {simulatedLogs.map((log, i) => (
                <div key={i} className="text-slate-300 border-l border-amber-500 pl-1.5 truncate">
                  {log}
                </div>
              ))}
              {simulatedLogs.length === 0 && (
                <div className="text-slate-600">Nenhum evento registrado.</div>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider font-mono">Automação de WhatsApp</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              O chatbot em modo híbrido possui integração com o Smartdesk. Se um cliente clica na opção 'Suporte', o ticket é criado no sistema em tempo real, gerando notificação para o atendente.
            </p>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-xl text-xs">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide font-mono">Abrir Protocolo de Suporte</h3>
            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Nome do Cliente / Empresa</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="ex: João Silva"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Assunto / Descrição Curta do Problema</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="ex: Rachaduras excessivas nas vigas do lote #04"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Prioridade</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                  <option value="critical">Crítica (Interrupção de Linha)</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 text-xs font-bold rounded-xl cursor-pointer shadow-sm"
                >
                  Abrir Protocolo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
