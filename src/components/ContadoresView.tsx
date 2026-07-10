import React, { useState } from 'react';
import { Hash, Plus, RefreshCw, Save, HelpCircle, AlertCircle } from 'lucide-react';

interface Counter {
  id: string;
  type: 'romaneio' | 'ordem';
  name: string;
  prefix: string;
  currentValue: number;
  format: string;
  description: string;
}

interface ContadoresViewProps {
  initialSubView: 'romaneio' | 'ordem';
}

export default function ContadoresView({ initialSubView }: ContadoresViewProps) {
  const [activeTab, setActiveTab] = useState<'romaneio' | 'ordem'>(
    initialSubView === 'romaneio' ? 'romaneio' : 'ordem'
  );

  const [counters, setCounters] = useState<Counter[]>([
    {
      id: 'CNT-1',
      type: 'romaneio',
      name: 'Contador de Romaneios de Saída',
      prefix: 'ROM-2026-',
      currentValue: 42,
      format: 'ROM-2026-XXXX',
      description: 'Gera números sequenciais para manifestos de carga do pátio e romaneio de balança.',
    },
    {
      id: 'CNT-2',
      type: 'ordem',
      name: 'Contador de Ordens de Compra',
      prefix: 'ORD-2026-',
      currentValue: 251,
      format: 'ORD-2026-XXXX',
      description: 'Gera identificadores de compra de toras de fornecedores credenciados.',
    },
  ]);

  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setSimulatedLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 4)]);
  };

  // Sync state if initialSubView changes
  React.useEffect(() => {
    setActiveTab(initialSubView === 'romaneio' ? 'romaneio' : 'ordem');
  }, [initialSubView]);

  const activeCounter = counters.find(c => c.type === activeTab) || counters[0];

  const handleUpdatePrefix = (id: string, newPrefix: string) => {
    setCounters(prev =>
      prev.map(c => (c.id === id ? { ...c, prefix: newPrefix, format: `${newPrefix}XXXX` } : c))
    );
    addLog(`UPDATE system_counters SET prefix = '${newPrefix}' WHERE id = '${id}'`);
  };

  const handleUpdateValue = (id: string, newVal: number) => {
    setCounters(prev =>
      prev.map(c => (c.id === id ? { ...c, currentValue: newVal } : c))
    );
    addLog(`UPDATE system_counters SET current_val = ${newVal} WHERE id = '${id}'`);
  };

  const handleResetValue = (id: string) => {
    setCounters(prev =>
      prev.map(c => (c.id === id ? { ...c, currentValue: 1 } : c))
    );
    addLog(`UPDATE system_counters SET current_val = 1 WHERE id = '${id}' - Sequência Reiniciada`);
  };

  return (
    <div className="space-y-6" id="view-contadores">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <Hash className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              {activeTab === 'romaneio' ? 'Contadores: Contador Romaneio de Madeira' : 'Contadores: Contador Ordem de Compra'}
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">Defina padrões sequenciais automáticos para preenchimento de documentos fiscais e internos.</p>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 text-xs">
        <button
          onClick={() => setActiveTab('romaneio')}
          className={`px-6 py-3 font-bold border-b-2 transition cursor-pointer ${
            activeTab === 'romaneio' ? 'border-amber-600 text-amber-700 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Contador Romaneio
        </button>
        <button
          onClick={() => setActiveTab('ordem')}
          className={`px-6 py-3 font-bold border-b-2 transition cursor-pointer ${
            activeTab === 'ordem' ? 'border-amber-600 text-amber-700 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Contador Ordem de Compra
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main setup form */}
        <div className="md:col-span-2 bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">{activeCounter.name}</h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{activeCounter.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Prefixo do Documento</label>
              <input
                type="text"
                value={activeCounter.prefix}
                onChange={(e) => handleUpdatePrefix(activeCounter.id, e.target.value)}
                placeholder="ex: ROM-2026-"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Próximo Número da Sequência</label>
              <input
                type="number"
                value={activeCounter.currentValue}
                onChange={(e) => handleUpdateValue(activeCounter.id, Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-mono font-bold"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase font-mono block font-bold">Máscara Exemplo</span>
              <span className="font-mono font-black text-amber-700 text-sm">
                {activeCounter.prefix}{'0'.repeat(Math.max(1, 4 - String(activeCounter.currentValue).length))}{activeCounter.currentValue}
              </span>
            </div>
            <button
              onClick={() => handleResetValue(activeCounter.id)}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1 cursor-pointer transition"
            >
              <RefreshCw className="w-3 h-3" />
              Zerar Sequência
            </button>
          </div>
        </div>

        {/* Counter audit logs */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-slate-200">
            <h3 className="text-[10px] font-extrabold uppercase font-mono text-amber-500 tracking-wider flex items-center gap-1.5 mb-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Counter SQL Audit
            </h3>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[9px] text-slate-400 space-y-1.5 min-h-[140px] max-h-[220px] overflow-y-auto">
              <div>-- Auditoria de Seq ID --</div>
              {simulatedLogs.map((log, i) => (
                <div key={i} className="text-slate-300 border-l border-amber-500 pl-1.5">
                  {log}
                </div>
              ))}
              {simulatedLogs.length === 0 && (
                <div className="text-slate-600">Nenhuma alteração de contador.</div>
              )}
            </div>
          </div>

          <div className="bg-amber-50/50 border border-amber-200 p-4 rounded-2xl flex gap-3 text-xs">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-amber-900 font-bold font-mono text-[10px] uppercase block">Atenção ao Zerar</strong>
              <p className="text-amber-700 text-[11px] leading-relaxed">
                Zerar a sequência de contadores de Romaneio ou Ordens de compra pode gerar duplicidade de chaves no banco de dados se não houver um novo prefixo anual.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
