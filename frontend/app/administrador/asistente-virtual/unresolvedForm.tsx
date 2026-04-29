'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, Clock, User, CheckCircle, AlertCircle, 
  Eye, Download, X, Mail, Tag, MapPin, AlignLeft, Info 
} from 'lucide-react';

interface FormRecord {
  id: number;
  tipo: 'Noticia' | 'Entrevista';
  usuario: string; // Remitente
  contenido: string; // Descripción
  fecha: string;
  hora: string;
  estado: 'Pendiente' | 'Revisado';
  correo?: string;
  titulo?: string;
  ubicacion?: string;
}

interface UnresolvedFormProps {
  data: FormRecord[];
  onMarkAsRead: (id: number) => void;
}

// --- SUB-COMPONENTE: MODAL DE DETALLES ACTUALIZADO ---
const FormDetailModal = ({ isOpen, onClose, form }: { isOpen: boolean, onClose: () => void, form: FormRecord | null }) => {
  if (!isOpen || !form) return null;

  const isNoticia = form.tipo === 'Noticia';

  return (
    <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header del Modal */}
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-[#003952] flex items-center gap-2 text-lg">
            <Info size={20} /> Detalles del Formulario
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-2">
                <User size={12}/> Remitente
              </label>
              <p className="text-sm font-bold text-gray-700">{form.usuario}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-2">
                <Tag size={12}/> Categoría
              </label>
              <p className="text-sm font-bold text-gray-700">{form.tipo}</p>
            </div>
          </div>

          {/* Correo Electrónico: Se muestra para ambos tipos si el dato existe */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-2">
              <Mail size={12}/> Contacto correo electrónico
            </label>
            <p className="text-sm font-bold text-gray-700">{form.correo || "No proporcionado"}</p>
          </div>

          {isNoticia && (
            /* Campos específicos de Noticia / Denuncia */
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-2">
                  <AlignLeft size={12}/> Título o tema central
                </label>
                <p className="text-sm font-bold text-gray-700">{form.titulo || "Sin título"}</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-2">
                  <MapPin size={12}/> Ubicación de los hechos
                </label>
                <p className="text-sm font-bold text-gray-700">{form.ubicacion || "No especificada"}</p>
              </div>
            </div>
          )}

          {/* Descripción detallada */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <label className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-2">
              <AlignLeft size={12} /> Descripción detallada
            </label>
            <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-600 leading-relaxed border border-gray-100 italic whitespace-pre-wrap">
              "{form.contenido}"
            </div>
          </div>
        </div>

        {/* Footer del Modal */}
        <div className="p-4 bg-gray-50 border-t flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-[#003952] text-white rounded-lg text-sm font-bold hover:bg-[#00283d] transition-all shadow-md"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL: UNRESOLVEDFORM ---
export default function UnresolvedForm({ data, onMarkAsRead }: UnresolvedFormProps) {
  const [filterType, setFilterType] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedForm, setSelectedForm] = useState<FormRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleViewDetails = (form: FormRecord) => {
    setSelectedForm(form);
    setIsDetailOpen(true);
  };

  const filteredForms = useMemo(() => {
    return data.filter((form) => {
      const matchesType = filterType === 'Todos' || form.tipo === filterType;
      const matchesSearch = form.usuario.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            form.contenido.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [data, filterType, searchTerm]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px] space-y-2">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Buscar por usuario o contenido</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Ej: Juan Pérez..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#003952]" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tipo de Formulario</label>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none cursor-pointer text-gray-600 font-medium"
          >
            <option value="Todos">Todos los tipos</option>
            <option value="Noticia">Noticias / Denuncias</option>
            <option value="Entrevista">Solicitud de Entrevista</option>
          </select>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-[#003952] text-white rounded-xl text-xs font-bold hover:bg-[#00283d] transition-all shadow-md active:scale-95">
          <Download size={14} /> Exportar CSV
        </button>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr className="text-[11px] font-black uppercase text-gray-400 tracking-widest">
                <th className="p-4">Recepción</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Remitente</th>
                <th className="p-4">Detalles del mensaje</th>
                <th className="p-4 text-center">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredForms.length > 0 ? filteredForms.map((form) => (
                <tr key={form.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-300" />
                      <div>
                        <p className="text-[13px] font-bold text-gray-700">{form.fecha}</p>
                        <p className="text-[10px] text-gray-400">{form.hora}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter ${
                      form.tipo === 'Noticia' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'
                    }`}>
                      {form.tipo}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[#003952]">
                        <User size={14} />
                      </div>
                      <span className="text-[13px] font-bold text-[#003952]">{form.usuario}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-[12px] text-gray-500 line-clamp-1 max-w-[250px] italic">
                      "{form.contenido}"
                    </p>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col items-center">
                      {form.estado === 'Pendiente' ? (
                        <AlertCircle size={18} className="text-red-500 animate-pulse" />
                      ) : (
                        <CheckCircle size={18} className="text-green-500" />
                      )}
                      <span className="text-[8px] font-black uppercase text-gray-400 mt-1">{form.estado}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleViewDetails(form)}
                        className="p-2 text-gray-400 hover:text-[#003952] hover:bg-gray-100 rounded-lg transition-all" 
                        title="Ver detalles"
                      >
                        <Eye size={18} />
                      </button>
                      {form.estado === 'Pendiente' && (
                        <button 
                          onClick={() => onMarkAsRead(form.id)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                          title="Marcar como revisado"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="p-20 text-center text-gray-400 italic text-sm">
                    No se encontraron formularios con los criterios de búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <FormDetailModal 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        form={selectedForm} 
      />
    </div>
  );
}