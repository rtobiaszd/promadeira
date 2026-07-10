import React, { useState } from 'react';
import { Edit3, Plus, Trash2, Sliders, Truck, Target, XSquare, Package, Landmark, Settings, CheckSquare, Coins } from 'lucide-react';

interface RegistryItem {
  id: string;
  name: string;
  extraInfo?: string;
}

export default function CadastrosView() {
  const [activeCategory, setActiveCategory] = useState<
    'segmentos' | 'fornecedores' | 'midias' | 'motivos' | 'produtos' | 'contas' | 'processos' | 'leadstatus' | 'comissoes'
  >('segmentos');

  // Multi-category states
  const [segmentos, setSegmentos] = useState<RegistryItem[]>([
    { id: '1', name: 'Marcenaria e Esquadrias', extraInfo: 'Consumidores de pranchas secas' },
    { id: '2', name: 'Construção Civil', extraInfo: 'Consumidores de vigas e pilares' },
    { id: '3', name: 'Movelaria Industrial', extraInfo: 'Contratos anuais de volume' },
  ]);

  const [fornecedores, setFornecedores] = useState<RegistryItem[]>([
    { id: '1', name: 'Florestal Rio Claro S/A', extraInfo: 'Pinus bruto' },
    { id: '2', name: 'Madeiras Reflorestadas Paraná', extraInfo: 'Eucalipto tratado' },
  ]);

  const [midias, setMidias] = useState<RegistryItem[]>([
    { id: '1', name: 'WhatsApp Orgânico', extraInfo: 'Atendimento direto' },
    { id: '2', name: 'Google Ads (Pesquisa)', extraInfo: 'Madeiras tratadas' },
    { id: '3', name: 'Feiras Agrícolas / Shows', extraInfo: 'Dormentes e estacas' },
  ]);

  const [motivos, setMotivos] = useState<RegistryItem[]>([
    { id: '1', name: 'Preço da cubagem alto', extraInfo: 'Negociação perdida' },
    { id: '2', name: 'Prazo de autoclave longo', extraInfo: 'Entrega indisponível' },
    { id: '3', name: 'Frete inviável', extraInfo: 'Problema logístico regional' },
  ]);

  const [produtos, setProdutos] = useState<RegistryItem[]>([
    { id: '1', name: 'Viga de Eucalipto Tratado 100x100mm 3m', extraInfo: 'Construção' },
    { id: '2', name: 'Tábua de Pinus Autoclavado 25x150mm 3m', extraInfo: 'Fardos' },
  ]);

  const [contas, setContas] = useState<RegistryItem[]>([
    { id: '1', name: 'Banco do Brasil - Agência 1290 - Conta 9811-2', extraInfo: 'Conta Principal' },
    { id: '2', name: 'Itaú Cobrança Integrada', extraInfo: 'Emissão de Boletos' },
  ]);

  const [processos, setProcessos] = useState<RegistryItem[]>([
    { id: '1', name: 'Garantia de Qualidade de Autoclave', extraInfo: 'SLA: 48 horas' },
    { id: '2', name: 'Divergência de Cubagem em Balança', extraInfo: 'SLA: 12 horas' },
  ]);

  const [leadstatus, setLeadstatus] = useState<RegistryItem[]>([
    { id: '1', name: 'Novo Contato (Lead)', extraInfo: 'Estágio inicial' },
    { id: '2', name: 'Amostras Solicitadas', extraInfo: 'Estágio quente' },
    { id: '3', name: 'Faturamento de Teste', extraInfo: 'Estágio avançado' },
  ]);

  const [comissoes, setComissoes] = useState<RegistryItem[]>([
    { id: '1', name: 'Alíquota Padrão Representante (2.5%)', extraInfo: 'Geral' },
    { id: '2', name: 'Alíquota VIP Madeira Nobre (4.0%)', extraInfo: 'Campanhas premium' },
  ]);

  const [newItemName, setNewItemName] = useState('');
  const [newItemExtra, setNewItemExtra] = useState('');

  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 4)]);
  };

  const getActiveList = () => {
    switch (activeCategory) {
      case 'segmentos': return segmentos;
      case 'fornecedores': return fornecedores;
      case 'midias': return midias;
      case 'motivos': return motivos;
      case 'produtos': return produtos;
      case 'contas': return contas;
      case 'processos': return processos;
      case 'leadstatus': return leadstatus;
      case 'comissoes': return comissoes;
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) return;

    const newItem: RegistryItem = {
      id: String(Date.now()),
      name: newItemName,
      extraInfo: newItemExtra || 'Configuração customizada',
    };

    switch (activeCategory) {
      case 'segmentos': setSegmentos([...segmentos, newItem]); break;
      case 'fornecedores': setFornecedores([...fornecedores, newItem]); break;
      case 'midias': setMidias([...midias, newItem]); break;
      case 'motivos': setMotivos([...motivos, newItem]); break;
      case 'produtos': setProdutos([...produtos, newItem]); break;
      case 'contas': setContas([...contas, newItem]); break;
      case 'processos': setProcessos([...processos, newItem]); break;
      case 'leadstatus': setLeadstatus([...leadstatus, newItem]); break;
      case 'comissoes': setComissoes([...comissoes, newItem]); break;
    }

    addLog(`Registro '${newItemName}' adicionado com sucesso na categoria '${activeCategory}'`);
    setNewItemName('');
    setNewItemExtra('');
  };

  const handleDeleteItem = (id: string, name: string) => {
    switch (activeCategory) {
      case 'segmentos': setSegmentos(segmentos.filter(i => i.id !== id)); break;
      case 'fornecedores': setFornecedores(fornecedores.filter(i => i.id !== id)); break;
      case 'midias': setMidias(midias.filter(i => i.id !== id)); break;
      case 'motivos': setMotivos(motivos.filter(i => i.id !== id)); break;
      case 'produtos': setProdutos(produtos.filter(i => i.id !== id)); break;
      case 'contas': setContas(contas.filter(i => i.id !== id)); break;
      case 'processos': setProcessos(processos.filter(i => i.id !== id)); break;
      case 'leadstatus': setLeadstatus(leadstatus.filter(i => i.id !== id)); break;
      case 'comissoes': setComissoes(comissoes.filter(i => i.id !== id)); break;
    }
    addLog(`DELETE FROM meta_${activeCategory} WHERE id = '${id}'`);
  };

  const categories = [
    { id: 'segmentos', label: 'Segmentos', icon: Sliders },
    { id: 'fornecedores', label: 'Fornecedores', icon: Truck },
    { id: 'midias', label: 'Mídias', icon: Target },
    { id: 'motivos', label: 'Motivo Cancelamento', icon: XSquare },
    { id: 'produtos', label: 'Produtos', icon: Package },
    { id: 'contas', label: 'Contas Pagamento', icon: Landmark },
    { id: 'processos', label: 'Processos Smartdesk', icon: Settings },
    { id: 'leadstatus', label: 'LEADs Status', icon: CheckSquare },
    { id: 'comissoes', label: 'Tabela de Comissões', icon: Coins },
  ];

  return (
    <div className="space-y-6" id="view-cadastros">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Cadastros e Parametrizações Gerais</h2>
            <p className="text-slate-400 text-xs mt-0.5">Configure as tabelas de referência global que controlam filtros, listas do CRM e automações.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Sub-Navigation of Registries */}
        <div className="md:col-span-1 bg-white border border-slate-200 p-4 rounded-2xl space-y-1.5 shadow-xs">
          <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block px-2 mb-2">Tabelas Globais</span>
          {categories.map(cat => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id as any);
                  setNewItemName('');
                  setNewItemExtra('');
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 cursor-pointer ${
                  isSelected ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Right Active Table Manager */}
        <div className="md:col-span-3 space-y-4">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide border-b border-slate-100 pb-2">
              Lançamentos na Tabela: {categories.find(c => c.id === activeCategory)?.label}
            </h3>

            {/* Insertion Form */}
            <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div className="sm:col-span-1">
                <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Nome do Registro</label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Nome do registro"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                  required
                />
              </div>
              <div className="sm:col-span-1">
                <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Observações / Detalhe</label>
                <input
                  type="text"
                  value={newItemExtra}
                  onChange={(e) => setNewItemExtra(e.target.value)}
                  placeholder="Detalhes extras"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition shadow-sm h-[38px]"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </form>

            {/* List with trash icon */}
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
              {getActiveList().map(item => (
                <div key={item.id} className="p-3.5 flex justify-between items-center text-xs bg-white hover:bg-slate-50 transition">
                  <div>
                    <span className="font-bold text-slate-800 block">{item.name}</span>
                    {item.extraInfo && <span className="text-[10px] text-slate-400 block mt-0.5">{item.extraInfo}</span>}
                  </div>
                  <button
                    onClick={() => handleDeleteItem(item.id, item.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {getActiveList().length === 0 && (
                <div className="p-6 text-center text-slate-400 italic">
                  Nenhum cadastro lançado para esta tabela.
                </div>
              )}
            </div>
          </div>

          {/* Logs of Table updates */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-slate-200">
            <span className="text-[10px] font-extrabold uppercase font-mono text-amber-500 tracking-wider block mb-2">
              Auditoria de Alterações Cadastrais (Geral)
            </span>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[9px] text-slate-400 space-y-1.5 min-h-[90px]">
              <div>-- Auditoria Cadastros Globais --</div>
              {logs.map((log, index) => (
                <div key={index} className="text-slate-300 border-l border-amber-500 pl-1.5">
                  {log}
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-slate-600">Nenhuma movimentação de tabelas nesta sessão.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
