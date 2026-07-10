import React, { useState } from 'react';
import { Columns, Settings, Trash2, Zap, Play, Plus } from 'lucide-react';
import { Pipeline, Stage, Deal, StageAction } from '../types';

interface CrmPipelineViewProps {
  pipelines: Pipeline[];
  deals: Deal[];
  onMoveDeal: (dealId: string, targetStageId: string) => void;
  onUpdateStageAutomation: (pipelineId: string, stageId: string, actions: StageAction[]) => void;
  onAddPipeline: (name: string, stageNames: string[]) => void;
  onAddDeal: (title: string, contactName: string, value: number, pipelineId: string, stageId: string) => void;
}

export default function CrmPipelineView({
  pipelines,
  deals,
  onMoveDeal,
  onUpdateStageAutomation,
  onAddPipeline,
  onAddDeal,
}: CrmPipelineViewProps) {
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>(pipelines[0]?.id || '');
  const [activeStageSettingsId, setActiveStageSettingsId] = useState<string | null>(null);
  const [automationLogs, setAutomationLogs] = useState<{ id: string; msg: string; type: string }[]>([]);

  // Modals state for Pipeline and Deal creation
  const [showAddPipelineModal, setShowAddPipelineModal] = useState(false);
  const [newPipelineName, setNewPipelineName] = useState('');
  const [newPipelineStages, setNewPipelineStages] = useState('Novo Lead, Contato, Proposta, Fechado');

  const [showAddDealModal, setShowAddDealModal] = useState(false);
  const [newDealTitle, setNewDealTitle] = useState('');
  const [newDealContact, setNewDealContact] = useState('');
  const [newDealValue, setNewDealValue] = useState<number>(0);
  const [newDealStageId, setNewDealStageId] = useState('');

  const activePipeline = pipelines.find((p) => p.id === selectedPipelineId) || pipelines[0];

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('text/plain', dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('text/plain');
    if (!dealId) return;

    const deal = deals.find((d) => d.id === dealId);
    if (!deal) return;

    onMoveDeal(dealId, targetStageId);

    const targetStage = activePipeline.stages.find((s) => s.id === targetStageId);

    // Trigger visual simulation of Stage Automation
    if (targetStage?.automation?.onEnterActions && targetStage.automation.onEnterActions.length > 0) {
      const logsToAppend = targetStage.automation.onEnterActions.map((act) => {
        let msg = '';
        if (act.type === 'send_message') {
          msg = `[WhatsApp/E-mail] Mensagem enviada automaticamente para ${deal.contactName}: "${act.config.text}"`;
        } else if (act.type === 'create_jira_issue') {
          msg = `[Automação n8n] Fluxo de trabalho executado com sucesso no n8n para o lead "${deal.contactName}".`;
        } else if (act.type === 'call_webhook') {
          msg = `[Gatilho Zapier] Evento HTTP POST enviado com sucesso para o Zapier: ${act.config.url}`;
        } else {
          msg = `[Motor de Atribuição] Lead atribuído automaticamente ao consultor comercial ativo.`;
        }
        return {
          id: `log-${Date.now()}-${Math.random()}`,
          msg,
          type: act.type,
        };
      });

      setAutomationLogs((prev) => [...logsToAppend, ...prev]);
    }
  };

  // Configure onEnter actions helper
  const [editingActions, setEditingActions] = useState<StageAction[]>([]);
  const openStageAutomationSettings = (stage: Stage) => {
    setActiveStageSettingsId(stage.id);
    setEditingActions(stage.automation?.onEnterActions || []);
  };

  const handleSaveAutomation = () => {
    if (activeStageSettingsId) {
      onUpdateStageAutomation(selectedPipelineId, activeStageSettingsId, editingActions);
      setActiveStageSettingsId(null);
    }
  };

  const addEditingAction = (type: 'send_message' | 'create_jira_issue' | 'call_webhook') => {
    let newAct: StageAction;
    if (type === 'send_message') {
      newAct = { type: 'send_message', config: { text: 'Olá! Seu lead avançou de estágio em nosso CRM.' } };
    } else if (type === 'create_jira_issue') {
      newAct = { type: 'create_jira_issue', config: { summary: 'Gatilho n8n - Novo Lead Comercial', projectKey: 'SUBA' } };
    } else {
      newAct = { type: 'call_webhook', config: { url: 'https://hooks.zapier.com/hooks/catch/12345/abcde/', method: 'POST' } };
    }
    setEditingActions([...editingActions, newAct]);
  };

  const handleCreatePipelineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPipelineName.trim()) return;
    const stagesArr = newPipelineStages.split(',').map(s => s.trim()).filter(Boolean);
    if (stagesArr.length === 0) return;
    onAddPipeline(newPipelineName, stagesArr);
    setNewPipelineName('');
    setNewPipelineStages('Novo Lead, Contato, Proposta, Fechado');
    setShowAddPipelineModal(false);
  };

  const handleCreateDealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDealTitle.trim() || !newDealContact.trim() || !newDealStageId) return;
    onAddDeal(newDealTitle, newDealContact, Number(newDealValue), selectedPipelineId, newDealStageId);
    setNewDealTitle('');
    setNewDealContact('');
    setNewDealValue(0);
    setShowAddDealModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Pipeline Toolbar */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <Columns className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Funis CRM Dinâmicos (Pipelines)</h2>
            <p className="text-slate-400 text-xs mt-0.5">Arraste os cards para alterar etapas e disparar automações baseadas em eventos.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl">
            {pipelines.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPipelineId(p.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  selectedPipelineId === p.id
                    ? 'bg-white text-slate-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddPipelineModal(true)}
            className="px-3 py-1.5 bg-slate-800 text-white hover:bg-slate-900 font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1 shrink-0 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Novo Funil
          </button>

          <button
            onClick={() => {
              setNewDealStageId(activePipeline?.stages[0]?.id || '');
              setShowAddDealModal(true);
            }}
            className="px-3 py-1.5 bg-amber-600 text-white hover:bg-amber-700 font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1 shrink-0 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Novo Card
          </button>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[460px] overflow-hidden">
        {activePipeline.stages.map((stage) => {
          const stageDeals = deals.filter((d) => d.stageId === stage.id && d.pipelineId === selectedPipelineId);
          return (
            <div
              key={stage.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
              className="bg-slate-100/50 border border-slate-200 rounded-2xl p-4 flex flex-col h-full"
            >
              {/* Column Header */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wide">{stage.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200/60 text-[10px] font-mono font-bold text-slate-600">
                    {stageDeals.length}
                  </span>
                </div>
                <button
                  onClick={() => openStageAutomationSettings(stage)}
                  className="p-1.5 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-lg transition cursor-pointer"
                  title="Configurar automações da etapa"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>

              {/* Deal Cards */}
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pb-4 pr-1">
                {stageDeals.length === 0 ? (
                  <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-400 text-xs font-bold">
                    Arraste negócios para cá
                  </div>
                ) : (
                  stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal.id)}
                      className="bg-white border border-slate-200 hover:border-amber-400 p-4 rounded-xl shadow-xs cursor-grab active:cursor-grabbing transition duration-150"
                    >
                      <h4 className="text-xs font-bold text-slate-800 leading-snug">{deal.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-1">Cliente: <span className="font-semibold text-slate-600">{deal.contactName}</span></p>
                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100">
                        <span className="text-xs font-black text-amber-600 font-mono">
                          {deal.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                        {stage.automation && stage.automation.onEnterActions.length > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[9px] font-mono font-extrabold flex items-center gap-1">
                            <Zap className="w-2.5 h-2.5 animate-pulse" />
                            Gatilho Ativo
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulated Stage Automation Logger Console */}
      {automationLogs.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-200 font-mono flex items-center gap-1.5 uppercase tracking-wider">
              <Zap className="text-amber-500 w-3.5 h-3.5 animate-bounce" />
              Retorno em Tempo Real de Automações Executadas
            </h3>
            <button
              onClick={() => setAutomationLogs([])}
              className="text-[10px] text-slate-400 hover:text-white cursor-pointer font-bold"
            >
              Limpar Logs
            </button>
          </div>
          <div className="space-y-2 max-h-[120px] overflow-y-auto custom-scrollbar font-mono text-[11px] text-amber-400">
            {automationLogs.map((log) => (
              <div key={log.id} className="flex gap-2 items-start">
                <span className="text-emerald-500 font-bold">[SUCESSO]</span>
                <span className="text-slate-300">{log.msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stage Settings Modal */}
      {activeStageSettingsId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-lg w-full space-y-5 shadow-xl">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                Configurar Automações ao Entrar no Estágio
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">Defina ações automáticas executadas instantaneamente nos canais integrados.</p>
              <div className="mt-2 py-1 px-3 bg-amber-50 text-amber-800 rounded-lg text-xs font-bold inline-block">
                Estágio Selecionado: {activePipeline.stages.find((s) => s.id === activeStageSettingsId)?.name}
              </div>
            </div>

            <div className="space-y-4 max-h-[280px] overflow-y-auto custom-scrollbar p-1">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 uppercase font-mono block font-bold">Disparos de Eventos Configurados</label>
                {editingActions.length === 0 ? (
                  <p className="text-slate-400 text-xs italic">Nenhuma ação de estágio configurada ainda. Adicione uma abaixo.</p>
                ) : (
                  editingActions.map((act, i) => (
                    <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-start gap-3">
                      <div className="text-xs space-y-1.5 flex-1">
                        <span className="font-mono font-extrabold text-amber-700 text-[10px] bg-amber-50 border border-amber-200/50 px-2 py-0.5 rounded-full">
                          {act.type === 'create_jira_issue' ? 'N8N_TRIGGER' : act.type === 'call_webhook' ? 'ZAPIER_WEBHOOK' : 'WHATSAPP_SEND'}
                        </span>
                        {act.type === 'send_message' && (
                          <input
                            type="text"
                            value={act.config.text}
                            onChange={(e) => {
                              const copy = [...editingActions];
                              copy[i].config.text = e.target.value;
                              setEditingActions(copy);
                            }}
                            className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 mt-2 text-xs text-slate-700 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                          />
                        )}
                        {act.type === 'create_jira_issue' && (
                          <input
                            type="text"
                            value={act.config.summary}
                            onChange={(e) => {
                              const copy = [...editingActions];
                              copy[i].config.summary = e.target.value;
                              setEditingActions(copy);
                            }}
                            className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 mt-2 text-xs text-slate-700 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                          />
                        )}
                        {act.type === 'call_webhook' && (
                          <input
                            type="text"
                            value={act.config.url}
                            onChange={(e) => {
                              const copy = [...editingActions];
                              copy[i].config.url = e.target.value;
                              setEditingActions(copy);
                            }}
                            className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 mt-2 text-xs text-slate-700 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                          />
                        )}
                      </div>
                      <button
                        onClick={() => setEditingActions(editingActions.filter((_, idx) => idx !== i))}
                        className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add buttons */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => addEditingAction('send_message')}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  + WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => addEditingAction('create_jira_issue')}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  + Disparador n8n
                </button>
                <button
                  type="button"
                  onClick={() => addEditingAction('call_webhook')}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  + Disparador Zapier
                </button>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveStageSettingsId(null)}
                className="px-4 py-2 text-xs text-slate-500 font-bold hover:text-slate-800 cursor-pointer"
              >
                Fechar
              </button>
              <button
                onClick={handleSaveAutomation}
                className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 text-xs font-bold rounded-xl cursor-pointer shadow-sm"
              >
                Salvar Automações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Pipeline Modal */}
      {showAddPipelineModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCreatePipelineSubmit} className="bg-white border border-slate-200 p-6 rounded-2xl max-w-md w-full space-y-5 shadow-xl">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                Criar Novo Funil de Vendas (Pipeline)
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">Defina uma nova trilha com etapas customizadas para organizar seus contatos e leads.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1 font-bold">Nome do Funil</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Funil de Vendas Corporativo"
                  value={newPipelineName}
                  onChange={(e) => setNewPipelineName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1 font-bold">Etapas (Separadas por vírgula)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Novo Lead, Contato, Proposta, Negociação, Fechado"
                  value={newPipelineStages}
                  onChange={(e) => setNewPipelineStages(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
                <p className="text-[10px] text-slate-400 italic mt-1">Crie as etapas em ordem de progresso separando-as por vírgula.</p>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddPipelineModal(false)}
                className="px-4 py-2 text-xs text-slate-500 font-bold hover:text-slate-800 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2 text-xs font-bold rounded-xl cursor-pointer shadow-sm"
              >
                Criar Funil
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Deal Modal */}
      {showAddDealModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCreateDealSubmit} className="bg-white border border-slate-200 p-6 rounded-2xl max-w-md w-full space-y-5 shadow-xl">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                Adicionar Novo Card / Lead (CRM)
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">Cadastre uma nova oportunidade comercial e defina seu valor estimado.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1 font-bold">Título do Negócio / Card</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lote Eucalipto 20m³"
                  value={newDealTitle}
                  onChange={(e) => setNewDealTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1 font-bold">Nome do Cliente (Contato)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ricardo Mendes"
                  value={newDealContact}
                  onChange={(e) => setNewDealContact(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1 font-bold">Valor (R$)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 8500"
                    value={newDealValue}
                    onChange={(e) => setNewDealValue(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1 font-bold">Etapa Inicial</label>
                  <select
                    value={newDealStageId}
                    onChange={(e) => setNewDealStageId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-bold"
                  >
                    {activePipeline?.stages.map((stg) => (
                      <option key={stg.id} value={stg.id}>
                        {stg.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddDealModal(false)}
                className="px-4 py-2 text-xs text-slate-500 font-bold hover:text-slate-800 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 text-xs font-bold rounded-xl cursor-pointer shadow-sm"
              >
                Adicionar Card
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
