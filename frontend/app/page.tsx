"use client"

import { useState, useRef, useEffect } from "react"
import { usePersistedState } from "@/hooks/use-persisted-state"
import {
  X,
  Calendar,
  ArrowRight,
  Eye,
  MessageCircle,
  MessageSquareText,
  Twitter,
  Camera,
  ThumbsUp,
  ThumbsDown,
  Reply,
  UserCircle,
  Search,
  Play,
} from "lucide-react"
import { AuthModal } from "@/components/auth-modal"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import ChatBot from "@/app/administrador/asistente-virtual/chatBot";

type Comment = {
  id: string
  author: string
  content: string
  date: string
  likes: number
  dislikes: number
  replies: Comment[]
  isReply?: boolean
}
const intents = [
  { id: 1, label: "Saludo", name: "saludo", keywords: "hola, buenas", active: true, response: "Hola, ¿en qué puedo ayudar?" }
];


// --- DATOS DE RESPALDO (PÁGINA ORIGINAL) ---
const FALLBACK_NEWS = [
  {
    id: "art-1",
    title: "Dirigentes indígenas y el Gobierno llegan a un acuerdo...",
    excerpt: "La reunión entre ambas partes se realizó este 15 de octubre...",
    image: "/business-innovation-forum.jpg",
    category: "ECUADOR",
    date: "16 Oct 2025",
    likes: 0, dislikes: 0, views: 0,
  },
  // ... (Agrega aquí el resto de tus artículos estáticos del array original)
];

const FALLBACK_FEATURED = [
  {
    id: "f1",
    title: "Terrorismo en Ecuador | 19 coches bomba detectados",
    description: "Últimos cuatro casos reportados en menos de tres semanas...",
    category: "LA NOTICIA A FONDO",
    date: "16 Oct 2025",
    image: "/online-education-digital-learning.jpg",
    country: "Ecuador",
  },
  {
    id: "art-1",
    title: "Dirigentes indígenas y el Gobierno llegan a un acuerdo y termina el paro en Imbabura",
    excerpt:
      "La reunión entre ambas partes se realizó este 15 de octubre en Otavalo. Hoy, la ciudad fue testigo del registro manifestaciones y la provincia de Imbabura empezó a retornar la normalidad.",
    image: "/business-innovation-forum.jpg",
    category: "ECUADOR",
    date: "16 Oct 2025",
    likes: 0,
    dislikes: 0,
    views: 0,
  },
  {
    id: "art-2",
    title: "Indígenas de Imbabura dicen que hay grupos indígenas que desconocen el acuerdo con el Gobierno",
    excerpt:
      "Representantes de comunidades indígenas manifestaron su preocupación por sectores que no aceptan los términos del acuerdo.",
    image: "/business-news-stock-market.jpg",
    category: "ECUADOR",
    date: "16 Oct 2025",
    likes: 0,
    dislikes: 0,
    views: 0,
  },
  {
    id: "art-3",
    title: "Ecuador acumula ocho prórrogas sin renovar contratos con operadoras telefónicas",
    excerpt:
      "Las empresas de telecomunicaciones operan bajo extensiones temporales mientras se define el marco regulatorio definitivo.",
    image: "/ciberseguridadpymes.png",
    category: "ECUADOR",
    date: "15 Oct 2025",
    likes: 0,
    dislikes: 0,
    views: 0,
  },
  {
    id: "art-4",
    title: "Ecuador recibe una propuesta de EE. UU. para eliminar aranceles a productos agrícolas como el banano",
    excerpt:
      "La propuesta busca fortalecer las relaciones comerciales entre ambos países y beneficiar al sector agrícola ecuatoriano.",
    image: "/ciudades_verdes.jpeg",
    category: "ECONOMÍA",
    date: "15 Oct 2025",
    likes: 0,
    dislikes: 0,
    views: 0,
  },
  {
    id: "art-5",
    title: "EE. UU.: El Gobierno Trump autorizó operaciones encubiertas en Venezuela, según The New York Times",
    excerpt: "Según reportes de prensa internacional, la administración estadounidense habría aprobado acciones de inteligencia en territorio venezolano.",
    image: "/community-voices-people-speaking.jpg",
    category: "EE. UU.",
    date: "14 Oct 2025",
    likes: 0,
    dislikes: 0,
    views: 0,
  },
  {
    id: "art-6",
    title: "Reconstrucción del atentado en Guayaquil: cuándo, cómo y dónde actuaron los responsables",
    excerpt: "Autoridades investigan los detalles del ataque que conmocionó a la ciudad portuaria la semana pasada.",
    image: "/formacion_docente.jpg",
    category: "SEGURIDAD",
    date: "14 Oct 2025",
    likes: 0,
    dislikes: 0,
    views: 0,
  },
  // ... (Agrega aquí el resto de tus slides estáticos del carrusel original)
];

