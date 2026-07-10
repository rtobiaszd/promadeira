import React, { useState } from 'react';
import { Terminal, Send, RefreshCw } from 'lucide-react';
import { InboundLog } from '../types';

interface LogIngestionViewProps {
  logs: InboundLog[];
  onTriggerLogWorkflow: (logId: string) => void;
}

export default function LogIngestionView({ logs, onTriggerLogWorkflow }: LogIngestionViewProps) {
  const [selectedLogId, setSelectedLogId] = useState<string>(logs[0]?.id || '');
  const [customPayload, setCustomPayload] = useState<string>(
    JSON.stringify(
      {
        type: 'alerta_infraestrutura',
        servidor: 'instancia-promadeira-producao',
        uso_disco_porcento: 92,
        telefone_administrador: '+55 11 99876-1234',
      },
      null,
      2
    )
  );
  const [customSource, setCustomSource] = useState<string>('Monitoramento Vercel Webhook');
  const [simulatedLogs, setSimulatedLogs] = useState<InboundLog[]>(logs);
  const [activeLogTrace, setActiveLogTrace] = useState<string[]>([]);
  const [isTracerRunning, setIsTracerRunning] = useState(false);

  const handleFireIngest = () => {
    try {
      // Validate JSON
      JSON.parse(customPayload);

      const newLog: InboundLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: customSource,
        payload: customPayload,
        workflowStatus: 'none',
      };

      setSimulatedLogs([newLog, ...simulatedLogs]);
      setSelectedLogId(newLog.id);

      setActiveLogTrace([
        '[INFORMAÇÃO] Endpoint de Ingestão recebeu requisição POST /api/events',
        '[SUCESSO] Payload validado com sucesso conforme norma RFC-8259 JSON. Registrado no Supabase.'
      ]);
    } catch (e) {
      alert('Formato JSON inválido no editor de payload.');
    }
  };

  const runTracerSimulation = (log: InboundLog) => {
    setIsTracerRunning(true);
    setActiveLogTrace([
      `[INGESTÃO] Buscando workflows ativos para o provedor "${log.source}"`,
      '[SUPABASE] Buscando workflows correspondentes no banco: "webhook_received"',
    ]);

    setTimeout(() => {
      setActiveLogTrace((prev) => [
        ...prev,
        '[COMBINAÇÃO] Encontrada 1 regra de fluxo ativa correspondente: "Resolução Automática de Sobrecarga"',
        '[MOTOR] Carregando mapa de nós JSON do banco Supabase...',
        '[PASSO 1] Verificando condição "Limite de Disco": uso_disco_porcento (92) > limite (90) -> VERDADEIRO',
      ]);

      setTimeout(() => {
        setActiveLogTrace((prev) => [
          ...prev,
          '[PASSO 2] Disparando ação de aviso REST "Canal de Alertas" via Webhook Vercel -> Status 200 OK',
          '[PASSO 3] Disparando script corretivo de backup e limpeza de logs no Supabase -> Status 201 Created',
          '[SUCESSO] Cadeia de execução de resolução finalizada com sucesso. Todos os nós verificados e concluídos.',
        ]);
        setIsTracerRunning(false);

        // Update log list status
        setSimulatedLogs((prev) =>
          prev.map((l) => (l.id === log.id ? { ...l, workflowStatus: 'success' } : l))
        );
      }, 1000);
    }, 1000);
  };

  const selectedLog = simulatedLogs.find((l) => l.id === selectedLogId) || simulatedLogs[0];

  return (
    <div className="space-y-6">
      {/* Intro header */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Simulador de Ingestão de Webhooks e Eventos</h2>
            <p className="text-slate-400 text-xs mt-0.5">Teste gatilhos automáticos simulando posts de servidores externos direcionados ao SaaS.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Emulator Payload Sender */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 h-fit shadow-xs">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider font-mono border-b border-slate-100 pb-3">
            Emulador de Entrada (Inbound)
          </h3>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1 font-bold">Origem / Provedor do Evento</label>
              <input
                type="text"
                value={customSource}
                onChange={(e) => setCustomSource(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1 font-bold">Editor de Payload (JSON)</label>
              <textarea
                value={customPayload}
                onChange={(e) => setCustomPayload(e.target.value)}
                rows={8}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-emerald-400 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500/20 custom-scrollbar"
              />
            </div>

            <button
              onClick={handleFireIngest}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
            >
              <Send className="w-4 h-4" />
              Ingerir Evento no Endpoint (/api/events)
            </button>
          </div>
        </div>

        {/* Middle Column: Ingested Webhook Log Feed */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 flex flex-col h-[500px] shadow-xs">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider font-mono border-b border-slate-100 pb-3 shrink-0">
            Eventos Armazenados no Supabase
          </h3>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2.5 pr-1">
            {simulatedLogs.map((log) => {
              const isSelected = selectedLogId === log.id;
              return (
                <button
                  key={log.id}
                  onClick={() => setSelectedLogId(log.id)}
                  className={`w-full p-4 rounded-xl border text-left flex justify-between items-start gap-2 transition cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50 border-amber-200 text-slate-850'
                      : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-500'
                  }`}
                >
                  <div className="min-w-0">
                    <span className={`text-xs font-mono font-bold block ${isSelected ? 'text-amber-900' : 'text-slate-800'}`}>{log.source}</span>
                    <span className="text-[10px] text-slate-400 block font-mono mt-1 font-bold">{log.timestamp}</span>
                  </div>
                  {log.workflowStatus === 'success' ? (
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] uppercase tracking-wider font-mono font-black">
                      Executado
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 text-[9px] uppercase tracking-wider font-mono font-black">
                      Pendente
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Execution Tracer details */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col h-[500px] shadow-xs">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider font-mono border-b border-slate-100 pb-3 shrink-0">
            Trilhas de Execuções e Resoluções
          </h3>

          {selectedLog ? (
            <div className="flex-1 flex flex-col justify-between pt-3 space-y-3 overflow-hidden text-xs">
              <div className="space-y-3.5 flex-1 overflow-y-auto custom-scrollbar pr-1">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block font-bold">Payload JSON Recebido</span>
                  <pre className="text-[10px] font-mono text-emerald-400 bg-slate-900 p-3 border border-slate-800 rounded-xl mt-1 overflow-x-auto custom-scrollbar shadow-inner leading-relaxed">
                    {selectedLog.payload}
                  </pre>
                </div>

                {activeLogTrace.length > 0 && (
                  <div className="space-y-1.5 bg-slate-900 p-3.5 border border-slate-800 rounded-xl shadow-inner">
                    <span className="text-[10px] text-amber-500 uppercase font-mono font-bold block mb-1">Passos da Máquina de Estados</span>
                    <div className="space-y-1.5 font-mono text-[10px] leading-relaxed">
                      {activeLogTrace.map((t, idx) => (
                        <div key={idx} className={t.startsWith('[SUCESSO]') ? 'text-emerald-400 font-bold' : t.startsWith('[PASSO') ? 'text-amber-300 font-bold' : 'text-slate-400'}>
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {selectedLog.workflowStatus !== 'success' && (
                <button
                  onClick={() => runTracerSimulation(selectedLog)}
                  disabled={isTracerRunning}
                  className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTracerRunning ? 'animate-spin' : ''}`} />
                  {isTracerRunning ? 'Processando Automação...' : 'Disparar Fluxo de Resolução'}
                </button>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-xs italic font-bold">
              Selecione um log para carregar e iniciar rastreio de execução
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
