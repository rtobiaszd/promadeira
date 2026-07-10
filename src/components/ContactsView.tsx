import React, { useState } from 'react';
import { Users, Phone, Mail, PlusCircle, Search } from 'lucide-react';
import { Contact } from '../types';

interface ContactsViewProps {
  contacts: Contact[];
  onAddContact: (contact: Omit<Contact, 'id'>) => void;
}

export default function ContactsView({ contacts, onAddContact }: ContactsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [telegram, setTelegram] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    onAddContact({
      name,
      email,
      phone,
      telegram: telegram || undefined,
      companyName: companyName || undefined,
      tags: tags ? tags.split(',').map((t) => t.trim()) : [],
      notes: notes || undefined,
    });

    // Reset forms
    setName('');
    setEmail('');
    setPhone('');
    setTelegram('');
    setCompanyName('');
    setTags('');
    setNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Banco de Dados de Contatos CRM</h2>
            <p className="text-slate-400 text-xs mt-0.5">Mantenha metadados estruturados e isolados de seus clientes com total segurança e privacidade de dados.</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          Adicionar Contato
        </button>
      </div>

      {/* Main filter / search bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex gap-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 text-slate-400 w-4.5 h-4.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar contatos por nome, e-mail ou número de telefone..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
          />
        </div>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.map((c) => (
          <div key={c.id} className="bg-white border border-slate-200 hover:border-amber-300 hover:shadow-md p-5 rounded-2xl space-y-3.5 shadow-xs transition duration-150">
            <div className="flex justify-between items-start gap-2">
              <div>
                <h4 className="text-sm font-black text-slate-800">{c.name}</h4>
                <p className="text-[10px] text-amber-700 font-mono font-bold mt-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 inline-block">
                  {c.companyName || 'Marcenaria Independente'}
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-600 font-mono space-y-1.5 pt-3 border-t border-slate-100 font-bold">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {c.phone}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {c.email}
              </div>
            </div>

            {/* Tags list */}
            {c.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1.5">
                {c.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-mono border border-slate-200/60 font-bold">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {c.notes && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-500 leading-relaxed italic">
                {c.notes}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Adicionar Novo Lead ao CRM</h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Nome Completo *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">E-mail *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Telefone de Contato *</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 font-mono"
                    placeholder="+55 11 99999-9999"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Telegram (Opcional)</label>
                  <input
                    type="text"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 font-mono"
                    placeholder="@usuario"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Empresa / Grupo</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700"
                    placeholder="ex: Madeiras Promadeira Ltda"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Tags (separadas por vírgula)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="marceneiro, premium-wood, vip"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1 font-bold">Notas de Observação do Lead</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 focus:outline-none custom-scrollbar font-medium"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
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
                  Salvar Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
