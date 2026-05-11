'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Eye, Heart, MessageCircle, Calendar, User, ArrowRight, BookOpen, ClipboardList, RefreshCw } from 'lucide-react';
import ArticuloCompleto from './articuloCompleto'; 
import { ArticulosRevisionPanel } from '@/components/articulos-revision-panel';
import { AddArticleForm } from '@/components/add-article-form';
import { ArticulosPapelera } from '@/components/articulos-papelera';
import { useUser } from '@/contexts/user-context';
import { title } from 'process';
import { Description } from '@radix-ui/react-toast';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// --- INTERFACES ---
interface Article {
    id: number;
    title: string;
    description: string;
    category: string;
    author: string;
    date: string;
    views: number;
    likes: number;
    comments: number;
    imageColor: string;
    url: string;
    imageUrl?: string;
    estado?: string;
    readTime?: string;
    contenido?: string;
}

interface Trending {
    id: number;
    title: string;
    views: string;
}

function articleFromApi(item: any): Article {
    return {
        id: item.articuloId,
        title: item.titulo,
        description: item.descripcion,
        category: item.categoria?.nombre || 'General',
        author: item.nombre_autor || item.autor?.nombre_completo || 'Autor',
        date: new Date(item.fechaPublicacion).toLocaleDateString('es-ES'),
        views: item.vistas || 0,
        likes: item.reacciones?.total || 0,
        comments: item._count?.comentarios || 0,
        imageColor: 'bg-slate-700',
        url: item.url_redireccion || '',
        imageUrl: item.url_imagen || '',
        estado: item.estado || '',
        readTime: item.tiempo_lectura ? `${item.tiempo_lectura} min` : '',
        contenido: item.contenido || '',
    };
}

