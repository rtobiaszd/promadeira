import React, { useState } from 'react';
import { ClipboardList, PlusCircle, CheckCircle, XCircle, Search, HelpCircle, FileSpreadsheet } from 'lucide-react';

interface PurchaseReq {
  id: string;
  woodType: string;
  spec: string;
  volumeM3: number;
  unitPrice: number;
  supplier: string;
  status: 'pending' | 'approved' | 'rejected';
  requester: string;
  createdAt: string;
}

export default function RequisicaoCompraView() {
  const [requisitions, setRequisitions] = useState<PurchaseReq[]>([
    {
      id: 'REQ-2026-001',
      woodType: 'Eucalipto',
      spec: 'Tora Bruta (Diâmetro 20-25cm)',
      volumeM3: 150,
      unitPrice: 180,
      supplier: 'Florestal Rio Claro S/A',
      status: 'approved',
      requester: 'Eng. Rodolfo Castro',
      createdAt: '2026-07-08',
    },
    {
      id: 'REQ-2026-002',
      woodType: 'Pinus',
      spec: 'Prancha Seca em Estufa (25x150mm)',
      volumeM3: 85,
      unitPrice: 420,
      supplier: 'Madeiras Reflorestadas Paraná',
      status: 'pending',
      requester: 'Gerente Carlos Souza',
      createdAt: '2026-07-10',
    },
    {
      id: 'REQ-2026-003',
      woodType: 'Cedro Rosa',
      spec: 'Blocos para Esquadrias Premium',
      volumeM3: 12,
      unitPrice: 1950,
      supplier: 'Nobre Wood Importadora',
      status: 'pending',
      requester: 'Mestre João Silva',
      createdAt: '2026-07-10',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [woodType, setWoodType] = useState('Pinus');
  const [spec, setSpec] = useState('');
  const [volumeM3, setVolumeM3] = useState(20);
  const [unitPrice, setUnitPrice] = useState(350);
  const [supplier, setSupplier] = useState('');
  const [requester, setRequester] = useState('Gerente Carlos Souza');

  // Supabase logging simulator
  const [apiLogs, setApiLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setApiLogs(prev => [`[${timestamp}] ${msg}`, ...prev.slice(0, 5)]);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spec || !supplier) return;

    const newReq: PurchaseReq = {
      id: `REQ-2026-00${requisitions.length + 1}`,
      woodType,
      spec,
      volumeM3,
      unitPrice,
      supplier,
      status: 'pending',
      requester,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setRequisitions([newReq, ...requisitions]);
    setShowAddModal(false);
    
    // reset form
    setSpec('');
    setSupplier('');
    setVolumeM3(20);
    setUnitPrice(350);

    addLog(`INSERT INTO purchase_requisitions (id, wood_type, volume) VALUES ('${newReq.id}', '${woodType}', ${volumeM3}) - Supabase OK`);
  };

  const handleUpdateStatus = (id: string, newStatus: 'approved' | 'rejected') => {
    setRequisitions(prev =>
      prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
    );
    addLog(`UPDATE purchase_requisitions SET status = '${newStatus}' WHERE id = '${id}' - Vercel Webhook Disparado`);
  };

  const filtered = requisitions.filter(r =>
    r.woodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6" id="view-requisicao-compra">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Requisições de Compra de Matéria-Prima</h2>
            <p className="text-slate-400 text-xs mt-0.5">Gestão de toras e lotes brutos de reflorestamento com automações de alçada de preço.</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          Nova Requisição
        </button>
      </div>

      {/* Grid Filter and Real-time Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar por Madeira, ID ou Fornecedor..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 font-mono font-bold uppercase border-b border-slate-200">
                    <th className="p-4 text-[10px]">CÓDIGO</th>
                    <th className="p-4 text-[10px]">TIPO / ESPECIFICAÇÃO</th>
                    <th className="p-4 text-[10px] text-right">VOLUME (M³)</th>
                    <th className="p-4 text-[10px] text-right">VALOR TOTAL</th>
                    <th className="p-4 text-[10px]">FORNECEDOR</th>
                    <th className="p-4 text-[10px]">STATUS</th>
                    <th className="p-4 text-[10px] text-right">AÇÕES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filtered.map(r => {
                    const total = r.volumeM3 * r.unitPrice;
                    return (
                      <tr key={r.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-4 font-mono font-bold text-amber-700">{r.id}</td>
                        <td className="p-4">
                          <span className="font-bold text-slate-900 block">{r.woodType}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{r.spec}</span>
                        </td>
                        <td className="p-4 text-right font-mono font-bold">{r.volumeM3} m³</td>
                        <td className="p-4 text-right font-mono font-bold text-slate-900">
                          R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-slate-500">{r.supplier}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            r.status === 'approved' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                              : r.status === 'rejected'
                              ? 'bg-rose-50 text-rose-700 border border-rose-100'
                              : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              r.status === 'approved' ? 'bg-emerald-500' : r.status === 'rejected' ? 'bg-rose-500' : 'bg-amber-500'
                            }`} />
                            {r.status === 'approved' ? 'Aprovado' : r.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {r.status === 'pending' ? (
                            <div className="flex gap-1.5 justify-end">
                              <button
                                onClick={() => handleUpdateStatus(r.id, 'approved')}
                                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded border border-emerald-200 transition cursor-pointer"
                                title="Aprovar Requisição"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(r.id, 'rejected')}
                                className="p-1 text-rose-600 hover:bg-rose-50 rounded border border-rose-200 transition cursor-pointer"
                                title="Rejeitar Requisição"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-mono italic">Processado</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400 italic">
                        Nenhuma requisição de compra encontrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Logs and Stats Card */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-slate-200">
            <h3 className="text-[10px] font-extrabold uppercase font-mono text-amber-500 tracking-wider flex items-center gap-1.5 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Integração Supabase RLS logs
            </h3>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[10px] text-slate-400 min-h-[140px] space-y-2 max-h-[220px] overflow-y-auto">
              <div>-- Auditoria Realtime Vercel / Supabase DB --</div>
              {apiLogs.map((log, idx) => (
                <div key={idx} className="text-slate-300 border-l-2 border-amber-500 pl-2">
                  {log}
                </div>
              ))}
              {apiLogs.length === 0 && (
                <div className="text-slate-600 italic">Nenhum evento registrado no fluxo de compra.</div>
              )}
            </div>
            <p className="text-[9px] text-slate-500 mt-2 italic">
              *As requisições acima possuem verificação de limites do tenant. Qualquer compra acima de R$ 50.000,00 dispara fluxo de assinatura digital para o CEO.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-xs">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono">Resumo Volumétrico</h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Total Solicitado Pinus</span>
                <span className="font-bold text-slate-800">
                  {requisitions.filter(r => r.woodType === 'Pinus').reduce((acc, curr) => acc + curr.volumeM3, 0)} m³
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Total Solicitado Eucalipto</span>
                <span className="font-bold text-slate-800">
                  {requisitions.filter(r => r.woodType === 'Eucalipto').reduce((acc, curr) => acc + curr.volumeM3, 0)} m³
                </span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-500">Valor Estimado em Trânsito</span>
                <span className="font-bold text-amber-700">
                  R$ {requisitions.reduce((acc, curr) => acc + (curr.volumeM3 * curr.unitPrice), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-xl text-xs">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Solicitar Requisição de Compra</h3>
            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Tipo de Madeira</label>
                <select
                  value={woodType}
                  onChange={(e) => setWoodType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                >
                  <option value="Pinus">Pinus de Reflorestamento</option>
                  <option value="Eucalipto">Eucalipto Tratado</option>
                  <option value="Cedro Rosa">Cedro Rosa de Manejo</option>
                  <option value="Garapeira">Garapeira Nobre</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Especificações Dimensionais / Estágio</label>
                <input
                  type="text"
                  value={spec}
                  onChange={(e) => setSpec(e.target.value)}
                  placeholder="ex: Pranchas brutas secas em estufa, sem nós"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Volume Desejado (m³)</label>
                  <input
                    type="number"
                    value={volumeM3}
                    onChange={(e) => setVolumeM3(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Preço Unitário Almejado (R$/m³)</label>
                  <input
                    type="number"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Fornecedor Credenciado</label>
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="ex: Florestal Rio Claro S/A"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Solicitante</label>
                <input
                  type="text"
                  value={requester}
                  onChange={(e) => setRequester(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs"
                  disabled
                />
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
                  Confirmar Solicitação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
