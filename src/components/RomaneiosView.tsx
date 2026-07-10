import React, { useState } from 'react';
import { List, PlusCircle, Search, Truck, Scale, Box, Check, HelpCircle } from 'lucide-react';

interface BundleDetail {
  thicknessMm: number;
  widthMm: number;
  lengthM: number;
  pieces: number;
}

interface Romaneio {
  id: string;
  clientName: string;
  plate: string;
  driverName: string;
  woodType: string;
  weightKg: number;
  bundles: BundleDetail[];
  status: 'draft' | 'loading' | 'transit' | 'delivered';
  createdAt: string;
}

export default function RomaneiosView() {
  const [romaneios, setRomaneios] = useState<Romaneio[]>([
    {
      id: 'ROM-2026-041',
      clientName: 'Movelaria Silva S/A',
      plate: 'BRA-3X92',
      driverName: 'Marcos Pontes',
      woodType: 'Pinus Autoclavado Seco',
      weightKg: 14200,
      bundles: [
        { thicknessMm: 25, widthMm: 150, lengthM: 3, pieces: 640 },
        { thicknessMm: 50, widthMm: 100, lengthM: 4, pieces: 320 },
      ],
      status: 'transit',
      createdAt: '2026-07-09',
    },
    {
      id: 'ROM-2026-042',
      clientName: 'Souza Esquadrias de Madeira',
      plate: 'PRT-8W11',
      driverName: 'Valdir Ramos',
      woodType: 'Eucalipto Tratado',
      weightKg: 22800,
      bundles: [
        { thicknessMm: 100, widthMm: 100, lengthM: 2.5, pieces: 450 },
        { thicknessMm: 75, widthMm: 75, lengthM: 3, pieces: 600 },
      ],
      status: 'loading',
      createdAt: '2026-07-10',
    },
  ]);

  const [selectedRomaneio, setSelectedRomaneio] = useState<Romaneio | null>(romaneios[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [clientName, setClientName] = useState('');
  const [plate, setPlate] = useState('');
  const [driverName, setDriverName] = useState('');
  const [woodType, setWoodType] = useState('Pinus Autoclavado');
  const [weightKg, setWeightKg] = useState(15000);
  
  // Single bundle item state for simple addition
  const [thickness, setThickness] = useState(25);
  const [width, setWidth] = useState(150);
  const [length, setLength] = useState(3.0);
  const [pieces, setPieces] = useState(100);

  const [dbLogs, setDbLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setDbLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 4)]);
  };

  const calculateVolumeM3 = (bundles: BundleDetail[]): number => {
    // Volume = thickness(m) * width(m) * length(m) * pieces
    return bundles.reduce((acc, curr) => {
      const vol = (curr.thicknessMm / 1000) * (curr.widthMm / 1000) * curr.lengthM * curr.pieces;
      return acc + vol;
    }, 0);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !driverName || !plate) return;

    const newRomaneio: Romaneio = {
      id: `ROM-2026-0${romaneios.length + 43}`,
      clientName,
      plate,
      driverName,
      woodType,
      weightKg,
      bundles: [
        { thicknessMm: thickness, widthMm: width, lengthM: length, pieces: pieces }
      ],
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setRomaneios([newRomaneio, ...romaneios]);
    setSelectedRomaneio(newRomaneio);
    setShowAddModal(false);

    // Reset
    setClientName('');
    setPlate('');
    setDriverName('');
    setWeightKg(15000);

    addLog(`INSERT INTO wood_manifests (id, client, driver) VALUES ('${newRomaneio.id}', '${clientName}', '${driverName}') - Supabase OK`);
  };

  const handleStatusChange = (id: string, nextStatus: 'draft' | 'loading' | 'transit' | 'delivered') => {
    setRomaneios(prev =>
      prev.map(r => {
        if (r.id === id) {
          const updated = { ...r, status: nextStatus };
          if (selectedRomaneio?.id === id) {
            setSelectedRomaneio(updated);
          }
          return updated;
        }
        return r;
      })
    );
    addLog(`UPDATE wood_manifests SET status = '${nextStatus}' WHERE id = '${id}'`);
  };

  const filtered = romaneios.filter(r =>
    r.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6" id="view-romaneios">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Romaneios de Embarque de Madeira</h2>
            <p className="text-slate-400 text-xs mt-0.5">Cubagem oficial de fardos, cubagem líquida, peso em balança rodoviária e manifesto de transporte.</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          Emitir Novo Romaneio
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Romaneios List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar por ID do Romaneio, Cliente ou Placa..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs divide-y divide-slate-100">
            {filtered.map(r => {
              const m3 = calculateVolumeM3(r.bundles);
              const isSelected = selectedRomaneio?.id === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRomaneio(r)}
                  className={`p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer transition ${
                    isSelected ? 'bg-amber-50/50 border-l-4 border-amber-600' : 'hover:bg-slate-50/50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-700 text-sm">{r.id}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase ${
                        r.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                        r.status === 'transit' ? 'bg-blue-100 text-blue-800' :
                        r.status === 'loading' ? 'bg-orange-100 text-orange-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {r.status === 'delivered' ? 'Entregue' :
                         r.status === 'transit' ? 'Em Trânsito' :
                         r.status === 'loading' ? 'Carregando' : 'Rascunho'}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-xs">{r.clientName}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Placa: <strong className="text-slate-600">{r.plate}</strong> | Driver: <strong className="text-slate-600">{r.driverName}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-6 text-right font-mono self-end sm:self-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-mono">Volume Total</span>
                      <span className="font-bold text-slate-800 text-xs">{m3.toFixed(3)} m³</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-mono">Peso Liquido</span>
                      <span className="font-bold text-slate-800 text-xs">{(r.weightKg / 1000).toFixed(1)} t</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Romaneio Detail Panel */}
        <div className="space-y-4">
          {selectedRomaneio ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-mono font-black text-amber-700 text-sm">{selectedRomaneio.id}</h3>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleStatusChange(selectedRomaneio.id, 'transit')}
                    className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer"
                  >
                    Despachar
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedRomaneio.id, 'delivered')}
                    className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer"
                  >
                    Entregar
                  </button>
                </div>
              </div>

              {/* Overview cards */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[9px] text-slate-400 uppercase block font-mono">Especificação</span>
                  <span className="font-bold text-slate-800 truncate block mt-0.5">{selectedRomaneio.woodType}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[9px] text-slate-400 uppercase block font-mono">Balança (Bacia)</span>
                  <span className="font-bold text-slate-800 block mt-0.5">{selectedRomaneio.weightKg.toLocaleString()} kg</span>
                </div>
              </div>

              {/* Bundles Detail List */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block">Fardos / Pacotes de Madeira</span>
                <div className="bg-slate-50 rounded-xl border border-slate-100 divide-y divide-slate-200/60 overflow-hidden text-xs">
                  {selectedRomaneio.bundles.map((b, index) => {
                    const bundleVol = (b.thicknessMm / 1000) * (b.widthMm / 1000) * b.lengthM * b.pieces;
                    return (
                      <div key={index} className="p-3 flex justify-between items-center">
                        <div>
                          <span className="font-mono font-bold block text-slate-800">
                            {b.thicknessMm} x {b.widthMm} x {(b.lengthM * 1000) / 1000}m
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono mt-0.5">{b.pieces} peças</span>
                        </div>
                        <span className="font-mono font-bold text-amber-700">{bundleVol.toFixed(3)} m³</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-900 text-slate-300 p-3.5 rounded-xl border border-slate-800 font-mono text-[9px] space-y-1">
                <div className="text-amber-400 font-bold">PROMADEIRA DIGITAL SIGNATURE V1</div>
                <div>Hash: SHA256_{selectedRomaneio.id.replace(/-/g, '_')}</div>
                <div>Status da NFe: <span className="text-emerald-400">AUTORIZADA</span> (SEFAZ-PR)</div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center italic text-slate-400 text-xs">
              Selecione um romaneio para ver a cubagem de madeira detalhada.
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
            <h4 className="text-[10px] font-extrabold uppercase font-mono text-slate-400 tracking-wider">Últimos Lançamentos Supabase</h4>
            <div className="space-y-1.5 font-mono text-[9px] text-slate-500 max-h-[110px] overflow-y-auto">
              {dbLogs.map((log, i) => (
                <div key={i} className="border-l border-amber-500 pl-1.5 truncate">
                  {log}
                </div>
              ))}
              {dbLogs.length === 0 && (
                <div className="italic text-slate-400">Nenhum evento registrado.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Romaneio Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-xl text-xs">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Emitir Romaneio de Madeira</h3>
            <form onSubmit={handleCreate} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Cliente Destino</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="ex: Movelaria Silva"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Espécie / Lote</label>
                  <select
                    value={woodType}
                    onChange={(e) => setWoodType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs"
                  >
                    <option value="Pinus Autoclavado">Pinus Autoclavado</option>
                    <option value="Eucalipto Tratado">Eucalipto Tratado</option>
                    <option value="Cedro Rosa Seco">Cedro Rosa Seco</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Placa do Veículo</label>
                  <input
                    type="text"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value)}
                    placeholder="BRA-3X92"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Nome do Motorista</label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="Valdir Ramos"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2">
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block">Lote de Peças (Cubagem)</span>
                <div className="grid grid-cols-4 gap-2 font-mono">
                  <div>
                    <label className="text-[9px] text-slate-400 block mb-0.5">Espessura(mm)</label>
                    <input
                      type="number"
                      value={thickness}
                      onChange={(e) => setThickness(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1 px-2 text-xs text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 block mb-0.5">Largura(mm)</label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1 px-2 text-xs text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 block mb-0.5">Comprim(m)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={length}
                      onChange={(e) => setLength(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1 px-2 text-xs text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 block mb-0.5">Peças</label>
                    <input
                      type="number"
                      value={pieces}
                      onChange={(e) => setPieces(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1 px-2 text-xs text-center font-bold text-amber-700"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Peso Balança Rodoviária (kg)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-mono font-bold"
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
                  Emitir Romaneio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
