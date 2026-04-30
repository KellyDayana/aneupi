'use client';

import { useState, useRef } from 'react';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Share2, Eye, Heart, MessageCircle, Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
// IMPORTANTE: Asegúrate de tener el archivo ArticuloCompleto.tsx en la misma carpeta
import ArticuloCompleto from './articuloCompleto'; 

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
}

interface Trending {
    id: number;
    title: string;
    views: string;
}

export default function ArticulosAdminPage() {
    // --- ESTADOS ---
    const [searchTerm, setSearchTerm] = useState('');
    const [displayedArticle, setDisplayedArticle] = useState<Article | null>(null); 
    const [showAllTrending, setShowAllTrending] = useState(false);
    // Estados para el Modal de Tendencias
    const [isTrendingModalOpen, setIsTrendingModalOpen] = useState(false);
    const [selectedTrending, setSelectedTrending] = useState<Trending | null>(null);

    const openTrendingModal = (item: Trending | null = null) => {
    setSelectedTrending(item);
    setIsTrendingModalOpen(true);
    };

    // Función para guardar o actualizar tendencia
    const handleGuardarTrending = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const title = formData.get('trendingTitle') as string;
        const views = formData.get('trendingViews') as string;

        if (selectedTrending) {
            setTrending(trending.map(t => 
                t.id === selectedTrending.id ? { ...t, title, views } : t
            ));
        } else {
            const nuevo = { id: Date.now(), title, views };
            setTrending([...trending, nuevo]);
        }
        setIsTrendingModalOpen(false);
    };

    // Función para eliminar tendencia
    const deleteTrending = (id: number) => {
        if (confirm('¿Eliminar esta tendencia del panel editorial?')) {
            setTrending(trending.filter(t => t.id !== id));
        }
    };

    const [articles, setArticles] = useState<Article[]>([
        {
            id: 1, title: 'IA en América Latina',
            description: 'Un análisis profundo sobre cómo la IA está transformando los sectores productivos...',
            category: 'TECNOLOGÍA', author: 'María González', date: '15 Oct 2025',
            views: 1234, likes: 89, comments: 23, imageColor: 'bg-blue-900', url: 'https://ejemplo.com/1',
            imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=500&auto=format&fit=crop'
        },
        {
            id: 4, title: 'Sostenibilidad Ambiental',
            description: 'Exploramos las iniciativas más innovadoras en sostenibilidad...',
            category: 'MEDIO AMBIENTE', author: 'Ana Silva', date: '02 Oct 2025',
            views: 1540, likes: 120, comments: 45, imageColor: 'bg-green-700', url: 'https://ejemplo.com/4',
            imageUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=500&auto=format&fit=crop'
        }
    ]);

    const [trending, setTrending] = useState<Trending[]>([
        { id: 1, title: 'III Congreso Internacional', views: '115 usuarios' },
        { id: 2, title: 'Foro de Innovación', views: '980 usuarios' },
        { id: 3, title: 'Encuentro de Educación Digital', views: '3,459 usuarios' }, // Elemento necesario para activar el botón
    ]);

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

    // --- MODAL Y FUNCIONES ADMIN ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    const handleGuardarArticulo = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const articleData = {
            title: formData.get('title') as string,
            author: formData.get('author') as string,
            category: formData.get('category') as string,
            imageUrl: formData.get('imageUrl') as string,
            url: formData.get('url') as string, // URL de Redirección
            description: formData.get('description') as string,
        };

        if (selectedArticle) {
            setArticles(articles.map(a => a.id === selectedArticle.id ? { ...a, ...articleData } : a));
        } else {
            const nuevo = { 
                ...articleData, 
                id: Date.now(), 
                date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }), 
                views: 0, likes: 0, comments: 0, imageColor: 'bg-slate-700' 
            };
            setArticles([nuevo, ...articles]);
        }
        setIsModalOpen(false);
    };

    const scrollContainer = (id: string, direction: 'left' | 'right') => {
        const container = document.getElementById(id);
        if (container) container.scrollBy({ left: direction === 'left' ? -350 : 350, behavior: 'smooth' });
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
                            <button onClick={() => { setSelectedArticle(null); setIsModalOpen(true); }} className="w-full sm:w-auto bg-[#003952] text-white px-5 py-2.5 rounded-lg text-[14px] font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-[#002233] transition-colors whitespace-nowrap">
                                <Plus size={18} /> Agregar artículo
                            </button>
                        </div>
                    </div>

                    {/* CUERPO POR CATEGORÍAS */}
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
                                                            <button onClick={() => { setSelectedArticle(article); setIsModalOpen(true); }} className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-[#003952] hover:text-white transition-colors"><Edit size={14} /></button>
                                                            <button onClick={() => setArticles(articles.filter(a => a.id !== article.id))} className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors"><Trash2 size={14} /></button>
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
                                <div className="py-3 bg-[#003952] text-white text-center font-bold text-[14px] flex items-center justify-center gap-2">
                                    Editorial ANEUPI
                                    <button onClick={() => openTrendingModal()} className="hover:scale-110 transition-transform">
                                        <Plus size={16} />
                                    </button>
                                </div>
                                
                                <div className="p-5 space-y-5">
                                    <h3 className="font-bold text-[16px] text-gray-800">¿Qué está pasando?</h3>
                                    
                                    <div className="space-y-5">
                                        {(showAllTrending ? trending : trending.slice(0, 2)).map(item => (
                                            <div key={item.id} className="group relative pr-10 animate-in fade-in duration-300">
                                                <p className="text-[10px] text-gray-400 mb-1 font-medium">Tendencia en este momento</p>
                                                <h4 className="font-bold text-[#003952] text-[14px] leading-tight">{item.title}</h4>
                                                <p className="text-[12px] text-gray-400 mt-1">{item.views}</p>
                                                
                                                {/* Botones de Gestión de Tendencias */}
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => openTrendingModal(item)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                                                        <Edit size={12} />
                                                    </button>
                                                    <button onClick={() => deleteTrending(item.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {trending.length > 2 && (
                                        <button 
                                            onClick={() => setShowAllTrending(!showAllTrending)}
                                            className="text-[#003952] text-[13px] font-bold hover:underline pt-2 w-full text-left flex items-center justify-between group"
                                        >
                                            <span>{showAllTrending ? "Mostrar menos" : "Mostrar más"}</span>
                                            <ChevronRight size={14} className={`transition-transform duration-300 ${showAllTrending ? 'rotate-90' : ''}`} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div> {/* CIERRE DEL GRID PRINCIPAL */}
                </>
            )};
                {/* MODAL GESTIÓN DE TENDENCIAS */}
            {isTrendingModalOpen && (
                <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 bg-white">
                            <h2 className="text-xl font-bold text-[#003952]">
                                {selectedTrending ? 'Editar Tendencia' : 'Nueva Tendencia'}
                            </h2>
                        </div>

                        <form onSubmit={handleGuardarTrending} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título de la Tendencia</label>
                                <input
                                    name="trendingTitle"
                                    type="text"
                                    defaultValue={selectedTrending?.title || ''}
                                    placeholder="Ej: III Congreso Internacional"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#003952]/20"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Información de Usuarios / Vistas</label>
                                <input
                                    name="trendingViews"
                                    type="text"
                                    defaultValue={selectedTrending?.views || ''}
                                    placeholder="Ej: 1,200 usuarios"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#003952]/20"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setIsTrendingModalOpen(false)} className="flex-1 py-2 px-4 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors">Cancelar</button>
                                <button type="submit" className="flex-1 py-2 px-4 bg-[#003952] text-white rounded-xl font-bold hover:bg-[#002a3a] transition-colors">
                                    {selectedTrending ? 'Actualizar' : 'Publicar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL ACTUALIZADO SEGÚN FORMATO SOLICITADO */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 bg-white">
                            <h2 className="text-2xl font-bold text-[#003952]">
                                {selectedArticle ? 'Editar Artículo' : 'Nuevo Artículo'}
                            </h2>
                        </div>

                        <form onSubmit={handleGuardarArticulo} className="p-6 space-y-4">
                            {/* Título del Artículo con lógica de auto-llenado */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título del Artículo</label>
                                <input
                                    name="title"
                                    type="text"
                                    placeholder="Escribe un título llamativo"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#003952]/20 focus:border-[#003952]"
                                    required
                                    onChange={(e) => {
                                        // Solo auto-llenar si estamos creando un nuevo artículo
                                        if (!selectedArticle) {
                                            const slug = e.target.value
                                                .toLowerCase()
                                                .trim()
                                                .replace(/[^\w\s-]/g, '') // Elimina caracteres especiales
                                                .replace(/[\s_-]+/g, '-') // Reemplaza espacios por guiones
                                                .replace(/^-+|-+$/g, ''); // Limpia guiones al inicio o final
                                            
                                            const urlInput = document.getElementsByName('url')[0] as HTMLInputElement;
                                            if (urlInput) urlInput.value = `https://aneupi.com/${slug}`;
                                        }
                                    }}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
                                    <input name="author" type="text" defaultValue={selectedArticle?.author} placeholder="Ej: Ana Silva" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                                    <select name="category" defaultValue={selectedArticle?.category || 'TECNOLOGÍA'} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none bg-white">
                                        <option value="TECNOLOGÍA">TECNOLOGÍA</option>
                                        <option value="MEDIO AMBIENTE">MEDIO AMBIENTE</option>
                                        <option value="ECONOMÍA">ECONOMÍA</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL de la Imagen (Opcional)</label>
                                <input name="imageUrl" type="url" defaultValue={selectedArticle?.imageUrl} placeholder="https://ejemplo.com/imagen.jpg" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                            </div>

                            {/* URL de Redirección (Se llena automáticamente) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL de Redirección (Leer más)</label>
                                <input
                                    name="url"
                                    type="url"
                                    defaultValue={selectedArticle?.url}
                                    placeholder="https://aneupi.com/articulo"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#003952]/20"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Resumen / Descripción</label>
                                <textarea name="description" rows={3} defaultValue={selectedArticle?.description} placeholder="Escribe un breve resumen..." className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none resize-none" required />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 px-4 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-semibold">Cancelar</button>
                                <button type="submit" className="flex-1 py-3 px-4 bg-[#003952] text-white rounded-xl font-bold">
                                    {selectedArticle ? 'Guardar Cambios' : 'Publicar Artículo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}