"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card } from "@/components/ui/card-articulos"
import {
  Calendar,
  User,
  Eye,
  Heart,
  MessageCircle,
  BookOpen,
  ArrowRight,
  Plus,
  Share2,
  Search,
  Twitter,
  Instagram,
  Copy,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { AddArticleForm } from "@/components/add-article-form"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"
import ChatBot from "@/app/administrador/asistente-virtual/chatBot";
import { ArticuloReaccion } from "@/components/articulo-reaccion"
import { ArticuloComentarios } from "@/components/articulo-comentarios"

const intents = [
  { id: 1, label: "Saludo", name: "saludo", keywords: "hola, buenas", active: true, response: "Hola, ¿en qué puedo ayudar?" }
];

// --- DATOS DE RESPALDO (PÁGINA ORIGINAL) ---
const FALLBACK_ARTICLES = [
  // Tecnología (4)
  {
    id: 1,
    title: "El Futuro de la Inteligencia Artificial en América Latina",
    excerpt: "Un análisis profundo sobre cómo la IA está transformando los sectores productivos en la región y las oportunidades que presenta para el desarrollo tecnológico.",
    author: "María González",
    date: "15 Oct 2025",
    readTime: "8 min",
    views: 1234,
    likes: 89,
    comments: 23,
    image: "/artificial-intelligence-technology.png",
    category: "Tecnología",
  },
  {
    id: 2,
    title: "Startups de Tecnología: Casos de Éxito en la Región",
    excerpt: "Historias de startups que escalaron y las lecciones clave para emprendedores tech en LATAM.",
    author: "Diego Herrera",
    date: "08 Oct 2025",
    readTime: "7 min",
    views: 842,
    likes: 47,
    comments: 10,
    image: "/startups_tecnologia.jpg",
    category: "Tecnología",
  },
  {
    id: 3,
    title: "Ciberseguridad para PYMES: Buenas prácticas",
    excerpt: "Guía práctica para que pequeñas empresas protejan sus datos sin grandes inversiones.",
    author: "Clara Ruiz",
    date: "05 Oct 2025",
    readTime: "6 min",
    views: 621,
    likes: 32,
    comments: 8,
    image: "/ciberseguridadpymes.png",
    category: "Tecnología",
  },
  {
    id: 4,
    title: "Tendencias Tech 2026: Lo que viene",
    excerpt: "Un vistazo a las tecnologías emergentes que tomarán fuerza en los próximos años.",
    author: "Javier Molina",
    date: "01 Oct 2025",
    readTime: "9 min",
    views: 940,
    likes: 58,
    comments: 15,
    image: "/artificial-intelligence-technology.png",
    category: "Tecnología",
  },

  // Medio Ambiente (4)
  {
    id: 5,
    title: "Sostenibilidad: El Desafío Ambiental del Siglo XXI",
    excerpt: "Exploramos las iniciativas más innovadoras en sostenibilidad ambiental y cómo las empresas están adaptándose a los nuevos estándares ecológicos.",
    author: "Carlos Mendoza",
    date: "14 Oct 2025",
    readTime: "12 min",
    views: 2156,
    likes: 145,
    comments: 34,
    image: "/sustainability-environment-green.jpg",
    category: "Medio Ambiente",
  },
  {
    id: 6,
    title: "Ciudades Verdes: Planificación urbana sostenible",
    excerpt: "Proyectos urbanos que están transformando el espacio público y reduciendo la huella de carbono.",
    author: "Mariana López",
    date: "09 Oct 2025",
    readTime: "10 min",
    views: 1302,
    likes: 64,
    comments: 19,
    image: "/ciudades_verdes.jpeg",
    category: "Medio Ambiente",
  },
  {
    id: 7,
    title: "Economías Circulares: modelos que funcionan",
    excerpt: "Casos prácticos de empresas que implementaron economía circular con éxito.",
    author: "Andrés García",
    date: "06 Oct 2025",
    readTime: "8 min",
    views: 778,
    likes: 39,
    comments: 7,
    image: "/economias_circulares.jpg",
    category: "Medio Ambiente",
  },
  {
    id: 8,
    title: "Conservación y comunidad: proyectos locales",
    excerpt: "Iniciativas comunitarias que protegen la biodiversidad y generan empleo local.",
    author: "Lucía Fernández",
    date: "02 Oct 2025",
    readTime: "6 min",
    views: 542,
    likes: 28,
    comments: 6,
    image: "/sustainability-environment-green.jpg",
    category: "Medio Ambiente",
  },

  // Educación (4)
  {
    id: 9,
    title: "La Revolución de la Educación Digital",
    excerpt: "Cómo las plataformas educativas en línea están democratizando el acceso al conocimiento y transformando la manera en que aprendemos.",
    author: "Ana Rodríguez",
    date: "13 Oct 2025",
    readTime: "10 min",
    views: 1876,
    likes: 112,
    comments: 45,
    image: "/online-education-digital-learning.jpg",
    category: "Educación",
  },
  {
    id: 10,
    title: "Metodologías activas: Aprender haciendo",
    excerpt: "Ejemplos prácticos para aplicar metodologías activas en aulas de todos los niveles.",
    author: "Beatriz Ávila",
    date: "07 Oct 2025",
    readTime: "7 min",
    views: 698,
    likes: 41,
    comments: 12,
    image: "/metodologia-activa-de-aprendizaje.jpg",
    category: "Educación",
  },
  {
    id: 11,
    title: "Formación docente continua: recursos y plataformas",
    excerpt: "Dónde encontrar cursos y comunidades para seguir formándose como docente.",
    author: "Miguel Torres",
    date: "03 Oct 2025",
    readTime: "6 min",
    views: 412,
    likes: 22,
    comments: 5,
    image: "/formacion_docente.jpg",
    category: "Educación",
  },
  {
    id: 12,
    title: "Acceso y brecha digital: retos por superar",
    excerpt: "Análisis de la brecha digital y propuestas para cerrar la desigualdad en el acceso a internet.",
    author: "Sofía Moreno",
    date: "29 Sep 2025",
    readTime: "9 min",
    views: 559,
    likes: 33,
    comments: 9,
    image: "/online-education-digital-learning.jpg",
    category: "Educación",
  },

  // Gastronomía (4)
  {
    id: 13,
    title: "Gastronomía Ecuatoriana: Tradición e Innovación",
    excerpt: "Un recorrido por los sabores tradicionales del Ecuador y cómo los chefs modernos están reinventando la cocina nacional.",
    author: "Luis Pérez",
    date: "12 Oct 2025",
    readTime: "6 min",
    views: 987,
    likes: 76,
    comments: 18,
    image: "/ecuadorian-food-traditional-cuisine.jpg",
    category: "Gastronomía",
  },
  {
    id: 14,
    title: "Ingredientes locales: de la finca a la mesa",
    excerpt: "Proveedores locales que están impulsando una gastronomía más sostenible y auténtica.",
    author: "Camila Ortiz",
    date: "04 Oct 2025",
    readTime: "5 min",
    views: 423,
    likes: 26,
    comments: 4,
    image: "/ingredientes_locales.jpg",
    category: "Gastronomía",
  },
  {
    id: 15,
    title: "Tendencias culinarias 2026: fusiones y técnicas",
    excerpt: "Qué técnicas y combinaciones esperaremos ver en los menús durante el próximo año.",
    author: "Elena Castro",
    date: "28 Sep 2025",
    readTime: "7 min",
    views: 354,
    likes: 19,
    comments: 3,
    image: "/tendencias_culinareas.jpeg",
    category: "Gastronomía",
  },
  {
    id: 16,
    title: "Cocina saludable: recetas fáciles y sabrosas",
    excerpt: "Recetas rápidas con ingredientes accesibles para comer mejor sin complicaciones.",
    author: "Paula Ríos",
    date: "22 Sep 2025",
    readTime: "4 min",
    views: 289,
    likes: 15,
    comments: 2,
    image: "/ecuadorian-food-traditional-cuisine.jpg",
    category: "Gastronomía",
  },

  // Negocios (4)
  {
    id: 17,
    title: "El Auge del Emprendimiento Social en Ecuador",
    excerpt: "Historias inspiradoras de emprendedores que están generando impacto social positivo mientras construyen negocios sostenibles.",
    author: "Patricia Silva",
    date: "11 Oct 2025",
    readTime: "9 min",
    views: 1543,
    likes: 98,
    comments: 29,
    image: "/social-entrepreneurship-business.jpg",
    category: "Negocios",
  },
  {
    id: 18,
    title: "Finanzas para emprendedores: gestión básica",
    excerpt: "Conceptos financieros esenciales para que emprendedores tomen mejores decisiones.",
    author: "Raúl Méndez",
    date: "30 Sep 2025",
    readTime: "6 min",
    views: 678,
    likes: 44,
    comments: 11,
    image: "/finanzas-para-emprendedores.jpg",
    category: "Negocios",
  },
  {
    id: 19,
    title: "Marketing digital efectivo para PYMES",
    excerpt: "Estrategias prácticas y de bajo costo para aumentar la visibilidad y ventas online.",
    author: "Valeria Santos",
    date: "25 Sep 2025",
    readTime: "7 min",
    views: 503,
    likes: 36,
    comments: 6,
    image: "/marketing_digital.jpg",
    category: "Negocios",
  },
  {
    id: 20,
    title: "Liderazgo y equipos: construir culturas resilientes",
    excerpt: "Prácticas para líderes que quieren equipos motivados y con foco en resultados.",
    author: "Fernando Castro",
    date: "20 Sep 2025",
    readTime: "8 min",
    views: 412,
    likes: 27,
    comments: 5,
    image: "/social-entrepreneurship-business.jpg",
    category: "Negocios",
  },

  // Arte y Cultura (4)
  {
    id: 21,
    title: "Arte Contemporáneo Latinoamericano: Nuevas Voces",
    excerpt: "Descubre a los artistas emergentes que están redefiniendo el panorama del arte contemporáneo en América Latina.",
    author: "Roberto Vargas",
    date: "10 Oct 2025",
    readTime: "7 min",
    views: 765,
    likes: 54,
    comments: 12,
    image: "/contemporary-latin-american-art.jpg",
    category: "Arte y Cultura",
  },
  {
    id: 22,
    title: "Festivales culturales: recuperando el encuentro",
    excerpt: "Cómo los festivales están revitalizando la economía local y la vida cultural.",
    author: "Mateo Peña",
    date: "18 Sep 2025",
    readTime: "6 min",
    views: 332,
    likes: 20,
    comments: 4,
    image: "/festival_cultural.jpg",
    category: "Arte y Cultura",
  },
  {
    id: 23,
    title: "Música emergente: nuevas escenas en la región",
    excerpt: "Bandas y sellos independientes que están marcando la agenda musical local.",
    author: "Natalia Gómez",
    date: "12 Sep 2025",
    readTime: "5 min",
    views: 287,
    likes: 18,
    comments: 3,
    image: "/musica_emergente.jpg",
    category: "Arte y Cultura",
  },
  {
    id: 24,
    title: "Patrimonio y memoria: preservar para el futuro",
    excerpt: "Iniciativas de preservación del patrimonio tangible e intangible en comunidades locales.",
    author: "Daniela Ruiz",
    date: "05 Sep 2025",
    readTime: "8 min",
    views: 198,
    likes: 12,
    comments: 2,
    image: "/contemporary-latin-american-art.jpg",
    category: "Arte y Cultura",
  },
];

export default function ArticulosPage() {
  // Aqui va la api de articulos, si no se conecta, se cargan los articulos de respaldo (FALLBACK_ARTICLES)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<any>(null)
  const [displayedArticle, setDisplayedArticle] = useState<any>(null)
  const [vistasArticulo, setVistasArticulo] = useState<number>(0);
  const [contenidoArticulo, setContenidoArticulo] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [showSearchOptions, setShowSearchOptions] = useState(false)
  const [activeExamTab, setActiveExamTab] = useState<"recent" | "date" | "author" | "title">("recent")
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("")
  const [authorSearch, setAuthorSearch] = useState("")
  const [titleSearch, setTitleSearch] = useState("")
  const ARTICLES_PER_PAGE = 9

  // Inicializamos el estado con los datos de respaldo para que la página nunca esté en blanco
  const [articles, setArticles] = useState(FALLBACK_ARTICLES)
  const [isLoading, setIsLoading] = useState(false)

  // Efecto para obtener los artículos reales del Backend
  useEffect(() => {
    async function fetchRealArticles() {
      if (!API_URL || API_URL === "Aqui va la api") return;

      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/articulos?take=50&estado=PUBLICADO`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          const data = await response.json();
          // Asegúrate de que "data" sea un arreglo. Si tu API devuelve { articulos: [...] }, usa data.articulos
          if (data && data.data && data.data.length > 0) {
              setArticles(data.data.map((a: any) => ({
                  id: a.articuloId,
                  title: a.titulo,
                  excerpt: a.descripcion,
                  author: a.nombre_autor || a.autor?.nombre_completo || 'Autor',
                  date: new Date(a.fechaPublicacion).toLocaleDateString('es-ES'),
                  readTime: `${a.tiempo_lectura} min`,
                  views: a.vistas || 0,
                  likes: a.reacciones?.total || 0,
                  comments: a._count?.comentarios || 0,
                  image: a.url_imagen || '/placeholder.jpg',
                  category: a.categoria?.nombre || 'General',
              })));
          }
        } else {
          console.warn("El servidor respondió con error, manteniendo artículos originales.");
        }
      } catch (error) {
        console.error("No se pudo conectar con el backend. Cargando versión original.", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRealArticles();
  }, []);

  const filteredArticles = articles.filter((article) => {
    // Base search filter
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase())

    // Tab-specific filters
    if (activeExamTab === "author" && authorSearch) {
      return matchesSearch && article.author.toLowerCase().includes(authorSearch.toLowerCase())
    }

    if (activeExamTab === "title" && titleSearch) {
      return matchesSearch && article.title.toLowerCase().includes(titleSearch.toLowerCase())
    }

    if (activeExamTab === "date" && (selectedYear || selectedMonth)) {
      const articleDate = new Date(article.date)
      const matchesYear = selectedYear ? articleDate.getFullYear().toString() === selectedYear : true
      const matchesMonth = selectedMonth ? (articleDate.getMonth() + 1).toString() === selectedMonth : true
      return matchesSearch && matchesYear && matchesMonth
    }

    // For "recent" tab, show all articles that match the general search term
    return matchesSearch
  })

  const sortedArticles =
    activeExamTab === "recent"
      ? [...filteredArticles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      : filteredArticles

  const totalPages = Math.ceil(sortedArticles.length / ARTICLES_PER_PAGE)
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE
  const endIndex = startIndex + ARTICLES_PER_PAGE
  const displayedArticles = sortedArticles.slice(startIndex, endIndex)

  const [sidebarItems] = useState([
    {
      id: 1,
      title: "III Congreso Internacional",
      image: "/technology-conference.png",
      link: "https://aneupi.com/congreso-internacional",
      subtitle: "Tendencia en este momento",
      posts: "115 usuarios",
    },
    {
      id: 2,
      title: "Foro de Innovación y Emprendimiento",
      image: "/business-innovation-forum.jpg",
      link: "https://aagale.com/",
      subtitle: "Tendencia en este momento",
      posts: "980 usuarios",
    },
    {
      id: 3,
      title: "Encuentro de Educación Digital",
      image: "/digital-education-conference.jpg",
      link: "https://universidadleceni.com/",
      subtitle: "Tendencia en este momento",
      posts: "3,459 usuarios",
    },
  ])

  const partnerLogos = [
    {
      id: 1,
      name: "ANEUPI",
      url: "https://aneupi.com/assets/brand-B_L3wkGX.png",
      link: "https://aneupi.com/",
    },
    {
      id: 2,
      name: "Institución Financiera ANEUPI",
      url: "https://institucionfinancieraaneupi.com/Logos/logoBank.jpg",
      link: "https://institucionfinancieraaneupi.com/",
    },
    {
      id: 3,
      name: "ANEUPI Gatito",
      url: "https://aneupi.com/assets/gatitoPlis-CLhW9kLN.png",
      link: "https://aneupi.com/",
    },
    {
      id: 4,
      name: "LECENI",
      url: "https://constructoraeinmobiliarialeceni.com/Logos/Leceni.png",
      link: "https://constructoraeinmobiliarialeceni.com/",
    },
    {
      id: 5,
      name: "Universidad LECENI",
      url: "https://universidadleceni.com/_next/image?url=%2Fimagenes%2Flogos%2Flogo%20universidad%20leceni.png&w=1200&q=75",
      link: "https://universidadleceni.com/",
    },
  ]

  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleAddArticle = (formData: any) => {
    const newArticle = {
      id: articles.length + 1,
      title: formData.title,
      excerpt: formData.description,
      author: formData.author,
      date: new Date().toLocaleDateString("es-ES", { year: "numeric", month: "short", day: "numeric" }),
      readTime: formData.readTime,
      views: 0,
      likes: 0,
      comments: 0,
      image: formData.imageSource === "url" ? formData.imageUrl : URL.createObjectURL(formData.imageFile),
      category: formData.category,
    }
    setArticles([newArticle, ...articles])
  }

  const handleShare = (article: any) => {
    setSelectedArticle(article)
    setShareModalOpen(true)
  }

  const shareToFacebook = () => {
    const url = selectedArticle?.link || window.location.href
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
  }

  const shareToTwitter = () => {
    const url = selectedArticle?.link || window.location.href
    const text = selectedArticle?.title || ""
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, "_blank")
  }

  const shareToWhatsApp = () => {
    const url = selectedArticle?.link || window.location.href
    window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, "_blank")
  }

  const shareToInstagram = () => {
    window.open("https://www.instagram.com/tv_aneupi/", "_blank")
  }

  const shareToAneupi = () => {
    const url = selectedArticle?.link || "https://aneupi.com"
    window.open(url, "_blank")
  }

  const copyToClipboard = () => {
    const url = selectedArticle?.link || window.location.href
    navigator.clipboard.writeText(url)
    alert("Enlace copiado al portapapeles")
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader activeSection="articulos" />

      {/* Indicador de carga opcional */}
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-[#003952] animate-pulse z-[60]" />
      )}

      <main className="mx-auto max-w-full px-0 py-8 overflow-x-hidden">
        {/* Grid principal igual que inicio: 4 columnas, contenido en 3, sidebar en 1 */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-3 pl-3">

            {/* Header con título y botón agregar */}
            <div className="mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 px-1">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Artículos</h1>
                <p className="text-gray-600 text-sm">Lee y comparte artículos de opinión, análisis y reportajes en profundidad</p>
              </div>
              <Button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-2 bg-[#003952] text-white px-4 py-2 rounded-md hover:bg-[#002a3a] transition-colors font-semibold text-sm"
              >
                <Plus className="w-4 h-4" />
                Agregar artículo
              </Button>
            </div>

            {/* Buscador */}
            <div className="mb-4 px-1">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => setShowSearchOptions((s) => !s)}
                  aria-expanded={showSearchOptions}
                  className="flex items-center gap-2 bg-[#003952] text-white px-4 py-2 rounded-md hover:bg-[#002a3a] transition-colors font-semibold text-sm"
                >
                  <Search className="w-4 h-4 text-white" />
                  <span>Buscar</span>
                </button>
              </div>
              {showSearchOptions && (
                <div className="flex border-b border-gray-300 overflow-x-auto">
                  {[
                    { key: "recent", label: "Envíos recientes" },
                    { key: "date", label: "Por fecha" },
                    { key: "author", label: "Por autor" },
                    { key: "title", label: "Por título" },
                  ].map(({ key, label }) => (
                    <button key={key}
                      onClick={() => { setActiveExamTab(key as any); setAuthorSearch(""); setTitleSearch("") }}
                      className={`px-3 py-2 font-medium transition-colors border-b-2 whitespace-nowrap text-sm ${activeExamTab === key ? "bg-[#003952] text-white border-[#003952]" : "bg-white text-[#003952] border-transparent hover:bg-gray-50"}`}
                    >{label}</button>
                  ))}
                </div>
              )}
            </div>

            {activeExamTab === "date" && (
              <div className="mb-4 bg-white p-4 rounded-lg border border-gray-300 mx-1">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Filtrar resultados por año o por mes:</h3>
                <div className="flex flex-col sm:flex-row items-end gap-3">
                  <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#003952]">
                    <option value="">(Elegir año)</option>
                    {["2025","2024","2023","2022"].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#003952]">
                    <option value="">(Elegir mes)</option>
                    {["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"].map((m,i) => <option key={i+1} value={String(i+1)}>{m}</option>)}
                  </select>
                  <Button onClick={() => setCurrentPage(1)} className="bg-[#003952] text-white px-6 py-2 rounded-lg hover:bg-[#002a3a] font-semibold text-sm flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Examinar
                  </Button>
                </div>
              </div>
            )}
            {activeExamTab === "author" && (
              <div className="mb-4 bg-white p-4 rounded-lg border border-gray-300 mx-1">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Buscar artículos por autor:</h3>
                <div className="flex gap-3">
                  <input type="text" placeholder="Ingrese el nombre del autor" value={authorSearch} onChange={(e) => setAuthorSearch(e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#003952]" />
                  <Button onClick={() => setCurrentPage(1)} className="bg-[#003952] text-white px-6 py-2 rounded-lg hover:bg-[#002a3a] font-semibold text-sm">Buscar</Button>
                </div>
              </div>
            )}
            {activeExamTab === "title" && (
              <div className="mb-4 bg-white p-4 rounded-lg border border-gray-300 mx-1">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Buscar artículos por título:</h3>
                <div className="flex gap-3">
                  <input type="text" placeholder="Ingrese el título del artículo" value={titleSearch} onChange={(e) => setTitleSearch(e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#003952]" />
                  <Button onClick={() => setCurrentPage(1)} className="bg-[#003952] text-white px-6 py-2 rounded-lg hover:bg-[#002a3a] font-semibold text-sm">Buscar</Button>
                </div>
              </div>
            )}
            {displayedArticle ? (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <button
                  onClick={() => setDisplayedArticle(null)}
                  className="inline-flex items-center gap-2 text-sm text-[#003952] hover:underline mb-4"
                >
                  <ChevronLeft className="w-4 h-4" /> Volver a artículos
                </button>

                <article className="prose max-w-none">
                  <h1 className="text-2xl font-bold">{displayedArticle.title}</h1>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><User className="w-4 h-4" />{displayedArticle.author}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{displayedArticle.date}</span>
                    <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" />{displayedArticle.readTime}</span>
                    <span className="flex items-center gap-1"><Eye className="w-4 h-4"/>{vistasArticulo} vistas</span>
                  </div>

                  {displayedArticle.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={displayedArticle.image} alt={displayedArticle.title} className="w-full rounded-md my-4" />
                  )}

                  <div className="text-gray-700">
                    {/* Resumen en caja destacada */}
                    <div className="border-l-4 border-[#003952] pl-4 py-1 my-4 bg-gray-50 rounded-r-lg">
                      <p className="text-gray-500 italic text-sm font-medium">{displayedArticle.excerpt}</p>
                    </div>
                    {/* Contenido completo */}
                    {contenidoArticulo && contenidoArticulo !== displayedArticle.excerpt && (
                      <p className="mt-4 leading-relaxed">{contenidoArticulo}</p>
                    )}
                  </div>
                </article>

                {/* Reacción ❤️ */}
                <div className="mt-4 flex items-center gap-3">
                  <ArticuloReaccion
                    articuloId={displayedArticle.id}
                    initialCount={displayedArticle.likes}
                  />
                  <span className="text-sm text-gray-500">Me encanta</span>
                </div>

                {/* Comentarios */}
                <ArticuloComentarios articuloId={displayedArticle.id} />

              </div>
            ) : (
              <div className="space-y-8">
                {Array.from(new Set(sortedArticles.map((a) => a.category))).map((category) => {
                  const items = sortedArticles.filter((a) => a.category === category)
                  return (
                    <section key={category} className="">
                      <div className="bg-white border-2 border-gray-200 hover:border-gray-300 rounded-lg p-3 shadow-sm">
                        <Carousel>
                          <CarouselContent className="flex">
                            {items.map((article) => (
                              <CarouselItem
                                key={article.id}
                                className="basis-full sm:basis-1/2 md:basis-1/3 flex"
                              >
                                <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-shadow cursor-pointer bg-white group border border-gray-500 hover:border-gray-800 rounded-lg">
                                  <div className="relative h-36 overflow-hidden rounded-t-lg bg-[#003952]/10 flex-shrink-0">
                                    <img
                                      src={article.image || "/placeholder.svg"}
                                      alt={article.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 block rounded-t-lg"
                                      onError={(e) => {
                                        const img = e.target as HTMLImageElement
                                        img.src = `https://placehold.co/400x200/003952/FDB913?text=${encodeURIComponent(article.category || 'Artículo')}`
                                      }}
                                    />
                                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-[#DC2626] text-white px-2 sm:px-3 py-1 text-xs font-bold uppercase rounded">
                                      {article.category}
                                    </div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleShare(article)
                                      }}
                                      className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-[#003952]/90 hover:bg-[#003952] text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all hover:scale-105 shadow-lg"
                                      aria-label="Compartir artículo"
                                    >
                                      <Share2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <div className="flex flex-col p-0 sm:p-1 flex-1">
                                    <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-2 text-gray-900 group-hover:text-[#003952] transition-colors leading-tight text-balance">
                                      {article.title}
                                    </h3>
                                    <p className="text-gray-600 text-xs sm:text-xs mb-1 leading-relaxed line-clamp-2 flex-1 min-h-[2.2rem] sm:min-h-[2.6rem]">
                                      {article.excerpt}
                                    </p>
                                    <div className="flex items-center flex-wrap gap-2 text-xs text-gray-500 mb-2">
                                      <span className="flex items-center gap-1">
                                        <User className="w-3 h-3 flex-shrink-0" />
                                        <span className="truncate">{article.author}</span>
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3 flex-shrink-0" />
                                        {article.date}
                                      </span>
                                      <span className="flex items-center gap-1 hidden sm:flex">
                                        <BookOpen className="w-3 h-3 flex-shrink-0" />
                                        {article.readTime}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between pt-0.5 sm:pt-1 border-t border-gray-100 gap-2 mt-auto">
                                      <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                                          {article.views}
                                        </span>
                                        <ArticuloReaccion
                                          articuloId={article.id}
                                          initialCount={article.likes}
                                        />
                                        <span className="flex items-center gap-1">
                                          <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                          {article.comments}
                                        </span>
                                      </div>
                                      <button
                                        onClick={async() => {
                                          setDisplayedArticle(article);
                                          try {
                                            const res = await fetch (`${API_URL}/api/articulos/${article.id}`);
                                            const data = await res.json();
                                            if (data.success) {
                                              setVistasArticulo(data.data.vistas);
                                              setContenidoArticulo(data.data.contenido || article.excerpt || '');
                                            }
                                          }catch(e) {}
                                        }}
                                        className="inline-flex items-center gap-2 bg-[#003952] text-white px-3 py-1 rounded-lg hover:bg-[#002a3a] transition-colors font-medium text-xs w-auto"
                                      >
                                        Leer más <ArrowRight className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                </Card>
                              </CarouselItem>
                            ))}
                          </CarouselContent>

                          <div className="flex items-center justify-center gap-3 mt-3">
                            <CarouselPrevious className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 p-2 rounded-full shadow-sm" />
                            <CarouselNext className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 p-2 rounded-full shadow-sm" />
                          </div>
                        </Carousel>
                      </div>
                    </section>
                  )
                })}
              </div>
            )}
          </div>

          {/* Sidebar derecho — igual que inicio */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Editorial ANEUPI */}
              <div className="bg-white rounded-lg shadow-lg p-4 news-border">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Editorial ANEUPI</h3>
                <p className="text-sm text-gray-500 mb-3">¿Qué esta pasando?</p>
                {sidebarItems.map((item) => (
                  <div key={item.id} className="mt-3 p-3 rounded-lg bg-gradient-to-r from-sky-50 to-white flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-0.5">{item.subtitle}</p>
                      <a href={item.link} target="_blank" rel="noopener noreferrer"
                        className="block font-semibold text-sm text-gray-900 hover:text-[#003952] hover:underline leading-tight">
                        {item.title}
                      </a>
                      <p className="text-xs text-gray-400 mt-0.5">{item.posts}</p>
                    </div>
                    <a href={item.link} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#003952] text-white px-3 py-2 rounded-md hover:bg-[#002a3a] text-sm font-semibold flex-shrink-0">
                      Visitar
                    </a>
                  </div>
                ))}
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <a href="#" className="text-sm text-[#003952] hover:underline">Show more</a>
                </div>
              </div>
            </div>
          </div>

        </div>

        <section className="mt-2 sm:mt-4 mb-2 sm:mb-3">
          <div className="bg-white rounded-lg p-2 sm:p-3 shadow-lg">
            <div className="flex justify-center">
              <h2 className="inline-block bg-[#003952] text-white text-lg sm:text-xl font-bold px-4 sm:px-6 py-1 rounded-lg">
                Marcas Corporativas
              </h2>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 items-center justify-center">
              {partnerLogos.map((logo) => (
                <a
                  key={logo.id}
                  href={logo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-40 h-24 sm:w-44 sm:h-32 bg-white rounded-lg border-2 border-[#003952] flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={logo.url || "/placeholder.svg"}
                    alt={logo.name}
                    className="max-w-[65%] max-h-[78%] object-contain"
                  />
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      {shareModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShareModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-4 sm:p-6 max-w-md w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShareModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Compartir artículo</h3>

            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6 flex-wrap">
              <button
                onClick={copyToClipboard}
                className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-md hover:shadow-lg flex-shrink-0"
                aria-label="Copiar enlace"
              >
                <Copy className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </button>

              <button
                onClick={shareToFacebook}
                className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1877F2] hover:bg-[#0d65d9] transition-colors shadow-md hover:shadow-lg flex-shrink-0"
                aria-label="Compartir en Facebook"
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>

              <button
                onClick={shareToTwitter}
                className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg flex-shrink-0"
                aria-label="Compartir en Twitter/X"
              >
                <Twitter className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>

              <button
                onClick={shareToWhatsApp}
                className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#1fb855] transition-colors shadow-md hover:shadow-lg flex-shrink-0"
                aria-label="Compartir en WhatsApp"
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </button>

              <button
                onClick={shareToInstagram}
                className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#FD5949] via-[#D6249F] to-[#285AEB] hover:opacity-90 transition-opacity shadow-md hover:shadow-lg flex-shrink-0"
                aria-label="Compartir en Instagram"
              >
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>

              <button
                onClick={shareToAneupi}
                className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white hover:bg-gray-50 transition-colors shadow-md hover:shadow-lg border-2 border-gray-200 flex-shrink-0"
                aria-label="Ir a ANEUPI"
              >
                <img
                  src="https://aneupi.com/assets/gatitoplis-CY6tDKz6.png"
                  alt="ANEUPI"
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-gray-500 text-center">
              Comparte este artículo en tus redes sociales favoritas
            </p>
          </div>
        </div>
      )}

      <AddArticleForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleAddArticle} />

      <ChatBot intencionesData={intents} botName="Chat bot TV Aneupi" onFormSubmit={() => {}} />
      
      <SiteFooter variant="minimal" />

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-152px * 5));
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #003952;
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #002a3a;
        }
      `}</style>
    </div>
  )
}