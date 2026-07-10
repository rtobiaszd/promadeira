import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Bot, User, CheckCircle2, AlertCircle, Sparkles, Smartphone, Mail, SendHorizontal, Calendar, Plus, Clock } from 'lucide-react';
import { Conversation, Message, EntryPoint, Contact, ChannelType } from '../types';

interface InboxViewProps {
  entryPoints: EntryPoint[];
  contacts: Contact[];
  onAddAppointment: (appointment: { title: string; contactId: string; date: string; time: string }) => void;
  onMoveDealStage: (contactName: string, stageId: string) => void;
}

export default function InboxView({ entryPoints, contacts, onAddAppointment, onMoveDealStage }: InboxViewProps) {
  // Mock conversations
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv-1',
      contactId: 'contact-1',
      contactName: 'João Silva',
      channel: 'whatsapp',
      lastMessageText: 'Gostaria de agendar uma reunião',
      lastMessageTime: '10:30',
      unreadCount: 2,
      status: 'active',
      messages: [
        { id: 'm1', sender: 'contact', senderName: 'João Silva', text: 'Olá! Sou marceneiro e vi seus planos de madeira premium.', timestamp: '10:28', channel: 'whatsapp' },
        { id: 'm2', sender: 'bot', senderName: 'OmniBot', text: 'Olá João! Digite 1 para Ver Planos, 2 para Falar com Suporte, ou 3 para Agendar Horário.', timestamp: '10:29', channel: 'whatsapp' },
        { id: 'm3', sender: 'contact', senderName: 'João Silva', text: 'Quero agendar uma reunião para conhecer melhor os lotes.', timestamp: '10:30', channel: 'whatsapp' },
      ],
    },
    {
      id: 'conv-2',
      contactId: 'contact-2',
      contactName: 'Elena Rostova',
      channel: 'telegram',
      lastMessageText: 'Confirmação do pedido #84102',
      lastMessageTime: '09:15',
      unreadCount: 0,
      status: 'active',
      messages: [
        { id: 'm4', sender: 'contact', senderName: 'Elena Rostova', text: 'Olá, preciso checar o status do envio #84102', timestamp: '09:14', channel: 'telegram' },
        { id: 'm5', sender: 'bot', senderName: 'OmniBot', text: 'Checando banco de dados de pedidos... Seu pedido está em trânsito e chegará nesta sexta-feira!', timestamp: '09:15', channel: 'telegram' },
      ],
    },
    {
      id: 'conv-3',
      contactId: 'contact-3',
      contactName: 'Carlos Souza',
      channel: 'email',
      lastMessageText: 'Orçamento lote de pinus tratado',
      lastMessageTime: 'Ontem',
      unreadCount: 0,
      status: 'closed',
      messages: [
        { id: 'm6', sender: 'contact', senderName: 'Carlos Souza', text: 'Preciso de cotação para 40 pranchas de pinus autoclavado.', timestamp: 'Ontem', channel: 'email' },
        { id: 'm7', sender: 'agent', senderName: 'Mariana (Agente)', text: 'Cotação enviada para seu e-mail, Carlos! Qualquer dúvida, estamos aqui.', timestamp: 'Ontem', channel: 'email' },
      ],
    },
  ]);

  const [selectedConvId, setSelectedConvId] = useState<string>('conv-1');
  const [selectedEntryPointId, setSelectedEntryPointId] = useState<string>(entryPoints[0]?.id || '');
  const [simulationRole, setSimulationRole] = useState<'client' | 'agent'>('client');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [appointmentTitle, setAppointmentTitle] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConv = conversations.find((c) => c.id === selectedConvId) || conversations[0];
  const activeEntryPoint = entryPoints.find((ep) => ep.id === selectedEntryPointId) || entryPoints[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConv?.messages]);

  // Handle incoming or outbound message simulations
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: `m-${Date.now()}`,
      sender: simulationRole === 'client' ? 'contact' : 'agent',
      senderName: simulationRole === 'client' ? selectedConv.contactName : 'Intervenção de Agente',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channel: selectedConv.channel,
    };

    // Update conversation message list
    const updatedConversations = conversations.map((conv) => {
      if (conv.id === selectedConv.id) {
        return {
          ...conv,
          lastMessageText: inputText,
          lastMessageTime: newMessage.timestamp,
          messages: [...conv.messages, newMessage],
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setInputText('');

    // If client sends a message and we have chatbot mode enabled, simulate the chatbot
    if (simulationRole === 'client') {
      setIsLoading(true);
      setTimeout(async () => {
        let botResponse = '';
        const botName = 'OmniBot';

        if (activeEntryPoint.chatbotMode === 'menu') {
          // Deterministic Menu simulation
          const flow = activeEntryPoint.chatbotConfig?.menuFlow;
          const userChoice = newMessage.text.trim();

          if (userChoice === '1') {
            botResponse = '🌲 Nossos Planos:\n- Premium: R$ 5.000/mês (Madeira nobre tratada)\n- Standard: R$ 2.500/mês (Pinus & Eucalipto)\nDigite 0 para voltar ao menu.';
          } else if (userChoice === '2') {
            botResponse = '📞 Transferindo para um agente humano... Aguarde um momento.';
            // Trigger stage move to Negotiating
            onMoveDealStage(selectedConv.contactName, 'stage-negotiating');
          } else if (userChoice === '3') {
            botResponse = '📅 Excelente! Agende agora clicando no botão "Agendar Horário / Visita" no painel direito.';
          } else {
            botResponse = `Olá ${selectedConv.contactName}! Obrigado pelo contato.\nMenu Automático:\n1 - Ver Catálogo de Madeiras\n2 - Falar com Consultor (Gera Oportunidade no CRM)\n3 - Agendar Visita técnica`;
          }
        } else {
          // AI or Hybrid mode (using live Gemini on server-side)
          try {
            const apiRes = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: newMessage.text,
                prompt: activeEntryPoint.chatbotConfig?.aiPrompt,
                history: selectedConv.messages.map(m => ({
                  role: m.sender === 'contact' ? 'user' : 'model',
                  text: m.text
                }))
              })
            });

            if (apiRes.ok) {
              const data = await apiRes.json();
              botResponse = data.text;

              // If AI chooses to move stage
              if (data.classification?.stageId) {
                onMoveDealStage(selectedConv.contactName, data.classification.stageId);
              }
            } else {
              throw new Error('Erro na API');
            }
          } catch (err) {
            // Clever fallback locally
            const textLower = newMessage.text.toLowerCase();
            if (textLower.includes('preco') || textLower.includes('valor') || textLower.includes('plano') || textLower.includes('preço')) {
              botResponse = '🌲 Entendido! Nossos planos de fornecimento de madeira sob demanda custam entre R$ 2.500/mês a R$ 10.000/mês. Gostaria que eu te movesse para a etapa de Negociação no CRM para falar com um consultor?';
            } else if (textLower.includes('reuniao') || textLower.includes('agendar') || textLower.includes('calendario') || textLower.includes('reunião')) {
              botResponse = '📅 Com certeza! Podemos agendar uma chamada. Por favor, selecione uma data no painel de agendamento rápido ao lado para salvar em nossa agenda.';
            } else {
              botResponse = `Olá! Sou o assistente de IA da plataforma. Compreendi sua solicitação sobre "${newMessage.text}". Como posso te guiar em nosso funil de vendas?`;
            }
          }
        }

        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          senderName: botName,
          text: botResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          channel: selectedConv.channel,
        };

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === selectedConv.id) {
              return {
                ...c,
                lastMessageText: botMsg.text,
                lastMessageTime: botMsg.timestamp,
                messages: [...c.messages, botMsg],
              };
            }
            return c;
          })
        );
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleCreateAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentTitle || !appointmentDate || !appointmentTime) return;

    onAddAppointment({
      title: appointmentTitle,
      contactId: selectedConv.contactId,
      date: appointmentDate,
      time: appointmentTime,
    });

    // Send visual agent notification in chat
    const apptMsg: Message = {
      id: `appt-${Date.now()}`,
      sender: 'agent',
      senderName: 'Sistema de Agendamento',
      text: `📅 Agendamento Confirmado: "${appointmentTitle}" em ${appointmentDate} às ${appointmentTime}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channel: selectedConv.channel,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedConv.id) {
          return {
            ...c,
            messages: [...c.messages, apptMsg],
          };
        }
        return c;
      })
    );

    setAppointmentTitle('');
    setAppointmentDate('');
    setAppointmentTime('');
    setShowAppointmentModal(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[720px]">
      {/* Conversations List Sidebar */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col h-full col-span-1 shadow-xs">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-wider">
            <MessageSquare className="text-amber-600 w-4.5 h-4.5" />
            Conversas Ativas
          </h2>
          <div className="mt-3">
            <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1 font-bold">Canal Simulado</label>
            <select
              value={selectedEntryPointId}
              onChange={(e) => setSelectedEntryPointId(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-mono font-bold cursor-pointer"
            >
              {entryPoints.map((ep) => (
                <option key={ep.id} value={ep.id}>
                  {ep.channel.toUpperCase()} - {ep.identifier}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
          {conversations.map((conv) => {
            const isActive = selectedConvId === conv.id;
            return (
              <button
                key={conv.id}
                onClick={() => setSelectedConvId(conv.id)}
                className={`w-full p-3.5 rounded-xl text-left transition flex flex-col gap-1 border cursor-pointer ${
                  isActive
                    ? 'bg-amber-50 border-amber-200 text-slate-850'
                    : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-500'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className={`text-xs font-black ${isActive ? 'text-amber-800' : 'text-slate-700'} truncate`}>{conv.contactName}</span>
                  <span className="text-[10px] font-mono text-slate-400">{conv.lastMessageTime}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] mt-1">
                  {conv.channel === 'whatsapp' && <Smartphone className="w-3.5 h-3.5 text-emerald-600" />}
                  {conv.channel === 'email' && <Mail className="w-3.5 h-3.5 text-blue-500" />}
                  {conv.channel === 'telegram' && <SendHorizontal className="w-3.5 h-3.5 text-sky-500" />}
                  <span className={`truncate flex-1 font-medium ${isActive ? 'text-slate-700' : 'text-slate-400'}`}>{conv.lastMessageText}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Thread Content */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col h-full lg:col-span-2 shadow-xs">
        {/* Header toolbar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/40 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-amber-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
              {selectedConv.contactName[0]}
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">{selectedConv.contactName}</h3>
              <span className="text-[10px] text-amber-600 font-extrabold flex items-center gap-1">
                <Bot className="w-3.5 h-3.5" />
                Modo de Bot Ativo: {activeEntryPoint.chatbotMode.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Toggle Simulation Side */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50">
            <button
              onClick={() => setSimulationRole('client')}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition cursor-pointer ${
                simulationRole === 'client'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Simular Cliente
            </button>
            <button
              onClick={() => setSimulationRole('agent')}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition cursor-pointer ${
                simulationRole === 'agent'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Intervir como Agente
            </button>
          </div>
        </div>

        {/* Messages body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4 bg-slate-50/50">
          {selectedConv.messages.map((msg) => {
            const isMe = msg.sender === 'contact';
            const isSystem = msg.senderName === 'Sistema de Agendamento';
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {isSystem ? (
                  <div className="w-full flex justify-center py-2">
                    <span className="bg-amber-50 text-amber-800 text-[10px] font-mono border border-amber-200/60 px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs font-bold">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      {msg.text}
                    </span>
                  </div>
                ) : (
                  <div className="max-w-[85%] space-y-1">
                    <span className="text-[9px] text-slate-400 font-mono font-bold block px-1">
                      {msg.senderName} • {msg.timestamp}
                    </span>
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-xs shadow-xs leading-relaxed ${
                        isMe
                          ? 'bg-slate-800 text-white rounded-tr-none'
                          : msg.sender === 'bot'
                          ? 'bg-amber-100/40 border border-amber-200/50 text-amber-900 rounded-tl-none font-medium'
                          : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {isLoading && (
            <div className="flex items-center gap-1.5 text-[10px] text-amber-600 font-mono italic px-2 animate-pulse">
              <Bot className="w-4 h-4 animate-bounce" />
              O Bot está digitando a resposta...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              simulationRole === 'client'
                ? 'Digite como cliente (ex: "Preço", "1", "2")'
                : 'Enviar resposta manual de intervenção do agente...'
            }
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl text-xs py-2.5 px-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
          <button
            type="submit"
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl transition duration-150 flex items-center justify-center shrink-0 cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Leads CRM Context Inspector Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 h-full col-span-1 space-y-5 shadow-xs flex flex-col justify-between">
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider font-mono border-b border-slate-100 pb-3 flex items-center gap-2">
            <Sparkles className="text-amber-600 w-4 h-4" />
            Inspetor Unificado de Leads
          </h3>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase font-mono block font-bold">Contato Associado</label>
            <span className="text-xs font-black text-slate-800 block mt-0.5">{selectedConv.contactName}</span>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-slate-400 uppercase font-mono block font-bold">Estágio do Funil CRM</label>
            <div className="flex flex-col gap-1.5 mt-1.5">
              {[
                { id: 'stage-new', label: 'Novo Lead' },
                { id: 'stage-negotiating', label: 'Em Negociação' },
                { id: 'stage-closed', label: 'Fechado-Ganho' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => onMoveDealStage(selectedConv.contactName, s.id)}
                  className="px-3 py-2 text-[10px] font-bold rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 cursor-pointer text-left transition duration-150 flex items-center justify-between"
                >
                  <span>Mover para {s.label}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase font-mono">Ações Omnicanal</h4>
          <button
            onClick={() => setShowAppointmentModal(true)}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
          >
            <Calendar className="w-4 h-4" />
            Agendar Horário / Visita
          </button>
        </div>

        {/* Quick scheduling Modal */}
        {showAppointmentModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-xl">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Agendar Visita Rápida de Lead</h3>
              <form onSubmit={handleCreateAppointmentSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Título do Compromisso</label>
                  <input
                    type="text"
                    value={appointmentTitle}
                    onChange={(e) => setAppointmentTitle(e.target.value)}
                    placeholder="ex: Demonstração Técnica de Madeiras Tratadas"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Data</label>
                    <input
                      type="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 font-mono font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Hora</label>
                    <input
                      type="time"
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 font-mono font-bold"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAppointmentModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-800 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 text-xs font-bold rounded-xl cursor-pointer shadow-sm"
                  >
                    Salvar Compromisso
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
