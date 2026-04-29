'use client';

import { useState } from 'react';
import { Edit, Trash2, Plus, ChevronLeft, ChevronRight, Eye, Heart, ArrowRight, Search } from 'lucide-react';

// --- INTERFACES ---
interface NewsItem {
  id: number;
  category: string;
  title: string;
  description?: string;
  date: string;
  color?: string; // Para tarjetas normales (Respaldo)
  imageColor?: string; // Para slider (Respaldo)
  views?: number;
  likes?: number;
  url?: string;
  imageUrl?: string; // NUEVO: URL de la imagen
}

export default function InicioAdminPage() {
  // --- ESTADOS ---
  const [searchTerm, setSearchTerm] = useState('');

  const [featuredNewsList, setFeaturedNewsList] = useState<NewsItem[]>([
    { 
      id: 1, category: 'DEPORTES', title: 'Deporte: victoria histórica en el torneo', 
      description: 'El equipo nacional consigue una victoria histórica en la final.', date: '11 Oct 2025', imageColor: 'bg-green-800', url: 'https://ejemplo.com/deportes',
      imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1000&auto=format&fit=crop' // Imagen de prueba
    },
    { 
      id: 2, category: 'TECNOLOGÍA', title: 'Nueva IA revoluciona la educación en LATAM', 
      description: 'Universidades implementan asistentes virtuales para mejorar el rendimiento estudiantil.', date: '12 Oct 2025', imageColor: 'bg-[#003952]',
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop' // Imagen de prueba
    },
    { 
      id: 3, category: 'ECONOMÍA', title: 'Crecimiento inesperado en startups locales', 
      description: 'El ecosistema emprendedor muestra números verdes tras el último trimestre.', date: '13 Oct 2025', imageColor: 'bg-amber-700' 
    }
  ]);

  const [masNoticias, setMasNoticias] = useState<NewsItem[]>([
    { id: 101, title: 'Dirigentes indígenas y el Gobierno llegan a un acuerdo histórico', description: 'Tras varias semanas de diálogo, se establecieron nuevas normativas de mutuo acuerdo.', category: 'ECUADOR', date: '16 Oct 2025', views: 850, likes: 320, color: 'bg-slate-700', url: 'https://ejemplo.com/101', imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=500&auto=format&fit=crop' },
    { id: 102, title: 'Indígenas de Imbabura dicen que hay grupos buscando desestabilizar', description: 'Representantes de comunidades manifestaron su preocupación por sectores externos.', category: 'ECUADOR', date: '16 Oct 2025', views: 640, likes: 215, color: 'bg-slate-800' },
    { id: 103, title: 'Ecuador acumula ocho prórrogas sin renovar contratos de telefonía', description: 'Las empresas operan bajo extensiones temporales mientras se define el marco.', category: 'ECUADOR', date: '15 Oct 2025', views: 120, likes: 45, color: 'bg-blue-900' },
    { id: 104, title: 'Nuevas medidas de seguridad en la capital para fin de año', description: 'Las autoridades anuncian un plan estratégico para resguardar a los ciudadanos.', category: 'SEGURIDAD', date: '15 Oct 2025', views: 430, likes: 110, color: 'bg-red-800' },
  ]);

  const [otrasNoticias, setOtrasNoticias] = useState<NewsItem[]>([
    { id: 201, title: 'Mercados asiáticos cierran al alza tras anuncios económicos', description: 'Las principales bolsas reaccionaron positivamente a las políticas fiscales.', category: 'INTERNACIONAL', date: '16 Oct 2025', views: 920, likes: 450, color: 'bg-emerald-800', imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=500&auto=format&fit=crop' },
    { id: 202, title: 'Avances prometedores en la cumbre climática global', description: 'Líderes mundiales firman un nuevo tratado para reducir emisiones.', category: 'MEDIO AMBIENTE', date: '15 Oct 2025', views: 780, likes: 310, color: 'bg-teal-700' },
    { id: 203, title: 'Nueva misión espacial anuncia hallazgos en la superficie de Marte', description: 'Imágenes revelan detalles sin precedentes sobre la geología marciana.', category: 'CIENCIA', date: '14 Oct 2025', views: 1200, likes: 890, color: 'bg-indigo-900' },
    { id: 204, title: 'Resultados preliminares de las elecciones europeas', description: 'Se perfila un cambio de tendencia política según los primeros escrutinios.', category: 'POLÍTICA', date: '13 Oct 2025', views: 650, likes: 120, color: 'bg-violet-800' },
  ]);

  const [sidebarItems] = useState([
    { id: 1, title: '¡Consigue trabajo!', desc: 'Explora oportunidades relevantes ahora.' },
    { id: 2, title: 'Conferencia', desc: 'Congreso Internacional ANEUPI.' },
    { id: 3, title: 'Cursos', desc: 'Aprende Inglés o Francés con Nosotros.' },
    { id: 4, title: 'Inversión', desc: 'Conviértete en accionista.' },
  ]);

  // --- LÓGICA DE BÚSQUEDA Y FILTRADO ---
  const matchSearch = (news: NewsItem) => 
    news.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    news.category.toLowerCase().includes(searchTerm.toLowerCase());

  const displayFeaturedList = featuredNewsList.filter(matchSearch);
  const displayMasNoticias = masNoticias.filter(matchSearch);
  const displayOtrasNoticias = otrasNoticias.filter(matchSearch);

  // Lógica del Slider
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const safeIndex = displayFeaturedList.length > 0 && currentFeaturedIndex >= displayFeaturedList.length ? 0 : currentFeaturedIndex;
  const featuredNews = displayFeaturedList[safeIndex];

  // Estados del Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<{news: NewsItem, section: string} | null>(null);

  // --- FUNCIONES DE NAVEGACIÓN ---
  const scrollContainer = (id: string, direction: 'left' | 'right') => {
    const container = document.getElementById(id);
    if (container) {
      const scrollAmount = 350;
      container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const nextFeatured = () => setCurrentFeaturedIndex((prev) => (prev + 1) % displayFeaturedList.length);
  const prevFeatured = () => setCurrentFeaturedIndex((prev) => (prev === 0 ? displayFeaturedList.length - 1 : prev - 1));

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentFeaturedIndex(0); 
  };

  // --- FUNCIONES DE GESTIÓN DE NOTICIAS ---
  const handleDeleteNews = (id: number, section: string) => {
    if (!confirm('¿Estás seguro de eliminar esta noticia?')) return;
    if (section === 'featured') setFeaturedNewsList(prev => prev.filter(n => n.id !== id));
    if (section === 'mas') setMasNoticias(prev => prev.filter(n => n.id !== id));
    if (section === 'otras') setOtrasNoticias(prev => prev.filter(n => n.id !== id));
  };

  const openCreateModal = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const openEditModal = (news: NewsItem, section: string) => {
    setEditingData({ news, section });
    setIsModalOpen(true);
  };

  const handleSaveNews = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const url = formData.get('url') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const description = formData.get('description') as string;
    const section = formData.get('section') as string;

    const newItem: NewsItem = {
      id: editingData ? editingData.news.id : Date.now(),
      title, category, url, description, imageUrl,
      date: editingData?.news.date || new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      color: editingData?.news.color || 'bg-[#003952]',
      imageColor: editingData?.news.imageColor || 'bg-[#003952]',
      views: editingData?.news.views || 0,
      likes: editingData?.news.likes || 0
    };

    if (editingData) {
      if (editingData.section === 'featured') setFeaturedNewsList(prev => prev.filter(n => n.id !== editingData.news.id));
      if (editingData.section === 'mas') setMasNoticias(prev => prev.filter(n => n.id !== editingData.news.id));
      if (editingData.section === 'otras') setOtrasNoticias(prev => prev.filter(n => n.id !== editingData.news.id));
    }

    if (section === 'featured') setFeaturedNewsList(prev => [newItem, ...prev]);
    if (section === 'mas') setMasNoticias(prev => [newItem, ...prev]);
    if (section === 'otras') setOtrasNoticias(prev => [newItem, ...prev]);

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-10 relative">
      
     {/* CABECERA DE LA PÁGINA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-200 pb-5">
        
        {/* TÍTULO MEJORADO CON ACENTO AZUL */}
        <div className="flex flex-col">
          <div className="flex items-center gap-4">
            {/* Barra lateral de acento (Borde azul redondeado) */}
            <div className="w-2.5 h-10 md:h-12 bg-gradient-to-b from-[#003952] to-blue-500 rounded-full shadow-sm"></div>
            <h1 className="text-[42px] md:text-[50px] font-black text-[#003952] tracking-tighter leading-none">
              Inicio
            </h1>
          </div>
          {/* El margen izquierdo (ml-[26px]) alinea el texto con la palabra "Inicio", saltándose la barra */}
          <p className="text-[15px] text-gray-500 mt-2 ml-[26px]">
            Gestiona la portada principal y el contenido destacado que ven tus usuarios.
          </p>
        </div>
        
        {/* BUSCADOR Y BOTÓN (Sin modificaciones de posición) */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar noticia..." 
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003952] outline-none text-[14px] transition-shadow shadow-sm"
            />
          </div>

          <button 
            onClick={openCreateModal}
            className="w-full sm:w-auto bg-[#003952] text-white px-5 py-2.5 rounded-lg text-[14px] font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-[#002233] transition-colors whitespace-nowrap"
          >
            <Plus size={18} /> Crear Noticia
          </button>
        </div>
      </div>

      {/* SECCIÓN SUPERIOR: HERO BANNER Y SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 ">
        
        {/* Banner Principal Destacado */}
        <div className="lg:col-span-2">
          {displayFeaturedList.length > 0 && featuredNews ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative group hover:shadow-md transition-shadow duration-300 h-full">
              
              <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button onClick={() => openEditModal(featuredNews, 'featured')} className="bg-white/90 text-[#003952] p-2 rounded-lg hover:bg-white transition-colors shadow-lg" title="Editar Destacado">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDeleteNews(featuredNews.id, 'featured')} className="bg-red-600/90 text-white p-2 rounded-lg hover:bg-red-600 transition-colors shadow-lg" title="Eliminar Destacado">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className={`h-[340px] ${featuredNews.imageColor} relative flex items-center justify-center transition-colors duration-500 overflow-hidden`}>
                
                {/* RENDERIZADO DE IMAGEN (Si existe) */}
                {featuredNews.imageUrl && (
                  <img src={featuredNews.imageUrl} alt={featuredNews.title} className="absolute inset-0 w-full h-full object-cover z-0" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-0"></div>
                <span className="absolute top-5 left-5 bg-red-600 text-white text-[11px] font-bold px-3 py-1.5 uppercase rounded shadow-sm tracking-wider z-10">
                  {featuredNews.category}
                </span>

                {displayFeaturedList.length > 1 && (
                  <>
                    <button onClick={prevFeatured} className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-black/30 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-all z-10"><ChevronLeft size={24} /></button>
                    <button onClick={nextFeatured} className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-black/30 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-all z-10"><ChevronRight size={24} /></button>
                  </>
                )}

                <div className="absolute bottom-5 flex gap-2.5 z-10">
                  {displayFeaturedList.map((_, idx) => (
                    <div key={idx} onClick={() => setCurrentFeaturedIndex(idx)} className={`h-2.5 rounded-full transition-all duration-300 ${idx === safeIndex ? 'w-8 bg-white shadow-md' : 'w-2.5 bg-white/50 hover:bg-white/80 cursor-pointer'}`}/>
                  ))}
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-1">
                <h2 className="text-[26px] font-bold text-[#003952] mb-3 leading-tight">{featuredNews.title}</h2>
                <p className="text-gray-600 mb-6 text-[15px] leading-relaxed">{featuredNews.description}</p>
                
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-[13px] font-medium text-gray-400">{featuredNews.date}</span>
                  <a href={featuredNews.url || '#'} target={featuredNews.url ? "_blank" : "_self"} rel="noopener noreferrer" className="bg-[#003952] text-white px-6 py-2.5 rounded-full text-[14px] font-bold hover:bg-[#002233] transition-colors shadow-sm flex items-center gap-2">
                    Leer más <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl h-full flex flex-col items-center justify-center text-gray-400 min-h-[400px]">
              <Search size={40} className="mb-4 text-gray-300" />
              <p>No se encontraron noticias destacadas</p>
            </div>
          )}
        </div>

        {/* Sidebar: Qué está pasando */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-[18px] text-[#003952]">Qué está pasando</h3>
              <button className="text-[#003952] hover:bg-blue-50 p-2 rounded-lg transition-colors" title="Agregar nuevo">
                <Plus size={18} />
              </button>
            </div>

            <div className="space-y-2">
              {sidebarItems.map(item => (
                <div key={item.id} className="flex justify-between items-center group p-3 -mx-3 rounded-xl hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                  <div className="pr-4">
                    <h4 className="font-bold text-[14px] text-gray-900 leading-tight mb-1">{item.title}</h4>
                    <p className="text-[13px] text-gray-500">{item.desc}</p>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-gray-400 hover:text-[#003952] bg-white border border-gray-200 rounded shadow-sm hover:shadow" title="Editar"><Edit size={14} /></button>
                    <button className="p-1.5 text-gray-400 hover:text-red-600 bg-white border border-gray-200 rounded shadow-sm hover:shadow" title="Eliminar"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* SECCIÓN 1: MÁS NOTICIAS */}
      <div className="bg-white rounded-2xl shadow-sm border border-black p-2">
        <div className="mb-6 px-4 pt-4">
          <h3 className="font-bold text-[22px] text-[#003952]">Más Noticias</h3>
        </div>

        {displayMasNoticias.length > 0 ? (
          <div className="relative group">
            <button onClick={() => scrollContainer('scroll-mas-noticias', 'left')} className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 p-3 bg-white border border-gray-200 rounded-full text-[#003952] shadow-lg hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 hidden md:block">
              <ChevronLeft size={24} />
            </button>
            <button onClick={() => scrollContainer('scroll-mas-noticias', 'right')} className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 p-3 bg-white border border-gray-200 rounded-full text-[#003952] shadow-lg hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 hidden md:block">
              <ChevronRight size={24} />
            </button>

            <div id="scroll-mas-noticias" className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style dangerouslySetInnerHTML={{__html: `.scrollbar-hide::-webkit-scrollbar { display: none; }`}} />
              
              {displayMasNoticias.map(noticia => (
                <div key={noticia.id} className="w-80 shrink-0 snap-start bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col relative">
                  
                  <div className={`h-30 ${noticia.color} relative flex items-center justify-center overflow-hidden`}>
                    {/* RENDERIZADO DE IMAGEN */}
                    {noticia.imageUrl && (
                      <img src={noticia.imageUrl} alt={noticia.title} className="absolute inset-0 w-full h-full object-cover z-0" />
                    )}
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase rounded-sm z-10">{noticia.category}</span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-[16px] text-gray-900 mb-2 leading-snug line-clamp-2 hover:text-[#003952] transition-colors">{noticia.title}</h3>
                    
                    {noticia.description && (
                      <p className="text-[13px] text-gray-500 mb-3 line-clamp-2 leading-relaxed">
                        {noticia.description}
                      </p>
                    )}

                    <div className="flex justify-between items-center mt-auto mb-4">
                      <p className="text-[12px] text-gray-400">{noticia.date}</p>
                      <a href={noticia.url || '#'} target={noticia.url ? "_blank" : "_self"} rel="noopener noreferrer" className="bg-[#003952] text-white px-4 py-1.5 rounded-full text-[12px] font-bold hover:bg-[#002233] transition-colors flex items-center gap-1.5 shadow-sm">
                        Leer más <ArrowRight size={14} />
                      </a>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="flex gap-4 text-gray-400 text-[12px] font-medium">
                        <span className="flex gap-1.5 items-center"><Eye size={14}/> {noticia.views}</span>
                        <span className="flex gap-1.5 items-center"><Heart size={14}/> {noticia.likes}</span>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => openEditModal(noticia, 'mas')} className="p-1.5 text-gray-400 hover:text-[#003952] hover:bg-blue-50 rounded transition-colors" title="Editar Noticia"><Edit size={20}/></button>
                        <button onClick={() => handleDeleteNews(noticia.id, 'mas')} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Eliminar Noticia"><Trash2 size={20}/></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200 m-4">
            <p>No se encontraron resultados en esta sección</p>
          </div>
        )}
      </div>

      {/* SECCIÓN 2: NOTICIAS INTERNACIONALES */}
      <div className="bg-white rounded-2xl shadow-sm border border-black p-2">
        <div className="mb-6 px-4 pt-4">
          <h3 className="font-bold text-[22px] text-[#003952]">Noticias Internacionales</h3>
        </div>

        {displayOtrasNoticias.length > 0 ? (
          <div className="relative group">
            <button onClick={() => scrollContainer('scroll-otras-noticias', 'left')} className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 p-3 bg-white border border-gray-200 rounded-full text-[#003952] shadow-lg hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 hidden md:block">
              <ChevronLeft size={24} />
            </button>
            <button onClick={() => scrollContainer('scroll-otras-noticias', 'right')} className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 p-3 bg-white border border-gray-200 rounded-full text-[#003952] shadow-lg hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 hidden md:block">
              <ChevronRight size={24} />
            </button>

            <div id="scroll-otras-noticias" className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {displayOtrasNoticias.map(noticia => (
                <div key={noticia.id} className="w-80 shrink-0 snap-start bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col relative">
                  
                  <div className={`h-30 ${noticia.color} relative flex items-center justify-center overflow-hidden`}>
                     {/* RENDERIZADO DE IMAGEN */}
                    {noticia.imageUrl && (
                      <img src={noticia.imageUrl} alt={noticia.title} className="absolute inset-0 w-full h-full object-cover z-0" />
                    )}
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase rounded-sm z-10">{noticia.category}</span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-[16px] text-gray-900 mb-2 leading-snug line-clamp-2 hover:text-[#003952] transition-colors">{noticia.title}</h3>
                    
                    {noticia.description && (
                      <p className="text-[13px] text-gray-500 mb-3 line-clamp-2 leading-relaxed">
                        {noticia.description}
                      </p>
                    )}

                    <div className="flex justify-between items-center mt-auto mb-4">
                      <p className="text-[12px] text-gray-400">{noticia.date}</p>
                      <a href={noticia.url || '#'} target={noticia.url ? "_blank" : "_self"} rel="noopener noreferrer" className="bg-[#003952] text-white px-4 py-1.5 rounded-full text-[12px] font-bold hover:bg-[#002233] transition-colors flex items-center gap-1.5 shadow-sm">
                        Leer más <ArrowRight size={14} />
                      </a>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="flex gap-4 text-gray-400 text-[12px] font-medium">
                        <span className="flex gap-1.5 items-center"><Eye size={14}/> {noticia.views}</span>
                        <span className="flex gap-1.5 items-center"><Heart size={14}/> {noticia.likes}</span>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => openEditModal(noticia, 'otras')} className="p-1.5 text-gray-400 hover:text-[#003952] hover:bg-blue-50 rounded transition-colors" title="Editar Noticia"><Edit size={20}/></button>
                        <button onClick={() => handleDeleteNews(noticia.id, 'otras')} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Eliminar Noticia"><Trash2 size={20}/></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200 m-4">
            <p>No se encontraron resultados en esta sección</p>
          </div>
        )}
      </div>

      {/* MODAL PARA CREAR/EDITAR NOTICIAS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden animate-in fade-in duration-200">
            
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="!text-[22px] !text-[#003952] font-bold">
                {editingData ? 'Editar Noticia' : 'Crear Nueva Noticia'}
              </h2>
            </div>

            <form onSubmit={handleSaveNews} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-1 text-[14px]">Título de la Noticia</label>
                  <input type="text" name="title" defaultValue={editingData?.news.title || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003952] outline-none text-[14px]" placeholder="Escribe el titular..." required />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-[14px]">Categoría</label>
                  <input type="text" name="category" defaultValue={editingData?.news.category || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003952] outline-none text-[14px] uppercase" placeholder="Ej: DEPORTES, ECONOMÍA" required />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-[14px]">Ubicación (Sección)</label>
                  <select name="section" defaultValue={editingData?.section || 'mas'} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003952] outline-none text-[14px] bg-white">
                    <option value="featured">Slider Principal (Destacado)</option>
                    <option value="mas">Más Noticias</option>
                    <option value="otras">Noticias Internacionales</option>
                  </select>
                </div>

                {/* NUEVO CAMPO: URL DE LA IMAGEN */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-1 text-[14px]">URL de la Imagen (Opcional)</label>
                  <input type="url" name="imageUrl" defaultValue={editingData?.news.imageUrl || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003952] outline-none text-[14px]" placeholder="https://ejemplo.com/imagen.jpg" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-1 text-[14px]">URL (Leer más)</label>
                  <input type="url" name="url" defaultValue={editingData?.news.url || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003952] outline-none text-[14px]" placeholder="https://..." />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-1 text-[14px]">Descripción breve</label>
                  <textarea name="description" rows={3} defaultValue={editingData?.news.description || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003952] outline-none text-[14px] resize-none" placeholder="Escribe un resumen de la noticia..."></textarea>
                </div>

              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-[14px] font-medium">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-[#003952] text-white rounded-lg hover:bg-[#002233] transition-colors text-[14px] font-bold">
                  {editingData ? 'Guardar Cambios' : 'Publicar Noticia'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}