'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, User, Calendar, BookOpen, MessageCircle, 
  Send, Trash2, Star, Pin, EyeOff, CheckCircle, Reply,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { ArticuloReaccion } from '@/components/articulo-reaccion';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface Respuesta {
  id: number;
  autor: string;
  texto: string;
  fecha: string;
  isAdmin?: boolean;
}

interface Comentario {
  id: number;
  autor: string;
  texto: string;
  fecha: string;
  fijado: boolean;
  destacado: boolean;
  oculto: boolean;
  respuestas: Respuesta[];
}

interface ArticuloCompletoProps {
    articulo: any;
    onBack: () => void;
}

export default function ArticuloCompleto({ articulo, onBack }: ArticuloCompletoProps) {
    const [comentarios, setComentarios] = useState<Comentario[]>([]);
    const [nuevoComentario, setNuevoComentario] = useState("");
    const [replyTo, setReplyTo] = useState<number | null>(null);
    const [textoRespuesta, setTextoRespuesta] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showAllComments, setShowAllComent] = useState(false);

    // Cargar comentarios reales desde la API
    const fetchComentarios = useCallback(async () => {
        if (!articulo?.id) return;
        setIsLoading(true);
        try {
            const res = await fetch(`${API}/api/articulos/${articulo.id}/comentarios`);
            const data = await res.json();
            if (data.success && data.data) {
                setComentarios(data.data.map((c: any) => ({
                    id: c.comentarioId,
                    autor: c.usuario?.nombre_completo || 'Usuario',
                    texto: c.mensaje,
                    fecha: new Date(c.fecha_hora).toLocaleDateString('es-ES'),
                    fijado: false,
                    destacado: false,
                    oculto: false,
                    respuestas: (c.respuestas || []).map((r: any) => ({
                        id: r.comentarioId,
                        autor: r.usuario?.nombre_completo || 'Usuario',
                        texto: r.mensaje,
                        fecha: new Date(r.fecha_hora).toLocaleDateString('es-ES'),
                        isAdmin: false,
                    }))
                })));
            }
        } catch (e) {
            console.error('Error cargando comentarios:', e);
        } finally {
            setIsLoading(false);
        }
    }, [articulo?.id]);

    useEffect(() => { fetchComentarios(); }, [fetchComentarios]);

    // Eliminar comentario en la API
    const eliminarComentario = async (id: number) => {
        if (!confirm("¿Seguro que deseas eliminar este comentario?")) return;
        try {
            await fetch(`${API}/api/articulos/${articulo.id}/comentarios/${id}`, { method: 'DELETE' });
            fetchComentarios();
        } catch (e) {
            console.error(e);
        }
    };

    // Agregar comentario nuevo
    const agregarComentario = async () => {
        if (!nuevoComentario.trim()) return;
        try {
            await fetch(`${API}/api/articulos/${articulo.id}/comentarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mensaje: nuevoComentario, usuarioId: 5, articuloId: articulo.id }),
            });
            setNuevoComentario("");
            fetchComentarios();
        } catch (e) {
            console.error(e);
        }
    };

    // Enviar respuesta
    const enviarRespuesta = async (parentId: number) => {
        if (!textoRespuesta.trim()) return;
        try {
            await fetch(`${API}/api/articulos/${articulo.id}/comentarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mensaje: textoRespuesta, usuarioId: 5, articuloId: articulo.id, respuestaAId: parentId }),
            });
            setTextoRespuesta("");
            setReplyTo(null);
            fetchComentarios();
        } catch (e) {
            console.error(e);
        }
    };

    const toggleFijar = (id: number) => {
        setComentarios(comentarios.map(c => 
            c.id === id ? { ...c, fijado: !c.fijado } : { ...c, fijado: false }
        ));
    };

    const toggleDestacar = (id: number) => {
        setComentarios(comentarios.map(c => c.id === id ? { ...c, destacado: !c.destacado } : c));
    };

    const toggleOcultar = (id: number) => {
        setComentarios(comentarios.map(c => c.id === id ? { ...c, oculto: !c.oculto } : c));
    };

    const comentariosOrdenados = [...comentarios].sort((a, b) => (a.fijado === b.fijado ? 0 : a.fijado ? -1 : 1));
    const comentariosVisibles = showAllComments ? comentariosOrdenados : comentariosOrdenados.slice(0, 2);

    return (
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden animate-in fade-in duration-500 pb-20">
            {/* 1. CABECERA SUPERIOR */}
            <div className="p-6 flex justify-between items-center border-b border-gray-50 bg-white">
                <button onClick={onBack} className="flex items-center gap-2 text-[#003952] font-bold bg-white border border-gray-100 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all shadow-sm text-sm">
                    <ChevronLeft size={18} /> Volver al Panel
                </button>
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#003952] uppercase bg-white px-3 py-1.5 rounded-full border border-green-100 shadow-sm">
                    <CheckCircle size={14} className="text-green-500" /> Modo Administrador Activo
                </div>
            </div>

            <article className="max-w-5xl mx-auto p-10 md:p-16">
                <div className="mb-6">
                    <span className="bg-[#003952] text-white px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider">
                        {articulo.category}
                    </span>
                </div>

                <h1 className="text-5xl md:text-6xl font-black text-[#003952] mb-8 leading-[1.1] tracking-tight">
                    {articulo.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm mb-8">
                    <span className="flex items-center gap-2 font-medium"><User size={18} className="text-gray-300" /> {articulo.author}</span>
                    <span className="flex items-center gap-2 font-medium"><Calendar size={18} className="text-gray-300" /> {articulo.date}</span>
                    <span className="flex items-center gap-2 font-medium"><BookOpen size={18} className="text-gray-300" /> {articulo.views} Vistas</span>
                    <ArticuloReaccion articuloId={articulo.id} initialCount={articulo.likes || 0} />
                </div>

                {articulo.imageUrl && (
                    <div className="mb-12 rounded-3xl overflow-hidden shadow-xl ring-1 ring-gray-100">
                        <img src={articulo.imageUrl} alt={articulo.title} className="w-full h-auto max-h-[500px] object-cover" />
                    </div>
                )}

                <div className="text-gray-700 text-[17px] leading-[1.8] space-y-8">
                    <div className="border-l-[5px] border-[#003952] pl-6 py-1 my-10 bg-gray-50/50 rounded-r-xl">
                        <p className="text-gray-500 italic text-lg font-medium">{articulo.description}</p>
                    </div>
                    <div className="font-normal prose prose-slate max-w-none">
                        <p>Contenido completo del artículo cargado satisfactoriamente desde la base de datos.</p>
                    </div>
                </div>

                {/* SECCIÓN DE COMENTARIOS CON EXPANSIÓN */}
                <section className="mt-24 pt-12 border-t border-gray-100">
                    <h3 className="text-2xl font-black text-[#003952] mb-10 flex items-center gap-3">
                        <MessageCircle size={28} /> Moderación de Comentarios ({comentarios.length})
                    </h3>

                    <div className="bg-white p-6 rounded-3xl mb-12 border border-gray-100 shadow-sm ring-1 ring-gray-50">
                        <textarea 
                            value={nuevoComentario}
                            onChange={(e) => setNuevoComentario(e.target.value)}
                            placeholder="Escribir un comentario..."
                            className="w-full p-2 outline-none text-sm resize-none bg-transparent placeholder:text-gray-300"
                            rows={3}
                        />
                        <div className="flex justify-end pt-4 border-t border-gray-50">
                            <button onClick={agregarComentario} className="bg-[#003952] text-white px-8 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-[#002a3a] transition-all shadow-md">
                                <Send size={14} /> Enviar Comentario
                            </button>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {comentariosVisibles.map(c => (
                            <div key={c.id} className="space-y-4">
                                <div className={`group relative p-8 rounded-3xl border transition-all ${c.fijado ? 'bg-blue-50/30 border-blue-100' : 'bg-white border-gray-50'} ${c.oculto ? 'opacity-40 grayscale' : ''} hover:shadow-md`}>
                                    {c.fijado && <div className="absolute -top-3 left-10 bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-sm"><Pin size={10} fill="white" /> FIJADO</div>}

                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-[#f1f5f9] flex items-center justify-center font-black text-gray-400 shadow-sm">{c.autor[0]}</div>
                                            <div>
                                                <h4 className="font-bold text-base text-[#003952]">{c.autor}</h4>
                                                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">{c.fecha}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                            <button onClick={() => setReplyTo(c.id)} className="p-2.5 text-gray-400 hover:text-[#003952] hover:bg-gray-50 rounded-xl" title="Responder"><Reply size={18} /></button>
                                            <button onClick={() => toggleFijar(c.id)} className={`p-2.5 rounded-xl transition-all ${c.fijado ? 'text-blue-600 bg-blue-50' : 'text-gray-300 hover:bg-gray-50'}`}><Pin size={18} /></button>
                                            <button onClick={() => toggleDestacar(c.id)} className={`p-2.5 rounded-xl transition-all ${c.destacado ? 'text-amber-500 bg-amber-50' : 'text-gray-300 hover:bg-gray-50'}`}><Star size={18} /></button>
                                            <button onClick={() => toggleOcultar(c.id)} className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl"><EyeOff size={18} /></button>
                                            <button onClick={() => eliminarComentario(c.id)} className="p-2.5 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                    <p className="text-[15px] text-gray-600 leading-relaxed pl-[64px] font-medium">{c.texto}</p>

                                    {replyTo === c.id && (
                                        <div className="mt-6 ml-[64px] p-4 bg-gray-50 rounded-2xl border border-gray-100 animate-in slide-in-from-top-2 duration-300">
                                            <textarea value={textoRespuesta} onChange={(e) => setTextoRespuesta(e.target.value)} placeholder="Responder..." className="w-full bg-transparent outline-none text-sm resize-none" rows={2} />
                                            <div className="flex justify-end gap-2 mt-2">
                                                <button onClick={() => setReplyTo(null)} className="px-4 py-1.5 text-xs font-bold text-gray-400 hover:text-gray-600">Cancelar</button>
                                                <button onClick={() => enviarRespuesta(c.id)} className="bg-[#003952] text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2"><Send size={12} /> Responder</button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {c.respuestas?.map(r => (
                                    <div key={r.id} className="ml-16 p-8 rounded-3xl bg-[#f8fafc] border border-blue-50 transition-all">
                                        <div className="flex gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center font-black text-[#003952] shadow-sm">{r.autor[0]}</div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-base text-[#003952]">{r.autor}</h4>
                                                    <span className="bg-[#003952] text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase">ADMIN</span>
                                                </div>
                                                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">{r.fecha}</span>
                                            </div>
                                        </div>
                                        <p className="text-[15px] text-gray-600 leading-relaxed pl-[64px] font-medium">{r.texto}</p>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* BOTÓN MOSTRAR MÁS / MENOS*/}
                    {comentarios.length > 2 && (
                        <div className="mt-10 flex justify-center">
                            <button 
                                onClick={() => setShowAllComent(!showAllComments)}
                                className="flex items-center gap-2 px-8 py-3 bg-gray-50 text-[#003952] font-bold rounded-2xl border border-gray-100 hover:bg-[#003952] hover:text-white transition-all shadow-sm"
                            >
                                {showAllComments ? (<>Mostrar menos <ChevronUp size={18} /></>) : (<>Ver todos ({comentarios.length}) <ChevronDown size={18} /></>)}
                            </button>
                        </div>
                    )}
                </section>
            </article>
        </div>
    );
}