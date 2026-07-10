import React from 'react';
import { Calendar, Clock, User, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { Appointment, Contact } from '../types';

interface CalendarSchedulerProps {
  appointments: Appointment[];
  contacts: Contact[];
}

export default function CalendarScheduler({ appointments, contacts }: CalendarSchedulerProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Agenda de Agendamentos e Visitas</h2>
            <p className="text-slate-400 text-xs mt-0.5">Acompanhe consultas comerciais e visitas técnicas integradas em tempo real aos leads do CRM.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Appointments List Column */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 md:col-span-2 space-y-4 shadow-xs">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider font-mono border-b border-slate-100 pb-3">
            Compromissos Agendados no Sistema
          </h3>

          <div className="space-y-3.5 max-h-[440px] overflow-y-auto custom-scrollbar">
            {appointments.length === 0 ? (
              <p className="text-slate-400 text-xs italic text-center py-10 font-bold">Nenhum compromisso agendado ainda. Agende um na Caixa de Entrada Unificada!</p>
            ) : (
              appointments.map((appt) => {
                const contact = contacts.find((c) => c.id === appt.contactId);
                return (
                  <div key={appt.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 hover:bg-slate-100/50 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-xs">
                    <div className="space-y-1.5 text-xs">
                      <h4 className="font-bold text-slate-800 text-sm">{appt.title}</h4>
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-amber-600" />
                          <span className="font-bold text-slate-700">{contact ? contact.name : 'Contato Desconhecido'}</span>
                        </span>
                        <span className="flex items-center gap-1 font-mono text-[11px] font-bold">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {appt.date} às {appt.time} ({appt.durationMinutes} minutos)
                        </span>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-mono flex items-center gap-1 font-black shrink-0 shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Confirmado
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Contacts lookup sidebar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 h-fit shadow-xs">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider font-mono border-b border-slate-100 pb-3">
            Consulta Rápida de Contatos CRM
          </h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
            {contacts.map((c) => (
              <div key={c.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 shadow-xs">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-800 text-sm">{c.name}</span>
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-mono font-bold border border-amber-100">
                    {c.companyName || 'Lead'}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-mono space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {c.phone}
                  </div>
                  <div className="flex items-center gap-1.5 font-bold">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {c.email}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
