"use client"

import type React from "react"
import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { usePersistedState } from "@/hooks/use-persisted-state"
import { apiPersistence } from "@/lib/api-persistence"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ChevronDown, Play, ChevronLeft, ChevronRight, MessageCircle,
  Send, ThumbsUp, ThumbsDown, Share2, Bell, Maximize, MoreVertical, User
} from 'lucide-react'
import { AuthModal } from "@/components/auth-modal"
import { OfferInterviewModal } from "@/components/offer-interview-modal"
import { ShareModal } from "@/components/share-modal"
import { MiniPlayer } from "@/components/mini-player"
import { TermsModal } from "@/components/terms-modal-tv"
import { useLanguage } from "@/contexts/language-context"
import { SiteFooter } from "@/components/site-footer"
import ChatBot from "@/app/administrador/asistente-virtual/chatBot";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

const intents = [
  { id: 1, label: "Saludo", name: "saludo", keywords: "hola, buenas", active: true, response: "Hola, ¿en qué puedo ayudar?" }
];

// Types
interface CommentReaction {
  emoji: string
  count: number
  users: string[]
}

interface CommentReply {
  id: number
  name: string
  text: string
  time: string
  reactions: CommentReaction[]
}

interface Comment {
  id: number
  name: string
  text: string
  time: string
  badge: boolean
  reactions: CommentReaction[]
  replies: CommentReply[]
}

interface ProgramItem {
  id: number
  time: string
  title: string
  description: string
}

interface Channel {
  id: number
  title: string
  description: string
  thumbnail: string
  viewers: string
  isLive: boolean
}

// Constants
const QUALITY_OPTIONS = ["1080p", "720p", "480p", "360p"]
const DAYS_TO_SHOW = 7

// Data (Fallback)
const channelComments: Record<number, Comment[]> = {
  0: [
    { id: 1, name: "ANEUPI Noticias", text: "Última hora: Nuevas medidas económicas anunciadas por el gobierno", time: "Hace 2 min", badge: true, reactions: [], replies: [] },
    { id: 2, name: "ANEUPI Noticias", text: "Actualización del clima: Se esperan lluvias para el fin de semana", time: "Hace 5 min", badge: true, reactions: [], replies: [] },
    { id: 3, name: "María López", text: "Excelente cobertura de las noticias nacionales", time: "Hace 8 min", badge: false, reactions: [], replies: [] },
    { id: 4, name: "Carlos Pérez", text: "Muy informativo el segmento sobre la economía", time: "Hace 10 min", badge: false, reactions: [], replies: [] },
    { id: 5, name: "Laura Gómez", text: "Me encanta la programación que ofrecen", time: "Hace 12 min", badge: false, reactions: [], replies: [] },
    { id: 6, name: "José Martínez", text: "Gran variedad de programas", time: "Hace 15 min", badge: false, reactions: [], replies: [] },
  ],
  1: [
    { id: 1, name: "Deportes ANEUPI", text: "¡Golazo! Increíble jugada del equipo nacional", time: "Hace 1 min", badge: true, reactions: [], replies: [] },
    { id: 2, name: "Juan Deportista", text: "Qué partidazo estamos viendo!", time: "Hace 3 min", badge: false, reactions: [], replies: [] },
  ],
  2: [
    { id: 1, name: "Cultura ANEUPI", text: "Próximamente: Entrevista con el artista del año", time: "Hace 2 min", badge: true, reactions: [], replies: [] },
  ],
  3: [
    { id: 1, name: "Política ANEUPI", text: "Debate en vivo: Reforma tributaria y su impacto", time: "Hace 1 min", badge: true, reactions: [], replies: [] },
  ],
  4: [
    { id: 1, name: "Economía ANEUPI", text: "Bolsa de valores: Análisis de cierre de mercados", time: "Hace 2 min", badge: true, reactions: [], replies: [] },
  ],
  5: [
    { id: 1, name: "Documentales ANEUPI", text: "Hoy: Especial sobre la biodiversidad del Ecuador", time: "Hace 3 min", badge: true, reactions: [], replies: [] },
  ],
}