export default function AneupiTV() {
  // 1. Configuración de la API
  // Aqui va la api
  const API_URL = "Aqui va la api";

  // 2. Estados inicializados con los datos de respaldo
  const [newsArticles, setNewsArticles] = useState(FALLBACK_NEWS);
  const [featuredSlides, setFeaturedSlides] = useState(FALLBACK_FEATURED);
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Lista de slides activas (todas o filtradas)
  const [searchQuery, setSearchQuery] = useState("")
  const parseQuery = (q: string) => {
    const tokens: string[] = []
    const filters: Record<string, string> = {}
    q
      .trim()
      .split(/\s+/)
      .forEach((tok) => {
        if (!tok) return
        const parts = tok.split(":")
        if (parts.length > 1) {
          const key = parts[0].toLowerCase()
          const value = parts.slice(1).join(":").toLowerCase()
          if (key === "categoria" || key === "cat") filters["category"] = value
          else if (key === "pais" || key === "país" || key === "country") filters["country"] = value
          else filters[key] = value
        } else {
          tokens.push(tok.toLowerCase())
        }
      })
    return { tokens, filters }
  }
  // --- FILTRADO DE LA NOTICIA PRINCIPAL ---
  const matchesFeatured = (slide: any, q: string) => {
    if (!q.trim()) return true
    const { tokens, filters } = parseQuery(q)
    const hay = [
      String(slide.title || ""),
      String(slide.description || ""),
      String(slide.category || ""),
      String(slide.country || ""),
    ]
      .join(" ")
      .toLowerCase()

    if (filters["category"]) {
      if (!String(slide.category || "").toLowerCase().includes(filters["category"])) return false
    }
    if (filters["country"]) {
      if (!String(slide.country || "").toLowerCase().includes(filters["country"])) return false
    }

    return tokens.every((t) => hay.includes(t))
  }
  const [featuredStats, setFeaturedStats] = useState({ likes: 0, dislikes: 0, views: 0 })
  const activeFeaturedSlides = featuredSlides.filter(s => matchesFeatured(s, searchQuery));
  const [featuredCollapsed, setFeaturedCollapsed] = useState(false)
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [featuredAutoPaused, setFeaturedAutoPaused] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [replyToId, setReplyToId] = useState<string | null>(null)

  const [pinnedFeatured, setPinnedFeatured] = usePersistedState<boolean>(
    "pinnedFeatured",
    false,
    { apiKey: "pinnedFeatured", debounceMs: 500 }
  )

  const prevFeatured = () => {
    if (activeFeaturedSlides.length === 0) return
    setFeaturedIndex((i) => (i - 1 + activeFeaturedSlides.length) % activeFeaturedSlides.length)
  }
  const nextFeatured = () => {
    if (activeFeaturedSlides.length === 0) return
    setFeaturedIndex((i) => (i + 1) % activeFeaturedSlides.length)
  }

  const incrementFeaturedViews = () => {
    setFeaturedStats((prev) => ({ ...prev, views: prev.views + 1 }))
  }
  const [featuredUserVote, setFeaturedUserVote] = useState<'liked' | 'disliked' | null>(null)
  const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n))

  const handleFeaturedVote = (type: "like" | "dislike") => {
    const mapped = type === "like" ? "liked" : "disliked"
    if (featuredUserVote === mapped) return

    setFeaturedStats((prev) => {
      let likes = prev.likes
      let dislikes = prev.dislikes

      if (featuredUserVote === "liked" && type === "dislike") likes = Math.max(0, likes - 1)
      if (featuredUserVote === "disliked" && type === "like") dislikes = Math.max(0, dislikes - 1)

      if (type === "like") likes += 1
      else dislikes += 1

      return { ...prev, likes, dislikes }
    })
    setFeaturedUserVote(mapped)
  }
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Usuario Ejemplo 1",
      content: "¡Excelente artículo! Muy bien redactado y con información relevante.",
      date: "17 Oct 2025",
      likes: 5,
      dislikes: 0,
      replies: [
        {
          id: "1-1",
          author: "Admin ANEUPI",
          content: "Gracias por tu amable comentario, ¡nos alegra que te haya gustado!",
          date: "17 Oct 2025",
          likes: 2,
          dislikes: 0,
          replies: [],
          isReply: true,
        },
      ],
    },
    {
      id: "2",
      author: "Lector Interesado",
      content: "Me gustaría saber más sobre las implicaciones a largo plazo del terrorismo en la economía local.",
      date: "17 Oct 2025",
      likes: 3,
      dislikes: 1,
      replies: [],
    },
  ])

  const [commentsCollapsed, setCommentsCollapsed] = usePersistedState<boolean>(
    "commentsCollapsed",
    false,
    { apiKey: "commentsCollapsed", debounceMs: 500 }
  )
  const handleAddComment = () => {
    if (newComment.trim() === "") return
    const newCommentObj: Comment = {
      id: String(Date.now()),
      author: "Usuario Anónimo",
      content: newComment.trim(),
      date: new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }),
      likes: 0,
      dislikes: 0,
      replies: [],
    }
    setComments([...comments, newCommentObj])
    setNewComment("")
  }
  const matchesArticle = (a: any, q: string) => {
    if (!q.trim()) return true
    const { tokens, filters } = parseQuery(q)
    const hay = [
      String(a.title || ""),
      String(a.excerpt || ""),
      String(a.category || ""),
      String((a as any).country || ""),
    ]
      .join(" ")
      .toLowerCase()

    if (filters["category"]) {
      if (!String(a.category || "").toLowerCase().includes(filters["category"])) return false
    }
    if (filters["country"]) {
      if (!String((a as any).country || "").toLowerCase().includes(filters["country"])) return false
    }

    return tokens.every((t) => hay.includes(t))
  }

  const filteredArticles = newsArticles.filter((a) => matchesArticle(a, searchQuery))
  const displayNews = searchQuery.trim() ? filteredArticles : newsArticles;

  const handleAddReply = (parentId: string, content: string) => {
    const trimmed = content.trim()
    if (trimmed === "") return
    const newReplyObj: Comment = {
      id: `${parentId}-${Date.now()}`,
      author: "Usuario Anónimo",
      content: trimmed,
      date: new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }),
      likes: 0,
      dislikes: 0,
      replies: [],
      isReply: true,
    }
    const updated = comments.map((c) => (c.id === parentId ? { ...c, replies: [...c.replies, newReplyObj] } : c))
    setComments(updated)
    setReplyToId(null)
  }
  const [userVotes, setUserVotes] = useState<{ [commentId: string]: 'liked' | 'disliked' | null }>({})


  const CommentItem = ({
    comment,
    onReply,
    onVote,
    userVoteStatus,
  }: {
    comment: Comment
    onReply: (id: string | null) => void
    onVote: (id: string, type: "like" | "dislike", isReply?: boolean) => void
    userVoteStatus: 'liked' | 'disliked' | null
  }) => {
    const [localReply, setLocalReply] = useState("")
    return (
      <div className={`flex gap-3 ${comment.isReply ? "ml-8 mt-3" : "mt-5"} border-t border-gray-100 pt-3`}>
        <UserCircle className="w-6 h-6 text-gray-400 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-800 text-sm">{comment.author}</h4>
            <span className="text-xs text-gray-500">{comment.date}</span>
          </div>
          <p className="mt-1 text-gray-700 text-sm">{comment.content}</p>
          <div className="flex items-center gap-3 mt-2 text-gray-500 text-xs">
            <button onClick={() => onVote(comment.id, "like", comment.isReply)} className="flex items-center gap-1 hover:text-blue-600 transition-colors">
              <ThumbsUp className="w-3 h-3" /> {comment.likes}
            </button>
            <button onClick={() => onVote(comment.id, "dislike", comment.isReply)} className="flex items-center gap-1 hover:text-red-600 transition-colors">
              <ThumbsDown className="w-3 h-3" /> {comment.dislikes}
            </button>
            <button onClick={() => onReply(comment.id)} className="flex items-center gap-1 hover:text-green-600 transition-colors">
              <Reply className="w-3 h-3" /> Responder
            </button>
          </div>

          {replyToId === comment.id && (
            <div className="mt-3 flex gap-2">
              <textarea
                value={localReply}
                onChange={(e) => setLocalReply(e.target.value)}
                placeholder={`Responder a ${comment.author}...`}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#003952] text-xs resize-none"
              />
              <button
                onClick={() => {
                  handleAddReply(comment.id, localReply)
                  setLocalReply("")
                  onReply(null)
                }}
                className="bg-[#003952] text-white px-3 py-1.5 rounded-lg hover:bg-[#002a3a] text-xs font-semibold"
              >
                Enviar
              </button>
              <button onClick={() => { setLocalReply(""); onReply(null) }} className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-300 text-xs">
                Cancelar
              </button>
            </div>
          )}

          {comment.replies.length > 0 && (
            <div className="mt-3">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} onReply={onReply} onVote={onVote} userVoteStatus={userVotes[reply.id] || null} />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  const handleVote = (commentId: string, type: "like" | "dislike") => {
    if (userVotes[commentId] === (type === "like" ? "liked" : "disliked")) return

    const updateRecursive = (items: Comment[]): Comment[] =>
      items.map((c) => {
        if (c.id === commentId) {
          let likes = c.likes
          let dislikes = c.dislikes
          if (userVotes[commentId] === (type === "like" ? "disliked" : "liked")) {
            if (type === "like") dislikes = Math.max(0, dislikes - 1)
            else likes = Math.max(0, likes - 1)
          }
          if (type === "like") likes += 1
          else dislikes += 1
          return { ...c, likes, dislikes }
        }
        return c.replies && c.replies.length ? { ...c, replies: updateRecursive(c.replies) } : c
      })

    setComments((prev) => updateRecursive(prev))
    setUserVotes((prev) => ({ ...prev, [commentId]: type === "like" ? "liked" : "disliked" }))
  }

  const [userArticleVotes, setUserArticleVotes] = useState<{ [articleId: string]: 'liked' | 'disliked' | null }>({})
  const handleArticleVote = (articleId: string, type: "like" | "dislike") => {
    const mapped = type === "like" ? "liked" : "disliked"
    if (userArticleVotes[articleId] === mapped) return

    setNewsArticles((prev) =>
      prev.map((article) => {
        if (article.id !== articleId) return article
        let newLikes = article.likes
        let newDislikes = article.dislikes

        if (userArticleVotes[articleId] === (type === "like" ? "disliked" : "liked")) {
          if (type === "like") newDislikes = Math.max(0, newDislikes - 1)
          else newLikes = Math.max(0, newLikes - 1)
        }
        if (type === "like") newLikes += 1
        else newDislikes += 1

        return { ...article, likes: newLikes, dislikes: newDislikes }
      })
    )
    setUserArticleVotes((prev) => ({ ...prev, [articleId]: mapped }))
  }
  const incrementArticleViews = (articleId: string) => {
    setNewsArticles((prev) => prev.map((a) => (a.id === articleId ? { ...a, views: (a.views || 0) + 1 } : a)))
  }
  const [currentUrl, setCurrentUrl] = useState("");
  // Más Noticias - Filas y Grupos
  const rowGroupSizes = [3, 4, 4]

  const makeRow = (startIndex: number, totalItems = 9) => {
    const source = displayNews.length > 0 ? displayNews : []
    if (source.length === 0) return []
    const arr = [...source]
    while (arr.length < totalItems) arr.push(...source)
    const slice = arr.slice(startIndex, startIndex + totalItems)
    return slice
  }

  // calcular rowData cada render (se usa una clave basada en longitudes para controlar efectos)
  const rowData = [
    makeRow(0, 9),
    makeRow(2, 12),
    makeRow(4, 12),
  ]
  const [rowIndexes, setRowIndexes] = useState([0, 0, 0])

  const prevRow = (row: number) => {
    setRowIndexes((prev) => {
      const slides = Math.max(1, Math.ceil(rowData[row].length / rowGroupSizes[row]))
      const copy = [...prev]
      copy[row] = (copy[row] - 1 + slides) % slides
      return copy
    })
  }
  const nextRow = (row: number) => {
    setRowIndexes((prev) => {
      const slides = Math.max(1, Math.ceil(rowData[row].length / rowGroupSizes[row]))
      const copy = [...prev]
      copy[row] = (copy[row] + 1) % slides
      return copy
    })
  }
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  // cuentas sugeridas
  const followAccounts = [
    {
      id: "aneupi",
      name: "ANEUPI",
      handle: "@aneupi",
      avatar: "/avatars/aneupi2.png",
      url: "https://aneupi.com/",
    },
    {
      id: "constructora",
      name: "Constructora & Inmobiliaria LECENI",
      handle: "@constructoraLECENI",
      avatar: "/avatars/constructora.jpg",
      url: "https://constructoraeinmobiliarialeceni.com/",
    },
    {
      id: "institucion",
      name: "Institución Financiera ANEUPI",
      handle: "@financieraANEUPI",
      avatar: "/avatars/aneupi.png",
      url: "https://institucionfinancieraaneupi.com/",
    },
    {
      id: "universidad",
      name: "Universidad LECENI",
      handle: "@universidadLECENI",
      avatar: "/avatars/universidad.png",
      url: "https://universidadleceni.com/",
    },
    {
      id: "aneupi2",
      name: "ANEUPI - Oficial",
      handle: "@aneupi_oficial",
      avatar: "/avatars/gatitoplis.png",
      url: "https://aneupi.com/",
    },
  ]
  const handleFollowClick = (_accountId: string, url: string) => {
    try {
      window.open(url, "_blank", "noopener,noreferrer")
    } catch {
      window.location.href = url
    }
  }

  // --- NUEVA SECCIÓN: Videos de YouTube ---
  type Video = {
    id: string
    title: string
    thumbnail: string
    channel?: string
    date?: string
    views: number
    url: string
  }

  const [youtubeVideos, setYoutubeVideos] = useState<Video[]>([
    {
      id: "v1",
      title: "Delcy Rodríguez: Si EE.UU. quisiera combatir al narco...",
      thumbnail: "/avatars/aneupi2.png",
      channel: "ANEUPI TV",
      date: "17 Oct 2025",
      views: 32400,
      url: "https://www.youtube.com/watch?v=example1",
    },
    {
      id: "v2",
      title: "EE.UU. cataloga como organización terrorista al presunto 'Cártel de los Soles'",
      thumbnail: "/business-news-stock-market.jpg",
      channel: "ANEUPI Noticias",
      date: "16 Oct 2025",
      views: 1721,
      url: "https://www.youtube.com/watch?v=example2",
    },
    {
      id: "v3",
      title: "Supremo de Brasil decide mantener la detención preventiva de Bolsonaro",
      thumbnail: "/inclusion-diversity-people-together.jpg",
      channel: "Internacional",
      date: "15 Oct 2025",
      views: 9820,
      url: "https://www.youtube.com/watch?v=example3",
    },
    {
      id: "v4",
      title: "Reconstrucción: atentado en Guayaquil - detalles",
      thumbnail: "/cumbia-band.jpg",
      channel: "Seguridad",
      date: "14 Oct 2025",
      views: 5400,
      url: "https://www.youtube.com/watch?v=example4",
    },
    {
      id: "v5",
      title: "Análisis económico: propuesta para eliminar aranceles agrícolas",
      thumbnail: "/business-innovation-forum.jpg",
      channel: "Economía",
      date: "13 Oct 2025",
      views: 2130,
      url: "https://www.youtube.com/watch?v=example5",
    },
    {
      id: "v6",
      title: "Educación en Ecuador: retos y oportunidades",
      thumbnail: "/education-school-children-learning.jpg",
      channel: "Educación",
      date: "13 Oct 2025",
      views: 2130,
      url: "https://www.youtube.com/watch?v=example6",
    },
  ])
  const filteredVideos = youtubeVideos.filter((v) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return v.title.toLowerCase().includes(q) || (v.channel && v.channel.toLowerCase().includes(q))
  })
  const displayVideos = searchQuery.trim() ? filteredVideos : youtubeVideos

  const openVideo = (id: string) => {
    const v = youtubeVideos.find((x) => x.id === id)
    if (!v) return
    setYoutubeVideos((prev) => prev.map((x) => (x.id === id ? { ...x, views: x.views + 1 } : x)))
    try {
      window.open(v.url, "_blank", "noopener,noreferrer")
    } catch {
      window.location.href = v.url
    }
  }
  const [authModalOpen, setAuthModalOpen] = useState(false)


  // 3. Efecto para conectar con el Backend
  useEffect(() => {
    async function fetchRealData() {
      // Aqui va la api de noticias (pagina de inicio)
      if (!API_URL || API_URL === "Aqui va la api") return;

      setIsLoading(true);
      try {
        // Intentamos traer las noticias
        const response = await fetch(`${API_URL}/noticias`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          const data = await response.json();

          // Suponiendo que el backend devuelve un objeto con { articulos, destacados }
          if (data.articulos) setNewsArticles(data.articulos);
          if (data.destacados) setFeaturedSlides(data.destacados);
        } else {
          console.warn("El servidor respondió con error, manteniendo página original.");
        }
      } catch (error) {
        console.error("No se pudo conectar con el backend. Cargando versión local.", error);
        // Al ocurrir un error, el estado no se actualiza y se ve la "página original"
      } finally {
        setIsLoading(false);
      }
    }

    fetchRealData();
  }, [API_URL]);

  return (
    <div className="page-root min-h-screen bg-white text-gray-900">
      

      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-[#003952] text-white transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button onClick={() => setMenuOpen(false)} className="hover:opacity-70"><X className="w-6 h-6" /></button>
        </div>

      </div>

      {menuOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setMenuOpen(false)} />}

      <SiteHeader activeSection="home" />

      <main className="mx-auto max-w-full px-0 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 pl-3">
            <section className={`bg-white rounded-lg overflow-hidden shadow-lg transition-all relative news-border ${featuredCollapsed ? "max-h-16 overflow-hidden" : ""}`}>
              {/* Fallback si no hay slides activas */}
              {activeFeaturedSlides.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p className="text-xl">No hay noticias destacadas que coincidan con tu búsqueda.</p>
                </div>
              ) : featuredCollapsed ? (
                <div className="px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 overflow-hidden rounded">
                      <img src={activeFeaturedSlides[featuredIndex]?.image || "/placeholder.svg"} alt={activeFeaturedSlides[featuredIndex]?.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 leading-tight">{activeFeaturedSlides[featuredIndex]?.title}</h3>
                      <span className="text-xs text-gray-500">{activeFeaturedSlides[featuredIndex]?.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setFeaturedCollapsed(false)} className="text-sm text-[#003952] font-medium">Abrir</button>
                    <button onClick={() => setPinnedFeatured(true)} className="text-sm text-yellow-600">Fijar</button>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className="relative h-[400px] overflow-hidden rounded-t-lg group"
                    onMouseEnter={() => setFeaturedAutoPaused(true)}
                    onMouseLeave={() => setFeaturedAutoPaused(false)}
                  >
                    <img src={activeFeaturedSlides[featuredIndex]?.image || "/placeholder.svg"} alt={activeFeaturedSlides[featuredIndex]?.title} className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 text-xs font-bold uppercase">{activeFeaturedSlides[featuredIndex]?.category}</div>

                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <span className="bg-white/90 px-2 py-1 rounded flex items-center gap-2 text-xs font-semibold text-gray-700">
                        {activeFeaturedSlides[featuredIndex]?.country}
                      </span>
                    </div>

                    <button aria-label="Anterior" onClick={prevFeatured} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow hover:scale-105 transition-transform">
                      <ArrowRight className="w-4 h-4 transform rotate-180" />
                    </button>
                    <button aria-label="Siguiente" onClick={nextFeatured} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow hover:scale-105 transition-transform">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-8">
                    <h3 className="text-3xl font-bold mb-4 text-gray-900 leading-tight text-balance group-hover:text-blue-600 transition-colors">{activeFeaturedSlides[featuredIndex]?.title}</h3>
                    <p className="text-gray-700 text-lg leading-relaxed mb-6">{activeFeaturedSlides[featuredIndex]?.description}</p>

                    <div className="flex flex-col gap-3 text-sm text-gray-500">
                      <div className="flex items-center justify-between w-full">
                        <button onClick={incrementFeaturedViews} className="flex items-center gap-2 bg-[#003952] text-white px-3 py-2 rounded-lg hover:bg-[#002a3a] transition-colors font-semibold text-sm whitespace-nowrap max-w-[160px]">Leer más <ArrowRight className="w-4 h-4" /></button>
                        <span className="flex items-center gap-1 text-gray-500"><Calendar className="w-4 h-4" />{activeFeaturedSlides[featuredIndex]?.date}</span>
                      </div>

                      <div className="flex items-center gap-6 text-gray-600">
                        <button onClick={() => handleFeaturedVote("like")} className="flex items-center gap-2 hover:text-blue-600 transition-colors" aria-label="Me gusta"><ThumbsUp className="w-4 h-4" /><span className="text-sm">{fmt(featuredStats.likes)}</span></button>
                        <button onClick={() => handleFeaturedVote("dislike")} className="flex items-center gap-2 hover:text-red-600 transition-colors" aria-label="No me gusta"><ThumbsDown className="w-4 h-4" /><span className="text-sm">{fmt(featuredStats.dislikes)}</span></button>
                        <div className="flex items-center gap-2 ml-2"><Eye className="w-4 h-4" /><span className="text-sm">{fmt(featuredStats.views)}</span></div>
                      </div>
                    </div>

                  </div>

                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    <button
                      onClick={() => setCommentsCollapsed((c) => !c)}
                      aria-pressed={commentsCollapsed}
                      aria-label={commentsCollapsed ? "Mostrar comentarios" : "Ocultar comentarios"}
                      className="bg-white/95 text-[#003952] p-2 rounded-full shadow-md hover:scale-105 transition-transform"
                      title="Comentarios"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </button>
                    <div className="bg-black/40 text-white text-xs px-2 py-1 rounded">{comments.length}</div>
                  </div>
                </>
              )}

              {/* Comentarios: Se ocultan si no hay slides activas o si están colapsados */}
              {(!commentsCollapsed && activeFeaturedSlides.length > 0) && (
                <section className="mt-8 bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold mb-4 text-gray-900 border-b-2 border-[#003952] pb-1.5">Comentarios</h2>

                  <div className="mb-6 p-3 bg-gray-50 rounded-md border border-gray-200">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Deja tu comentario</h3>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Escribe tu comentario aquí..." rows={3} className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#003952] text-sm resize-none" />
                      <button onClick={handleAddComment} className="bg-[#003952] text-white px-4 py-2 rounded-md hover:bg-[#002a3a] transition-colors font-semibold self-start sm:self-center text-sm">Enviar Comentario</button>
                    </div>
                  </div>

                  <div>
                    {comments.length === 0 ? <p className="text-gray-600 italic">Sé el primero en comentar.</p> : comments.map((comment) => <CommentItem key={comment.id} comment={comment} onReply={setReplyToId} onVote={(id, type) => handleVote(id, type)} userVoteStatus={userVotes[comment.id] || null} />)}
                  </div>
                </section>
              )}
            </section>

            {/* SEARCH RESULTS: mostrar resultados directos también */}
            {searchQuery.trim() ? (
              <div className="mt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Resultados de búsqueda</h2>

                {filteredArticles.length === 0 ? (
                  <div className="bg-white rounded-lg p-6 shadow text-gray-600">No se encontró nada para "<span className="font-medium">{searchQuery}</span>".</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {filteredArticles.map((article) => (
                      <article key={article.id} className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col news-border">
                        <div className="relative h-32 overflow-hidden">
                          <img src={article.image || "/placeholder.svg"} alt={article.title} className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105" />
                          <span className="absolute top-2 left-2 bg-red-600 text-white px-2 py-0.5 text-[10px] font-bold uppercase rounded">{article.category}</span>
                        </div>

                        <div className="p-3 flex-1 flex flex-col">
                          <h3 className="text-sm font-semibold mb-1 text-gray-900 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">{article.title}</h3>
                          <p className="text-gray-600 text-xs leading-normal mb-3 line-clamp-2">{article.excerpt}</p>

                          <div className="mt-auto flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-gray-600 text-xs">
                                <button onClick={() => handleArticleVote(article.id, "like")} className="flex items-center gap-1 hover:text-blue-600 transition-colors"><ThumbsUp className="w-4 h-4" /><span>{fmt(article.likes)}</span></button>
                                <button onClick={() => handleArticleVote(article.id, "dislike")} className="flex items-center gap-1 hover:text-red-600 transition-colors"><ThumbsDown className="w-4 h-4" /><span>{fmt(article.dislikes)}</span></button>
                                <div className="flex items-center gap-1 text-xs"><Eye className="w-4 h-4" /><span>{fmt(article.views || 0)}</span></div>
                              </div>

                              <span className="text-xs text-gray-400">{article.date}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <button onClick={() => incrementArticleViews(article.id)} className="inline-flex items-center gap-2 bg-[#003952] text-white px-2 py-0.5 rounded-md hover:bg-[#002a3a] text-[11px] font-semibold">
                                Leer más <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex gap-2">
                              <a target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-green-100 text-green-600 transition-colors" aria-label="Compartir en WhatsApp" onClick={(e) => e.stopPropagation()} href={`https://wa.me/?text=${encodeURIComponent(article.title + " " + currentUrl)}`}><MessageSquareText className="w-5 h-5" /></a>
                              <a target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-blue-100 transition-colors" aria-label="Compartir en Facebook" onClick={(e) => e.stopPropagation()} href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&t=${encodeURIComponent(article.title)}`}><img src="/gatitoplis-CY6tDKz6.png" alt="Gatito Plis" className="w-5 h-5" /></a>
                              <a target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-blue-100 text-blue-400 transition-colors" aria-label="Compartir en X" onClick={(e) => e.stopPropagation()} href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(currentUrl)}`}><Twitter className="w-5 h-5" /></a>
                              <a target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-pink-100 text-pink-600 transition-colors" aria-label="Compartir en Instagram (directo)" onClick={(e) => e.stopPropagation()} href={`https://www.instagram.com/`}><Camera className="w-5 h-5" /></a>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Más Noticias</h2>
              {(() => {
                const items = rowData[0] || []
                const groups: typeof items[] = []
                const step = rowGroupSizes[0] // 3
                for (let i = 0; i < items.length; i += step) groups.push(items.slice(i, i + step))
                const activeGroup = groups[Math.min(rowIndexes[0], groups.length - 1)] || groups[0] || []

                if (items.length === 0) return <p className="text-gray-500 italic">No hay noticias que coincidan con la búsqueda.</p>

                return (
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-4 relative overflow-hidden">
                    <button
                      onClick={() => prevRow(0)}
                      aria-label="Anterior fila"
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow hover:scale-105"
                    >
                      <ArrowRight className="w-4 h-4 transform rotate-180 text-gray-600" />
                    </button>

                    <button
                      onClick={() => nextRow(0)}
                      aria-label="Siguiente fila"
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow hover:scale-105"
                    >
                      <ArrowRight className="w-4 h-4 text-gray-600" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {activeGroup.map((article, idx) => (
                        <article key={`${article.id}-r0-${idx}`} className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col news-border">
                          <div className="relative h-32 overflow-hidden">
                            <img src={article.image || "/placeholder.svg"} alt={article.title} className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105" />
                            <span className="absolute top-2 left-2 bg-red-600 text-white px-2 py-0.5 text-[10px] font-bold uppercase rounded">{article.category}</span>
                          </div>

                          <div className="p-3 flex-1 flex flex-col">
                            <h3 className="text-sm font-semibold mb-1 text-gray-900 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">{article.title}</h3>
                            <p className="text-gray-600 text-xs leading-normal mb-3 line-clamp-2">{article.excerpt}</p>

                            <div className="mt-auto flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-gray-600 text-xs">
                                  <button onClick={() => handleArticleVote(article.id, "like")} className="flex items-center gap-1 hover:text-blue-600 transition-colors"><ThumbsUp className="w-4 h-4" /><span>{fmt(article.likes)}</span></button>
                                  <button onClick={() => handleArticleVote(article.id, "dislike")} className="flex items-center gap-1 hover:text-red-600 transition-colors"><ThumbsDown className="w-4 h-4" /><span>{fmt(article.dislikes)}</span></button>
                                  <div className="flex items-center gap-1 text-xs"><Eye className="w-4 h-4" /><span>{fmt(article.views || 0)}</span></div>
                                </div>

                                <span className="text-xs text-gray-400">{article.date}</span>
                              </div>

                              <div className="flex items-center justify-between">
                                <button onClick={() => incrementArticleViews(article.id)} className="inline-flex items-center gap-2 bg-[#003952] text-white px-2 py-0.5 rounded-md hover:bg-[#002a3a] text-[11px] font-semibold">
                                  Leer más <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex gap-2">
                                <a
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-full hover:bg-green-100 text-green-600 transition-colors"
                                  aria-label="Compartir en WhatsApp"
                                  onClick={(e) => e.stopPropagation()}
                                  href={`https://wa.me/?text=${encodeURIComponent(article.title + (currentUrl ? " " + currentUrl : ""))}`}
                                >
                                  <MessageSquareText className="w-5 h-5" />
                                </a>

                                <a
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-full hover:bg-blue-100 transition-colors"
                                  aria-label="Compartir en Facebook"
                                  onClick={(e) => e.stopPropagation()}
                                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&t=${encodeURIComponent(article.title)}`}
                                >
                                  <img src="/gatitoplis-CY6tDKz6.png" alt="Gatito Plis" className="w-5 h-5" />
                                </a>

                                <a target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-blue-100 text-blue-400 transition-colors" aria-label="Compartir en X" onClick={(e) => e.stopPropagation()} href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(currentUrl)}`}><Twitter className="w-5 h-5" /></a>
                                <a target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-pink-100 text-pink-600 transition-colors" aria-label="Compartir en Instagram (directo)" onClick={(e) => e.stopPropagation()} href={`https://www.instagram.com/`}><Camera className="w-5 h-5" /></a>
                              </div>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )
              })()}
            </div>

          </div>

          <div className="lg:col-span-1">
            <div className="space-y-6">
              <div className="mb-3">
                <div className="w-full flex items-center gap-2 bg-white rounded-full shadow-sm px-3 py-2 news-border">
                  <Search className="w-5 h-5 text-gray-500" />
                  <input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar noticias, videos..."
                    className="flex-1 text-sm outline-none bg-transparent"
                  />
                  {searchQuery && (
                    <button onClick={() => { setSearchQuery(""); searchInputRef.current?.focus() }} className="text-sm text-gray-500">
                      Limpiar
                    </button>
                  )}
                </div>
              </div>

              {/* Trending */}
              <div className="bg-white rounded-lg shadow-lg p-4 news-border">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Qué está pasando</h3>

                <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-sky-50 to-white flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="mt-1 text-sm font-bold text-gray-700">¡Consigue trabajo!</div>
                    <div className="mt-1 text-sm text-gray-700">Explora oportunidades relevantes ahora.</div>
                  </div>
                  <div className="flex-shrink-0">
                    <a
                      href="https://aagale.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#003952] text-white px-3 py-2 rounded-md hover:bg-yellow-700 text-sm font-semibold"
                    >
                      Visitar
                    </a>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-sky-50 to-white flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Conferencia</div>
                    <div className="text-sm text-gray-700">Congreso Internacional ANEUPI</div>
                    <div className="text-xs text-gray-500 mt-1">Participa en ponencias y paneles.</div>
                  </div>
                  <div>
                    <a
                      href="https://aneupi.com/congreso-internacional"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#003952] text-white px-3 py-2 rounded-md hover:bg-[#002a3a] text-sm font-semibold"
                    >
                      Visitar
                    </a>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-sky-50 to-white flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Cursos</div>
                    <div className="text-sm text-gray-700">Aprende Inglés o Francés con Nosotros</div>
                    <div className="text-xs text-gray-500 mt-1">Clases online, certificación y apoyo personalizado.</div>
                  </div>
                  <div>
                    <a
                      href="https://aagale.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#003952] text-white px-3 py-2 rounded-md hover:bg-[#002a3a] text-sm font-semibold"
                    >
                      Visitar
                    </a>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-sky-50 to-white flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Inversión</div>
                    <div className="text-sm text-gray-700">Conviértete en accionista</div>
                    <div className="text-xs text-gray-500 mt-1">Únete a la Institución Financiera ANEUPI y participa del crecimiento.</div>
                  </div>
                  <div>
                    <a
                      href="https://institucionfinancieraaneupi.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#003952] text-white px-3 py-2 rounded-md hover:bg-[#0d6b4f] text-sm font-semibold"
                    >
                      Visitar
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-4 news-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">A quien seguir</h3>
                </div>

                <div className="mt-3 space-y-3">
                  {followAccounts.map((acct) => (
                    <div key={acct.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                          <img src={acct.avatar} alt={acct.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900">{acct.name}</span>
                          <span className="text-xs text-gray-500">{acct.handle}</span>
                        </div>
                      </div>

                      <div>
                        <button
                          onClick={() => handleFollowClick(acct.id, acct.url)}
                          className="px-3 py-1.5 rounded-full font-medium transition-colors bg-white text-[#003952] border border-gray-200 shadow-sm hover:bg-[#003952] hover:text-white"
                        >
                          Visitar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-4">
                <h4 className="font-semibold mb-2">Acerca de TV aneupi</h4>
                <p className="text-sm text-gray-600">ANEUPI·TV - noticias, análisis y opinión.</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- NUEVAS: filas 2 y 3 de "Más Noticias" --- */}
        <div className="mt-8 w-full px-6 space-y-6">
          {[1, 2].map((rowIdx) => {
            const items = rowData[rowIdx] || []
            if (items.length === 0) return null

            const groups: typeof items[] = []
            const step = rowGroupSizes[rowIdx] // 4 for these rows
            for (let i = 0; i < items.length; i += step) groups.push(items.slice(i, i + step))
            const activeGroup = groups[Math.min(rowIndexes[rowIdx], groups.length - 1)] || groups[0] || []

            return (
              <div key={"fullrow-" + rowIdx} className="max-w-full mx-auto bg-white border-2 border-gray-200 rounded-lg p-4 relative overflow-hidden">
                <button
                  onClick={() => prevRow(rowIdx)}
                  aria-label="Anterior fila"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow hover:scale-105"
                >
                  <ArrowRight className="w-4 h-4 transform rotate-180 text-gray-600" />
                </button>

                <button
                  onClick={() => nextRow(rowIdx)}
                  aria-label="Siguiente fila"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow hover:scale-105"
                >
                  <ArrowRight className="w-4 h-4 text-gray-600" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {activeGroup.map((article, idx) => (
                    <article key={`${article.id}-r${rowIdx}-${idx}`} className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col news-border">
                      <div className="relative h-32 overflow-hidden">
                        <img src={article.image || "/placeholder.svg"} alt={article.title} className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105" />
                        <span className="absolute top-2 left-2 bg-red-600 text-white px-2 py-0.5 text-[10px] font-bold uppercase rounded">{article.category}</span>
                      </div>

                      <div className="p-3 flex-1 flex flex-col">
                        <h3 className="text-sm font-semibold mb-1 text-gray-900 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">{article.title}</h3>
                        <p className="text-gray-600 text-xs leading-normal mb-3 line-clamp-2">{article.excerpt}</p>

                        <div className="mt-auto flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-600 text-xs">
                              <button onClick={() => handleArticleVote(article.id, "like")} className="flex items-center gap-1 hover:text-blue-600 transition-colors"><ThumbsUp className="w-4 h-4" /><span>{fmt(article.likes)}</span></button>
                              <button onClick={() => handleArticleVote(article.id, "dislike")} className="flex items-center gap-1 hover:text-red-600 transition-colors"><ThumbsDown className="w-4 h-4" /><span>{fmt(article.dislikes)}</span></button>
                              <div className="flex items-center gap-1 text-xs"><Eye className="w-4 h-4" /><span>{fmt(article.views || 0)}</span></div>
                            </div>

                            <span className="text-xs text-gray-400">{article.date}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <button onClick={() => incrementArticleViews(article.id)} className="inline-flex items-center gap-2 bg-[#003952] text-white px-2 py-0.5 rounded-md hover:bg-[#002a3a] text-[11px] font-semibold">
                              Leer más <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex gap-2">
                            <a target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-green-100 text-green-600 transition-colors" aria-label="Compartir en WhatsApp" onClick={(e) => e.stopPropagation()} href={`https://wa.me/?text=${encodeURIComponent(article.title + " " + currentUrl)}`}><MessageSquareText className="w-5 h-5" /></a>
                            <a target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-blue-100 transition-colors" aria-label="Compartir en Facebook" onClick={(e) => e.stopPropagation()} href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&t=${encodeURIComponent(article.title)}`}><img src="/gatitoplis-CY6tDKz6.png" alt="Gatito Plis" className="w-5 h-5" /></a>
                            <a target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-blue-100 text-blue-400 transition-colors" aria-label="Compartir en X" onClick={(e) => e.stopPropagation()} href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(currentUrl)}`}><Twitter className="w-5 h-5" /></a>
                            <a target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-pink-100 text-pink-600 transition-colors" aria-label="Compartir en Instagram (directo)" onClick={(e) => e.stopPropagation()} href={`https://www.instagram.com/`}><Camera className="w-5 h-5" /></a>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* --- NUEVA SECCIÓN: Videos de YouTube --- */}
        <section className="mt-8 w-full px-6">

          <div className="max-w-full mx-auto news-border">
            <h2 className="text-4xl font-extrabold mb-6">Videos</h2>

            {displayVideos.length === 0 ? (
              <p className="text-gray-500 italic">No hay videos que coincidan con la búsqueda.</p>
            ) : (
              <div className="grid lg:grid-cols-3 gap-6">

                {displayVideos[0] && (
                  <div className="lg:col-span-2 bg-gray-900 text-white rounded-lg overflow-hidden shadow-md cursor-pointer group" onClick={() => openVideo(displayVideos[0].id)}>
                    <div className="relative h-96 bg-black">
                      <img src={displayVideos[0].thumbnail || "/placeholder.svg"} alt={displayVideos[0].title} className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                        <div className="bg-white/90 p-4 rounded-full">
                          <Play className="w-6 h-6 text-black" />
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold leading-tight mb-3">{displayVideos[0].title}</h3>
                      <div className="flex items-center justify-between text-sm text-gray-300">
                        <div className="flex items-center gap-3">
                          <span>{displayVideos[0].channel}</span>
                          <span className="text-gray-500">·</span>
                          <span className="text-gray-500">{displayVideos[0].date}</span>
                        </div>
                        <div className="text-gray-400 text-sm"><Eye className="w-4 h-4 inline-block mr-1" />{fmt(displayVideos[0].views)}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {displayVideos.slice(1, 6).map((v) => (
                    <div key={v.id} onClick={() => openVideo(v.id)} className="flex gap-3 items-start bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                      <div className="relative w-36 h-24 flex-shrink-0">
                        <img src={v.thumbnail || "/placeholder.svg"} alt={v.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white/90 p-2 rounded-full">
                            <Play className="w-4 h-4 text-black" />
                          </div>
                        </div>
                      </div>
                      <div className="p-3 flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">{v.title}</h4>
                        <div className="text-xs text-gray-500 mt-2 flex items-center justify-between">
                          <span>{v.channel}</span>
                          <span className="flex items-center gap-2"><Eye className="w-4 h-4" />{fmt(v.views)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* --- NUEVA SECCIÓN: Noticiero --- */}
        <section className="mt-8 w-full px-6">
          <div className="max-w-full mx-auto">
            <h2 className="text-4xl font-extrabold mb-6">Noticiero</h2>

            {displayNews.length === 0 ? (
              <p className="text-gray-500 italic">No hay resultados en el noticiero.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {displayNews.slice(0, 4).map((a) => (
                  <article key={a.id} className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer news-border" onClick={() => incrementArticleViews(a.id)}>
                    <div className="relative h-44 overflow-hidden">
                      <img src={a.image || "/placeholder.svg"} alt={a.title} className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/90 p-3 rounded-full">
                          <Play className="w-6 h-6 text-black" />
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2">{a.title}</h3>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{a.excerpt}</p>
                      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                        <span>{a.category}</span>
                        <span>{a.date}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

      </main>
      {/* CHATBOT INTERACTIVO (Recibe la data en tiempo real) */}
      <ChatBot intencionesData={intents} botName="Chat bot TV Aneupi" />

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <SiteFooter variant="minimal" />

      <style jsx>{`
        h1, h2, h3 { font-size: 25px !important; }
        p { font-size: 14px !important; }
        h3 { transition: color 200ms ease; }
        h3:hover, :global(.group:hover) h3 { color: #003952; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  )
}