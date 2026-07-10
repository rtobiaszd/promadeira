import React, { useState } from 'react';
import { Store, PlusCircle, Search, AlertTriangle, RefreshCw, BarChart2, Package } from 'lucide-react';

interface WoodProduct {
  id: string;
  name: string;
  category: 'Tabua' | 'Viga' | 'Caibro' | 'Tora' | 'Ripa';
  dimensions: string;
  volumeM3: number;
  piecesCount: number;
  unitPriceM3: number;
  minAlertM3: number;
}

export default function EstoqueView() {
  const [products, setProducts] = useState<WoodProduct[]>([
    {
      id: 'EST-001',
      name: 'Pinus Autoclavado Tratado',
      category: 'Tabua',
      dimensions: '25x150x3000mm',
      volumeM3: 45.2,
      piecesCount: 4017,
      unitPriceM3: 650,
      minAlertM3: 15.0,
    },
    {
      id: 'EST-002',
      name: 'Eucalipto Saligna Seco Estufa',
      category: 'Tabua',
      dimensions: '50x100x4000mm',
      volumeM3: 12.8,
      piecesCount: 640,
      unitPriceM3: 1200,
      minAlertM3: 20.0,
    },
    {
      id: 'EST-003',
      name: 'Dormentes Ferroviários Tratados',
      category: 'Viga',
      dimensions: '170x240x2800mm',
      volumeM3: 88.0,
      piecesCount: 768,
      unitPriceM3: 1850,
      minAlertM3: 10.0,
    },
    {
      id: 'EST-004',
      name: 'Ripas de Pinus para Telhado',
      category: 'Ripa',
      dimensions: '12x50x3000mm',
      volumeM3: 4.5,
      piecesCount: 2500,
      unitPriceM3: 450,
      minAlertM3: 8.0,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [dbLogs, setDbLogs] = useState<string[]>([]);

  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Tabua' | 'Viga' | 'Caibro' | 'Tora' | 'Ripa'>('Tabua');
  const [dimensions, setDimensions] = useState('');
  const [volumeM3, setVolumeM3] = useState(10);
  const [piecesCount, setPiecesCount] = useState(100);
  const [unitPriceM3, setUnitPriceM3] = useState(650);
  const [minAlertM3, setMinAlertM3] = useState(10);

  const addLog = (msg: string) => {
    setDbLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 4)]);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dimensions) return;

    const newProd: WoodProduct = {
      id: `EST-00${products.length + 1}`,
      name,
      category,
      dimensions,
      volumeM3,
      piecesCount,
      unitPriceM3,
      minAlertM3,
    };

    setProducts([newProd, ...products]);
    setShowAddModal(false);
    addLog(`INSERT INTO stock_products (name, category, volume_m3) VALUES ('${name}', '${category}', ${volumeM3}) - Supabase RLS OK`);
  };

  const handleQuickAdjust = (id: string, deltaM3: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const newVal = Math.max(0, p.volumeM3 + deltaM3);
          addLog(`UPDATE stock_products SET volume_m3 = ${newVal.toFixed(2)} WHERE id = '${id}'`);
          return { ...p, volumeM3: newVal };
        }
        return p;
      })
    );
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.dimensions.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6" id="view-estoque">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Controle de Estoque de Madeiras</h2>
            <p className="text-slate-400 text-xs mt-0.5">Níveis de fardos de madeira serrada, metros cúbicos em pátio, autoclaves e estufas da ProMadeira.</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          Novo Item Estoque
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
                placeholder="Pesquisar por Madeira, Categoria ou Medida..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-mono font-bold uppercase border-b border-slate-200">
                  <th className="p-4 text-[10px]">CÓDIGO</th>
                  <th className="p-4 text-[10px]">PRODUTO</th>
                  <th className="p-4 text-[10px]">CATEGORIA</th>
                  <th className="p-4 text-[10px]">MEDIDA</th>
                  <th className="p-4 text-[10px] text-right">VOLUME (M³)</th>
                  <th className="p-4 text-[10px] text-right">QTD PEÇAS</th>
                  <th className="p-4 text-[10px] text-right">VALOR ESTOQUE</th>
                  <th className="p-4 text-[10px] text-center">STATUS</th>
                  <th className="p-4 text-[10px] text-right">AJUSTE RÁPIDO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map(p => {
                  const isCritical = p.volumeM3 <= p.minAlertM3;
                  const totalVal = p.volumeM3 * p.unitPriceM3;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4 font-mono font-bold text-amber-700">{p.id}</td>
                      <td className="p-4">
                        <span className="font-bold text-slate-900 block">{p.name}</span>
                      </td>
                      <td className="p-4 text-slate-500 font-mono text-[10px]">{p.category.toUpperCase()}</td>
                      <td className="p-4 text-slate-500 font-mono">{p.dimensions}</td>
                      <td className="p-4 text-right font-mono font-bold">{p.volumeM3.toFixed(2)} m³</td>
                      <td className="p-4 text-right font-mono">{p.piecesCount.toLocaleString()} pçs</td>
                      <td className="p-4 text-right font-mono font-black text-slate-900">
                        R$ {totalVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          isCritical 
                            ? 'bg-rose-50 text-rose-700 border border-rose-100 animate-pulse' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                          {isCritical ? 'Estoque Crítico' : 'Seguro'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1 justify-end">
                          <button
                            onClick={() => handleQuickAdjust(p.id, -5)}
                            className="bg-slate-50 border border-slate-200 hover:bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold text-[10px] cursor-pointer"
                          >
                            -5m³
                          </button>
                          <button
                            onClick={() => handleQuickAdjust(p.id, 5)}
                            className="bg-slate-50 border border-slate-200 hover:bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold text-[10px] cursor-pointer"
                          >
                            +5m³
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar logs */}
        <div className="space-y-4">
          <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl border border-slate-800">
            <h3 className="text-[10px] font-extrabold uppercase font-mono text-amber-500 tracking-wider flex items-center gap-1.5 mb-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Inventário Logs Realtime
            </h3>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[9px] text-slate-400 space-y-1.5 min-h-[120px]">
              <div>-- Auditoria Geral de Estoques --</div>
              {dbLogs.map((log, i) => (
                <div key={i} className="text-slate-300 border-l border-amber-500 pl-1.5">
                  {log}
                </div>
              ))}
              {dbLogs.length === 0 && (
                <div className="text-slate-600">Nenhum ajuste registrado.</div>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-xs">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono">Consolidado Financeiro Estoque</h4>
            <div className="space-y-2.5 text-xs pt-1">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Volume Total em Pátio</span>
                <span className="font-bold text-slate-800 font-mono">
                  {products.reduce((acc, curr) => acc + curr.volumeM3, 0).toFixed(2)} m³
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Quantidade Peças</span>
                <span className="font-bold text-slate-800 font-mono">
                  {products.reduce((acc, curr) => acc + curr.piecesCount, 0).toLocaleString()} pçs
                </span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-500">Valor Total Ativos</span>
                <span className="font-bold text-amber-700 font-mono">
                  R$ {products.reduce((acc, curr) => acc + (curr.volumeM3 * curr.unitPriceM3), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Cadastrar Madeira no Estoque</h3>
            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Nome do Produto</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: Cedro Rosa Seco Estufa"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs"
                  >
                    <option value="Tabua">Tábua</option>
                    <option value="Viga">Viga</option>
                    <option value="Caibro">Caibro</option>
                    <option value="Tora">Tora</option>
                    <option value="Ripa">Ripa</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Dimensões (Ex: AxLxC)</label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder="25x150x3000mm"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[9px] text-slate-400 block mb-0.5">Volume (m³)</label>
                  <input
                    type="number"
                    value={volumeM3}
                    onChange={(e) => setVolumeM3(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-2 text-xs text-center"
                    required
                  />
                </div>
                <div>
                  <label className="text-[9px] text-slate-400 block mb-0.5">Qtd Peças</label>
                  <input
                    type="number"
                    value={piecesCount}
                    onChange={(e) => setPiecesCount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-2 text-xs text-center"
                    required
                  />
                </div>
                <div>
                  <label className="text-[9px] text-slate-400 block mb-0.5">Preço Unit m³ (R$)</label>
                  <input
                    type="number"
                    value={unitPriceM3}
                    onChange={(e) => setUnitPriceM3(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-2 text-xs text-center font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Volume Alerta Mínimo (m³)</label>
                <input
                  type="number"
                  value={minAlertM3}
                  onChange={(e) => setMinAlertM3(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs"
                  required
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
                  Cadastrar Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
