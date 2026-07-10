import React, { useState } from 'react';
import { GitCommit, Settings, Play, ArrowDown, RefreshCw } from 'lucide-react';
import { Workflow, WorkflowNode } from '../types';

interface WorkflowEditorProps {
  workflows: Workflow[];
  onUpdateWorkflowNode: (workflowId: string, nodeId: string, updatedNode: WorkflowNode) => void;
}

export default function WorkflowEditor({ workflows, onUpdateWorkflowNode }: WorkflowEditorProps) {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(workflows[0]?.id || '');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-1');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'visual' | 'json'>('visual');

  const activeWorkflow = workflows.find((w) => w.id === selectedWorkflowId) || workflows[0];
  const selectedNode = activeWorkflow.nodes[selectedNodeId] || activeWorkflow.nodes[activeWorkflow.startNodeId];

  // Visual state updates
  const handleUpdateNodeName = (val: string) => {
    if (!selectedNode) return;
    onUpdateWorkflowNode(selectedWorkflowId, selectedNodeId, {
      ...selectedNode,
      name: val,
    });
  };

  const handleUpdateNodeConfig = (key: string, val: any) => {
    if (!selectedNode) return;
    onUpdateWorkflowNode(selectedWorkflowId, selectedNodeId, {
      ...selectedNode,
      config: {
        ...selectedNode.config,
        [key]: val,
      },
    });
  };

  // Run mock state machine simulation of workflow
  const runWorkflowSimulation = () => {
    setIsSimulating(true);
    setSimulationLogs(['[INFO] Inicializando motor de workflows...', `[INFO] Carregando contexto de execução para o fluxo: "${activeWorkflow.name}"`]);

    let currentNodeId: string | undefined = activeWorkflow.startNodeId;
    let step = 1;

    const executeStep = () => {
      if (!currentNodeId || !activeWorkflow.nodes[currentNodeId]) {
        setSimulationLogs((prev) => [...prev, `[SUCESSO] Execução de automação concluída com sucesso em ${step - 1} etapas.`]);
        setIsSimulating(false);
        return;
      }

      const node = activeWorkflow.nodes[currentNodeId];
      let logMsg = '';

      if (node.type === 'trigger') {
        logMsg = `[PASSO ${step}] 📥 [GATILHO] "${node.name}" recebeu payload do evento. Critérios validados com sucesso.`;
        currentNodeId = node.nextId;
      } else if (node.type === 'ai') {
        logMsg = `[PASSO ${step}] 🧠 [MOTOR IA] "${node.name}" invocando processamento seguro do Gemini. Variáveis de intenções extraídas salvas no contexto comercial.`;
        currentNodeId = node.nextId;
      } else if (node.type === 'condition') {
        const checkVal = node.config.compareValue || 5000;
        logMsg = `[PASSO ${step}] ⚖️ [CONDIÇÃO] Verificando limites no nó "${node.name}": Valor (R$ 12.000) > limite de comparação (R$ ${checkVal}) -> Resolvido como: VERDADEIRO.`;
        currentNodeId = node.config.trueId || node.nextId;
      } else if (node.type === 'action') {
        logMsg = `[PASSO ${step}] ⚙️ [EXECUÇÃO DE AÇÃO] Disparando provedor de integração "${node.config.providerId || 'whatsapp'}": Envio efetuado com sucesso. Status de retorno: 200 OK.`;
        currentNodeId = node.nextId;
      } else if (node.type === 'delay') {
        logMsg = `[PASSO ${step}] ⏳ [MOTOR DE TEMPO] Temporizador agendado no motor: Aguardando ${node.config.duration || '24'} horas antes de retomar o fluxo no pipeline.`;
        currentNodeId = node.nextId;
      }

      setSimulationLogs((prev) => [...prev, logMsg]);
      step += 1;

      // Queue next node
      setTimeout(executeStep, 800);
    };

    setTimeout(executeStep, 600);
  };

  return (
    <div className="space-y-6">
      {/* Workflow selectors */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <GitCommit className="w-5 h-5 rotate-90" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Orquestrador de Fluxos (Workflows)</h2>
            <p className="text-slate-400 text-xs mt-0.5">Designer visual de nós lógicos orientados a eventos para múltiplos canais.</p>
          </div>
        </div>
        <div className="flex gap-2">
          {workflows.map((w) => (
            <button
              key={w.id}
              onClick={() => {
                setSelectedWorkflowId(w.id);
                setSelectedNodeId(w.startNodeId);
              }}
              className={`px-4 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                selectedWorkflowId === w.id
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'
              }`}
            >
              {w.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Central Visual Canvas Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:col-span-2 space-y-4 flex flex-col h-[560px] shadow-xs">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4 shrink-0">
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50">
              <button
                onClick={() => setActiveTab('visual')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition ${
                  activeTab === 'visual' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Designer Visual de Fluxos
              </button>
              <button
                onClick={() => setActiveTab('json')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition ${
                  activeTab === 'json' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                JSON de Configuração
              </button>
            </div>

            <button
              onClick={runWorkflowSimulation}
              disabled={isSimulating}
              className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              <Play className="w-4 h-4 fill-current animate-pulse" />
              {isSimulating ? 'Simulando...' : 'Executar Simulação'}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 bg-slate-50/50 rounded-xl border border-slate-150 flex flex-col items-center justify-start space-y-4 relative">
            {activeTab === 'visual' ? (
              (() => {
                const nodesList: any[] = [];
                let currentId: string | undefined = activeWorkflow.startNodeId;
                const visited = new Set<string>();

                while (currentId && activeWorkflow.nodes[currentId] && !visited.has(currentId)) {
                  visited.add(currentId);
                  const node = activeWorkflow.nodes[currentId];
                  nodesList.push(node);

                  if (node.type === 'condition') {
                    currentId = node.config.trueId || node.nextId;
                  } else {
                    currentId = node.nextId;
                  }
                }

                return (
                  <div className="w-full max-w-sm space-y-4 flex flex-col items-center py-2">
                    {nodesList.map((node, i) => {
                      const isNodeSelected = selectedNodeId === node.id;
                      return (
                        <React.Fragment key={node.id}>
                          <button
                            onClick={() => setSelectedNodeId(node.id)}
                            className={`w-full p-4 rounded-2xl border transition text-left flex items-start gap-3.5 relative cursor-pointer shadow-xs ${
                              isNodeSelected
                                ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500/20'
                                : 'bg-white border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                              node.type === 'trigger' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                              node.type === 'ai' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                              node.type === 'condition' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                              node.type === 'delay' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              <span className="text-xs uppercase font-extrabold font-mono">{node.type[0]}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-slate-800 truncate">{node.name}</h4>
                              <p className="text-[10px] text-slate-400 uppercase font-mono mt-0.5">Tipo: <span className="font-bold">
                                {node.type === 'trigger' ? 'Gatilho' :
                                 node.type === 'ai' ? 'Inteligência Artificial' :
                                 node.type === 'condition' ? 'Condição Lógica' :
                                 node.type === 'delay' ? 'Atraso Temporal' : 'Ação de Saída'}
                              </span></p>
                            </div>
                          </button>
                          {i < nodesList.length - 1 && (
                            <div className="flex flex-col items-center">
                              <ArrowDown className="w-4 h-4 text-slate-300" />
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                );
              })()
            ) : (
              <pre className="w-full text-left font-mono text-[11px] text-slate-700 p-4 bg-white rounded-xl overflow-x-auto max-h-[420px] border border-slate-200 shadow-inner">
                {JSON.stringify(activeWorkflow, null, 2)}
              </pre>
            )}
          </div>
        </div>

        {/* Node Properties inspector panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col h-[560px] shadow-xs">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider font-mono border-b border-slate-100 pb-3 shrink-0 flex items-center gap-2">
            <Settings className="text-amber-600 w-4 h-4" />
            Configuração de Propriedades do Nó
          </h3>

          {selectedNode ? (
            <div className="flex-1 overflow-y-auto custom-scrollbar pt-4 space-y-4 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1 font-bold">ID de Referência do Nó</label>
                <input
                  type="text"
                  value={selectedNode.id}
                  disabled
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl py-2 px-3 text-xs text-slate-400 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1 font-bold">Título / Nome Descritivo do Nó</label>
                <input
                  type="text"
                  value={selectedNode.name}
                  onChange={(e) => handleUpdateNodeName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold"
                />
              </div>

              {/* Type-specific configs */}
              {selectedNode.type === 'trigger' && (
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1 font-bold">Evento de Entrada Associado</label>
                  <select
                    value={activeWorkflow.triggerType}
                    disabled
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-500 font-bold"
                  >
                    <option value="message_received">WhatsApp - Mensagem Recebida</option>
                    <option value="webhook_received">E-mail ou Webhook Externo - Payload Recebido</option>
                  </select>
                </div>
              )}

              {selectedNode.type === 'ai' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1 font-bold">Instruções de Prompt da IA (Gemini)</label>
                    <textarea
                      value={selectedNode.config.prompt || ''}
                      onChange={(e) => handleUpdateNodeConfig('prompt', e.target.value)}
                      rows={5}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 custom-scrollbar font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1 font-bold">Chave de Saída para o JSON (Output Key)</label>
                    <input
                      type="text"
                      value={selectedNode.config.outputKey || 'aiResult'}
                      onChange={(e) => handleUpdateNodeConfig('outputKey', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 font-mono font-bold focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {selectedNode.type === 'condition' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1 font-bold">Campo / Variável Verificada no Payload</label>
                    <input
                      type="text"
                      value={selectedNode.config.field || ''}
                      onChange={(e) => handleUpdateNodeConfig('field', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 font-mono font-bold focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1 font-bold">Operador</label>
                      <select
                        value={selectedNode.config.operator || 'greater_than'}
                        onChange={(e) => handleUpdateNodeConfig('operator', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-2.5 text-xs text-slate-600 focus:outline-none font-bold"
                      >
                        <option value="greater_than">&gt; Maior que</option>
                        <option value="equals">== Igual a</option>
                        <option value="contains">Contém</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1 font-bold">Valor de Comparação</label>
                      <input
                        type="number"
                        value={selectedNode.config.compareValue || 5000}
                        onChange={(e) => handleUpdateNodeConfig('compareValue', Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 font-mono font-bold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedNode.type === 'action' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1 font-bold">Provedor de Integração</label>
                    <input
                      type="text"
                      value={selectedNode.config.providerId || ''}
                      onChange={(e) => handleUpdateNodeConfig('providerId', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 font-mono font-bold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1 font-bold">Conteúdo do Envio (Payload / Mensagem)</label>
                    <textarea
                      value={selectedNode.config.text || selectedNode.config.body || ''}
                      onChange={(e) => handleUpdateNodeConfig(selectedNode.config.text ? 'text' : 'body', e.target.value)}
                      rows={4}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 custom-scrollbar font-medium"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-xs italic">
              Selecione um nó lógico para editar as regras...
            </div>
          )}
        </div>
      </div>

      {/* Simulator logs box */}
      {simulationLogs.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
            <h3 className="text-xs font-bold text-slate-200 font-mono flex items-center gap-1.5 uppercase tracking-wider">
              <RefreshCw className={`text-amber-500 w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              Console Ativo de Execução da Máquina de Estados (Realtime)
            </h3>
            <button
              onClick={() => setSimulationLogs([])}
              className="text-[10px] text-slate-400 hover:text-white cursor-pointer font-bold"
            >
              Limpar Console
            </button>
          </div>
          <div className="space-y-1.5 max-h-[140px] overflow-y-auto custom-scrollbar font-mono text-[11px] text-slate-300">
            {simulationLogs.map((log, i) => (
              <div key={i} className={log.startsWith('[SUCESSO]') ? 'text-emerald-400 font-bold' : log.startsWith('[PASSO') ? 'text-amber-400' : 'text-slate-400'}>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
