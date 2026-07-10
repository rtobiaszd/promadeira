import React, { useState } from 'react';
import { PlusCircle, Search, Percent, ShieldCheck, BadgePercent, Coins } from 'lucide-react';

interface Commission {
  id: string;
  representative: string;
  dealTitle: string;
  dealValue: number;
  ratePercent: number;
  earnedValue: number;
  status: 'pending' | 'paid' | 'processing';
  date: string;
}

export default function ComissoesVendasView() {
  const [commissions, setCommissions] = useState<Commission[]>([
    {
      id: 'COM-001',
      representative: 'Claudio Medeiros',
      dealTitle: 'Lote Pinus Autoclavado 40m³',
      dealValue: 12500,
      ratePercent: 2.5,
      earnedValue: 312.5,
      status: 'paid',
      date: '2026-07-09',
    },
    {
      id: 'COM-002',
      representative: 'Patricia Oliveira',
      dealTitle: 'Fornecimento Eucalipto Tratado S/A',
      dealValue: 45000,
      ratePercent: 3.0,
      earnedValue: 1350,
      status: 'pending',
      date: '2026-07-10',
    },
    {
      id: 'COM-003',
      representative: 'Claudio Medeiros',
      dealTitle: 'Lote Dormentes Ferroviários Tratados',
      dealValue: 88000,
      ratePercent: 4.0,
      earnedValue: 3520,
      status: 'processing',
      date: '2026-07-10',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [representative, setRepresentative] = useState('');
  const [dealTitle, setDealTitle] = useState('');
  const [dealValue, setDealValue] = useState(10000);
  const [ratePercent, setRatePercent] = useState(3);
  const [status, setStatus] = useState<'pending' | 'paid' | 'processing'>('pending');

  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setSimulatedLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 4)]);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!representative || !dealTitle) return;

    const earned = (dealValue * ratePercent) / 100;
    const newComm: Commission = {
      id: `COM-00${commissions.length + 1}`,
      representative,
      dealTitle,
      dealValue,
      ratePercent,
      earnedValue: earned,
      status,
      date: new Date().toISOString().split('T')[0],
    };

    setCommissions([newComm, ...commissions]);
    setShowAddModal(false);
    setRepresentative('');
    setDealTitle('');
    setDealValue(10000);

    addLog(`INSERT INTO commissions (representative, earned) VALUES ('${representative}', ${earned}) - Supabase RLS OK`);
  };

  const payAllPending = () => {
    setCommissions(prev =>
      prev.map(c => c.status === 'pending' || c.status === 'processing' ? { ...c, status: 'paid' } : c)
    );
    addLog(`UPDATE commissions SET status = 'paid' WHERE status IN ('pending','processing') - Transação Vercel OK`);
  };

  const filtered = commissions.filter(c =>
    c.representative.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.dealTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6" id="view-comissoes-vendas">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Comissões de Vendas de Madeira</h2>
            <p className="text-slate-400 text-xs mt-0.5">Controle de percentuais, saques e relatórios consolidados de representantes da ProMadeira.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={payAllPending}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            Liquidar Pendentes
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Nova Comissão
          </button>
        </div>
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
                placeholder="Buscar por Representante ou Negócio..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-mono font-bold uppercase border-b border-slate-200">
                  <th className="p-4 text-[10px]">CÓDIGO</th>
                  <th className="p-4 text-[10px]">REPRESENTANTE</th>
                  <th className="p-4 text-[10px]">NEGÓCIO / CONTRATO</th>
                  <th className="p-4 text-[10px] text-right">VALOR DO LOTE</th>
                  <th className="p-4 text-[10px] text-center">TAXA (%)</th>
                  <th className="p-4 text-[10px] text-right font-bold text-amber-700">COMISSÃO</th>
                  <th className="p-4 text-[10px]">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-mono font-bold text-amber-600">{c.id}</td>
                    <td className="p-4 font-bold text-slate-900">{c.representative}</td>
                    <td className="p-4 text-slate-500">{c.dealTitle}</td>
                    <td className="p-4 text-right font-mono">
                      R$ {c.dealValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-center font-mono font-bold text-slate-500">
                      {c.ratePercent}%
                    </td>
                    <td className="p-4 text-right font-mono font-black text-amber-700">
                      R$ {c.earnedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'paid' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : c.status === 'processing'
                          ? 'bg-blue-50 text-blue-700 border border-blue-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          c.status === 'paid' ? 'bg-emerald-500' : c.status === 'processing' ? 'bg-blue-500' : 'bg-amber-500'
                        }`} />
                        {c.status === 'paid' ? 'Paga' : c.status === 'processing' ? 'Aprovada' : 'Pendente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Cards */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-slate-200">
            <h3 className="text-[10px] font-extrabold uppercase font-mono text-amber-500 tracking-wider flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Faturamento & Impostos logs
            </h3>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[9px] text-slate-400 space-y-1.5 min-h-[110px]">
              <div>-- Auditoria Geral de Comissionamento --</div>
              {simulatedLogs.map((log, i) => (
                <div key={i} className="text-slate-300 truncate">
                  {log}
                </div>
              ))}
              {simulatedLogs.length === 0 && (
                <div className="text-slate-600">Nenhum lançamento recente.</div>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-xs">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono">Consolidado Acumulado</h4>
            <div className="space-y-2.5 text-xs pt-1">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Comissões Pagas</span>
                <span className="font-bold text-emerald-600 font-mono">
                  R$ {commissions.filter(c => c.status === 'paid').reduce((acc, curr) => acc + curr.earnedValue, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Comissões Pendentes</span>
                <span className="font-bold text-amber-600 font-mono">
                  R$ {commissions.filter(c => c.status !== 'paid').reduce((acc, curr) => acc + curr.earnedValue, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-500">Média de Alíquota</span>
                <span className="font-bold text-slate-800 font-mono">
                  {(commissions.reduce((acc, curr) => acc + curr.ratePercent, 0) / commissions.length).toFixed(2)} %
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Commission Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-xl text-xs">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Adicionar Lançamento de Comissão</h3>
            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Representante Comercial</label>
                <input
                  type="text"
                  value={representative}
                  onChange={(e) => setRepresentative(e.target.value)}
                  placeholder="ex: Claudio Medeiros"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Título do Negócio / Lote</label>
                <input
                  type="text"
                  value={dealTitle}
                  onChange={(e) => setDealTitle(e.target.value)}
                  placeholder="ex: Fornecimento de Prancha de Eucalipto"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Valor Total Vendido (R$)</label>
                  <input
                    type="number"
                    value={dealValue}
                    onChange={(e) => setDealValue(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Taxa de Comissão (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={ratePercent}
                    onChange={(e) => setRatePercent(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Status Inicial</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                >
                  <option value="pending">Pendente de Liberação</option>
                  <option value="processing">Aprovada para Pagamento</option>
                  <option value="paid">Paga / Liquidada</option>
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
                  Lançar Comissão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
