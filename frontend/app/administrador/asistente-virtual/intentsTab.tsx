'use client';

import React, { useState, useMemo } from 'react';
import { Search, Trash2, RotateCcw, Power } from 'lucide-react';

interface Intent {
  id: number;
  label: string;
  name: string;
  keywords: string;
  priority: number;
  active: boolean;
  responses: number;
  response?: string;
}

interface IntentsTabProps {
  data: Intent[];
  onEdit: (item: Intent) => void;
  onToggleStatus: (id: number) => void;
}

export default function IntentsTab({ data, onEdit, onToggleStatus }: IntentsTabProps) {
  // ESTADOS PARA LOS FILTROS
  const [filterName, setFilterName] = useState('');
  const [filterKeywords, setFilterKeywords] = useState(''); // Nuevo estado para keywords
  const [filterStatus, setFilterStatus] = useState('Todos');

  // LÓGICA DE FILTRADO DINÁMICO
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesName = item.name.toLowerCase().includes(filterName.toLowerCase());
      const matchesKeywords = item.keywords.toLowerCase().includes(filterKeywords.toLowerCase());
      const matchesStatus = 
        filterStatus === 'Todos' ? true : 
        filterStatus === 'Activa' ? item.active === true : 
        item.active === false;

      return matchesName && matchesKeywords && matchesStatus;
    });
  }, [data, filterName, filterKeywords, filterStatus]);

  return (
    <div className="space-y-6">
      
      {/* SECCIÓN DE FILTROS ACTUALIZADA */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Filtrar por Intención</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Ej: horarios" 
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#003952] transition-all" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Filtrar por Keywords</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Ej: vivo, ayuda, pago" 
              value={filterKeywords}
              onChange={(e) => setFilterKeywords(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#003952] transition-all" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Estado</label>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none cursor-pointer appearance-none text-gray-700"
          >
            <option value="Todos">Todos</option>
            <option value="Activa">Activa</option>
            <option value="Inactiva">Inactiva</option>
          </select>
        </div>
      </section>

      {/* LISTADO DE INTENCIONES */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">Listado de intenciones</h2>
          <button className="px-5 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2">
            <RotateCcw size={14} /> Recargar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] text-gray-400 border-b border-gray-50 uppercase tracking-widest font-bold">
                <th className="pb-4 px-2">Intención</th>
                <th className="pb-4 px-2">Keywords</th>
                <th className="pb-4 px-2 text-center">Priority</th>
                <th className="pb-4 px-2 text-center">Estado</th>
                <th className="pb-4 px-2 text-center">Respuestas</th>
                <th className="pb-4 px-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.map((item) => (
                <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="py-5 px-2">
                    <div className="font-bold text-[#003952] text-[14px] leading-tight mb-0.5">{item.label}</div>
                    <div className="text-[11px] text-gray-400 font-medium">{item.name}</div>
                  </td>
                  <td className="py-5 px-2">
                    <p className="text-[11px] text-gray-500 leading-relaxed max-w-[280px] line-clamp-2">
                      {item.keywords}
                    </p>
                  </td>
                  <td className="py-5 px-2 text-center text-sm font-semibold text-gray-600">
                    {item.priority}
                  </td>
                  <td className="py-5 px-2 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold border transition-colors ${
                      item.active 
                      ? 'bg-[#dcfce7] text-[#166534] border-[#bbf7d0]' 
                      : 'bg-gray-100 text-gray-400 border-gray-200'
                    }`}>
                      {item.active ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="py-5 px-2 text-center text-sm font-semibold text-gray-600">
                    {item.responses}
                  </td>
                  <td className="py-5 px-2">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => onEdit(item)}
                        className="px-4 py-1.5 border border-gray-200 rounded-lg text-[13px] font-bold text-gray-700 hover:bg-gray-100 shadow-sm transition-all"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => onToggleStatus(item.id)}
                        className={`px-3 py-1.5 rounded-lg text-[13px] font-bold shadow-md flex items-center gap-1.5 transition-all text-white ${
                          item.active 
                          ? 'bg-[#ef4444] hover:bg-red-600' 
                          : 'bg-[#003952] hover:bg-[#00283d]'
                        }`}
                      >
                        {item.active ? (
                          <><Trash2 size={14} /> Desactivar</>
                        ) : (
                          <><Power size={14} /> Activar</>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredData.length === 0 && (
            <div className="py-20 text-center text-gray-400 italic text-sm">
              No se encontraron resultados para los filtros aplicados.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}