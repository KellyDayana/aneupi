'use client';

import React, { useState } from 'react';
import { Eye, CheckCircle, ExternalLink, Play } from 'lucide-react';

interface SolicitudStream {
  id: number;
  usuario: string; // Nombres del usuario
  correo: string;
  contenido: string; // Aquí viene: CANAL: ... | PLATAfORMA: ... | LINK: ...
  fecha: string;
  hora: string;
  estado: string;
}

interface FormularioStreamProps {
  data: SolicitudStream[];
  onMarkAsRead: (id: number) => void;
}

export default function FormularioStream({ data, onMarkAsRead }: FormularioStreamProps) {
  const [selectedItem, setSelectedArticle] = useState<SolicitudStream | null>(null);

  // Función para extraer datos del string de contenido
  const parseContenido = (text: string) => {
    const parts = text.split(' | ');
    return {
      canal: parts[0]?.replace('CANAL: ', '') || 'N/A',
      plataforma: parts[1]?.replace('PLATAfORMA: ', '') || 'N/A',
      link: parts[2]?.replace('LINK: ', '') || '#',
      descripcion: parts[3]?.replace('CONTENIDO: ', '') || 'Sin descripción'
    };
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-400 border-b border-gray-50 text-[12px] uppercase tracking-wider font-bold">
              <th className="py-4 px-6">Streamer</th>
              <th className="py-4 px-6 text-center">Plataforma</th>
              <th className="py-4 px-6">Fecha / Hora</th>
              <th className="py-4 px-6 text-center">Estado</th>
              <th className="py-4 px-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((item) => {
              const details = parseContenido(item.contenido);
              return (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-[#003952] text-sm">{item.usuario}</div>
                    <div className="text-[11px] text-gray-400">{details.canal}</div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                      details.plataforma.includes('Twitch') ? 'bg-purple-100 text-purple-600' : 
                      details.plataforma.includes('YouTube') ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {details.plataforma}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-[11px] font-medium text-gray-600">{item.fecha}</div>
                    <div className="text-[10px] text-gray-400">{item.hora}</div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${item.estado === 'Aceptado' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                      {item.estado}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setSelectedArticle(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye size={18} /></button>
                      {item.estado === 'Pendiente' && (
                        <button onClick={() => onMarkAsRead(item.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"><CheckCircle size={18} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {data.length === 0 && <div className="py-20 text-center text-gray-400 italic text-sm">No hay solicitudes de stream pendientes.</div>}
      </div>

      {/* MODAL DE DETALLES DEL STREAMER */}
      {selectedItem && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="bg-[#003952] p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Play size={24} />
                <div>
                  <h3 className="font-bold text-lg leading-none">Detalles del Streamer</h3>
                  <p className="text-blue-200 text-xs mt-1">Solicitud enviada el {selectedItem.fecha}</p>
                </div>
              </div>
              <button onClick={() => setSelectedArticle(null)} className="text-white/60 hover:text-white transition-colors text-2xl">&times;</button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-gray-400 font-bold uppercase text-[10px]">Nombre Real</p><p className="font-semibold text-gray-800">{selectedItem.usuario}</p></div>
                <div><p className="text-gray-400 font-bold uppercase text-[10px]">Correo</p><p className="font-semibold text-gray-800 break-all">{selectedItem.correo}</p></div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3">
                <div className="flex justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase">Canal:</span>
                  <span className="text-xs font-bold text-[#003952]">{parseContenido(selectedItem.contenido).canal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase">Link:</span>
                  <a href={parseContenido(selectedItem.contenido).link} target="_blank" className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">Ir al stream <ExternalLink size={12}/></a>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Contenido:</p>
                  <p className="text-sm text-gray-600 italic leading-relaxed">"{parseContenido(selectedItem.contenido).descripcion}"</p>
                </div>
              </div>
              <button onClick={() => setSelectedArticle(null)} className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all uppercase text-xs tracking-widest">Cerrar Detalle</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}