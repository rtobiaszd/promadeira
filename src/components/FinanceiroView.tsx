import React, { useState } from 'react';
import { Landmark, ArrowUpRight, ArrowDownRight, Search, PlusCircle, CreditCard, DollarSign, Wallet } from 'lucide-react';

interface Invoice {
  id: string;
  type: 'payable' | 'receivable';
  description: string;
  entityName: string; // Supplier or Client
  value: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  category: string;
}

interface FinanceiroViewProps {
  initialSubView: 'apagar' | 'areceber';
}

export default function FinanceiroView({ initialSubView }: FinanceiroViewProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'FIN-001',
      type: 'payable',
      description: 'Aquisição Óleo Protetor de Autoclave',
      entityName: 'Química Industrial Sul S/A',
      value: 8400,
      dueDate: '2026-07-15',
      status: 'pending',
      category: 'Químicos / Insumos',
    },
    {
      id: 'FIN-002',
      type: 'receivable',
      description: 'Lote Pinus Autoclavado 40m³',
      entityName: 'Movelaria Silva S/A',
      value: 12500,
      dueDate: '2026-07-20',
      status: 'pending',
      category: 'Vendas Madeira',
    },
    {
      id: 'FIN-003',
      type: 'payable',
      description: 'Energia Elétrica Linha de Corte Estufas',
      entityName: 'Copel Distribuidora S/A',
      value: 14600,
      dueDate: '2026-07-10',
      status: 'paid',
      category: 'Utilidades',
    },
    {
      id: 'FIN-004',
      type: 'receivable',
      description: 'Venda de Subprodutos (Serragem/Cavaco)',
      entityName: 'Briquetes Biopower Ltda',
      value: 4100,
      dueDate: '2026-07-05',
      status: 'paid',
      category: 'Biomassa',
    },
    {
      id: 'FIN-005',
      type: 'payable',
      description: 'Comissão de Representante',
      entityName: 'Claudio Medeiros',
      value: 3520,
      dueDate: '2026-07-12',
      status: 'pending',
      category: 'Comissões',
    },
  ]);

  const [activeTab, setActiveTab] = useState<'payable' | 'receivable'>(
    initialSubView === 'apagar' ? 'payable' : 'receivable'
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [description, setDescription] = useState('');
  const [entityName, setEntityName] = useState('');
  const [value, setValue] = useState(5000);
  const [dueDate, setDueDate] = useState('2026-07-15');
  const [category, setCategory] = useState('Geral');

  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setSimulatedLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 4)]);
  };

  // Sync state if initialSubView changes
  React.useEffect(() => {
    setActiveTab(initialSubView === 'apagar' ? 'payable' : 'receivable');
  }, [initialSubView]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !entityName) return;

    const newInvoice: Invoice = {
      id: `FIN-00${invoices.length + 1}`,
      type: activeTab,
      description,
      entityName,
      value,
      dueDate,
      status: 'pending',
      category,
    };

    setInvoices([newInvoice, ...invoices]);
    setShowAddModal(false);
    setDescription('');
    setEntityName('');
    setValue(5000);

    addLog(`INSERT INTO financial_ledger (id, type, value, entity) VALUES ('${newInvoice.id}', '${activeTab}', ${value}, '${entityName}') - Supabase OK`);
  };

  const markAsPaid = (id: string) => {
    setInvoices(prev =>
      prev.map(inv => (inv.id === id ? { ...inv, status: 'paid' } : inv))
    );
    addLog(`UPDATE financial_ledger SET status = 'paid' WHERE id = '${id}'`);
  };

  const filtered = invoices
    .filter(inv => inv.type === activeTab)
    .filter(inv =>
      inv.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalPending = invoices
    .filter(inv => inv.type === activeTab && inv.status !== 'paid')
    .reduce((acc, curr) => acc + curr.value, 0);

  const totalPaid = invoices
    .filter(inv => inv.type === activeTab && inv.status === 'paid')
    .reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-6" id="view-financeiro">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              {activeTab === 'payable' ? 'Financeiro: Contas a Pagar (Custos)' : 'Financeiro: Contas a Receber (Vendas)'}
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">Conciliação bancária, fluxo de caixa operacional e impostos retidos na fonte para a ProMadeira.</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          {activeTab === 'payable' ? 'Novo Título a Pagar' : 'Novo Título a Receber'}
        </button>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">Volume Líquido Pago/Recebido</span>
            <span className="text-xl font-black text-slate-900 font-mono">
              R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">Volume Total Pendente</span>
            <span className="text-xl font-black text-amber-600 font-mono">
              R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="p-2 bg-amber-50 text-amber-500 rounded-xl">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between text-slate-200 shadow-xs">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-extrabold font-mono text-amber-500 uppercase tracking-wider">Gateway Integrado</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="font-mono text-[10px] text-slate-400 mt-2">
            <div>API: Supabase + Asaas API / Open Finance</div>
            <div className="text-slate-300">NFe Auto-Sincronizada</div>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 text-xs">
        <button
          onClick={() => setActiveTab('payable')}
          className={`px-6 py-3 font-bold border-b-2 transition cursor-pointer ${
            activeTab === 'payable' ? 'border-amber-600 text-amber-700 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Contas a Pagar
        </button>
        <button
          onClick={() => setActiveTab('receivable')}
          className={`px-6 py-3 font-bold border-b-2 transition cursor-pointer ${
            activeTab === 'receivable' ? 'border-amber-600 text-amber-700 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Contas a Receber
        </button>
      </div>

      {/* Main invoices list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar por descrição, favorecido ou categoria..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-mono font-bold uppercase border-b border-slate-200">
                  <th className="p-4 text-[10px]">CÓDIGO</th>
                  <th className="p-4 text-[10px]">DESCRIÇÃO</th>
                  <th className="p-4 text-[10px]">{activeTab === 'payable' ? 'CREDOR / FORNECEDOR' : 'DEVEDOR / CLIENTE'}</th>
                  <th className="p-4 text-[10px]">CATEGORIA</th>
                  <th className="p-4 text-[10px] text-right">VENCIMENTO</th>
                  <th className="p-4 text-[10px] text-right">VALOR EM R$</th>
                  <th className="p-4 text-[10px]">STATUS</th>
                  <th className="p-4 text-[10px] text-right">AÇÕES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-mono font-bold text-amber-700">{inv.id}</td>
                    <td className="p-4">
                      <span className="font-bold text-slate-900 block">{inv.description}</span>
                    </td>
                    <td className="p-4 text-slate-600 font-bold">{inv.entityName}</td>
                    <td className="p-4 font-mono text-slate-500 text-[10px]">{inv.category.toUpperCase()}</td>
                    <td className="p-4 text-right font-mono text-slate-500">{inv.dueDate}</td>
                    <td className="p-4 text-right font-mono font-black text-slate-900">
                      R$ {inv.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.status === 'paid' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${inv.status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {inv.status === 'paid' ? 'Liquidado' : 'Aberto'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {inv.status !== 'paid' ? (
                        <button
                          onClick={() => markAsPaid(inv.id)}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2.5 py-1.5 rounded-lg font-bold transition border border-emerald-200 cursor-pointer text-[10px]"
                        >
                          Liquidar
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono italic">Finalizado</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Logs */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-slate-200">
            <h3 className="text-[10px] font-extrabold uppercase font-mono text-amber-500 tracking-wider flex items-center gap-1.5 mb-2.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Gateway Supabase Financial Logs
            </h3>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[9px] text-slate-400 space-y-1.5 min-h-[140px] max-h-[220px] overflow-y-auto">
              <div>-- Auditoria Realtime Open Finance --</div>
              {simulatedLogs.map((log, i) => (
                <div key={i} className="text-slate-300 border-l border-amber-500 pl-1.5 truncate">
                  {log}
                </div>
              ))}
              {simulatedLogs.length === 0 && (
                <div className="text-slate-600">Nenhum evento financeiro ativo.</div>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider font-mono">Controle de Caixa</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Todos os recebimentos geram automação webhook para o CRM. O status do Lead é alterado de forma automatizada no momento em que a SEFAZ aprova a nota.
            </p>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-xl text-xs">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              {activeTab === 'payable' ? 'Lançar Título a Pagar' : 'Lançar Título a Receber'}
            </h3>
            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Descrição do Lançamento</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="ex: Faturamento de Pranchas de Pinus"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">
                  {activeTab === 'payable' ? 'Favorecido (Credor)' : 'Cliente (Devedor)'}
                </label>
                <input
                  type="text"
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  placeholder="ex: Movelaria Silva S/A"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Valor (R$)</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Vencimento</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Categoria</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="ex: Logística, Matéria-Prima, Venda"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs"
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
                  Salvar Título
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
