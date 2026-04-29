'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Share2,
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  User,
  ArrowRight,
  Clock,
  X,
  Image as ImageIcon,
} from 'lucide-react';

interface Article {
  id: number;
  title: string;
  description: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  views: number;
  likes: number;
  comments: number;
  imageUrl: string;
  url: string;
}

interface Trending {
  id: number;
  title: string;
  views: string;
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const CATEGORY_OPTIONS = [
  'TECNOLOGIA',
  'MEDIO AMBIENTE',
  'EDUCACION',
  'GASTRONOMIA',
  'NEGOCIOS',
  'ARTE Y CULTURA',
];

const CATEGORY_ID_MAP: Record<string, number> = {
  TECNOLOGIA: 3,
  'MEDIO AMBIENTE': 4,
  EDUCACION: 5,
  GASTRONOMIA: 6,
  NEGOCIOS: 7,
  'ARTE Y CULTURA': 8,
};

const READ_TIME_OPTIONS = ['3', '5', '8', '10', '15', '20'];

const INITIAL_TRENDING: Trending[] = [
  { id: 1, title: 'III Congreso Internacional', views: '115 usuarios' },
  { id: 2, title: 'Foro de Innovacion y Emprendimiento', views: '980 usuarios' },
  { id: 3, title: 'Encuentro de Educacion Digital', views: '3,459 usuarios' },
];

const FALLBACK_ARTICLES: Article[] = [
  {
    id: 1,
    title: 'Comprobacion para ver si usa estos datos',
    description:
      'Un analisis profundo sobre como la IA esta transformando los sectores productivos en la region.',
    category: 'TECNOLOGIA',
    author: 'Maria Gonzalez',
    date: '15/10/2025',
    readTime: '3 min',
    views: 1234,
    likes: 89,
    comments: 23,
    imageUrl: '',
    url: '',
  },
];

function normalizeCategory(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
}

function articleFromApi(item: any): Article {
  return {
    id: item.articuloId,
    title: item.titulo,
    description: item.descripcion,
    category: normalizeCategory(item.categoria?.nombre || 'GENERAL'),
    author: item.autor?.nombre_completo || 'Autor',
    date: new Date(item.fechaPublicacion).toLocaleDateString('es-ES'),
    readTime: `${item.tiempo_lectura || 3} min`,
    views: item.vistas || 0,
    likes: item.reacciones?.total || 0,
    comments: item._count?.comentarios || 0,
    imageUrl: item.url_imagen || '',
    url: item.url_redireccion || '',
  };
}

export default function ArticulosAdminPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [articles, setArticles] = useState<Article[]>(FALLBACK_ARTICLES);
  const [trending, setTrending] = useState<Trending[]>(INITIAL_TRENDING);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    fetch(`${API}/api/articulos?take=50`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.length) {
          setArticles(data.data.map(articleFromApi));
        }
      })
      .catch((error) => {
        console.error('Error cargando articulos:', error);
      });
  }, []);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const text = `${article.title} ${article.category} ${article.author}`.toLowerCase();
      return text.includes(searchTerm.toLowerCase());
    });
  }, [articles, searchTerm]);

  const groupedArticles = useMemo(() => {
    return filteredArticles.reduce((acc, article) => {
      if (!acc[article.category]) acc[article.category] = [];
      acc[article.category].push(article);
      return acc;
    }, {} as Record<string, Article[]>);
  }, [filteredArticles]);

  const openAddModal = () => {
    setSelectedArticle(null);
    setIsModalOpen(true);
  };

  const openEditModal = (article: Article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const deleteArticle = (id: number) => {
    if (confirm('Eliminar este articulo del listado?')) {
      setArticles((prev) => prev.filter((article) => article.id !== id));
    }
  };

  const deleteTrending = (id: number) => {
    if (confirm('Quitar de destacados?')) {
      setTrending((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const scrollContainer = (id: string, direction: 'left' | 'right') => {
    const container = document.getElementById(id);
    if (!container) return;
    container.scrollBy({
      left: direction === 'left' ? -350 : 350,
      behavior: 'smooth',
    });
  };

  const handleGuardarArticulo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const title = String(formData.get('title') || '').trim();
    const author = String(formData.get('author') || '').trim();
    const category = String(formData.get('category') || 'TECNOLOGIA').trim();
    const description = String(formData.get('description') || '').trim();
    const url = String(formData.get('url') || '').trim();
    const imageUrl = String(formData.get('imageUrl') || '').trim();
    const readTimeValue = String(formData.get('readTime') || '3').trim();
    const readTimeMinutes = Number.parseInt(readTimeValue, 10) || 3;

    const body = {
      titulo: title,
      descripcion: description,
      contenido: description,
      url_imagen: imageUrl || 'https://via.placeholder.com/300',
      url_preview_imagen: imageUrl || 'https://via.placeholder.com/150',
      url_redireccion: url || null,
      tiempo_lectura: readTimeMinutes,
      autorId: 5,
      categoriaId: CATEGORY_ID_MAP[category] || 3,
    };

    try {
      const response = selectedArticle
        ? await fetch(`${API}/api/articulos/${selectedArticle.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })
        : await fetch(`${API}/api/articulos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        console.error('Error al guardar articulo:', result);
        return;
      }

      const nextArticle: Article = result?.data
        ? articleFromApi(result.data)
        : {
            id: selectedArticle?.id || Date.now(),
            title,
            description,
            category,
            author: author || 'Autor',
            date: new Date().toLocaleDateString('es-ES'),
            readTime: `${readTimeMinutes} min`,
            views: selectedArticle?.views || 0,
            likes: selectedArticle?.likes || 0,
            comments: selectedArticle?.comments || 0,
            imageUrl,
            url,
          };

      if (selectedArticle) {
        setArticles((prev) => prev.map((article) => (article.id === selectedArticle.id ? nextArticle : article)));
      } else {
        setArticles((prev) => [nextArticle, ...prev]);
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  return (
    <div className="space-y-10 relative">
      <style dangerouslySetInnerHTML={{ __html: `.scrollbar-hide::-webkit-scrollbar { display: none; }` }} />

      <div className="flex flex-col gap-4 border-b border-gray-200 pb-4">
        <h1 className="!text-[25px] !text-[#003952] font-bold">Articulos</h1>
        <p className="text-[14px] text-gray-500">
          Lee y comparte articulos de opinion, analisis y reportajes en profundidad
        </p>

        <div className="flex justify-between items-center w-full">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" size={16} />
            <input
              type="text"
              placeholder="Buscar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-32 pl-9 pr-4 py-2 bg-[#003952] text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-[14px]"
            />
          </div>

          <button
            onClick={openAddModal}
            className="bg-[#003952] text-white px-4 py-2 rounded-lg hover:bg-[#002233] transition-colors flex items-center gap-2 text-[14px] font-medium"
          >
            <Plus size={18} /> Agregar articulo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-10">
          {Object.keys(groupedArticles).length > 0 ? (
            Object.entries(groupedArticles).map(([category, catArticles]) => (
              <div key={category} className="relative">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-[18px] text-[#003952] uppercase flex items-center gap-2">
                    <span className="w-2 h-6 bg-red-600 rounded-full block"></span>
                    {category}
                  </h2>

                  <div className="flex gap-2">
                    <button
                      onClick={() => scrollContainer(`scroll-${category}`, 'left')}
                      className="p-1.5 border border-gray-200 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => scrollContainer(`scroll-${category}`, 'right')}
                      className="p-1.5 border border-gray-200 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                <div
                  id={`scroll-${category}`}
                  className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {catArticles.map((article) => (
                    <div
                      key={article.id}
                      className="w-80 shrink-0 snap-start bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col group relative"
                    >
                      <div className="h-40 relative flex items-center justify-center bg-[#003952] overflow-hidden">
                        {article.imageUrl ? (
                          <img src={article.imageUrl} alt={article.title} className="absolute inset-0 w-full h-full object-cover" />
                        ) : null}
                        <button className="absolute top-3 right-3 bg-[#003952] bg-opacity-80 p-1.5 rounded-full text-white hover:bg-opacity-100 transition">
                          <Share2 size={14} />
                        </button>
                      </div>

                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-bold text-[16px] text-[#003952] mb-2 leading-snug line-clamp-2">{article.title}</h3>
                        <p className="text-[13px] text-gray-500 mb-4 line-clamp-3 leading-relaxed">{article.description}</p>

                        <div className="flex justify-between items-end mb-4 mt-auto gap-3">
                          <div className="flex flex-col text-[12px] text-gray-400 gap-1">
                            <span className="flex items-center gap-1"><User size={12} /> {article.author}</span>
                            <span className="flex items-center gap-1"><Calendar size={12} /> {article.date}</span>
                            <span className="flex items-center gap-1"><Clock size={12} /> {article.readTime}</span>
                          </div>

                          {article.url ? (
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-[#003952] text-white px-3 py-1.5 rounded-full text-[12px] font-medium flex items-center gap-1 hover:bg-[#002233] transition-colors"
                            >
                              Leer mas <ArrowRight size={14} />
                            </a>
                          ) : (
                            <span className="bg-gray-200 text-gray-500 px-3 py-1.5 rounded-full text-[12px] font-medium inline-flex items-center gap-1 cursor-not-allowed">
                              Sin enlace
                            </span>
                          )}
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-3 text-gray-400 text-[12px]">
                            <span className="flex items-center gap-1"><Eye size={14} /> {article.views}</span>
                            <span className="flex items-center gap-1"><Heart size={14} /> {article.likes}</span>
                            <span className="flex items-center gap-1"><MessageCircle size={14} /> {article.comments}</span>
                          </div>

                          <div className="flex gap-1">
                            <button
                              onClick={() => openEditModal(article)}
                              className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-[#003952] hover:text-white transition-colors"
                              title="Editar articulo"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => deleteArticle(article.id)}
                              className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors"
                              title="Eliminar articulo"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-gray-400 text-[14px]">No se encontraron articulos con "{searchTerm}"</div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
            <div className="py-3 bg-[#003952] text-white text-center font-bold text-[14px]">Editorial ANEUPI</div>

            <div className="p-5 space-y-5">
              <h3 className="font-bold text-[16px] text-gray-800">Que esta pasando?</h3>

              {trending.map((item) => (
                <div key={item.id} className="group relative pr-6">
                  <p className="text-[10px] text-gray-400 mb-1">Tendencia en este momento</p>
                  <h4 className="font-bold text-[#003952] text-[14px] leading-tight">{item.title}</h4>
                  <p className="text-[12px] text-gray-400 mt-1">{item.views}</p>

                  <button
                    onClick={() => deleteTrending(item.id)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              <button className="text-[#003952] text-[14px] font-medium hover:underline pt-2">Show more</button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl overflow-hidden animate-in fade-in duration-200">
            <div className="bg-[#0D3F50] px-6 py-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex-1 text-center">
                {selectedArticle ? 'Editar Articulo' : 'Agregar Nuevo Articulo'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:bg-white/20 rounded-full p-2 transition">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-[#0D3F50] px-6 py-4 mx-6 mt-6 rounded-lg flex items-center justify-center gap-3">
              <ImageIcon className="w-6 h-6 text-yellow-400" />
              <h3 className="text-white font-bold text-center text-lg tracking-wide">INFORMACION DEL ARTICULO</h3>
              <ImageIcon className="w-6 h-6 text-yellow-400" />
            </div>

            <form onSubmit={handleGuardarArticulo} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Titulo del Articulo</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={selectedArticle?.title || ''}
                    required
                    placeholder="Ingresa un titulo atractivo..."
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0D3F50] focus:ring-2 focus:ring-[#0D3F50]/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Autor</label>
                  <input
                    type="text"
                    name="author"
                    defaultValue={selectedArticle?.author || ''}
                    required
                    placeholder="Nombre del autor..."
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0D3F50] focus:ring-2 focus:ring-[#0D3F50]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Descripcion del Articulo</label>
                <textarea
                  name="description"
                  defaultValue={selectedArticle?.description || ''}
                  required
                  rows={4}
                  placeholder="Escribe una descripcion atractiva que capture la atencion del lector..."
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0D3F50] focus:ring-2 focus:ring-[#0D3F50]/30 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Categoria</label>
                  <select
                    name="category"
                    defaultValue={selectedArticle?.category || 'TECNOLOGIA'}
                    required
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0D3F50] text-gray-700 font-medium cursor-pointer"
                  >
                    {CATEGORY_OPTIONS.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Tiempo de Lectura</label>
                  <select
                    name="readTime"
                    defaultValue={selectedArticle?.readTime?.replace(' min', '') || '3'}
                    required
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0D3F50] text-gray-700 font-medium cursor-pointer"
                  >
                    {READ_TIME_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option} min
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
                <label className="block text-sm font-semibold text-gray-700 mb-4">Imagen del Articulo</label>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL de la imagen</label>
                  <input
                    type="url"
                    name="imageUrl"
                    defaultValue={selectedArticle?.imageUrl || ''}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0D3F50] focus:ring-2 focus:ring-[#0D3F50]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">URL de Redireccion</label>
                <input
                  type="url"
                  name="url"
                  defaultValue={selectedArticle?.url || ''}
                  placeholder="https://aneupi.com/articulo"
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0D3F50] focus:ring-2 focus:ring-[#0D3F50]/30"
                />
              </div>

              <div className="flex gap-4 justify-end pt-6 border-t border-gray-300">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-2 bg-[#0D3F50] text-white hover:bg-[#0A2D3A] rounded-lg font-semibold transition flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-8 py-2 bg-[#0D3F50] text-white hover:bg-[#0A2D3A] rounded-lg font-semibold transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {selectedArticle ? 'Guardar Cambios' : 'Crear Articulo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
