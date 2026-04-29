'use client';

import React, { useState, useMemo } from 'react';

interface UnresolvedTabProps {
  onCreateIntent: (userMessage: string) => void;
}

export default function UnresolvedTab({ onCreateIntent }: UnresolvedTabProps) {
  // ESTADOS PARA LOS FILTROS
  const [filterText, setFilterText] = useState('');
  const [filterSession, setFilterSession] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [pageSize, setPageSize] = useState('20');

  // DATA MOCK (Simulada)
  const logs = [
    { fecha: '17/04/2026, 14:39', usuario: 'dreccion de tvaneupi', sessionId: '4e98b85d-6506-4551-8b1c-3b1fc4c69022', bot: 'Lo siento, no entendí tu pregunta. ¿Puedes intentarlo de otra forma?' },
    { fecha: '17/04/2026, 14:39', usuario: 'direcciom de tu casa', sessionId: '4e98b85d-6506-4551-8b1c-3b1fc4c69022', bot: 'Lo siento, no entendí tu pregunta. ¿Puedes intentarlo de otra forma?' },
    { fecha: '17/04/2026, 14:35', usuario: 'Cual es su edad', sessionId: '4e98b85d-6506-4551-8b1c-3b1fc4c69022', bot: 'Lo siento, no entendí tu pregunta. ¿Puedes intentarlo de otra forma?' },
    { fecha: '16/04/2026, 09:42', usuario: 'whatsapp', sessionId: '550e8400-e29b-41d4-a716-446655440000', bot: 'Lo siento, no entendí tu pregunta.' },
    { fecha: '16/04/2026, 09:42', usuario: 'hola', sessionId: '550e8400-e29b-41d4-a716-446655440000', bot: 'Lo siento, no entendí tu pregunta.' },
  ];

  // LÓGICA DE FILTRADO DINÁMICO
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesText = log.usuario.toLowerCase().includes(filterText.toLowerCase());
      const matchesSession = log.sessionId.toLowerCase().includes(filterSession.toLowerCase());
      
      // Nota: Para las fechas en un entorno real compararíamos objetos Date, 
      // aquí se mantiene la estructura visual.
      return matchesText && matchesSession;
    });
  }, [filterText, filterSession]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* SECCIÓN DE FILTROS */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-[11px] font-bold text-gray-400 uppercase mb-4 tracking-wider">Filtros de no resueltas</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input 
              type="text" 
              placeholder="Buscar texto" 
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#003952] transition-all" 
            />
            <input 
              type="text" 
              placeholder="Session ID" 
              value={filterSession}
              onChange={(e) => setFilterSession(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#003952] transition-all" 
            />
            <input 
              type="text" 
              placeholder="dd/mm/aaaa" 
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 outline-none" 
            />
            <input 
              type="text" 
              placeholder="dd/mm/aaaa" 
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 outline-none" 
            />
            <select 
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none bg-white cursor-pointer"
            >
              <option value="20">20 por página</option>
              <option value="50">50 por página</option>
              <option value="100">100 por página</option>
            </select>
          </div>
          
          <div className="flex justify-end">
            <button className="bg-[#003952] text-white px-6 py-2 rounded-lg text-[13px] font-bold hover:bg-[#00283d] transition-colors shadow-md active:scale-95">
              Aplicar filtros
            </button>
          </div>
        </div>
      </section>

      {/* TABLA DE RESULTADOS */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 border-b border-gray-50 text-[12px] uppercase tracking-wider font-bold">
                <th className="pb-4 px-2">Fecha</th>
                <th className="pb-4 px-2">Usuario</th>
                <th className="pb-4 px-2 text-center">Intent detectada</th>
                <th className="pb-4 px-2 text-center">Matched</th>
                <th className="pb-4 px-2">Bot</th>
                <th className="pb-4 px-2 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLogs.map((log, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="py-5 px-2 text-[12px] font-bold text-gray-700 leading-tight">
                    {log.fecha.split(',')[0]}<br/>
                    <span className="font-medium text-gray-400">{log.fecha.split(',')[1]}</span>
                  </td>
                  <td className="py-5 px-2">
                    <div className="text-[13px] font-bold text-gray-700">{log.usuario}</div>
                    <div className="text-[10px] text-gray-300 break-all max-w-[150px] font-mono">{log.sessionId}</div>
                  </td>
                  <td className="py-5 px-2 text-center text-[12px] text-gray-400 italic">
                    Sin intención
                  </td>
                  <td className="py-5 px-2 text-center text-[12px] text-gray-400 font-medium">
                    No
                  </td>
                  <td className="py-5 px-2">
                    <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2 max-w-[280px]">
                      {log.bot}
                    </p>
                  </td>
                  <td className="py-5 px-2 text-right">
                    <button 
                      onClick={() => onCreateIntent(log.usuario)}
                      className="px-4 py-1.5 border border-gray-200 rounded-lg text-[12px] font-bold text-gray-700 hover:bg-[#003952] hover:text-white hover:border-[#003952] transition-all shadow-sm active:scale-95"
                    >
                      Crear intención
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLogs.length === 0 && (
            <div className="py-20 text-center text-gray-400 italic text-sm">
              No se encontraron mensajes que coincidan con los filtros.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}