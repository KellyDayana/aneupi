'use client';

import { useState } from 'react';
import { Play, Square, Trash2, Edit, Radio, Users, MessageSquareX, Plus, ExternalLink } from 'lucide-react';

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
  url: string; // <-- Nueva propiedad agregada
}

export default function TvVivoAdminPage() {
  // --- ESTADOS SIMULADOS ---
  const [isStreaming, setIsStreaming] = useState(true);

  const [comments, setComments] = useState<Comment[]>([
    { id: 1, user: 'ANEUPI Noticias', text: 'Última hora: Nuevas medidas...', time: 'Hace 2 min', isModerator: true },
    { id: 2, user: 'Maria López', text: 'Excelente cobertura de las noticias', time: 'Hace 8 min' },
    { id: 3, user: 'Carlos Pérez', text: 'Muy informativo el segmento.', time: 'Hace 10 min' },
    { id: 4, user: 'Usuario Troll', text: 'Este canal es una pérdida de tiempo xd', time: 'Hace 11 min' },
  ]);

  const [channels, setChannels] = useState<Channel[]>([
    { id: 1, title: 'ANEUPI Noticias 24/7', category: 'Noticias', viewers: 2500, isLive: true, image: 'bg-blue-900', url: 'https://youtube.com' },
    { id: 2, title: 'Deportes en Vivo', category: 'Deportes', viewers: 1800, isLive: true, image: 'bg-green-900', url: '' },
    { id: 3, title: 'Cultura y Entretenimiento', category: 'Cultura', viewers: 950, isLive: false, image: 'bg-purple-900', url: '' },
  ]);

  // --- ESTADOS DEL MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  // --- FUNCIONES DE ACCIÓN (SALA DE CONTROL) ---
  const toggleStream = () => setIsStreaming(!isStreaming);

  const deleteComment = (id: number) => {
    if (confirm('¿Eliminar este comentario del chat público?')) {
      setComments(comments.filter(c => c.id !== id));
    }
  };

  // --- FUNCIONES DE GESTIÓN DE CANALES ---
  const deleteChannel = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este canal permanentemente?')) {
      setChannels(channels.filter(c => c.id !== id));
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

    // Obtenemos los valores del formulario
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const url = formData.get('url') as string; // <-- Capturamos la URL

    if (selectedChannel) {
      // Editar existente incluyendo la URL
      setChannels(channels.map(c =>
        c.id === selectedChannel.id ? { ...c, title, category, url } : c
      ));
    } else {
      // Crear nuevo incluyendo la URL
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

  return (
    <div className="space-y-8 relative">
      {/* TÍTULO DE LA SECCIÓN */}
      <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
        <Radio className="text-[#003952]" size={30} />
        <h1>Control de Transmisión (TV en Vivo)</h1>
      </div>

      {/* BLOQUE 1: SALA DE CONTROL Y MODERACIÓN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h2 className="!text-lg">Transmisión Principal</h2>
            <div className="flex items-center gap-2 text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">
              <Users size={16} /> 2,500 Espectadores
            </div>
          </div>

          <div className={`aspect-video flex flex-col items-center justify-center transition-colors ${isStreaming ? 'bg-slate-800' : 'bg-black'}`}>
            {isStreaming ? (
              <div className="text-center text-white">
                <Radio size={48} className="mx-auto mb-4 animate-pulse text-red-500" />
                <p className="text-xl text-white font-bold">SEÑAL EN VIVO ACTIVA</p>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <Square size={48} className="mx-auto mb-4" />
                <p className="text-xl">TRANSMISIÓN PAUSADA</p>
              </div>
            )}
          </div>

          <div className="p-4 bg-white flex gap-4">
            <button
              onClick={toggleStream}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-white transition-colors ${isStreaming ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {isStreaming ? <><Square size={20} /> DETENER STREAM</> : <><Play size={20} /> INICIAR STREAM</>}
            </button>
          </div>
        </div>

        {/* Panel de Moderación */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[500px]">
          <div className="p-4 border-b border-gray-100 bg-[#003952] text-white rounded-t-xl">
            <h2 className="!text-lg !text-white flex items-center gap-2">
              <MessageSquareX size={20} /> Comentarios
            </h2>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="group relative bg-gray-50 p-3 rounded-lg border border-gray-100 hover:border-red-200 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-bold text-[12px] ${comment.isModerator ? 'text-[#003952]' : 'text-gray-700'}`}>
                    {comment.user} {comment.isModerator && '(Admin)'}
                  </span>
                  <span className="text-[10px] text-gray-400">{comment.time}</span>
                </div>
                <p className="text-gray-600">{comment.text}</p>

                <button
                  onClick={() => deleteComment(comment.id)}
                  className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-600 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
                  title="Eliminar comentario"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {comments.length === 0 && <p className="text-center text-gray-400 mt-10">Chat vacío</p>}
          </div>
        </div>
      </div>

      {/* BLOQUE 2: GESTIÓN DE CANALES */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2>Gestión de Canales</h2>
          <button
            onClick={openAddModal}
            className="bg-[#003952] text-white px-4 py-2 rounded-lg hover:bg-[#002233] transition-colors flex items-center gap-2 text-[14px]"
          >
            <Plus size={18} /> Agregar Canal
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {channels.map(channel => (
            <div key={channel.id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col group">

              {/* MINIATURA CON ENLACE CLICKEABLE */}
              <a
                href={channel.url || '#'}
                target={channel.url ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className={`h-32 ${channel.image} relative flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer`}
                title={channel.url ? "Abrir transmisión en nueva pestaña" : "Sin URL configurada"}
              >
                {channel.isLive && (
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">EN VIVO</span>
                )}
                {/* Ícono play que aparece al pasar el ratón para indicar que es clickeable */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 w-12 h-12 rounded-full flex items-center justify-center">
                  <Play size={24} className="text-white ml-1" />
                </div>
              </a>

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <h3 className="!text-[18px] text-[#003952] mb-1 truncate pr-2" title={channel.title}>{channel.title}</h3>
                  {channel.url && (
                    <span title="Tiene URL" className="flex-shrink-0 mt-1">
                      <ExternalLink size={14} className="text-gray-400" />
                    </span>
                  )}
                </div>
                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mb-4 w-fit">
                  {channel.category}
                </span>

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => openEditModal(channel)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors text-[14px]"
                  >
                    <Edit size={16} /> Editar
                  </button>
                  <button
                    onClick={() => deleteChannel(channel.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded transition-colors text-[14px]"
                  >
                    <Trash2 size={16} /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DE GESTIÓN DE CANALES */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in duration-200">

            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="!text-[25px] !text-[#003952] font-bold">
                {selectedChannel ? 'Editar Canal' : 'Agregar Nuevo Canal'}
              </h2>
            </div>

            <form onSubmit={handleGuardarCanal} className="p-6 space-y-4">
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
                  name="url" // <-- Nombre clave para capturarlo en el FormData
                  defaultValue={selectedChannel?.url || ''} // <-- Carga la URL si estás editando
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003952] outline-none text-[14px]"
                  placeholder="https://ejemplo.com/stream"
                />
              </div>

              <div className="flex gap-3 mt-6 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-[14px]"
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