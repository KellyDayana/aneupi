'use client';

import React, { useState } from 'react';
import { ShieldCheck, Plus, Bot, FileText, MessageSquare, Play } from 'lucide-react';

// Importación de componentes modulares
import IntentsModal from './intetsmodal';
import UnresolvedTab from './unresolvedTab';
import IntentsTab from './intentsTab';
import UnresolvedForm from './unresolvedForm'; 
import ChatBot from './chatBot';
import FormularioStream from './formularioStream';

export default function AsistenteVirtualAdmin() {
  const [activeTab, setActiveTab] = useState<'intents' | 'unresolved' | 'forms'| 'streams'>('intents');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedData, setSelectedData] = useState<any>(null);
  const [unresolvedLogs, setUnresolvedLogs] = useState<any[]>([]);
  
  // ESTADO PARA LAS SOLICITUDES DE STREAM (Ahora definido correctamente)
  const [solicitudesStream, setSolicitudesStream] = useState<any[]>([]);

  // NUEVO: Estado para rastrear qué consultas ya fueron convertidas en intenciones
  const [resolvedQueryIds, setResolvedQueryIds] = useState<string[]>([]);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Los cambios se guardaron correctamente.');

  // --- ESTADO CENTRALIZADO DE INTENCIONES ---
  const [intenciones, setIntenciones] = useState([
    { id: 1, label: 'Transmisión en vivo', name: 'en_vivo', keywords: 'en vivo, vivo, live, transmision, directo, streaming, ahora', priority: 2, responses: 1, response: 'Estamos en vivo ahora mismo. No te pierdas nuestra transmisión en tiempo real. 🔴 [Haz clic aquí para ver en vivo]', active: true },
    { id: 2, label: 'Solicita tu entrevista', name: 'entrevista', keywords: 'entrevista, solicitar entrevista, unirme, unirse, proyecto, formulario, postular, agendar,...', priority: 2, responses: 1, response: 'Claro, puedes agendar tu entrevista aquí.', active: true },
    { id: 3, label: 'Publica tu artículo', name: 'publicar_articulo', keywords: 'articulo, artículo, publicar articulo, opinion, conocimiento, escribir, blog, colaborar', priority: 2, responses: 1, response: 'Para publicar tu artículo, envíanos un correo a redaccion@aneupi.com', active: true },
    { id: 4, label: 'Publica tu noticia / denuncia', name: 'publicar_noticia', keywords: 'publicar noticia, denuncia, denunciar, mi noticia, compartir noticia, enviar noticia,...', priority: 2, responses: 1, response: 'Tu denuncia es importante. Adjunta las pruebas en el siguiente formulario.', active: true },
    { id: 5, label: '11', name: '11', keywords: 'cual, años', priority: 1, responses: 1, response: 'El bot tiene 1 año de funcionamiento.', active: true },
  ]);

  const [formulariosRecibidos, setFormulariosRecibidos] = useState<any[]>([
    { id: 1, tipo: 'Noticia', usuario: 'Andrés López', correo: 'andres@ejemplo.com', titulo: 'Baches en la vía', ubicacion: 'Av. Amazonas', contenido: 'Denuncia sobre baches en la vía principal.', fecha: '21/04/2026', hora: '10:30', estado: 'Revisado' },
  ]);

  const handleUnresolvedQuery = (userMessage: string) => {
    // Generamos un ID único para el log para poder rastrearlo
    const logId = `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newLog = {
      id: logId,
      fecha: `${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      usuario: userMessage,
      sessionId: `sess-${Math.random().toString(36).substr(2, 9)}`,
      bot: 'Lo siento, no entendí tu pregunta. ¿Puedes intentarlo de otra forma?'
    };
    setUnresolvedLogs(prev => [newLog, ...prev]);
  };

  
  const handleOpenModal = (mode: 'create' | 'edit', data: any = null) => {
    setModalMode(mode);
    setSelectedData(data);
    setIsModalOpen(true);
  };

  // ACTUALIZACIÓN: Lógica para enviar a la pestaña correcta
  const handleFormReceived = (datos: any) => {
    const nuevoRegistro = { 
      ...datos, 
      id: Date.now(), 
      fecha: new Date().toLocaleDateString('es-ES'), 
      hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }), 
      estado: 'Pendiente' 
    };

    if (datos.tipo === 'Promocion Stream') {
      setSolicitudesStream(prev => [nuevoRegistro, ...prev]); // Llena la nueva tabla
      setToastMessage("Nueva solicitud de stream recibida.");
    } else {
      setFormulariosRecibidos(prev => [nuevoRegistro, ...prev]);
      setToastMessage(`Nuevo formulario de ${datos.tipo} recibido.`);
    }
    triggerToast();
  };

  const handleSave = (newData: any) => {
    if (modalMode === 'edit') {
      setIntenciones(prev => prev.map(item => item.id === newData.id ? newData : item));
    } else {
      const nuevoId = intenciones.length > 0 ? Math.max(...intenciones.map(i => i.id)) + 1 : 1;
      setIntenciones(prev => [...prev, { ...newData, id: nuevoId, responses: 1, active: true }]);
      if (selectedData?.logId) setResolvedQueryIds(prev => [...prev, selectedData.logId]);
    }
    setIsModalOpen(false);
    triggerToast();
  };

  const handleToggleStatus = (id: number) => {
    setIntenciones(prev => prev.map(item => item.id === id ? { ...item, active: !item.active } : item));
    triggerToast();
  };

  const handleMarkFormAsRead = (id: number) => {
    setFormulariosRecibidos(prev => prev.map(f => f.id === id ? { ...f, estado: 'Revisado' } : f));
    setToastMessage('Formulario marcado como revisado.');
    triggerToast();
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-4 md:p-8 font-sans text-gray-700 relative overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="bg-[#003952] text-white p-5 rounded-xl shadow-lg flex justify-between items-center gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="bg-white/10 p-2 rounded-full shrink-0"><ShieldCheck size={24} /></div>
            <div className="truncate">
              <p className="text-xl md:text-2xl font-bold block">Panel de administración del bot</p>
              <p className="text-xs text-blue-100/70 truncate">Gestiona intenciones y respuestas de manera eficiente.</p>
            </div>
          </div>
          <button onClick={() => handleOpenModal('create')} className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all font-semibold shrink-0">
            <Plus size={16} /> Nueva intención
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          <main className="space-y-6">
            <div className="flex gap-6 border-b border-gray-200 overflow-x-auto">
              <button onClick={() => setActiveTab('intents')} className={`pb-2 text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'intents' ? 'border-b-2 border-[#003952] text-[#003952]' : 'text-gray-400'}`}><Bot size={16} /> Intenciones</button>
              <button onClick={() => setActiveTab('forms')} className={`pb-2 text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'forms' ? 'border-b-2 border-[#003952] text-[#003952]' : 'text-gray-400'}`}><FileText size={16} /> Formularios Recibidos</button>
              <button onClick={() => setActiveTab('unresolved')} className={`pb-2 text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'unresolved' ? 'border-b-2 border-[#003952] text-[#003952]' : 'text-gray-400'}`}><MessageSquare size={16} /> No resueltas</button>
              <button onClick={() => setActiveTab('streams')} className={`pb-2 text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'streams' ? 'border-b-2 border-[#003952] text-[#003952]' : 'text-gray-400'}`}><Play size={16} /> Streams Solicitados</button>
            </div>
            <div className="min-h-[400px]">
              {activeTab === 'intents' && <IntentsTab data={intenciones} onEdit={(item) => handleOpenModal('edit', item)} onToggleStatus={handleToggleStatus} />}
              {activeTab === 'forms' && <UnresolvedForm data={formulariosRecibidos} onMarkAsRead={handleMarkFormAsRead} />}
              {activeTab === 'streams' && (<FormularioStream data={solicitudesStream} onMarkAsRead={(id) => setSolicitudesStream(prev => prev.map(s => s.id === id ? {...s, estado: 'Aceptado'} : s))} />)}
              {activeTab === 'unresolved' && (
                <UnresolvedTab 
                  // Pasamos los IDs resueltos al componente
                  resolvedIds={resolvedQueryIds}
                  onCreateIntent={(msg, logId) => {
                    setModalMode('create');
                    setSelectedData({ 
                      keywords: msg, 
                      name: '', 
                      label: '', 
                      priority: 2, 
                      active: true, 
                      response: '',
                      logId: logId // Vinculamos el log con la nueva intención
                    });
                    setIsModalOpen(true);
                  }} 
                  logsData={unresolvedLogs} 
                />
              )}    
            </div>
          </main>

          <aside className="space-y-6">
            {activeTab === 'forms' && (
              <section className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4">
                <h3 className="text-sm font-bold text-[#003952] mb-3 flex items-center gap-2"><ShieldCheck size={16} /> Resumen de actividad</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs"><span className="text-gray-400">Total Intenciones</span><span className="font-bold">{intenciones.length}</span></div>
                  <div className="flex justify-between items-center text-xs"><span className="text-gray-400">Pendientes Revisión</span><span className="font-bold text-red-500">{formulariosRecibidos.filter(f => f.estado === 'Pendiente').length}</span></div>
                </div>
              </section>
            )}
            <section className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-[#003952]"><Bot size={16} /><h3 className="text-sm font-bold">Guía rápida</h3></div>
              <div className="text-[11px] text-gray-500 space-y-3 leading-relaxed">
                <p>Usa <span className="font-bold">Editar</span> para modificar palabras clave o respuestas existentes.</p>
                <p>Con <span className="font-bold">Desactivar</span> el bot ignorará esta intención sin borrarla.</p>
                <p>Desde <span className="font-bold">No resueltas</span> puedes crear intenciones con keyword sugerida.</p>
              </div>
            </section>
            <section className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[#003952]">Espacios para imágenes</h3>
              <div className="h-28 border-2 border-dashed border-gray-100 rounded-xl flex flex-col items-center justify-center text-[10px] text-gray-400 gap-2 font-medium bg-gray-50/50"><Plus size={20} className="opacity-20" />Imagen panel intenciones</div>
              <div className="h-28 border-2 border-dashed border-gray-100 rounded-xl flex flex-col items-center justify-center text-[10px] text-gray-400 gap-2 font-medium bg-gray-50/50"><Plus size={20} className="opacity-20" />Imagen panel no resueltas</div>
            </section>
          </aside>
        </div>
      </div>

      <ChatBot intencionesData={intenciones} onFormSubmit={handleFormReceived} onUnresolvedQuery={handleUnresolvedQuery} />
      <IntentsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} mode={modalMode} data={selectedData} />
      {showToast && <div className="fixed bottom-10 right-10 bg-white border border-gray-100 shadow-2xl rounded-xl p-4 flex flex-col min-w-[250px] z-[200] animate-in slide-in-from-right duration-300"><p className="text-sm font-bold text-gray-800">Operación exitosa</p><p className="text-[12px] text-gray-500">{toastMessage}</p></div>}
    </div>
  );
}