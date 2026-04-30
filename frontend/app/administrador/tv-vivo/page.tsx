'use client';

import { useState } from 'react';
import { Play, Square, Trash2, Edit, Radio, Users, MessageSquareX, Plus, ExternalLink, Search, ChevronLeft, ChevronRight, Pin, Send, MonitorPlay, Ban } from 'lucide-react';

// --- INTERFACES PARA TYPESCRIPT ---
interface Comment {
  id: number;
  user: string;
  text: string;
  time: string;
  isModerator?: boolean;
}

interface Channel {
  id: number;
  title: string;
  category: string;
  viewers: number;
  isLive: boolean;
  image: string;
  url: string; 
}

export default function TvVivoAdminPage() {
  // --- ESTADOS SIMULADOS ---
  const [searchTerm, setSearchTerm] = useState('');
  const [isStreaming, setIsStreaming] = useState(true);

  // Estados de Canales
  const [channels, setChannels] = useState<Channel[]>([
    { id: 1, title: 'ANEUPI Noticias 24/7', category: 'Noticias', viewers: 2500, isLive: true, image: 'bg-blue-900', url: 'https://youtube.com' },
    { id: 2, title: 'Deportes en Vivo', category: 'Deportes', viewers: 1800, isLive: true, image: 'bg-green-900', url: '' },
    { id: 3, title: 'Cultura y Entretenimiento', category: 'Cultura', viewers: 950, isLive: false, image: 'bg-purple-900', url: '' },
    { id: 4, title: 'Cine Independiente', category: 'Entretenimiento', viewers: 420, isLive: true, image: 'bg-indigo-900', url: '' },
  ]);

  // Canal Activo en la Transmisión Principal
  const [activeChannelId, setActiveChannelId] = useState<number | null>(1); 

  // Estados para el Chat
  // [Backend - Websockets] El estado inicial debería cargarse desde la BD y luego escuchar eventos de un WebSocket
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, user: 'ANEUPI Noticias', text: 'Última hora: Nuevas medidas implementadas.', time: 'Hace 2 min', isModerator: true },
    { id: 2, user: 'Maria López', text: 'Excelente cobertura de las noticias', time: 'Hace 8 min' },
    { id: 3, user: 'Carlos Pérez', text: 'Muy informativo el segmento.', time: 'Hace 10 min' },
    { id: 4, user: 'Usuario Troll', text: 'Este canal es una pérdida de tiempo xd', time: 'Hace 11 min' },
  ]);
  const [newComment, setNewComment] = useState('');
  const [pinnedCommentId, setPinnedCommentId] = useState<number | null>(1);

  // --- ESTADOS DEL MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  // --- LÓGICA DE BÚSQUEDA Y CANAL ACTIVO ---
  const filteredChannels = channels.filter(channel => 
    channel.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    channel.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeChannel = channels.find(c => c.id === activeChannelId);

  // --- FUNCIONES DE ACCIÓN (SALA DE CONTROL Y CHAT) ---
  const toggleStream = () => setIsStreaming(!isStreaming);

  const deleteComment = (id: number) => {
    if (confirm('¿Eliminar este comentario del chat público?')) {
      setComments(comments.filter(c => c.id !== id));
      if (pinnedCommentId === id) setPinnedCommentId(null);

      // [Backend - Emitir Borrado]
      // socket.emit('admin_delete_message', { messageId: id });
    }
  };

  const banUser = (username: string) => {
    if (confirm(`¿Estás seguro de BLOQUEAR a ${username}? Se eliminarán todos sus mensajes y no podrá volver a escribir.`)) {
      // 1. Eliminar visualmente todos los comentarios de ese usuario
      setComments(prevComments => prevComments.filter(c => c.user !== username));
      
      // 2. [Backend - Banear y Emitir]
      // Enviar petición al backend (ej: Node.js) para registrar el ban en BD.
      // fetch('/api/admin/chat/ban', { method: 'POST', body: JSON.stringify({ username }) })
      // Y emitir por socket: socket.emit('admin_ban_user', { username });
      
      alert(`El usuario ${username} ha sido bloqueado.`);
    }
  };

  const togglePinComment = (id: number) => {
    setPinnedCommentId(prevId => prevId === id ? null : id);
    // [Backend - Emitir Fijado]
    // socket.emit('admin_pin_message', { messageId: pinnedCommentId === id ? null : id });
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentToAdd: Comment = {
      id: Date.now(),
      user: 'Admin ANEUPI',
      text: newComment,
      time: 'Justo ahora',
      isModerator: true
    };

    setComments([commentToAdd, ...comments]);
    setNewComment('');

    // [Backend - Enviar Mensaje Oficial]
    // socket.emit('send_message', commentToAdd);
  };

  // --- FUNCIONES DE GESTIÓN DE CANALES ---
  const deleteChannel = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este canal permanentemente?')) {
      const remainingChannels = channels.filter(c => c.id !== id);
      setChannels(remainingChannels);
      
      if (activeChannelId === id) {
        setActiveChannelId(remainingChannels.length > 0 ? remainingChannels[0].id : null);
      }
    }
  };

  const openAddModal = () => {
    setSelectedChannel(null);
    setIsModalOpen(true);
  };

  const openEditModal = (channel: Channel) => {
    setSelectedChannel(channel);
    setIsModalOpen(true);
  };

  const handleGuardarCanal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const url = formData.get('url') as string;

    if (selectedChannel) {
      setChannels(channels.map(c =>
        c.id === selectedChannel.id ? { ...c, title, category, url } : c
      ));
    } else {
      const nuevoCanal: Channel = {
        id: Date.now(),
        title,
        category,
        url,
        viewers: 0,
        isLive: false,
        image: 'bg-slate-700'
      };
      setChannels([...channels, nuevoCanal]);
    }
    setIsModalOpen(false);
  };

  const scrollContainer = (id: string, direction: 'left' | 'right') => {
    const container = document.getElementById(id);
    if (container) {
      const scrollAmount = 350;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="space-y-10 relative">
      <style dangerouslySetInnerHTML={{ __html: `.scrollbar-hide::-webkit-scrollbar { display: none; }` }} />
      
      {/* 1. CABECERA DE LA PÁGINA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-200 pb-5">
        <div className="flex flex-col">
          <div className="flex items-center gap-4">
            <div className="w-2.5 h-10 md:h-12 bg-gradient-to-b from-[#003952] to-blue-500 rounded-full shadow-sm"></div>
            <div className="flex items-center gap-3">
              <Radio size={34} className="text-[#003952]" strokeWidth={2.5} />
              <h1 className="text-[42px] md:text-[50px] font-black text-[#003952] tracking-tighter leading-none">
                TV en Vivo
              </h1>
            </div>
          </div>
          <p className="text-[15px] text-gray-500 mt-2 ml-[26px]">
            Controla la transmisión principal, modera el chat y gestiona los canales.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar canal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003952] outline-none text-[14px] transition-shadow shadow-sm"
            />
          </div>

          <button
            onClick={openAddModal}
            className="w-full sm:w-auto bg-[#003952] text-white px-5 py-2.5 rounded-lg text-[14px] font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-[#002233] transition-colors whitespace-nowrap"
          >
            <Plus size={18} /> Agregar Canal
          </button>
        </div>
      </div>

      {/* BLOQUE 1: SALA DE CONTROL Y MODERACIÓN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Transmisión Principal Dinámica */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <div>
               <h2 className="!text-[18px] font-bold text-[#003952]">Transmisión Principal</h2>
               <p className="text-[13px] text-gray-500 font-medium mt-0.5">
                 {activeChannel ? `Emite: ${activeChannel.title}` : 'Sin canal seleccionado'}
               </p>
            </div>
            
            <div className="flex items-center gap-2 text-[12px] font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
              <Users size={14} /> {activeChannel ? activeChannel.viewers : 0} Espectadores
            </div>
          </div>

          <div className={`flex-1 flex flex-col items-center justify-center transition-colors min-h-[300px] ${isStreaming && activeChannel ? activeChannel.image : 'bg-black'}`}>
            {isStreaming && activeChannel ? (
              <div className="text-center text-white bg-black/40 p-6 rounded-2xl backdrop-blur-sm">
                <Radio size={48} className="mx-auto mb-4 animate-pulse text-red-500" />
                <p className="text-2xl text-white font-bold mb-1">SEÑAL EN VIVO ACTIVA</p>
                <p className="text-sm text-gray-300 uppercase tracking-widest">{activeChannel.category}</p>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <Square size={48} className="mx-auto mb-4" />
                <p className="text-xl font-bold">{!activeChannel ? 'SELECCIONA UN CANAL' : 'TRANSMISIÓN PAUSADA'}</p>
              </div>
            )}
          </div>

          <div className="p-4 bg-white flex gap-4">
            <button
              onClick={toggleStream}
              disabled={!activeChannel}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-white transition-colors text-[14px] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${isStreaming ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {isStreaming ? <><Square size={18} /> DETENER STREAM</> : <><Play size={18} /> INICIAR STREAM</>}
            </button>
          </div>
        </div>

        {/* Panel de Moderación (Chat) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[500px]">
          <div className="p-4 border-b border-gray-100 bg-[#003952] text-white rounded-t-xl">
            <h2 className="!text-[16px] font-bold !text-white flex items-center gap-2">
              <MessageSquareX size={18} /> Comentarios en Vivo
            </h2>
          </div>

          {/* Comentario Fijado */}
          {pinnedCommentId && comments.find(c => c.id === pinnedCommentId) && (
            <div className="p-3 bg-blue-50 border-b border-blue-100 relative">
              <div className="flex items-center gap-1 text-[#003952] text-[11px] font-bold mb-1 uppercase tracking-wider">
                <Pin size={12} fill="currentColor" /> Mensaje Fijado
              </div>
              <p className="text-[13px] text-gray-800 pr-6">
                <span className="font-bold mr-1">{comments.find(c => c.id === pinnedCommentId)?.user}:</span>
                {comments.find(c => c.id === pinnedCommentId)?.text}
              </p>
              <button 
                onClick={() => setPinnedCommentId(null)} 
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                title="Desfijar mensaje"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}

          {/* Lista de Comentarios */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {comments.map(comment => (
              <div key={comment.id} className={`group relative p-3 rounded-lg border transition-colors ${comment.isModerator ? 'bg-blue-50/50 border-blue-100' : 'bg-gray-50 border-gray-100 hover:border-gray-200'}`}>
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-bold text-[12px] flex items-center gap-1 ${comment.isModerator ? 'text-[#003952]' : 'text-gray-700'}`}>
                    {comment.user} {comment.isModerator && <span className="bg-[#003952] text-white text-[9px] px-1.5 py-0.5 rounded uppercase">Admin</span>}
                  </span>
                  <span className="text-[10px] text-gray-400">{comment.time}</span>
                </div>
                <p className="text-[13px] text-gray-600 pr-16">{comment.text}</p> {/* Añadido pr-16 para que el texto no se monte sobre los 3 iconos */}

                {/* BOTONES DE ACCIÓN FLOTANTES */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm p-1 rounded-lg">
                  
                  {/* BOTÓN BLOQUEAR USUARIO */}
                  {!comment.isModerator && (
                    <button
                      onClick={() => banUser(comment.user)}
                      className="p-1.5 bg-white text-orange-500 rounded hover:text-white hover:bg-orange-500 transition-colors shadow-sm border border-transparent hover:border-orange-600"
                      title={`Bloquear a ${comment.user}`}
                    >
                      <Ban size={14} />
                    </button>
                  )}

                  <button
                    onClick={() => togglePinComment(comment.id)}
                    className={`p-1.5 rounded transition-colors shadow-sm ${pinnedCommentId === comment.id ? 'bg-[#003952] text-white' : 'bg-white text-gray-400 hover:text-[#003952]'}`}
                    title={pinnedCommentId === comment.id ? "Desfijar" : "Fijar mensaje"}
                  >
                    <Pin size={14} />
                  </button>

                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="p-1.5 bg-white text-red-400 rounded hover:text-red-600 hover:bg-red-50 transition-colors shadow-sm"
                    title="Eliminar comentario"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {comments.length === 0 && <p className="text-center text-gray-400 mt-10 text-[14px]">Chat vacío</p>}
          </div>

          <div className="p-3 border-t border-gray-100 bg-white rounded-b-xl">
            <form onSubmit={handleSendComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe como administrador..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#003952]"
              />
              <button 
                type="submit" 
                disabled={!newComment.trim()}
                className="bg-[#003952] text-white px-3 py-2 rounded-lg hover:bg-[#002233] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* BLOQUE 2: GESTIÓN DE CANALES */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="mb-6">
          <h2 className="!text-[22px] font-bold text-[#003952]">Catálogo de Canales</h2>
        </div>

        {filteredChannels.length > 0 ? (
          <div className="relative group">
            <button onClick={() => scrollContainer('scroll-canales', 'left')} className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 p-3 bg-white border border-gray-200 rounded-full text-[#003952] shadow-lg hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 hidden md:block">
              <ChevronLeft size={24} />
            </button>
            <button onClick={() => scrollContainer('scroll-canales', 'right')} className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 p-3 bg-white border border-gray-200 rounded-full text-[#003952] shadow-lg hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 hidden md:block">
              <ChevronRight size={24} />
            </button>

            <div id="scroll-canales" className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide pt-2 px-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {filteredChannels.map(channel => (
                <div key={channel.id} className={`w-80 shrink-0 snap-start bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col group transition-all duration-300 hover:shadow-md ${activeChannelId === channel.id ? 'border-[#003952] ring-2 ring-[#003952]/20' : 'border-gray-200 hover:-translate-y-1'}`}>

                  <a
                    href={channel.url || '#'}
                    target={channel.url ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className={`h-32 ${channel.image} relative flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer`}
                    title={channel.url ? "Abrir transmisión en nueva pestaña" : "Sin URL configurada"}
                  >
                    {channel.isLive && (
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm tracking-wider">EN VIVO</span>
                    )}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 w-12 h-12 rounded-full flex items-center justify-center">
                      <Play size={24} className="text-white ml-1" />
                    </div>
                  </a>

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-[16px] text-[#003952] mb-1 truncate pr-2" title={channel.title}>{channel.title}</h3>
                      {channel.url && (
                        <span title="Tiene URL" className="flex-shrink-0 mt-1">
                          <ExternalLink size={14} className="text-gray-400" />
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center mb-4 mt-1">
                      <span className="inline-block bg-gray-100 text-gray-600 text-[11px] font-medium px-2 py-1 rounded">
                        {channel.category}
                      </span>
                      <span className="text-[12px] text-gray-400 flex items-center gap-1"><Users size={12}/> {channel.viewers}</span>
                    </div>

                    <button
                      onClick={() => setActiveChannelId(channel.id)}
                      className={`w-full py-2 flex items-center justify-center gap-2 rounded text-[13px] font-bold mb-3 transition-colors ${activeChannelId === channel.id ? 'bg-[#003952] text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                    >
                      <MonitorPlay size={16} />
                      {activeChannelId === channel.id ? 'En Emisión Principal' : 'Emitir en Principal'}
                    </button>

                    <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
                      <button
                        onClick={() => openEditModal(channel)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 hover:bg-[#003952] hover:text-white text-gray-600 rounded transition-colors text-[13px] font-medium"
                      >
                        <Edit size={14} /> Editar
                      </button>
                      <button
                        onClick={() => deleteChannel(channel.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded transition-colors text-[13px] font-medium"
                      >
                        <Trash2 size={14} /> Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
           <div className="py-12 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p>No se encontraron canales con "{searchTerm}"</p>
          </div>
        )}
      </div>

      {/* MODAL DE GESTIÓN DE CANALES */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in duration-200">

            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="!text-[22px] !text-[#003952] font-bold">
                {selectedChannel ? 'Editar Canal' : 'Agregar Nuevo Canal'}
              </h2>
            </div>

            <form onSubmit={handleGuardarCanal} className="p-6 space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-[14px]">Nombre del Canal</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={selectedChannel?.title || ''}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003952] outline-none text-[14px]"
                  placeholder="Ej: ANEUPI Deportes"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1 text-[14px]">Categoría</label>
                <select
                  name="category"
                  defaultValue={selectedChannel?.category || 'Noticias'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003952] outline-none text-[14px] bg-white"
                >
                  <option value="Noticias">Noticias</option>
                  <option value="Deportes">Deportes</option>
                  <option value="Cultura">Cultura</option>
                  <option value="Entretenimiento">Entretenimiento</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1 text-[14px]">URL de la Señal (Stream)</label>
                <input
                  type="url"
                  name="url"
                  defaultValue={selectedChannel?.url || ''}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003952] outline-none text-[14px]"
                  placeholder="https://ejemplo.com/stream"
                />
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-[14px] font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#003952] text-white rounded-lg hover:bg-[#002233] transition-colors text-[14px] font-bold"
                >
                  {selectedChannel ? 'Guardar Cambios' : 'Crear Canal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}