'use client';

import { useState } from 'react';
import { 
  Edit, Trash2, Plus, ChevronLeft, ChevronRight, Eye, Heart, 
  ArrowRight, Search, MessageCircle, X, ChevronDown, ChevronUp 
} from 'lucide-react';
import NoticiaCompleta from './noticiaCompleta'; 

// --- INTERFACES ---
interface NewsItem {
  id: number;
  category: string;
  title: string;
  description?: string;
  date: string;
  color?: string; 
  imageColor?: string; 
  views?: number;
  likes?: number;
  comments?: number;
  url?: string;
  imageUrl?: string; 
}

interface SidebarItem {
  id: number;
  title: string;
  desc: string;
}

export default function InicioAdminPage() {
  // --- ESTADOS ---
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedNews, setDisplayedNews] = useState<NewsItem | null>(null);

  // Estados para Sidebar (Qué está pasando)
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([
    { id: 1, title: '¡Consigue trabajo!', desc: 'Explora oportunidades relevantes ahora.' },
    { id: 2, title: 'Conferencia', desc: 'Congreso Internacional ANEUPI.' },
    { id: 3, title: 'Cursos', desc: 'Aprende Inglés o Francés con Nosotros.' },
    { id: 4, title: 'Inversión', desc: 'Conviértete en accionista.' },
  ]);
  const [isSidebarModalOpen, setIsSidebarModalOpen] = useState(false);
  const [editingSidebar, setEditingSidebar] = useState<SidebarItem | null>(null);
  const [showAllSidebar, setShowAllSidebar] = useState(false);

  // Estados de Noticias
  const [featuredNewsList, setFeaturedNewsList] = useState<NewsItem[]>([
    { 
      id: 1, category: 'DEPORTES', title: 'Deporte: victoria histórica en el torneo', 
      description: 'El equipo nacional consigue una victoria histórica en la final.', date: '11 Oct 2025', 
      imageColor: 'bg-green-800', views: 1200, likes: 450, comments: 24,
      imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1000&auto=format&fit=crop'
    },
  ]);

  const [masNoticias, setMasNoticias] = useState<NewsItem[]>([
    { id: 101, title: 'Dirigentes indígenas y el Gobierno llegan a un acuerdo histórico', description: 'Tras varias semanas de diálogo, se establecieron nuevas normativas de mutuo acuerdo.', category: 'ECUADOR', date: '16 Oct 2025', views: 850, likes: 320, comments: 15, color: 'bg-slate-700', imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=500&auto=format&fit=crop' },
  ]);

  const [otrasNoticias, setOtrasNoticias] = useState<NewsItem[]>([
    { id: 201, title: 'Mercados asiáticos cierran al alza tras anuncios económicos', description: 'Las principales bolsas reaccionaron positivamente a las políticas fiscales.', category: 'INTERNACIONAL', date: '16 Oct 2025', views: 920, likes: 450, comments: 8, color: 'bg-emerald-800', imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=500&auto=format&fit=crop' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<{news: NewsItem, section: string} | null>(null);

/* ==========================================================================
     LÓGICA PARA EL EQUIPO DE BACKEND (DESCOMENTAR PARA INTEGRAR)
     ==========================================================================
  
  // 1. CARGA INICIAL DE NOTICIAS Y SIDEBAR DESDE LA DB
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // const newsRes = await fetch('/api/noticias');
        // const sidebarRes = await fetch('/api/sidebar');
        // const newsData = await newsRes.json();
        // const sidebarData = await sidebarRes.json();
        // Separar newsData por secciones y actualizar estados...
      } catch (error) { console.error(error); } finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  // 2. GUARDAR / EDITAR NOTICIA EN DB
  const handleSaveNewsToDB = async (payload: any) => {
    const method = editingData ? 'PUT' : 'POST';
    const url = editingData ? `/api/noticias/${editingData.news.id}` : '/api/noticias';
    // try { const res = await fetch(url, { method, body: JSON.stringify(payload) }); ... }
  };

  // 3. ELIMINAR NOTICIA EN DB
  const deleteNewsFromDB = async (id: number) => {
    // try { await fetch(`/api/noticias/${id}`, { method: 'DELETE' }); ... }
  };
  ========================================================================== */

  // --- FUNCIONES SIDEBAR ---
  const handleSaveSidebar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const desc = formData.get('desc') as string;

    if (editingSidebar) {
      setSidebarItems(sidebarItems.map(item => item.id === editingSidebar.id ? { ...item, title, desc } : item));
    } else {
      setSidebarItems([{ id: Date.now(), title, desc }, ...sidebarItems]);
    }
    setIsSidebarModalOpen(false);
    setEditingSidebar(null);
  };

  const deleteSidebarItem = (id: number) => {
    if (confirm('¿Eliminar este aviso?')) {
      setSidebarItems(sidebarItems.filter(item => item.id !== id));
    }
  };

  // --- LÓGICA DE BÚSQUEDA ---
  const matchSearch = (news: NewsItem) => 
    news.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    news.category.toLowerCase().includes(searchTerm.toLowerCase());

  const displayFeaturedList = featuredNewsList.filter(matchSearch);
  const displayMasNoticias = masNoticias.filter(matchSearch);
  const displayOtrasNoticias = otrasNoticias.filter(matchSearch);

  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const safeIndex = displayFeaturedList.length > 0 && currentFeaturedIndex >= displayFeaturedList.length ? 0 : currentFeaturedIndex;
  const featuredNews = displayFeaturedList[safeIndex];

  // --- FUNCIONES GESTIÓN NOTICIAS ---
  const openEditModal = (news: NewsItem, section: string) => {
    setEditingData({ news, section });
    setIsModalOpen(true);
  };

  const handleDeleteNews = async (id: number, section: string) => {
    if (!confirm('¿Estás seguro de eliminar esta noticia?')) return;
    if (section === 'featured') setFeaturedNewsList(prev => prev.filter(n => n.id !== id));
    if (section === 'mas') setMasNoticias(prev => prev.filter(n => n.id !== id));
    if (section === 'otras') setOtrasNoticias(prev => prev.filter(n => n.id !== id));
  };

  const handleSaveNews = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      url: formData.get('url') as string,
      imageUrl: formData.get('imageUrl') as string,
      description: formData.get('description') as string,
      section: formData.get('section') as string,
    };

    const newItem: NewsItem = {
      id: editingData ? editingData.news.id : Date.now(),
      ...payload,
      date: editingData?.news.date || new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      views: editingData?.news.views || 0,
      likes: editingData?.news.likes || 0,
      comments: editingData?.news.comments || 0
    };

    if (editingData) {
      if (editingData.section === 'featured') setFeaturedNewsList(prev => prev.filter(n => n.id !== editingData.news.id));
      if (editingData.section === 'mas') setMasNoticias(prev => prev.filter(n => n.id !== editingData.news.id));
      if (editingData.section === 'otras') setOtrasNoticias(prev => prev.filter(n => n.id !== editingData.news.id));
    }

    if (payload.section === 'featured') setFeaturedNewsList(prev => [newItem, ...prev]);
    if (payload.section === 'mas') setMasNoticias(prev => [newItem, ...prev]);
    if (payload.section === 'otras') setOtrasNoticias(prev => [newItem, ...prev]);

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-10 relative">
      <style dangerouslySetInnerHTML={{ __html: `.scrollbar-hide::-webkit-scrollbar { display: none; }` }} />

      {displayedNews ? (
        <NoticiaCompleta noticia={displayedNews} onBack={() => setDisplayedNews(null)} />
      ) : (
        <>
          {/* CABECERA */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-200 pb-5">
            <div className="flex flex-col">
              <div className="flex items-center gap-4">
                <div className="w-2.5 h-10 md:h-12 bg-gradient-to-b from-[#003952] to-blue-500 rounded-full shadow-sm"></div>
                <h1 className="text-[42px] md:text-[50px] font-black text-[#003952] tracking-tighter leading-none">Inicio</h1>
              </div>
              <p className="text-[15px] text-gray-500 mt-2 ml-[26px]">Gestiona la portada principal y el contenido destacado que ven tus usuarios.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" placeholder="Buscar noticia..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none text-[14px] shadow-sm" />
              </div>
              <button onClick={() => { setEditingData(null); setIsModalOpen(true); }} className="w-full sm:w-auto bg-[#003952] text-white px-5 py-2.5 rounded-lg text-[14px] font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-[#002233] transition-colors whitespace-nowrap">
                <Plus size={18} /> Crear Noticia
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {displayFeaturedList.length > 0 && featuredNews ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative group h-full">
                  <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button onClick={() => openEditModal(featuredNews, 'featured')} className="bg-white/90 text-[#003952] p-2 rounded-lg shadow-lg"><Edit size={16} /></button>
                    <button onClick={() => handleDeleteNews(featuredNews.id, 'featured')} className="bg-red-600/90 text-white p-2 rounded-lg shadow-lg"><Trash2 size={16} /></button>
                  </div>
                  <div className={`h-[340px] bg-slate-800 relative flex items-center justify-center transition-colors duration-500 overflow-hidden`}>
                    {featuredNews.imageUrl && <img src={featuredNews.imageUrl} alt={featuredNews.title} className="absolute inset-0 w-full h-full object-cover z-0" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-0"></div>
                    <span className="absolute top-5 left-5 bg-red-600 text-white text-[11px] font-bold px-3 py-1.5 uppercase rounded shadow-sm tracking-wider z-10">{featuredNews.category}</span>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h2 className="text-[26px] font-bold text-[#003952] mb-3 leading-tight">{featuredNews.title}</h2>
                    <p className="text-gray-600 mb-6 text-[15px] leading-relaxed line-clamp-2">{featuredNews.description}</p>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-[13px] font-medium text-gray-400">{featuredNews.date}</span>
                      <button onClick={() => setDisplayedNews(featuredNews)} className="bg-[#003952] text-white px-6 py-2.5 rounded-full text-[14px] font-bold shadow-sm flex items-center gap-2">
                        Leer más <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* SIDEBAR: QUÉ ESTÁ PASANDO */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-[18px] text-[#003952]">Qué está pasando</h3>
                  <button onClick={() => { setEditingSidebar(null); setIsSidebarModalOpen(true); }} className="text-[#003952] hover:bg-blue-50 p-1.5 border-2 border-[#003952] rounded-xl transition-colors">
                    <Plus size={18} strokeWidth={3} />
                  </button>
                </div>
                <div className="space-y-4">
                  {(showAllSidebar ? sidebarItems : sidebarItems.slice(0, 3)).map(item => (
                    <div key={item.id} className="flex justify-between items-center group p-3 -mx-3 rounded-xl hover:bg-gray-50 transition-all">
                      <div className="pr-4">
                        <h4 className="font-bold text-[14px] text-gray-900 leading-tight mb-1">{item.title}</h4>
                        <p className="text-[13px] text-gray-500">{item.desc}</p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingSidebar(item); setIsSidebarModalOpen(true); }} className="p-1.5 text-gray-400 border border-gray-200 rounded-lg hover:text-[#003952] hover:bg-white shadow-sm transition-all"><Edit size={14} /></button>
                        <button onClick={() => deleteSidebarItem(item.id)} className="p-1.5 text-gray-400 border border-gray-200 rounded-lg hover:text-red-600 hover:bg-white shadow-sm transition-all"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}

                  {sidebarItems.length > 3 && (
                    <button 
                      onClick={() => setShowAllSidebar(!showAllSidebar)}
                      className="w-full text-center text-[#003952] text-[13px] font-bold py-2 mt-2 hover:underline flex items-center justify-center gap-2"
                    >
                      {showAllSidebar ? <>Mostrar menos <ChevronUp size={14}/></> : <>Mostrar más <ChevronDown size={14}/></>}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SECCIONES DE NOTICIAS */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mt-8">
            <h3 className="font-bold text-[22px] text-[#003952] px-4 pt-4 mb-6">Más Noticias</h3>
            <div id="scroll-mas-noticias" className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide px-4">
              {displayMasNoticias.map(noticia => (
                <div key={noticia.id} className="w-80 shrink-0 bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm flex flex-col relative group">
                  <div className="h-40 bg-slate-200 relative overflow-hidden">
                    {noticia.imageUrl && <img src={noticia.imageUrl} alt={noticia.title} className="absolute inset-0 w-full h-full object-cover z-0" />}
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase rounded-sm z-10">{noticia.category}</span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-[16px] mb-2 line-clamp-2">{noticia.title}</h3>
                    <div className="flex justify-between items-center mt-auto mb-4">
                      <p className="text-[12px] text-gray-400">{noticia.date}</p>
                      <button onClick={() => setDisplayedNews(noticia)} className="bg-[#003952] text-white px-4 py-1.5 rounded-full text-[12px] font-bold">Leer más</button>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="flex gap-4 text-gray-400 text-[12px] font-medium">
                        <span className="flex gap-1.5 items-center"><Eye size={14}/> {noticia.views || 0}</span>
                        <span className="flex gap-1.5 items-center"><Heart size={14}/> {noticia.likes || 0}</span>
                        <span className="flex gap-1.5 items-center"><MessageCircle size={14}/> {noticia.comments || 0}</span>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => openEditModal(noticia, 'mas')} className="p-1.5 text-gray-400 border border-gray-200 rounded hover:text-[#003952] transition-colors"><Edit size={16}/></button>
                        <button onClick={() => handleDeleteNews(noticia.id, 'mas')} className="p-1.5 text-gray-400 border border-gray-200 rounded hover:text-red-600 transition-colors"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECCIÓN INTERNACIONALES */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mt-8">
            <h3 className="font-bold text-[22px] text-[#003952] px-4 pt-4 mb-6">Noticias Internacionales</h3>
            <div id="scroll-otras-noticias" className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide px-4">
              {displayOtrasNoticias.map(noticia => (
                <div key={noticia.id} className="w-80 shrink-0 bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm flex flex-col group">
                  <div className="h-40 bg-slate-200 relative overflow-hidden">
                    {noticia.imageUrl && <img src={noticia.imageUrl} alt={noticia.title} className="absolute inset-0 w-full h-full object-cover z-0" />}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-[16px] mb-2 line-clamp-2">{noticia.title}</h3>
                    <div className="flex justify-between items-center mt-auto mb-4">
                      <p className="text-xs text-gray-400">{noticia.date}</p>
                      <button onClick={() => setDisplayedNews(noticia)} className="bg-[#003952] text-white px-4 py-1.5 rounded-full text-xs font-bold">Leer más</button>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="flex gap-4 text-gray-400 text-xs">
                        <span className="flex items-center gap-1"><Eye size={14}/> {noticia.views || 0}</span>
                        <span className="flex items-center gap-1"><Heart size={14}/> {noticia.likes || 0}</span>
                        <span className="flex items-center gap-1"><MessageCircle size={14}/> {noticia.comments || 0}</span>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => openEditModal(noticia, 'otras')} className="p-1 text-gray-400 border rounded hover:text-[#003952] transition-colors"><Edit size={16}/></button>
                        <button onClick={() => handleDeleteNews(noticia.id, 'otras')} className="p-1 text-gray-400 border rounded hover:text-red-600 transition-colors"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* MODAL SIDEBAR EDITAR/CREAR */}
      {isSidebarModalOpen && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl text-[#003952] font-bold">{editingSidebar ? 'Editar Aviso' : 'Nuevo Aviso Sidebar'}</h2>
              <button onClick={() => setIsSidebarModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            <form onSubmit={handleSaveSidebar} className="p-6 space-y-4">
              <input type="text" name="title" defaultValue={editingSidebar?.title || ''} placeholder="Ej: Gana dinero" className="w-full px-4 py-2 border rounded-xl outline-none" required />
              <textarea name="desc" rows={2} defaultValue={editingSidebar?.desc || ''} placeholder="Ej: Descripción del aviso..." className="w-full px-4 py-2 border rounded-xl outline-none resize-none" required />
              <div className="flex gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsSidebarModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-[#003952] text-white rounded-xl font-bold">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NOTICIAS EDITAR/CREAR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in duration-200">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="!text-[22px] !text-[#003952] font-bold">{editingData ? 'Editar Noticia' : 'Crear Nueva Noticia'}</h2>
            </div>
            <form onSubmit={handleSaveNews} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium text-sm mb-1">Título</label>
                  <input type="text" name="title" defaultValue={editingData?.news.title || ''} placeholder="Ej: III Congreso Internacional" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" required />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium text-sm mb-1">Categoría</label>
                  <input type="text" name="category" defaultValue={editingData?.news.category || ''} placeholder="Ej: Educación" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none uppercase" required />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium text-sm mb-1">Ubicación</label>
                  <select name="section" defaultValue={editingData?.section || 'mas'} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white">
                    <option value="featured">Slider Destacado</option>
                    <option value="mas">Más Noticias</option>
                    <option value="otras">Internacionales</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium text-sm mb-1">URL Imagen</label>
                  <input type="url" name="imageUrl" defaultValue={editingData?.news.imageUrl || ''} placeholder="Ej: https://example.com/image.jpg" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium text-sm mb-1">Resumen</label>
                  <textarea name="description" rows={3} defaultValue={editingData?.news.description || ''} placeholder="Ej: Descripción de la noticia..." className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none resize-none"></textarea>
                </div>
              </div>
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-xl font-medium">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-[#003952] text-white rounded-xl font-bold">Publicar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}