const channelProgramming: Record<number, ProgramItem[]> = {
  0: [
    { id: 1, time: "08:15", title: "ZonaDocu", description: "Baltimore - Nueva política contra la criminalidad de bandas" },
    { id: 2, time: "09:00", title: "¿Cómo te afecta?", description: "Qué efectos tiene el fentanilo sobre el cuerpo para dejarlo como un 'zombi'" },
    { id: 3, time: "11:00", title: "Consulta popular", description: "Resultados de la consulta popular en Ecuador y su impacto político" },
    { id: 4, time: "14:00", title: "Daniel Noboa despliega el ejército en las calles de Quito ante protestas contra su Gobierno", description: "Cobertura especial de las protestas y medidas gubernamentales" },
    { id: 5, time: "17:00", title: "Entrevista con Ministro de Economía", description: "Análisis de las nuevas medidas económicas implementadas" },
  ],
  1: [
    { id: 1, time: "08:00", title: "Deportes Matutinos", description: "Resumen de los partidos internacionales de la noche anterior" },
  ],
  2: [
    { id: 1, time: "08:30", title: "Entrevistas Culturales", description: "Conversación con artistas y creadores ecuatorianos" },
  ],
  3: [
    { id: 1, time: "09:00", title: "Debate Político", description: "Análisis de la reforma tributaria y su impacto económico" },
  ],
  4: [
    { id: 1, time: "08:00", title: "Bolsa de Valores", description: "Análisis de cierre de mercados y tendencias financieras" },
  ],
  5: [
    { id: 1, time: "09:00", title: "Especial Biodiversidad", description: "Documental sobre la riqueza natural del Ecuador" },
  ],
}

const channelTranslations = {
  es: {
    channels: [
      { id: 1, title: "ANEUPI Noticias 24/7", description: "Transmisión en vivo de noticias nacionales e internacionales las 24 horas del día" },
      { id: 2, title: "Deportes en Vivo", description: "Cobertura en directo de los principales eventos deportivos del país" },
      { id: 3, title: "Cultura y Entretenimiento", description: "Programas culturales, entrevistas y entretenimiento en vivo" },
      { id: 4, title: "Debate Político", description: "Análisis y debate sobre los temas políticos más relevantes" },
      { id: 5, title: "Economía y Negocios", description: "Información financiera y análisis económico en tiempo real" },
      { id: 6, title: "Especiales Documentales", description: "Documentales y reportajes especiales sobre Ecuador y el mundo" },
    ],
  },
  en: {
    channels: [
      { id: 1, title: "ANEUPI News 24/7", description: "Live broadcast of national and international news 24 hours a day" },
      { id: 2, title: "Live Sports", description: "Direct coverage of the main sporting events in the country" },
      { id: 3, title: "Culture and Entertainment", description: "Cultural programs, interviews and live entertainment" },
      { id: 4, title: "Political Debate", description: "Analysis and debate on the most relevant political issues" },
      { id: 5, title: "Economy and Business", description: "Financial information and economic analysis in real time" },
      { id: 6, title: "Documentary Specials", description: "Documentaries and special reports about Ecuador and the world" },
    ],
  },
}

