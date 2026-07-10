import React, { useState } from 'react';
import { Search, FileText, CheckCircle, ArrowUpRight, HelpCircle } from 'lucide-react';

interface HistoricItem {
  id: string;
  type: 'romaneio' | 'compra';
  date: string;
  description: string;
  partnerName: string; // client or supplier
  amountValue: number;
  secondaryInfo: string; // license plate or requester
}

interface HistoricoViewProps {
  initialSubView: 'romaneios' | 'ordens';
}

export default function HistoricoView({ initialSubView }: HistoricoViewProps) {
  const [activeTab, setActiveTab] = useState<'romaneio' | 'compra'>(
    initialSubView === 'romaneios' ? 'romaneio' : 'compra'
  );

  const [searchTerm, setSearchTerm] = useState('');

  const [historyItems] = useState<HistoricItem[]>([
    {
      id: 'ROM-2026-030',
      type: 'romaneio',
      date: '2026-07-01',
      description: 'Lote Pinus Autoclavado Amostras',
      partnerName: 'Movelaria Silva S/A',
      amountValue: 3400,
      secondaryInfo: 'Placa: BRA-3X92 | Driver: Marcos Pontes',
    },
    {
      id: 'ROM-2026-031',
      type: 'romaneio',
      date: '2026-07-03',
      description: 'Carga Fechada Dormentes e Vigas',
      partnerName: 'Souza Esquadrias de Madeira',
      amountValue: 24500,
      secondaryInfo: 'Placa: PRT-8W11 | Driver: Valdir Ramos',
    },
    {
      id: 'ORD-2026-250',
      type: 'compra',
      date: '2026-06-28',
      description: 'Lote Eucalipto Tora Bruta 150m³',
      partnerName: 'Florestal Rio Claro S/A',
      amountValue: 27000,
      secondaryInfo: 'Solicitado por: Eng. Rodolfo Castro',
    },
    {
      id: 'ORD-2026-251',
      type: 'compra',
      date: '2026-07-02',
      description: 'Tratamento CCA Química Autoclave Lote #4',
      partnerName: 'Química Industrial Sul S/A',
      amountValue: 18400,
      secondaryInfo: 'Solicitado por: Gerente Carlos Souza',
    },
  ]);

  // Sync state if initialSubView changes
  React.useEffect(() => {
    setActiveTab(initialSubView === 'romaneios' ? 'romaneio' : 'compra');
  }, [initialSubView]);

  const filtered = historyItems
    .filter(i => i.type === activeTab)
    .filter(i =>
      i.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.partnerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="space-y-6" id="view-historico-geral">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              {activeTab === 'romaneio' ? 'Histórico Geral: Romaneios Emitidos' : 'Histórico Geral: Ordens de Compra Efetuadas'}
            </h2>
            <p className="text-slate-400 text-xs mt-0.5 font-sans">
              Histórico consolidado e imutável de movimentações fiscais e de pátio da ProMadeira, auditadas no Supabase.
            </p>
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
          Histórico Romaneios
        </button>
        <button
          onClick={() => setActiveTab('compra')}
          className={`px-6 py-3 font-bold border-b-2 transition cursor-pointer ${
            activeTab === 'compra' ? 'border-amber-600 text-amber-700 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Histórico Ordens de Compra
        </button>
      </div>

      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por Código, Nome ou Descrição..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-700 focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-400 font-mono font-bold uppercase border-b border-slate-200">
              <th className="p-4 text-[10px]">DATA</th>
              <th className="p-4 text-[10px]">CÓDIGO</th>
              <th className="p-4 text-[10px]">DESCRIÇÃO</th>
              <th className="p-4 text-[10px]">{activeTab === 'romaneio' ? 'CLIENTE' : 'FORNECEDOR'}</th>
              <th className="p-4 text-[10px]">DETALHES SECUNDÁRIOS</th>
              <th className="p-4 text-[10px] text-right">VALOR CONTRATO</th>
              <th className="p-4 text-[10px] text-center">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filtered.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition">
                <td className="p-4 font-mono text-slate-500">{item.date}</td>
                <td className="p-4 font-mono font-bold text-amber-700">{item.id}</td>
                <td className="p-4">
                  <span className="font-bold text-slate-900 block">{item.description}</span>
                </td>
                <td className="p-4 text-slate-600 font-bold">{item.partnerName}</td>
                <td className="p-4 text-slate-400 font-mono text-[10px]">{item.secondaryInfo}</td>
                <td className="p-4 text-right font-mono font-black text-slate-900">
                  R$ {item.amountValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    Finalizado
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-slate-400 italic">
                  Nenhum registro histórico encontrado para o filtro aplicado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