export default function ArticulosAdminPage() {
    // --- ESTADOS ---
    const [searchTerm, setSearchTerm] = useState('');
    const [displayedArticle, setDisplayedArticle] = useState<Article | null>(null); 
    const [showAllTrending, setShowAllTrending] = useState(false);
    // Pestañas
    const [activeTab, setActiveTab] = useState<'lista' | 'revision' | 'papelera'>('lista');
    const [pendientesCount, setPendientesCount] = useState(0);
    const { token } = useUser();
    // Modal de agregar artículo — usa AddArticleForm
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    // Lista de artículos desde la API
    const [articles, setArticles] = useState<Article[]>([]);
    const [loadingArticles, setLoadingArticles] = useState(false);

    const fetchArticulos = useCallback(async (search: string = '') => {
        setLoadingArticles(true);
        try {
            const searchParam = search.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
            // Traer todos excepto OCULTO — si hay búsqueda no filtrar por estado para mostrar todos los resultados
            const url = search.trim()
                ? `${API}/api/articulos?take=100${searchParam}`
                : `${API}/api/articulos?take=100&estado=PUBLICADO`;
            const res = await fetch(url);
            const data = await res.json();
            if (data?.data?.length) {
                setArticles(data.data.filter((a: any) => a.estado !== 'OCULTO').map(articleFromApi));
            } else {
                setArticles([]);
            }
        } catch (e) {
            console.error('Error cargando artículos:', e);
        } finally {
            setLoadingArticles(false);
        }
    }, []);

    useEffect(() => { fetchArticulos(); }, [fetchArticulos]);

    // Búsqueda con debounce — espera 400ms después de que el usuario deja de escribir
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchArticulos(searchTerm);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchTerm, fetchArticulos]);

    // --- LÓGICA DE BÚSQUEDA Y AGRUPACIÓN ---
    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedArticles = filteredArticles.reduce((acc, article) => {
        if (!acc[article.category]) acc[article.category] = [];
        acc[article.category].push(article);
        return acc;
    }, {} as Record<string, Article[]>);

    const scrollContainer = (id: string, direction: 'left' | 'right') => {
        const container = document.getElementById(id);
        if (container) container.scrollBy({ left: direction === 'left' ? -350 : 350, behavior: 'smooth' });
    };

    const deleteArticle = async (id: number) => {
        if (!confirm('¿Mover este artículo a la papelera? Tendrás 30 días para eliminarlo permanentemente.')) return;
        try {
            const headers: Record<string, string> = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;
            await fetch(`${API}/api/articulos/${id}`, { method: 'DELETE', headers });
            fetchArticulos(searchTerm);
        } catch (e) {
            console.error('Error moviendo artículo a papelera:', e);
        }
    };

    return (
        <div className="space-y-10 relative">
            <style dangerouslySetInnerHTML={{ __html: `.scrollbar-hide::-webkit-scrollbar { display: none; }` }} />

            {displayedArticle ? (
                <ArticuloCompleto articulo={displayedArticle} onBack={() => setDisplayedArticle(null)} />
            ) : (
                <>
                    {/* CABECERA */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-200 pb-5">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-4">
                                <div className="w-2.5 h-10 md:h-12 bg-gradient-to-b from-[#003952] to-blue-500 rounded-full shadow-sm"></div>
                                <div className="flex items-center gap-3">
                                    <BookOpen size={34} className="text-[#003952]" strokeWidth={2.5} />
                                    <h1 className="text-[42px] md:text-[50px] font-black text-[#003952] tracking-tighter leading-none">Artículos</h1>
                                </div>
                            </div>
                            <p className="text-[15px] text-gray-500 mt-2 ml-[26px]">Lee y gestiona artículos de opinión y reportajes.</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="text" placeholder="Buscar artículo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none text-[14px] transition-shadow shadow-sm" />
                            </div>
                            <button onClick={() => { setSelectedArticle(null); setIsFormOpen(true); }} className="w-full sm:w-auto bg-[#003952] text-white px-5 py-2.5 rounded-lg text-[14px] font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-[#002233] transition-colors whitespace-nowrap">
                                <Plus size={18} /> Agregar artículo
                            </button>
                        </div>
                    </div>

                    {/* PESTAÑAS */}
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('lista')}
                            className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                                activeTab === 'lista'
                                    ? 'border-[#003952] text-[#003952]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Lista de Artículos
                        </button>
                        <button
                            onClick={() => setActiveTab('revision')}
                            className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                                activeTab === 'revision'
                                    ? 'border-[#003952] text-[#003952]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <ClipboardList size={16} />
                            Revisión de Artículos
                            {pendientesCount > 0 && (
                                <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-0.5 rounded-full font-bold">
                                    {pendientesCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('papelera')}
                            className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                                activeTab === 'papelera'
                                    ? 'border-red-500 text-red-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            🗑️ Papelera
                        </button>
                    </div>

                    {/* TAB: REVISIÓN */}
                    {activeTab === 'revision' && <ArticulosRevisionPanel onCountChange={setPendientesCount} />}

                    {/* TAB: PAPELERA */}
                    {activeTab === 'papelera' && <ArticulosPapelera />}

                    {/* TAB: LISTA */}
                    {activeTab === 'lista' && (
                    <>

                    {/* CUERPO POR CATEGORÍAS */}
                    {loadingArticles ? (
                        <div className="flex items-center justify-center py-20 text-gray-400">
                            <svg className="animate-spin w-8 h-8 mr-3 text-[#003952]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg>
                            <span className="text-[14px] font-medium">Cargando artículos...</span>
                        </div>
                    ) : Object.keys(groupedArticles).length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <BookOpen size={40} className="mb-3 opacity-30" />
                            <p className="text-[14px] font-medium">No se encontraron artículos</p>
                            {searchTerm && <p className="text-[12px] mt-1">para "{searchTerm}"</p>}
                        </div>
                    ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Lado Izquierdo: Artículos (3 columnas) */}
                        <div className="lg:col-span-3 space-y-10">
                            {Object.entries(groupedArticles).map(([category, catArticles]) => (
                                <div key={category} className="relative">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="font-bold text-[18px] text-[#003952] uppercase flex items-center gap-2">
                                            <span className="w-2 h-6 bg-red-600 rounded-full block"></span>{category}
                                        </h2>
                                        <div className="flex gap-2">
                                            <button onClick={() => scrollContainer(`scroll-${category}`, 'left')} className="p-1.5 border border-gray-200 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"><ChevronLeft size={18} /></button>
                                            <button onClick={() => scrollContainer(`scroll-${category}`, 'right')} className="p-1.5 border border-gray-200 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"><ChevronRight size={18} /></button>
                                        </div>
                                    </div>

                                    <div id={`scroll-${category}`} className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                                        {catArticles.map(article => (
                                            <div key={article.id} className="w-60 shrink-0 snap-start bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col group relative">
                                                <div className={`h-20 ${article.imageColor} relative flex items-center justify-center opacity-90 overflow-hidden`}>
                                                    {article.imageUrl && <img src={article.imageUrl} alt={article.title} className="absolute inset-0 w-full h-full object-cover z-0" />}
                                                    <div className="absolute inset-0 bg-black/10 z-0"></div>
                                                </div>
                                                <div className="p-4 flex-1 flex flex-col">
                                                    <h3 className="font-bold text-[16px] text-[#003952] mb-2 leading-snug line-clamp-2">{article.title}</h3>
                                                    <p className="text-[13px] text-gray-500 mb-4 line-clamp-3 leading-relaxed">{article.description}</p>
                                                    <div className="flex justify-between items-end mb-4 mt-auto">
                                                        <div className="flex flex-col text-[12px] text-gray-400 gap-1">
                                                            <span className="flex items-center gap-1"><User size={12} /> {article.author}</span>
                                                            <span className="flex items-center gap-1"><Calendar size={12} /> {article.date}</span>
                                                        </div>
                                                        <button onClick={() => setDisplayedArticle(article)} className="bg-[#003952] text-white px-3 py-1.5 rounded-full text-[12px] font-medium flex items-center gap-1 hover:bg-[#002233] transition-colors">
                                                            Leer más <ArrowRight size={14} />
                                                        </button>
                                                    </div>
                                                    <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-gray-400 text-[12px]">
                                                        <div className="flex items-center gap-3">
                                                            <span className="flex items-center gap-1"><Eye size={14} /> {article.views}</span>
                                                            <span className="flex items-center gap-1"><Heart size={14} /> {article.likes}</span>
                                                            <span className="flex items-center gap-1"><MessageCircle size={14} /> {article.comments}</span>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <button onClick={() => { setSelectedArticle(article); setIsFormOpen(true); }} className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-[#003952] hover:text-white transition-colors" title="Editar"><Edit size={14} /></button>
                                                            <button onClick={() => deleteArticle(article.id)} className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors" title="Eliminar"><Trash2 size={14} /></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* PANEL DERECHO EDITORIAL */}
                        <div className="lg:col-span-1 space-y-4">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
                                <div className="py-3 bg-[#003952] text-white text-center font-bold text-[14px]">
                                    Editorial ANEUPI
                                </div>
                                <div className="p-5 space-y-4">
                                    <h3 className="font-bold text-[16px] text-gray-800">¿Qué está pasando?</h3>
                                    {[
                                        { title: 'III Congreso Internacional', views: '115 usuarios' },
                                        { title: 'Foro de Innovación', views: '980 usuarios' },
                                        { title: 'Encuentro de Educación Digital', views: '3,459 usuarios' },
                                    ].map((item, i) => (
                                        <div key={i} className="pr-2">
                                            <p className="text-[10px] text-gray-400 mb-1">Tendencia en este momento</p>
                                            <h4 className="font-bold text-[#003952] text-[14px] leading-tight">{item.title}</h4>
                                            <p className="text-[12px] text-gray-400 mt-1">{item.views}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    )} {/* fin condicional loadingArticles */}
                    </>
                    )}
                </>
            )}

            <AddArticleForm
                isOpen={isFormOpen}
                onClose={() => { setIsFormOpen(false); setSelectedArticle(null); }}
                onSubmit={() => { fetchArticulos(); }}
                isAdmin={true}
                initialData={selectedArticle ? {
                    title: selectedArticle.title,
                    author: selectedArticle.author,
                    description: selectedArticle.description,
                    contenido: selectedArticle.contenido,
                    category: selectedArticle.category, 
                    readTime: selectedArticle.readTime,
                    imageUrl: selectedArticle.imageUrl,
                    articuloId: selectedArticle.id,
                }:undefined}
            />
        </div>
    );
}