export default function TVEnVivo() {
  // Aqui va la api
  const API_URL = "Aqui va la api";

  const { language, t } = useLanguage()

  // API State
  const [fetchedChannels, setFetchedChannels] = useState<Channel[] | null>(null)

  // Modal states
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [interviewModalOpen, setInterviewModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [miniPlayerOpen, setMiniPlayerOpen] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)

  // Video player states
  const [currentChannel, setCurrentChannel] = useState(0)
  const [videoQuality, setVideoQuality] = useState("1080p")
  const [qualityMenuOpen, setQualityMenuOpen] = useState(false)
  const [commentsVisible, setCommentsVisible] = useState(true)
  const [videoInView, setVideoInView] = useState(true)

  // Comment states
  const [commentText, setCommentText] = useState("")
  const [liveComments, setLiveComments] = useState<Comment[]>([])
  const [commentVotes, setCommentVotes] = useState<Record<number, "like" | "dislike" | null>>({})
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState("")

  // Engagement states
  const [likes, setLikes] = useState(160)
  const [dislikes, setDislikes] = useState(3)
  const [userLiked, setUserLiked] = useState(false)
  const [userDisliked, setUserDisliked] = useState(false)
  const [reminderSet, setReminderSet] = useState(false)

  // UI states
  const [expandedPrograms, setExpandedPrograms] = useState<number[]>([])
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Loading state
  const [isLoading, setIsLoading] = useState(true)

  const videoPlayerRef = useRef<HTMLDivElement>(null)

  // Effect to fetch real videos/channels from Backend
  useEffect(() => {
    async function fetchRealChannels() {
      // Aqui va la api de tv-en-vivo (la lista de canales en vivo) 
      if (!API_URL || API_URL === "Aqui va la api") return;
      try {
        const response = await fetch(`${API_URL}/tv-en-vivo`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          const data = await response.json();
          // Asegúrate de que la estructura devuelta coincida con la interfaz Channel[]
          if (data && data.length > 0) {
            setFetchedChannels(data);
          }
        } else {
          console.warn("El servidor respondió con error, manteniendo los canales originales.");
        }
      } catch (error) {
        console.error("No se pudo conectar con el backend. Cargando versión original.", error);
      }
    }

    fetchRealChannels();
  }, []);

  // Format time helper
  const formatTimeAgo = useCallback((timeString: string): string => {
    if (timeString === "Ahora" || timeString === "Now") {
      return t("time.now")
    }

    const match = timeString.match(/(\d+)\s*(min|hora|día|minuto|hour|day|minute)/i)
    if (match) {
      const number = match[1]
      const unit = match[2].toLowerCase()

      let timeUnit = ""
      if (unit.includes("min")) {
        timeUnit = t("time.min")
      } else if (unit.includes("hora") || unit.includes("hour")) {
        timeUnit = number === "1" ? t("time.hour") : t("time.hours")
      } else if (unit.includes("día") || unit.includes("day")) {
        timeUnit = number === "1" ? t("time.day") : t("time.days")
      }

      return language === "es"
        ? `${t("time.ago")} ${number} ${timeUnit}`
        : `${number} ${timeUnit} ${t("time.ago")}`.trim()
    }

    return timeString
  }, [language, t])

  // Generate days array
  const days = useMemo(() => {
    const locale = language === "es" ? "es-ES" : "en-US"
    return Array.from({ length: DAYS_TO_SHOW }).map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() + i)
      return {
        date: d,
        shortWeekday: d.toLocaleDateString(locale, { weekday: "long" }),
        dayMonth: d.toLocaleDateString(locale, { day: "2-digit", month: "2-digit" }),
        fullLabel: d.toLocaleDateString(locale, {
          weekday: "long",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      }
    })
  }, [language])

  // Generate live channels (Uses fetched API data if available, otherwise fallback)
  const liveChannels: Channel[] = useMemo(() => {
    if (fetchedChannels && fetchedChannels.length > 0) {
      return fetchedChannels;
    }
    
    // Fallback a los datos originales
    return channelTranslations[language].channels.map((channel, index) => ({
      id: channel.id,
      title: channel.title,
      description: channel.description,
      thumbnail: [
        "/news-studio-broadcast.jpg",
        "/sports-stadium-live.jpg",
        "/tv-studio-entertainment.jpg",
        "/political-debate-panel.jpg",
        "/business-news-stock-market.jpg",
        "/documentary-filming.png"
      ][index],
      viewers: ["2500", "1800", "950", "1200", "680", "520"][index],
      isLive: true,
    }))
  }, [language, fetchedChannels])

  // Get top channels
  const topChannels = useMemo(() =>
    [...liveChannels]
      .sort((a, b) => Number.parseInt(b.viewers) - Number.parseInt(a.viewers))
      .slice(0, 3)
    , [liveChannels])

  // Check terms acceptance
  useEffect(() => {
    async function loadTermsAcceptance() {
      try {
        const accepted = await apiPersistence.getSinglePreference("tvLiveTermsAccepted")
        setTermsAccepted(accepted === true || accepted === "true")
        setShowTermsModal(accepted !== true && accepted !== "true")
      } catch (error) {
        console.error("Error loading terms acceptance from API:", error)
        // Fallback a localStorage
        try {
          const stored = localStorage.getItem("tvLiveTermsAccepted")
          setTermsAccepted(stored === "true")
          setShowTermsModal(stored !== "true")
        } catch (fallbackError) {
          console.error("Error loading terms acceptance from localStorage:", fallbackError)
          setShowTermsModal(true)
        }
      }
    }

    loadTermsAcceptance()
  }, [])

  // Handle scroll for mini player
  useEffect(() => {
    const handleScroll = () => {
      if (!videoPlayerRef.current) return

      const rect = videoPlayerRef.current.getBoundingClientRect()
      const isOutOfView = rect.top + rect.height * 0.3 < 0

      setVideoInView(!isOutOfView)
      setMiniPlayerOpen(isOutOfView)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Update comments when channel changes
  useEffect(() => {
    setLiveComments(channelComments[currentChannel] || [])
    setLikes(Math.floor(Math.random() * 300) + 100)
    setDislikes(Math.floor(Math.random() * 10) + 1)
    setUserLiked(false)
    setUserDisliked(false)
  }, [currentChannel])

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  // Handlers
  const handleTermsAccept = useCallback(() => {
    setTermsAccepted(true)
    setShowTermsModal(false)
  }, [])

  const handleCommentSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoggedIn) {
      window.location.assign("https://aagale.com/inicio-sesion")
      return
    }
    if (commentText.trim()) {
      const newComment: Comment = {
        id: liveComments.length + 1,
        name: "Usuario anónimo",
        text: commentText,
        time: "Ahora",
        badge: false,
        reactions: [],
        replies: [],
      }
      setLiveComments([newComment, ...liveComments])
      setCommentText("")
    }
  }, [isLoggedIn, commentText, liveComments])

  const toggleLike = useCallback(() => {
    setLikes(prev => userLiked ? prev - 1 : prev + 1)
    setUserLiked(prev => !prev)
    if (!userLiked && userDisliked) {
      setDislikes(prev => prev - 1)
      setUserDisliked(false)
    }
  }, [userLiked, userDisliked])

  const toggleDislike = useCallback(() => {
    setDislikes(prev => userDisliked ? prev - 1 : prev + 1)
    setUserDisliked(prev => !prev)
    if (!userDisliked && userLiked) {
      setLikes(prev => prev - 1)
      setUserLiked(false)
    }
  }, [userLiked, userDisliked])

  const handleFullscreen = useCallback(() => {
    const videoElement = document.getElementById("video-player")
    if (!videoElement) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      videoElement.requestFullscreen()
    }
  }, [])

  const toggleCommentVote = useCallback((commentId: number, type: "like" | "dislike") => {
    setCommentVotes(prev => ({
      ...prev,
      [commentId]: prev[commentId] === type ? null : type
    }))
  }, [])

  const handleReplySubmit = useCallback((e: React.FormEvent, commentId: number) => {
    e.preventDefault()
    if (!isLoggedIn) {
      window.location.href = "https://aagale.com/inicio-sesion"
      return
    }
    if (replyText.trim()) {
      setLiveComments(comments =>
        comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [
                ...comment.replies,
                {
                  id: Date.now(),
                  name: "Usuario anónimo",
                  text: replyText,
                  time: "Ahora",
                  reactions: [],
                },
              ],
            }
          }
          return comment
        }),
      )
      setReplyText("")
      setReplyingTo(null)
    }
  }, [isLoggedIn, replyText])

  const scrollCarousel = useCallback((direction: "left" | "right") => {
    const carousel = document.getElementById("channels-carousel")
    if (carousel) {
      carousel.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      })
    }
  }, [])

  const toggleProgramExpanded = useCallback((programId: number) => {
    setExpandedPrograms(prev =>
      prev.includes(programId) ? prev.filter(id => id !== programId) : [...prev, programId]
    )
  }, [])

  if (!termsAccepted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader activeSection="tv-en-vivo" />
        <TermsModal isOpen={showTermsModal} onAccept={handleTermsAccept} />
      </div>
    )
  }

  // Prevención de error por si se está renderizando antes de que los canales se procesen
  if (!liveChannels || liveChannels.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <SiteHeader activeSection="tv-en-vivo" />

      <main className="container mx-auto px-4 py-4 md:py-8 lg:py-12">
        {/* Video Player and Programming Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-8">
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col h-full">
            {/* Video Player */}
            <div
              ref={videoPlayerRef}
              className="bg-white rounded-lg overflow-hidden shadow-lg mb-6 h-80 md:h-[500px] lg:h-[540px]"
            >
              <div id="video-player" className="relative w-full h-full overflow-hidden rounded-t-lg">
                <img
                  src={liveChannels[currentChannel]?.thumbnail}
                  alt={liveChannels[currentChannel]?.title}
                  className="w-full h-full object-cover"
                />

                {/* Live Badge and Quality */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className="bg-red-600 text-white px-4 py-2 text-sm font-bold uppercase rounded flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-white rounded-full" />
                      <span>{t("live.liveNow")}</span>
                    </div>
                    <div className="w-px h-4 bg-white/30" />
                    <div className="flex items-center gap-1 text-white/90">
                      <User className="w-4 h-4" />
                      <span>{liveChannels[currentChannel]?.viewers}</span>
                    </div>
                  </div>
                  <div className="bg-black/70 text-white px-2 py-1 text-xs rounded w-fit">
                    {videoQuality}
                  </div>
                </div>

                {/* Share Button */}
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShareModalOpen(true)
                    }}
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-all duration-200 text-white backdrop-blur-sm"
                    aria-label={t("general.share")}
                  >
                    <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                    <Play className="w-10 h-10 text-gray-900 ml-1" />
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button
                    onClick={handleFullscreen}
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-all duration-200 text-white backdrop-blur-sm"
                    aria-label={t("button.fullscreen")}
                  >
                    <Maximize className="w-4 h-4 md:w-5 md:h-5" />
                  </button>

                  <button
                    onClick={() => setCommentsVisible(!commentsVisible)}
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-all duration-200 text-white backdrop-blur-sm"
                    aria-label={commentsVisible ? t("button.hideComments") : t("button.showComments")}
                  >
                    <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                  </button>

                  {/* Quality Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setQualityMenuOpen(!qualityMenuOpen)}
                      className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-all duration-200 text-white backdrop-blur-sm"
                      aria-label="Calidad de video"
                    >
                      <MoreVertical className="w-4 h-4 md:w-5 md:h-5" />
                    </button>

                    {qualityMenuOpen && (
                      <div className="absolute bottom-12 right-0 bg-black/90 backdrop-blur-sm rounded-lg border border-white/20 shadow-xl p-2 w-32 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-200">
                        <div className="text-white/60 text-xs font-semibold px-3 py-1.5 border-b border-white/10">
                          {t("quality.title")}
                        </div>
                        {QUALITY_OPTIONS.map((quality) => (
                          <button
                            key={quality}
                            onClick={() => {
                              setVideoQuality(quality)
                              setQualityMenuOpen(false)
                            }}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${videoQuality === quality
                              ? "bg-white/20 text-white"
                              : "text-white/80 hover:bg-white/10 hover:text-white"
                              }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{quality}</span>
                              {videoQuality === quality && (
                                <span className="text-green-400">✓</span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Video Title & Description */}
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 text-gray-900 leading-tight">
              {liveChannels[currentChannel]?.title}
            </h1>
            <p className="text-sm md:text-base text-gray-900 mb-4">
              {liveChannels[currentChannel]?.description}
            </p>

            {/* Engagement Buttons (con loading) */}
            {isLoading ? (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-28 bg-gray-200 rounded animate-pulse" />
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={toggleLike}
                    className={`bg-white border-2 border-white text-[#003952] px-3 py-2 rounded-md hover:bg-gray-50 transition-colors font-semibold text-sm flex items-center gap-2 shadow-sm ${userLiked ? "shadow-md" : ""}`}
                  >
                    <ThumbsUp className="w-5 h-5" />
                    <span className="hidden sm:inline">{likes}</span>
                  </button>

                  <button
                    onClick={toggleDislike}
                    className={`bg-white border-2 border-white text-[#003952] px-3 py-2 rounded-md hover:bg-gray-50 transition-colors font-semibold text-sm flex items-center gap-2 shadow-sm ${userDisliked ? "shadow-md" : ""}`}
                  >
                    <ThumbsDown className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={() => setShareModalOpen(true)}
                  className="bg-white border-2 border-white text-[#003952] px-3 py-2 rounded-md hover:bg-gray-50 transition-colors font-semibold text-sm flex items-center gap-2 shadow-sm"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="hidden sm:inline">{t("general.share")}</span>
                </button>

                <button
                  onClick={() => setReminderSet(prev => !prev)}
                  className={`bg-white border-2 border-white text-[#003952] px-3 py-2 rounded-md hover:bg-gray-50 transition-colors font-semibold text-sm shadow-sm ${reminderSet ? "shadow-md" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    <span className="hidden sm:inline">
                      {reminderSet ? t("live.reminding") : t("live.remindNext")}
                    </span>
                  </div>
                </button>
              </div>
            )}

            {/* Programming Section */}
            <div className="mb-8 bg-white rounded-lg shadow-lg overflow-hidden h-96 md:h-[560px] lg:h-[600px] flex flex-col">
              <div className="bg-[#003952] py-1 px-2 flex-shrink-0">
                <h2 className="text-sm md:text-base lg:text-lg font-semibold text-white mb-1.5">
                  {t("live.schedule")}
                </h2>
                <div className="text-[11px] md:text-xs text-yellow-400 mb-1 font-medium">
                  {days[selectedDayIndex]?.fullLabel}
                </div>
              </div>

              {/* Day Selector */}
              <div className="px-4 py-2 border-b bg-white flex-shrink-0">
                <div className="grid grid-cols-7 gap-1.5 md:gap-2">
                  {days.map((d, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedDayIndex(idx)}
                      className={`w-full rounded-md flex flex-col items-center justify-center text-xs md:text-sm transition-colors py-1.5 md:py-2 ${selectedDayIndex === idx
                        ? "bg-[#003952] text-white font-semibold shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      <span className="uppercase text-[9px] md:text-[10px]">{d.shortWeekday}</span>
                      <span className="text-xs md:text-sm font-medium mt-0.5">{d.dayMonth}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Programs List */}
              <div className="divide-y divide-gray-100 flex-1 overflow-y-auto">
                {(channelProgramming[currentChannel] || []).map((program) => (
                  <div key={program.id} className="bg-white hover:bg-gray-50 transition-colors">
                    <button
                      onClick={() => toggleProgramExpanded(program.id)}
                      className="w-full flex items-start gap-2 md:gap-4 p-3 md:p-4"
                    >
                      <div className="flex items-start gap-2 md:gap-4 flex-1 min-w-0">
                        <div className="text-right font-medium text-[#003952] whitespace-nowrap text-xs md:text-sm">
                          {program.time}
                        </div>
                        <div className="w-1 bg-[#003952] rounded-full h-12 flex-shrink-0 mt-1" />
                        <div className="flex-1 min-w-0 text-left">
                          <h3 className="font-semibold text-sm md:text-base text-gray-900 leading-tight">
                            {program.title}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-600 mt-1">{program.description}</p>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 md:w-6 md:h-6 text-gray-400 flex-shrink-0 transition-transform ${expandedPrograms.includes(program.id) ? "rotate-180" : ""
                            }`}
                        />
                      </div>
                    </button>

                    {expandedPrograms.includes(program.id) && (
                      <div className="px-4 pb-3 pt-1 ml-12 md:ml-20">
                        <div className="bg-gray-50 rounded-lg p-2 md:p-2.5">
                          <div className="flex gap-2">
                            <Button
                              onClick={() => setReminderSet(true)}
                              className="bg-[#003952] text-white px-2.5 py-1.5 rounded-md hover:bg-[#002a3a] transition-colors font-semibold text-xs flex items-center"
                            >
                              <Bell className="w-3.5 h-3.5 mr-1.5" />
                              {t("live.remindStart")}
                            </Button>
                            <Button
                              onClick={() => setShareModalOpen(true)}
                              className="bg-gray-200 text-gray-700 px-2.5 py-1.5 rounded-md hover:bg-gray-300 transition-colors text-xs flex items-center"
                            >
                              <Share2 className="w-3.5 h-3.5 mr-1.5" />
                              {t("general.share")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Comments & Featured */}
          <div className="lg:col-span-1 flex flex-col gap-4 md:gap-6 lg:gap-8 h-full">
            {/* Comments Section */}
            {commentsVisible && (
              <div className="bg-white rounded-lg overflow-hidden shadow-lg flex flex-col h-80 md:h-[500px] lg:h-[540px]">
                {/* Chat Header */}
                <div className="bg-[#003952] p-1.5 md:p-2 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs md:text-sm lg:text-base font-semibold flex items-center gap-2 text-white">
                      <MessageCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      {t("live.chat")}
                    </h3>
                    <p className="text-[10px] text-white/80">
                      {liveComments.length} {liveComments.length === 1 ? t("comments.count.singular") : t("comments.count")}
                    </p>
                  </div>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-2 md:p-2.5 space-y-0 bg-white">
                  {liveComments.map((comment, index) => (
                    <div key={comment.id}>
                      <div className="py-1.5">
                        <div className="flex gap-2">
                          {/* Avatar */}
                          <div className="flex-shrink-0">
                            <div className="w-7 h-7 md:w-8 md:h-8 bg-white border-2 border-[#003952] rounded-full flex items-center justify-center text-[#003952] font-bold text-xs">
                              {comment.name.charAt(0).toUpperCase()}
                            </div>
                          </div>

                          {/* Comment Content */}
                          <div className="flex-1 min-w-0">
                            {/* Header */}
                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                              <span className={`text-xs font-semibold ${comment.badge ? "text-[#003952]" : "text-gray-900"}`}>
                                {comment.name}
                              </span>
                              {comment.badge && (
                                <span className="bg-white border-2 border-[#003952] text-[#003952] text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                                  ANEUPI
                                </span>
                              )}
                              <span className="text-[10px] text-gray-500">{formatTimeAgo(comment.time)}</span>
                            </div>

                            {/* Comment Text */}
                            <p className="text-xs text-gray-700 leading-snug mb-1">{comment.text}</p>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleCommentVote(comment.id, "like")}
                                className={`p-1 transition-colors ${commentVotes[comment.id] === "like"
                                  ? "text-yellow-500"
                                  : "text-[#003952] hover:text-[#002a3a]"
                                  }`}
                              >
                                <ThumbsUp className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => toggleCommentVote(comment.id, "dislike")}
                                className={`p-1 transition-colors ${commentVotes[comment.id] === "dislike"
                                  ? "text-yellow-500"
                                  : "text-[#003952] hover:text-[#002a3a]"
                                  }`}
                              >
                                <ThumbsDown className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => setReplyingTo(comment.id)}
                                className="text-[10px] text-gray-600 hover:text-[#003952] transition-colors font-medium"
                              >
                                {t("live.reply")}
                              </button>
                            </div>

                            {/* Replies */}
                            {comment.replies.length > 0 && (
                              <div className="mt-1.5 space-y-1.5 pl-3 border-l-2 border-gray-200">
                                {comment.replies.map((reply) => (
                                  <div key={reply.id} className="flex gap-2">
                                    <div className="flex-shrink-0">
                                      <div className="w-6 h-6 bg-white border-2 border-gray-400 rounded-full flex items-center justify-center text-gray-600 font-bold text-[10px]">
                                        {reply.name.charAt(0).toUpperCase()}
                                      </div>
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-1.5 mb-0.5">
                                        <span className="text-[10px] font-semibold text-gray-900">{reply.name}</span>
                                        <span className="text-[9px] text-gray-500">{formatTimeAgo(reply.time)}</span>
                                      </div>
                                      <p className="text-[11px] text-gray-700 leading-snug">{reply.text}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Reply Form */}
                            {replyingTo === comment.id && (
                              <form
                                onSubmit={(e) => handleReplySubmit(e, comment.id)}
                                className="mt-1.5 pl-3 border-l-2 border-[#003952]"
                              >
                                <div className="flex gap-1.5">
                                  <Input
                                    placeholder={t("live.writeReply")}
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="flex-1 bg-gray-50 border-gray-300 text-gray-900 text-[11px] h-8 focus:border-[#003952] focus:ring-[#003952]"
                                  />
                                  <Button
                                    type="submit"
                                    className="bg-[#003952] text-white px-2 py-1 rounded-md hover:bg-[#002a3a] transition-colors font-medium text-[11px] h-8 shadow-sm"
                                  >
                                    {t("general.send")}
                                  </Button>
                                </div>
                              </form>
                            )}
                          </div>
                        </div>
                      </div>

                      {index < liveComments.length - 1 && (
                        <div className="border-b border-[#003952]/20" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-1.5 md:p-2 border-t border-gray-200 bg-gray-50">
                  <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-1">
                    <div className="flex-shrink-0">
                      <div className="w-7 h-7 bg-white border-2 border-gray-400 rounded-full flex items-center justify-center text-gray-600 font-bold text-xs">
                        U
                      </div>
                    </div>
                    <Input
                      placeholder={t("live.typePlaceholder")}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="flex-1 bg-white border-gray-300 text-gray-900 text-xs h-7 focus:border-[#003952] focus:ring-[#003952]"
                    />
                    <Button
                      type="submit"
                      className="bg-[#003952] text-white px-2.5 py-1.5 rounded-md hover:bg-[#002a3a] transition-colors font-semibold text-xs shadow-sm h-7"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </Button>
                  </form>
                  <p className="text-[9px] text-gray-500 pl-9">{t("live.loginToComment")}</p>
                </div>
              </div>
            )}

            {/* Featured Channels */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg h-[35rem] md:h-[700px] lg:h-[750px] flex flex-col">
              <div className="bg-[#003952] py-1 px-2 flex-shrink-0">
                <h2 className="text-xs md:text-sm lg:text-base font-semibold text-white">
                  {t("live.featured")}
                </h2>
              </div>
              <div className="p-3 md:p-4 space-y-3 md:space-y-4 flex-1 overflow-y-auto">

                {topChannels.map((channel) => (
                  <article
                    key={channel.id}
                    className="group flex-shrink-0 bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg cursor-pointer flex flex-col"
                    onClick={() => {
                      setCurrentChannel(liveChannels.findIndex((c) => c.id === channel.id))
                      setMiniPlayerOpen(true)
                    }}
                  >
                    <div className="relative h-28 md:h-32 overflow-hidden">
                      <img
                        src={channel.thumbnail}
                        alt={channel.title}
                        className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className="absolute top-2 md:top-3 left-2 md:left-3 bg-red-600 text-white px-2 py-0.5 text-xs font-bold uppercase rounded flex items-center gap-1">
                        {t("live.popular")}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShareModalOpen(true)
                        }}
                        className="absolute top-2 md:top-3 right-2 md:right-3 bg-yellow-400 border-2 border-yellow-500 text-[#003952] p-1.5 rounded flex items-center justify-center hover:bg-yellow-300 transition-colors shadow-md"
                        aria-label={t("general.share")}
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="p-2.5 md:p-3">
                      <h3 className="font-bold text-xs md:text-sm mb-1 line-clamp-2">{channel.title}</h3>
                      <p className="text-gray-600 text-[11px] md:text-xs">
                        {new Intl.NumberFormat('en-US').format(Number(channel.viewers))} {t("live.viewers")}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Available Channels Carousel */}
        <div className="mb-8 w-full">
          <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-4 md:mb-5 text-gray-900">
            {t("live.availableChannels")}
          </h3>
          <div className="relative">
            <button
              onClick={() => scrollCarousel("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-black/60 border-2 border-[#003952]/40 rounded-lg shadow-lg hover:bg-black/70 transition-colors text-white backdrop-blur-sm"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={() => scrollCarousel("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-black/60 border-2 border-[#003952]/40 rounded-lg shadow-lg hover:bg-black/70 transition-colors text-white backdrop-blur-sm"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <div
              id="channels-carousel"
              className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-hide scroll-smooth px-12 md:px-14 py-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {liveChannels.map((channel, index) => (
                <article
                  key={channel.id}
                  className="group flex-shrink-0 w-72 md:w-80 lg:w-96 bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg cursor-pointer flex flex-col transition-transform duration-200 hover:scale-105"
                  onClick={() => {
                    setCurrentChannel(index)
                    setMiniPlayerOpen(true)
                  }}
                >
                  <div className="relative h-40 md:h-44 overflow-hidden">
                    <img
                      src={channel.thumbnail}
                      alt={channel.title}
                      className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                    />
                    <span className="absolute top-3 left-3 bg-red-600 text-white px-2 md:px-3 py-1 text-xs font-bold uppercase rounded flex items-center gap-1.5 shadow-lg">
                      {t("live.liveNow")}
                    </span>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 md:p-3">
                      <div className="flex items-center gap-2 text-white text-xs md:text-sm">
                        <User className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="font-semibold">{channel.viewers}</span>
                        <span className="text-xs opacity-90">{t("live.viewers")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3.5 md:p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-sm md:text-base mb-2 line-clamp-2">{channel.title}</h3>
                    <p className="text-gray-600 text-xs md:text-sm line-clamp-2 flex-1">{channel.description}</p>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between gap-2">
                        <button
                          className="text-[#003952] hover:text-[#002a3a] font-semibold text-xs md:text-sm flex items-center gap-2 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            setCurrentChannel(index)
                            setMiniPlayerOpen(true)
                          }}
                        >
                          <Play className="w-4 h-4" />
                          <span>{t("live.watch")}</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleLike()
                            }}
                            className={`p-1.5 transition-colors ${userLiked ? "text-yellow-500" : "text-[#003952] hover:text-[#002a3a]"
                              }`}
                            aria-label="Me gusta"
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleDislike()
                            }}
                            className={`p-1.5 transition-colors ${userDisliked ? "text-yellow-500" : "text-[#003952] hover:text-[#002a3a]"
                              }`}
                            aria-label="No me gusta"
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setShareModalOpen(true)
                            }}
                            className="text-[#003952] hover:text-[#002a3a] p-1.5 transition-colors"
                            aria-label={t("general.share")}
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <OfferInterviewModal isOpen={interviewModalOpen} onClose={() => setInterviewModalOpen(false)} />
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={liveChannels[currentChannel]?.title}
      />
      <MiniPlayer
        isOpen={miniPlayerOpen}
        onClose={() => setMiniPlayerOpen(false)}
        channel={liveChannels[currentChannel]}
      />

      {/* Floating Interview Button */}
      <button
        onClick={() => setInterviewModalOpen(true)}
        className="fixed top-24 right-2 z-40 bg-red-600 text-white px-2 md:px-3 py-1 md:py-2 rounded-md shadow-xl transition-colors duration-200 flex items-center gap-2 border-2 border-[#003952] hover:bg-red-700 font-semibold text-xs md:text-sm"
      >
        <span className="text-lg md:text-xl">🎙️</span>
        <span className="hidden sm:inline">{t("interview.offer")}</span>
      </button>

      {/* CHATBOT INTERACTIVO (Recibe la data en tiempo real) */}
      <ChatBot intencionesData={intents} botName="Chat bot TV Aneupi" />
      
      {/* Footer */}
      <SiteFooter variant="minimal" />
    </div>
  )
}