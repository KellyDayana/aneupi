"use client"

import type React from "react"
import { useState, useEffect, useMemo, useRef } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  X,
  Film,
  User,
  ChevronDown,
  Music,
  Newspaper,
  Globe,
  Leaf,
  Sparkles,
  Mail,
  Star,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Check,
  MessageCircle,
  Send,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  MoreVertical,
  Maximize,
  Settings,
  Copy,
  Link as LinkIcon,
  Scissors,
  Trophy, // <-- 1. Importar nuevos iconos
  Heart,
} from "lucide-react"
import Link from "next/link"
import { AuthModal } from "@/components/auth-modal"

// --- (Componentes de iconos SVG sin cambios) ---
const WhatsAppIcon = () => (<svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>)
const FacebookIcon = () => (<svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>)
const XIcon = () => (<svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>)
const PipIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18 8V2H12" /><path d="M22 2L12 12" /></svg>)

// Interfaces
interface FloatingReaction { id: number; emoji: string; x: number; }
type SocialShareButton = { name: string; icon: React.ReactNode; bgColor: string; hoverBgColor: string; textColor: string; action: () => void; }

type Language = "es" | "en" | "fr" | "pt";
interface Clip {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  channelTitle: { [key in Language]: string };
  creator: string;
  likes: number;
}

// Traducciones (con nuevas adiciones)
const fullTranslations = {
  es: {
    menu: "Menu", latest: "LO ÚLTIMO", news: "NOTICIAS", world: "MUNDO", ecuaterra: "ECUATERRA", style: "ESTILO", newsletters: "NEWSLETTERS", specials: "ESPECIALES", entertainment: "ENTRETENIMIENTO", cinema: "Cine", music: "Música", countryNewsTitle: "Noticias por País", countryNewsSubtitle: "Selecciona tu país", live: "EN VIVO", viewers: "espectadores", share: "Compartir", save: "Guardar", fullscreen: "Ver en pantalla completa", pip: "Picture-in-Picture", exitPip: "Salir de PiP", quality: "Calidad de transmisión", liveComments: "Comentarios en vivo", commentPlaceholder: "Escribe un mensaje...", anonymousMode: 'Modo anónimo activado. Tus mensajes aparecerán como "Usuario anónimo".', availableChannels: "Canales Disponibles", previous: "Anterior", next: "Siguiente", shareModalTitle: "¡Comparte la transmisión!", insert: "Insertar", copy: "Copiar", copied: "¡Copiado!", shareMessage: "¡Mira esto!:",
    clip: "Clip", createClip: "Generar Clip", cancel: "Cancelar", clipInstructions: "Arrastra para seleccionar un momento (máx. 10s)", yourClipReady: "¡Tu clip está listo!", shareClip: "Compartir Clip", clipFrom: "Clip de:", clipTitleLabel: "Título del clip", clipTitleEmptyError: "El título no puede estar vacío.", clipTitleOffensiveError: "El título contiene palabras no permitidas. Por favor, elige otro.",
    topClips: "Top Clips", by: "por", likes: "likes", noClipsYet: "Aún no se han generado clips. ¡Sé el primero!", onChannel: "en"
  },
  en: {
    menu: "Menu", latest: "LATEST", news: "NEWS", world: "WORLD", ecuaterra: "ECUATERRA", style: "STYLE", newsletters: "NEWSLETTERS", specials: "SPECIALS", entertainment: "ENTERTAINMENT", cinema: "Cinema", music: "Music", countryNewsTitle: "News by Country", countryNewsSubtitle: "Select your country", live: "LIVE", viewers: "viewers", share: "Share", save: "Save", fullscreen: "View in fullscreen", pip: "Picture-in-Picture", exitPip: "Exit PiP", quality: "Streaming Quality", liveComments: "Live Comments", commentPlaceholder: "Write a message...", anonymousMode: 'Anonymous mode activated. Your messages will appear as "Anonymous User".', availableChannels: "Available Channels", previous: "Previous", next: "Next", shareModalTitle: "Share the stream!", insert: "Embed", copy: "Copy", copied: "Copied!", shareMessage: "Check this out!:",
    clip: "Clip", createClip: "Generate Clip", cancel: "Cancel", clipInstructions: "Drag to select a moment (max 10s)", yourClipReady: "Your clip is ready!", shareClip: "Share Clip", clipFrom: "Clip from:", clipTitleLabel: "Clip title", clipTitleEmptyError: "Title cannot be empty.", clipTitleOffensiveError: "The title contains inappropriate words. Please choose another one.",
    topClips: "Top Clips", by: "by", likes: "likes", noClipsYet: "No clips have been generated yet. Be the first!", onChannel: "on"
  },
  // ... (Traducciones para 'fr' y 'pt' actualizadas)
  fr: { menu: "Menu", latest: "À LA UNE", news: "ACTUALITÉS", world: "MONDE", ecuaterra: "ECUATERRA", style: "STYLE", newsletters: "NEWSLETTERS", specials: "SPÉCIAUX", entertainment: "DIVERTISSEMENT", cinema: "Cinéma", music: "Musique", countryNewsTitle: "Actualités par Pays", countryNewsSubtitle: "Sélectionnez votre pays", live: "EN DIRECT", viewers: "spectateurs", share: "Partager", save: "Enregistrer", fullscreen: "Voir en plein écran", pip: "Picture-in-Picture", exitPip: "Quitter PiP", quality: "Qualité de diffusion", liveComments: "Commentaires en direct", commentPlaceholder: "Écrivez un message...", anonymousMode: 'Mode anonyme activé. Vos messages apparaîtront en tant que "Utilisateur anonyme".', availableChannels: "Chaînes Disponibles", previous: "Précédent", next: "Suivant", shareModalTitle: "Partagez la diffusion !", insert: "Intégrer", copy: "Copier", copied: "Copié !", shareMessage: "Regarde ça !:", clip: "Clip", createClip: "Générer le clip", cancel: "Annuler", clipInstructions: "Faites glisser pour sélectionner un moment (max 10s)", yourClipReady: "Votre clip est prêt !", shareClip: "Partager le clip", clipFrom: "Clip de :", clipTitleLabel: "Titre du clip", clipTitleEmptyError: "Le titre ne peut pas être vide.", clipTitleOffensiveError: "Le titre contient des mots inappropriés. Veuillez en choisir un autre.", topClips: "Top Clips", by: "par", likes: "J'aime", noClipsYet: "Aucun clip n'a encore été généré. Soyez le premier !", onChannel: "sur" },
  pt: { menu: "Menu", latest: "ÚLTIMAS", news: "NOTÍCIAS", world: "MUNDO", ecuaterra: "ECUATERRA", style: "ESTILO", newsletters: "NEWSLETTERS", specials: "ESPECIAIS", entertainment: "ENTRETENIMENTO", cinema: "Cinema", music: "Música", countryNewsTitle: "Notícias por País", countryNewsSubtitle: "Selecione seu país", live: "AO VIVO", viewers: "espectadores", share: "Compartilhar", save: "Salvar", fullscreen: "Ver em tela cheia", pip: "Picture-in-Picture", exitPip: "Sair do PiP", quality: "Qualidade de transmissão", liveComments: "Comentários ao vivo", commentPlaceholder: "Escreva uma mensagem...", anonymousMode: 'Modo anônimo ativado. Suas mensagens aparecerão como "Usuário anônimo".', availableChannels: "Canais Disponíveis", previous: "Anterior", next: "Próximo", shareModalTitle: "Compartilhe a transmissão!", insert: "Incorporar", copy: "Copiar", copied: "Copiado!", shareMessage: "Confira isso!:", clip: "Clipe", createClip: "Gerar Clipe", cancel: "Cancelar", clipInstructions: "Arraste para selecionar um momento (máx. 10s)", yourClipReady: "Seu clipe está pronto!", shareClip: "Compartilhar Clipe", clipFrom: "Clipe de:", clipTitleLabel: "Título do clipe", clipTitleEmptyError: "O título não pode estar vazio.", clipTitleOffensiveError: "O título contém palavras inadequadas. Por favor, escolha outro.", topClips: "Top Clipes", by: "por", likes: "curtidas", noClipsYet: "Nenhum clipe foi gerado ainda. Seja o primeiro!", onChannel: "em" },
}
// --- (channelComments, fullLiveChannels, badWords sin cambios) ---
const channelComments = { 0: [{ id: 1, name: "ANEUPI Noticias", text: "Última hora: Nuevas medidas económicas anunciadas por el gobierno", time: "Hace 2 min", badge: !0 }, { id: 2, name: "ANEUPI Noticias", text: "Actualización del clima: Se esperan lluvias para el fin de semana", time: "Hace 5 min", badge: !0 }, { id: 3, name: "María López", text: "Excelente cobertura de las noticias nacionales", time: "Hace 8 min", badge: !1 }, { id: 4, name: "ANEUPI Noticias", text: "Entrevista exclusiva con el ministro de economía a las 8 PM", time: "Hace 12 min", badge: !0 }, { id: 5, name: "Carlos Ruiz", text: "Muy profesional la transmisión 👏", time: "Hace 15 min", badge: !1 }], 1: [{ id: 1, name: "Deportes ANEUPI", text: "¡Golazo! Increíble jugada del equipo nacional", time: "Hace 1 min", badge: !0 }, { id: 2, name: "Juan Deportista", text: "Qué partidazo estamos viendo!", time: "Hace 3 min", badge: !1 }, { id: 3, name: "Deportes ANEUPI", text: "Estadísticas del partido en tiempo real disponibles en nuestra app", time: "Hace 6 min", badge: !0 }, { id: 4, name: "Ana Futbolera", text: "El mejor canal deportivo sin duda", time: "Hace 10 min", badge: !1 }, { id: 5, name: "Pedro Sánchez", text: "Vamos Ecuador! 🇪🇨⚽", time: "Hace 14 min", badge: !1 }], 2: [{ id: 1, name: "Cultura ANEUPI", text: "Próximamente: Entrevista con el artista del año", time: "Hace 2 min", badge: !0 }, { id: 2, name: "Laura Artista", text: "Me encanta este programa cultural", time: "Hace 5 min", badge: !1 }, { id: 3, name: "Cultura ANEUPI", text: "Recuerden seguirnos en redes sociales para más contenido", time: "Hace 8 min", badge: !0 }, { id: 4, name: "Roberto Músico", text: "Excelente selección musical", time: "Hace 12 min", badge: !1 }, { id: 5, name: "Sofía Cultural", text: "Gracias por promover la cultura ecuatoriana", time: "Hace 18 min", badge: !1 }], 3: [{ id: 1, name: "Política ANEUPI", text: "Debate en vivo: Reforma tributaria y su impacto", time: "Hace 1 min", badge: !0 }, { id: 2, name: "Miguel Analista", text: "Muy buen análisis político", time: "Hace 4 min", badge: !1 }, { id: 3, name: "Política ANEUPI", text: "Participen con sus preguntas usando #DebateANEUPI", time: "Hace 7 min", badge: !0 }, { id: 4, name: "Carmen Ciudadana", text: "Necesitamos más espacios de debate como este", time: "Hace 11 min", badge: !1 }, { id: 5, name: "José Político", text: "Información clara y objetiva 👍", time: "Hace 16 min", badge: !1 }], 4: [{ id: 1, name: "Economía ANEUPI", text: "Bolsa de valores: Análisis de cierre de mercados", time: "Hace 2 min", badge: !0 }, { id: 2, name: "Inversora Pro", text: "Datos muy útiles para mis inversiones", time: "Hace 5 min", badge: !1 }, { id: 3, name: "Economía ANEUPI", text: "Próximo segmento: Criptomonedas y su regulación", time: "Hace 9 min", badge: !0 }, { id: 4, name: "Empresario Digital", text: "El mejor canal de economía y finanzas", time: "Hace 13 min", badge: !1 }, { id: 5, name: "Analista Financiero", text: "Información precisa y actualizada", time: "Hace 17 min", badge: !1 }], 5: [{ id: 1, name: "Documentales ANEUPI", text: "Hoy: Especial sobre la biodiversidad del Ecuador", time: "Hace 3 min", badge: !0 }, { id: 2, name: "Naturaleza Fan", text: "Impresionantes imágenes de la Amazonía", time: "Hace 6 min", badge: !1 }, { id: 3, name: "Documentales ANEUPI", text: "Este documental ganó el premio internacional", time: "Hace 10 min", badge: !0 }, { id: 4, name: "Ecologista Verde", text: "Contenido educativo de primera calidad", time: "Hace 14 min", badge: !1 }, { id: 5, name: "Estudiante Curioso", text: "Perfecto para mi proyecto de biología", time: "Hace 19 min", badge: !1 }] }
const fullLiveChannels = [{ title: { es: "ANEUPI Noticias 24/7", en: "ANEUPI News 24/7", fr: "ANEUPI Actualités 24/7", pt: "ANEUPI Notícias 24/7" }, description: { es: "Transmisión en vivo de noticias nacionales e internacionales las 24 horas del día", en: "Live broadcast of national and international news 24 hours a day", fr: "Diffusion en direct des actualités nationales et internationales 24 heures sur 24", pt: "Transmissão ao vivo de notícias nacionais e internacionais 24 horas por dia" }, thumbnail: "/news-studio-broadcast.jpg", viewers: "2.5K", isLive: !0, streamUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" }, { title: { es: "Deportes en Vivo", en: "Live Sports", fr: "Sports en Direct", pt: "Esportes ao Vivo" }, description: { es: "Cobertura en directo de los principales eventos deportivos del país", en: "Live coverage of the main sporting events in the country", fr: "Couverture en direct des principaux événements sportifs du pays", pt: "Cobertura ao vivo dos principais eventos esportivos do país" }, thumbnail: "/sports-stadium-live.jpg", viewers: "1.8K", isLive: !0, streamUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" }, { title: { es: "Cultura y Entretenimiento", en: "Culture & Entertainment", fr: "Culture et Divertissement", pt: "Cultura e Entretenimento" }, description: { es: "Programas culturales, entrevistas y entretenimiento en vivo", en: "Cultural programs, interviews, and live entertainment", fr: "Programmes culturels, interviews et divertissements en direct", pt: "Programas culturais, entrevistas e entretenimento ao vivo" }, thumbnail: "/tv-studio-entertainment.jpg", viewers: "950", isLive: !0, streamUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" }, { title: { es: "Debate Político", en: "Political Debate", fr: "Débat Politique", pt: "Debate Político" }, description: { es: "Análisis y debate sobre los temas políticos más relevantes", en: "Analysis and debate on the most relevant political issues", fr: "Analyse et débat sur les questions politiques les plus pertinentes", pt: "Análise e debate sobre os temas políticos mais relevantes" }, thumbnail: "/political-debate-panel.jpg", viewers: "1.2K", isLive: !0, streamUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" }, { title: { es: "Economía y Negocios", en: "Economy & Business", fr: "Économie et Affaires", pt: "Economia e Negócios" }, description: { es: "Información financiera y análisis económico en tiempo real", en: "Financial information and real-time economic analysis", fr: "Informations financières et analyse économique en temps réel", pt: "Informações financeiras e análise econômica em tempo real" }, thumbnail: "/business-news-stock-market.jpg", viewers: "680", isLive: !0, streamUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4" }, { title: { es: "Especiales Documentales", en: "Documentary Specials", fr: "Spéciaux Documentaires", pt: "Especiais de Documentários" }, description: { es: "Documentales y reportajes especiales sobre Ecuador y el mundo", en: "Documentaries and special reports about Ecuador and the world", fr: "Documentaires et reportages spéciaux sur l'Équateur et le monde", pt: "Documentários e reportagens especiais sobre o Equador e o mundo" }, thumbnail: "/documentary-filming.png", viewers: "520", isLive: !0, streamUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" }]
const badWords = ["tonto", "estupido", "idiota", "imbecil", "pendejo", "mrd", "puta", "puto", "gil", "fool", "stupid", "idiot", "asshole"];

// Datos de ejemplo para la lista de clips
const mockClips: Clip[] = [
  { id: 'clip1', title: '¡Golazo increíble!', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4#t=10,20', thumbnail: '/sports-stadium-live.jpg', channelTitle: fullLiveChannels[1].title, creator: 'JuanDeportista', likes: 125 },
  { id: 'clip2', title: 'Análisis económico clave', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4#t=5,15', thumbnail: '/business-news-stock-market.jpg', channelTitle: fullLiveChannels[4].title, creator: 'InversoraPro', likes: 88 },
  { id: 'clip3', title: 'Momento tenso en el debate', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4#t=25,35', thumbnail: '/political-debate-panel.jpg', channelTitle: fullLiveChannels[3].title, creator: 'MiguelAnalista', likes: 210 },
]

export default function TVEnVivo() {
  type Language = "es" | "en" | "fr" | "pt";
  // --- Estados existentes ---
  const [menuOpen, setMenuOpen] = useState(false);
  const [entertainmentOpen, setEntertainmentOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentChannel, setCurrentChannel] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState("Ecuador");
  const [countryPanelExpanded, setCountryPanelExpanded] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [liveComments, setLiveComments] = useState(channelComments[0]);
  const [likes, setLikes] = useState(160);
  const [dislikes, setDislikes] = useState(3);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [showPlayerMenu, setShowPlayerMenu] = useState(false);
  const [videoQuality, setVideoQuality] = useState("1080p");
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);
  const [reactionCounts, setReactionCounts] = useState({ "❤️": 0, "👍": 0, "😂": 0, "👏": 0 });
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPipActive, setIsPipActive] = useState(false);
  const [language, setLanguage] = useState<Language>("es");

  // --- Estados de Clips ---
  const [isClippingMode, setIsClippingMode] = useState(false);
  const [clipStartTime, setClipStartTime] = useState(0);
  const [clipEndTime, setClipEndTime] = useState(0);
  const [clipAvailableRange, setClipAvailableRange] = useState({ start: 0, end: 0 });
  const [clipTitle, setClipTitle] = useState("");
  const [clipTitleError, setClipTitleError] = useState<string | null>(null);
  const [generatedClipInfo, setGeneratedClipInfo] = useState<{ url: string, title: string } | null>(null);
  const [clipLinkCopied, setClipLinkCopied] = useState(false);

  // --- 3. Nuevos estados para la galería de clips ---
  const [isClipsModalOpen, setIsClipsModalOpen] = useState(false);
  const [allClips, setAllClips] = useState<Clip[]>(mockClips);
  const [likedClips, setLikedClips] = useState<Set<string>>(new Set(['clip3'])); // Simular que ya nos gusta un clip

  const videoRef = useRef<HTMLVideoElement>(null);
  const wasPlayingBeforeClip = useRef(true);

  const t = useMemo(() => fullTranslations[language], [language]);

  // --- (Lógica de useEffects y handlers existentes) ---
  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const onEnterPip = () => setIsPipActive(true)
    const onLeavePip = () => setIsPipActive(false)

    videoElement.addEventListener("enterpictureinpicture", onEnterPip)
    videoElement.addEventListener("leavepictureinpicture", onLeavePip)

    return () => {
      videoElement.removeEventListener("enterpictureinpicture", onEnterPip)
      videoElement.removeEventListener("leavepictureinpicture", onLeavePip)
    }
  }, [])

  const closeShareModal = () => {
    setShareModalOpen(false)
    setTimeout(() => setLinkCopied(false), 300)
  }

  const handleCopyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const shareOnWhatsApp = () => { const url = encodeURIComponent(window.location.href); const text = encodeURIComponent(`${t.shareMessage} ${fullLiveChannels[currentChannel].title[language]}`); window.open(`https://wa.me/?text=${text}%20${url}`, "_blank") }
  const shareOnFacebook = () => { const url = encodeURIComponent(window.location.href); window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank") }
  const shareOnX = () => { const url = encodeURIComponent(window.location.href); const text = encodeURIComponent(`${t.shareMessage} ${fullLiveChannels[currentChannel].title[language]}`); window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank") }

  const socialButtons: SocialShareButton[] = [
    { name: "WhatsApp", icon: <WhatsAppIcon />, bgColor: "bg-[#25D366]", hoverBgColor: "hover:bg-[#1DAA50]", textColor: "text-white", action: shareOnWhatsApp },
    { name: "Facebook", icon: <FacebookIcon />, bgColor: "bg-[#1877F2]", hoverBgColor: "hover:bg-[#166bda]", textColor: "text-white", action: shareOnFacebook },
    { name: "X", icon: <XIcon />, bgColor: "bg-black", hoverBgColor: "hover:bg-gray-800", textColor: "text-white", action: shareOnX },
  ]

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (commentText.trim()) {
      const commentDefaults = {
        es: { name: "Usuario anónimo", time: "Ahora" },
        en: { name: "Anonymous User", time: "Now" },
        fr: { name: "Utilisateur anonyme", time: "Maintenant" },
        pt: { name: "Usuário anônimo", time: "Agora" },
      }
      const newComment = {
        id: liveComments.length + 1,
        name: commentDefaults[language].name,
        text: commentText,
        time: commentDefaults[language].time,
        badge: false,
      }
      setLiveComments([newComment, ...liveComments])
      setCommentText("")
    }
  }

  const handleLike = () => { if (userLiked) { setLikes(likes - 1); setUserLiked(false) } else { setLikes(likes + 1); setUserLiked(true); if (userDisliked) { setDislikes(dislikes - 1); setUserDisliked(false) } } }
  const handleDislike = () => { if (userDisliked) { setDislikes(dislikes - 1); setUserDisliked(false) } else { setDislikes(dislikes + 1); setUserDisliked(true); if (userLiked) { setLikes(likes - 1); setUserLiked(false) } } }
  const handleFullscreen = () => { const videoElement = videoRef.current; if (videoElement) { if (document.fullscreenElement) { document.exitFullscreen() } else { videoElement.requestFullscreen() } }; setShowPlayerMenu(false) }
  const handleTogglePlay = () => { const videoElement = videoRef.current; if (videoElement) { if (videoElement.paused) { videoElement.play(); setIsPlaying(true) } else { videoElement.pause(); setIsPlaying(false) } } }
  const handleTogglePip = async () => { const videoElement = videoRef.current; if (!videoElement) return; try { if (document.pictureInPictureElement) { await document.exitPictureInPicture() } else if (document.pictureInPictureEnabled) { await videoElement.requestPictureInPicture() } } catch (error) { console.error("Error al gestionar Picture-in-Picture:", error) } finally { setShowPlayerMenu(false) } }
  const handleQualityChange = (quality: string) => { setVideoQuality(quality); setShowPlayerMenu(false) }
  const handleReaction = (emoji: string) => { const newReaction: FloatingReaction = { id: Date.now(), emoji, x: Math.random() * 80 + 10 }; setFloatingReactions((prev) => [...prev, newReaction]); setReactionCounts((prev) => ({ ...prev, [emoji as keyof typeof prev]: prev[emoji as keyof typeof prev] + 1 })); setTimeout(() => { setFloatingReactions((prev) => prev.filter((r) => r.id !== newReaction.id)) }, 2000) }
  const countries = [{ name: "Ecuador", flag: "🇪🇨", language: "Español", color: "from-yellow-400 to-blue-600" }, { name: "Estados Unidos", flag: "🇺🇸", language: "English", color: "from-red-500 to-blue-700" }, { name: "España", flag: "🇪🇸", language: "Español", color: "from-red-600 to-yellow-400" }, { name: "México", flag: "🇲🇽", language: "Español", color: "from-green-600 to-red-600" }, { name: "Colombia", flag: "🇨🇴", language: "Español", color: "from-yellow-400 to-blue-600" }, { name: "Argentina", flag: "🇦🇷", language: "Español", color: "from-blue-400 to-blue-600" }, { name: "Brasil", flag: "🇧🇷", language: "Português", color: "from-green-500 to-yellow-400" }, { name: "Francia", flag: "🇫🇷", language: "Français", color: "from-blue-600 to-red-600" },]
  const handleCountrySelect = (country: typeof countries[0]) => { setSelectedCountry(country.name); if (country.language === "English") { setLanguage("en") } else if (country.language === "Français") { setLanguage("fr") } else if (country.language === "Português") { setLanguage("pt") } else { setLanguage("es") } }
  const getSelectedCountryData = () => { return countries.find((c) => c.name === selectedCountry) || countries[0] }
  const scrollCarousel = (direction: "left" | "right") => { const carousel = document.getElementById("channels-carousel"); if (carousel) { const scrollAmount = 300; carousel.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth", }) } }
  const enterClippingMode = () => {
    const video = videoRef.current; if (!video) return;
    wasPlayingBeforeClip.current = !video.paused; video.pause(); setIsPlaying(false);
    const now = video.currentTime; const availableStart = Math.max(0, now - 60);
    setClipAvailableRange({ start: availableStart, end: now });
    const defaultStart = Math.max(availableStart, now - 10);
    setClipStartTime(defaultStart); setClipEndTime(now);
    setClipTitle(`${t.clipFrom} ${fullLiveChannels[currentChannel].title[language]}`);
    setClipTitleError(null); setIsClippingMode(true);
  }
  const exitClippingMode = () => {
    setIsClippingMode(false); const video = videoRef.current;
    if (video && wasPlayingBeforeClip.current) { video.play(); setIsPlaying(true); }
  }
  const handleCreateClip = () => {
    const cleanTitle = clipTitle.trim();
    if (!cleanTitle) { setClipTitleError(t.clipTitleEmptyError); return; }
    const titleLower = cleanTitle.toLowerCase();
    const foundBadWord = badWords.find(word => titleLower.includes(word));
    if (foundBadWord) { setClipTitleError(t.clipTitleOffensiveError); return; }

    setClipTitleError(null);
    const url = `${fullLiveChannels[currentChannel].streamUrl}#t=${clipStartTime},${clipEndTime}`;

    // Crear el nuevo objeto de clip
    const newClip: Clip = {
      id: `clip_${Date.now()}`,
      title: cleanTitle,
      url: url,
      thumbnail: fullLiveChannels[currentChannel].thumbnail,
      channelTitle: fullLiveChannels[currentChannel].title,
      creator: 'Usuario anónimo', // En un sistema real, aquí iría el nombre de usuario.
      likes: 0,
    };

    // Añadir el nuevo clip a la lista global
    setAllClips(prev => [newClip, ...prev]);

    // Mostrar el modal de compartir para el clip recién creado
    setGeneratedClipInfo({ url, title: cleanTitle });
    exitClippingMode();
    setClipLinkCopied(false);
  }
  const handleClipTimeChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'start' | 'end') => {
    const time = parseFloat(e.target.value);
    if (type === 'start') {
      if (time < clipEndTime - 10) { setClipStartTime(time); setClipEndTime(time + 10); }
      else if (time < clipEndTime) { setClipStartTime(time); }
    } else {
      if (time > clipStartTime + 10) { setClipEndTime(time); setClipStartTime(time - 10); }
      else if (time > clipStartTime) { setClipEndTime(time); }
    }
    videoRef.current!.currentTime = time;
  }

  // 4. Lógica para dar "like" a un clip
  const handleLikeClip = (clipId: string) => {
    const newLikedClips = new Set(likedClips);
    let likeIncrement = 0;

    if (newLikedClips.has(clipId)) {
      newLikedClips.delete(clipId);
      likeIncrement = -1;
    } else {
      newLikedClips.add(clipId);
      likeIncrement = 1;
    }

    setLikedClips(newLikedClips);
    setAllClips(prevClips =>
      prevClips.map(clip =>
        clip.id === clipId ? { ...clip, likes: clip.likes + likeIncrement } : clip
      )
    );
  };

  // 5. Usar useMemo para ordenar los clips por likes
  const sortedClips = useMemo(() => {
    return [...allClips].sort((a, b) => b.likes - a.likes);
  }, [allClips]);


  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* ... (Menú lateral, panel de país, SiteHeader sin cambios) ... */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-[#003952] text-white transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}><div className="flex items-center justify-between p-6 border-b border-white/10"><h2 className="text-xl font-semibold">{t.menu}</h2><button onClick={() => setMenuOpen(!1)} className="hover:opacity-70"><X className="w-6 h-6" /></button></div><nav className="p-4 overflow-y-auto max-h-[calc(100vh-88px)]"><Link href="/lo-ultimo" className="w-full flex items-center gap-3 p-4 hover:bg-white/5 rounded-lg transition-colors" onClick={() => setMenuOpen(!1)}><Sparkles className="w-5 h-5" /><span className="font-medium">{t.latest}</span></Link><Link href="/noticias" className="w-full flex items-center gap-3 p-4 hover:bg-white/5 rounded-lg transition-colors" onClick={() => setMenuOpen(!1)}><Newspaper className="w-5 h-5" /><span className="font-medium">{t.news}</span></Link><Link href="/mundo" className="w-full flex items-center gap-3 p-4 hover:bg-white/5 rounded-lg transition-colors" onClick={() => setMenuOpen(!1)}><Globe className="w-5 h-5" /><span className="font-medium">{t.world}</span></Link><Link href="/ecuaterra" className="w-full flex items-center gap-3 p-4 hover:bg-white/5 rounded-lg transition-colors" onClick={() => setMenuOpen(!1)}><Leaf className="w-5 h-5" /><span className="font-medium">{t.ecuaterra}</span></Link><Link href="/estilo" className="w-full flex items-center gap-3 p-4 hover:bg-white/5 rounded-lg transition-colors" onClick={() => setMenuOpen(!1)}><Sparkles className="w-5 h-5" /><span className="font-medium">{t.style}</span></Link><Link href="/newsletters" className="w-full flex items-center gap-3 p-4 hover:bg-white/5 rounded-lg transition-colors" onClick={() => setMenuOpen(!1)}><Mail className="w-5 h-5" /><span className="font-medium">{t.newsletters}</span></Link><Link href="/especiales" className="w-full flex items-center gap-3 p-4 hover:bg-white/5 rounded-lg transition-colors" onClick={() => setMenuOpen(!1)}><Star className="w-5 h-5" /><span className="font-medium">{t.specials}</span></Link><div className="border-t border-white/10 my-4"></div><div><button onClick={() => setEntertainmentOpen(!entertainmentOpen)} className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-lg transition-colors"><div className="flex items-center gap-3"><Film className="w-5 h-5" /><span className="font-medium">{t.entertainment}</span></div><ChevronDown className={`w-5 h-5 transition-transform ${entertainmentOpen ? "rotate-180" : ""}`} /></button>{entertainmentOpen && <div className="ml-8 space-y-1"><Link href="/cine" className="block p-3 hover:bg-white/5 rounded-lg transition-colors" onClick={() => setMenuOpen(!1)}><div className="flex items-center gap-3"><Film className="w-4 h-4" /><span>{t.cinema}</span></div></Link><Link href="/musica" className="block p-3 hover:bg-white/5 rounded-lg transition-colors" onClick={() => setMenuOpen(!1)}><div className="flex items-center gap-3"><Music className="w-4 h-4" /><span>{t.music}</span></div></Link></div>}</div></nav></div>
      {menuOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setMenuOpen(!1)} />}
      <div className={`fixed top-24 right-0 z-40 transition-all duration-300 ${countryPanelExpanded ? "w-80" : "w-16"}`}><div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-l-2 border-yellow-500/30 shadow-2xl h-auto rounded-l-2xl overflow-hidden"><button onClick={() => setCountryPanelExpanded(!countryPanelExpanded)} className="w-full p-4 flex items-center justify-center bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors border-b border-yellow-500/20">{countryPanelExpanded ? <ChevronRight className="w-6 h-6 text-yellow-400" /> : <div className="flex flex-col items-center gap-2"><Globe className="w-6 h-6 text-yellow-400" /><div className="text-2xl">{getSelectedCountryData().flag}</div></div>}</button>{countryPanelExpanded && <div className="p-4"><div className="mb-4"><h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2"><Globe className="w-5 h-5 text-yellow-400" />{t.countryNewsTitle}</h3><p className="text-gray-400 text-xs">{t.countryNewsSubtitle}</p></div><div className="mb-4 bg-gray-800/50 rounded-lg p-3 border border-yellow-500/20"><div className="flex items-center gap-2"><div className="text-3xl">{getSelectedCountryData().flag}</div><div className="flex-1"><p className="text-white font-semibold text-sm">{selectedCountry}</p><p className="text-gray-400 text-xs">{getSelectedCountryData().language}</p></div><Sparkles className="w-4 h-4 text-yellow-400" /></div></div><div className="space-y-1 max-h-[400px] overflow-y-auto pr-2">{countries.map(e => <button key={e.name} onClick={() => handleCountrySelect(e)} className={`w-full p-3 flex items-center gap-3 rounded-lg transition-all duration-200 ${selectedCountry === e.name ? "bg-yellow-500/20 border-l-4 border-yellow-500" : "hover:bg-gray-700/50 border-l-4 border-transparent"}`}><div className="text-2xl">{e.flag}</div><div className="flex-1 text-left"><div className="text-white font-medium text-sm">{e.name}</div><div className="text-gray-400 text-xs">{e.language}</div></div>{selectedCountry === e.name && <Check className="w-4 h-4 text-yellow-400" />}</button>)}</div></div>}</div></div>
      <SiteHeader activeSection="tv-en-vivo" />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* ... (Reproductor de video y lógica de clipping sin cambios funcionales, solo JSX) ... */}
          <div className="lg:col-span-2"><div id="video-player-container" className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-2xl mb-4 group"><video ref={videoRef} src={fullLiveChannels[currentChannel].streamUrl} poster={fullLiveChannels[currentChannel].thumbnail} className="w-full h-full object-cover" autoPlay muted loop playsInline onClick={handleTogglePlay} /><div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 text-sm font-bold uppercase rounded flex items-center gap-2 animate-pulse"><div className="w-3 h-3 bg-white rounded-full" />{t.live}</div><div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 text-sm rounded flex items-center gap-2"><User className="w-4 h-4" />{fullLiveChannels[currentChannel].viewers} {t.viewers}</div><div className="absolute top-16 right-4 bg-black/70 text-white px-3 py-1 text-xs rounded">{videoQuality}</div><div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" onClick={handleTogglePlay}><div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">{isPlaying ? <Pause className="w-10 h-10 text-gray-900" /> : <Play className="w-10 h-10 text-gray-900 ml-1" />}</div></div>{floatingReactions.map(e => <div key={e.id} className="absolute bottom-0 text-4xl pointer-events-none" style={{ left: `${e.x}%`, animation: "floatUp 2s ease-out forwards" }}>{e.emoji}</div>)}</div>
            {isClippingMode && <div className="bg-gray-800 rounded-lg p-4 mb-4 border border-yellow-500/50 animate-in fade-in-0 slide-in-from-top-2 duration-300"><div className="flex justify-between items-center mb-2"><h3 className="font-bold text-lg text-yellow-400">{t.clip}</h3><div className="text-sm font-mono bg-gray-900 px-3 py-1 rounded">{(clipEndTime - clipStartTime).toFixed(1)}s</div></div><div className="mb-4"><label htmlFor="clipTitle" className="block text-sm font-medium text-gray-300 mb-1">{t.clipTitleLabel}</label><Input id="clipTitle" type="text" value={clipTitle} onChange={e => setClipTitle(e.target.value)} className={`bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 w-full ${clipTitleError ? "border-red-500 focus:ring-red-500" : ""}`} maxLength={100} />{clipTitleError && <p className="text-red-500 text-xs mt-1">{clipTitleError}</p>}</div><p className="text-sm text-gray-400 mb-4">{t.clipInstructions}</p><div className="relative h-8 flex items-center"><div className="absolute w-full h-1 bg-gray-700 rounded-full top-1/2 -translate-y-1/2"></div><div className="absolute h-1 bg-yellow-500 rounded-full top-1/2 -translate-y-1/2" style={{ left: `${(clipStartTime - clipAvailableRange.start) / (clipAvailableRange.end - clipAvailableRange.start) * 100}%`, right: `${100 - (clipEndTime - clipAvailableRange.start) / (clipAvailableRange.end - clipAvailableRange.start) * 100}%` }}></div><input type="range" min={clipAvailableRange.start} max={clipAvailableRange.end} step={.1} value={clipStartTime} onChange={e => handleClipTimeChange(e, "start")} className="absolute w-full h-1 appearance-none bg-transparent range-thumb" /><input type="range" min={clipAvailableRange.start} max={clipAvailableRange.end} step={.1} value={clipEndTime} onChange={e => handleClipTimeChange(e, "end")} className="absolute w-full h-1 appearance-none bg-transparent range-thumb" /></div><div className="flex justify-end gap-3 mt-4"><Button variant="ghost" onClick={exitClippingMode}>{t.cancel}</Button><Button onClick={handleCreateClip} className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold"><Scissors className="w-4 h-4 mr-2" />{t.createClip}</Button></div></div>}
            <h1 className="text-2xl font-bold mb-2">{fullLiveChannels[currentChannel].title[language]}</h1><p className="text-gray-400 text-sm mb-4">{fullLiveChannels[currentChannel].description[language]}</p><div className="flex items-center gap-2 mb-6"><div className="flex items-center bg-gray-800 rounded-full overflow-hidden"><button onClick={handleLike} className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-700 transition-colors ${userLiked ? "text-yellow-400" : ""}`}><ThumbsUp className="w-5 h-5" /><span className="font-semibold">{likes}</span></button><div className="w-px h-6 bg-gray-700" /><button onClick={handleDislike} className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-700 transition-colors ${userDisliked ? "text-yellow-400" : ""}`}><ThumbsDown className="w-5 h-5" /></button></div><button onClick={() => setShareModalOpen(!0)} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"><Share2 className="w-5 h-5" /><span className="font-semibold">{t.share}</span></button><button onClick={enterClippingMode} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"><Scissors className="w-5 h-5" /><span className="font-semibold">{t.clip}</span></button><button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"><Bookmark className="w-5 h-5" /><span className="font-semibold">{t.save}</span></button><div className="relative ml-auto"><button onClick={() => setShowPlayerMenu(!showPlayerMenu)} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"><MoreVertical className="w-5 h-5" /></button>{showPlayerMenu && <div className="absolute right-0 bottom-full mb-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50"><button onClick={handleFullscreen} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors text-left"><Maximize className="w-5 h-5" /><span>{t.fullscreen}</span></button><button onClick={handleTogglePip} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors text-left"><PipIcon /><span>{isPipActive ? t.exitPip : t.pip}</span></button><div className="border-t border-gray-700"><div className="px-4 py-2 text-sm text-gray-400 flex items-center gap-2"><Settings className="w-4 h-4" />{t.quality}</div>{["1080p", "720p", "480p"].map(e => <button key={e} onClick={() => handleQualityChange(e)} className={`w-full flex items-center justify-between px-4 py-2 hover:bg-gray-700 transition-colors text-left ${videoQuality === e ? "text-yellow-400" : ""}`}><span className="ml-6">{e}</span>{videoQuality === e && <Check className="w-4 h-4" />}</button>)}</div></div>}</div></div></div>

          {/* ... (Chat de comentarios sin cambios) ... */}
          <div className="lg:col-span-1"><div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl h-[600px] flex flex-col"><div className="bg-gray-900 p-4 border-b border-gray-700"><div className="flex items-center justify-between"><h3 className="font-semibold flex items-center gap-2"><MessageCircle className="w-5 h-5 text-yellow-400" />{t.liveComments}</h3><button className="text-gray-400 hover:text-white"><MoreVertical className="w-5 h-5" /></button></div></div><div className="bg-gray-900/50 p-3 border-b border-gray-700"><div className="flex items-center justify-around gap-2">{Object.entries(reactionCounts).map(([e, t]) => <button key={e} onClick={() => handleReaction(e)} className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-700/50 transition-colors group"><span className="text-2xl group-hover:scale-125 transition-transform">{e}</span><span className="text-xs text-gray-400">{t}</span></button>)}</div></div><div className="flex-1 overflow-y-auto p-4 space-y-3">{liveComments.map(e => <div key={e.id} className="flex items-start gap-2 text-sm"><div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center text-gray-300 font-bold flex-shrink-0 text-xs">{e.name.charAt(0).toUpperCase()}</div><div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-1"><span className={`font-semibold ${e.badge ? "text-yellow-400" : "text-gray-400"}`}>{e.name}</span>{e.badge && <span className="bg-yellow-500 text-gray-900 text-xs px-2 py-0.5 rounded font-bold">ANEUPI</span>}<span className="text-gray-500 text-xs ml-auto">{e.time}</span></div><p className="text-gray-200 text-sm leading-relaxed break-words">{e.text}</p></div></div>)}</div><div className="p-4 border-t border-gray-700 bg-gray-900"><form onSubmit={handleCommentSubmit} className="flex gap-2"><Input placeholder={t.commentPlaceholder} value={commentText} onChange={e => setCommentText(e.target.value)} className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 flex-1" /><Button type="submit" size="icon" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 flex-shrink-0"><Send className="w-4 h-4" /></Button></form><p className="text-xs text-gray-500 mt-2">{t.anonymousMode}</p></div></div></div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">{t.availableChannels}</h3>
            {/* 6. Botón para abrir el modal de Top Clips */}
            <Button onClick={() => setIsClipsModalOpen(true)} className="bg-gray-800 hover:bg-yellow-500/20 text-yellow-400 font-bold border-2 border-yellow-500/30">
              <Trophy className="w-5 h-5 mr-2" />
              {t.topClips}
            </Button>
          </div>
          {/* ... (Carrusel de canales sin cambios) ... */}
          <div className="relative"><button onClick={() => scrollCarousel("left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors" aria-label={t.previous}><ChevronLeft className="w-6 h-6" /></button><button onClick={() => scrollCarousel("right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors" aria-label={t.next}><ChevronRight className="w-6 h-6" /></button><div id="channels-carousel" className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-12" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>{fullLiveChannels.map((e, i) => <div key={i} onClick={() => setCurrentChannel(i)} className={`flex-shrink-0 w-72 bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transition-all hover:scale-105 ${currentChannel === i ? "ring-4 ring-yellow-400" : ""}`}><div className="relative h-40 overflow-hidden"><img src={e.thumbnail || "/placeholder.svg"} alt={e.title[language]} className="w-full h-full object-cover" />{e.isLive && <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-bold uppercase rounded flex items-center gap-1"><div className="w-2 h-2 bg-white rounded-full" />{t.live}</div>}<div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded flex items-center gap-1"><User className="w-3 h-3" />{e.viewers}</div></div><div className="p-4"><h4 className="font-bold mb-1 text-sm leading-tight">{e.title[language]}</h4><p className="text-gray-400 text-xs line-clamp-2">{e.description[language]}</p></div></div>)}</div></div>
        </div>
      </main>

      {/* ... (Footer, AuthModal, ShareModal sin cambios) ... */}
      <SiteFooter />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(!1)} />
      {shareModalOpen && <>
        <div className="fixed inset-0 bg-black/70 z-50 animate-in fade-in-0" onClick={closeShareModal} />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg animate-in fade-in-0 slide-in-from-bottom-2 duration-300"><div className="relative m-4 font-sans"><div className="absolute -top-18 left-1/2 -translate-x-1/2"><div className="w-36 h-36 rounded-full bg-white p-1 shadow-lg flex items-center justify-center"><img src="/gatito-plis-logo.png" alt="Logo Gatito Plis" className="w-full h-full object-contain" /></div></div><div className="bg-[#003952] text-white rounded-xl shadow-2xl p-6 pt-20"><button onClick={closeShareModal} className="absolute top-3 right-3 text-gray-300 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"><X className="w-6 h-6" /></button><h3 className="text-[25px] font-bold text-center">{t.shareModalTitle}</h3><p className="text-[14px] text-gray-300 mt-2 text-center">"{fullLiveChannels[currentChannel].title[language]}"</p><div className="flex justify-center items-center gap-4 overflow-x-auto py-6"><div className="flex flex-col items-center gap-2 text-center w-20"><button className="w-14 h-14 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors text-white"><LinkIcon className="w-7 h-7" /></button><span className="text-xs text-gray-300">{t.insert}</span></div>{socialButtons.map(e => <div key={e.name} className="flex flex-col items-center gap-2 text-center w-20"><button onClick={e.action} className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${e.textColor} ${e.bgColor} ${e.hoverBgColor}`}>{e.icon}</button><span className="text-xs text-gray-300">{e.name}</span></div>)}</div><div className="mt-2"><div className="flex items-center border border-transparent rounded-lg p-1 bg-[#002a3d]"><p className="flex-grow bg-transparent px-3 text-[14px] text-gray-300 truncate">{"undefined" != typeof window ? window.location.href : ""}</p><button onClick={handleCopyLink} className={`px-5 py-2 rounded-md text-sm font-semibold transition-all w-28 text-center ${linkCopied ? "bg-green-600 text-white" : "bg-gray-600 hover:bg-gray-500 text-white"}`}>{linkCopied ? t.copied : t.copy}</button></div></div></div></div></div>
      </>}
      {generatedClipInfo && <>
        <div className="fixed inset-0 bg-black/70 z-50 animate-in fade-in-0" onClick={() => setGeneratedClipInfo(null)} />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-xl animate-in fade-in-0 slide-in-from-bottom-2 duration-300"><div className="bg-[#003952] text-white rounded-xl shadow-2xl p-6 m-4"><button onClick={() => setGeneratedClipInfo(null)} className="absolute top-3 right-3 text-gray-300 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"><X className="w-6 h-6" /></button><h3 className="text-2xl font-bold mb-2 break-words">"{generatedClipInfo.title}"</h3><p className="text-sm text-gray-400 mb-4">{t.clipFrom} "{fullLiveChannels[currentChannel].title[language]}"</p><div className="aspect-video bg-black rounded-lg overflow-hidden mb-4"><video src={generatedClipInfo.url} key={generatedClipInfo.url} controls autoPlay loop playsInline className="w-full h-full object-contain" /></div><div className="flex items-center border border-transparent rounded-lg p-1 bg-[#002a3d]"><p className="flex-grow bg-transparent px-3 text-sm text-gray-300 truncate">{generatedClipInfo.url}</p><button onClick={() => { navigator.clipboard.writeText(generatedClipInfo.url), setClipLinkCopied(!0), setTimeout(() => setClipLinkCopied(!1), 2e3) }} className={`px-5 py-2 rounded-md text-sm font-semibold transition-all w-28 text-center ${clipLinkCopied ? "bg-green-600 text-white" : "bg-yellow-500 hover:bg-yellow-600 text-gray-900"}`}>{clipLinkCopied ? t.copied : t.copy}</button></div></div></div>
      </>}

      {/* 7. Modal para mostrar los Top Clips */}
      {isClipsModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/70 z-50 animate-in fade-in-0" onClick={() => setIsClipsModalOpen(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-4xl animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
            <div className="bg-[#002a3d] text-white rounded-xl shadow-2xl m-4 border border-yellow-500/30 max-h-[80vh] flex flex-col">
              <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-yellow-400 flex items-center gap-3"><Trophy /> {t.topClips}</h3>
                <button onClick={() => setIsClipsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"><X className="w-6 h-6" /></button>
              </div>
              <div className="p-6 overflow-y-auto">
                {sortedClips.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedClips.map(clip => (
                      <div key={clip.id} className="bg-gray-800 rounded-lg overflow-hidden flex flex-col group">
                        <div
                          className="relative aspect-video cursor-pointer"
                          onClick={() => {
                            setGeneratedClipInfo({ url: clip.url, title: clip.title });
                            setIsClipsModalOpen(false);
                          }}
                        >
                          <img src={clip.thumbnail} alt={clip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-12 h-12 text-white" />
                          </div>
                        </div>
                        <div className="p-3 flex flex-col flex-grow">
                          <h4 className="font-bold text-sm leading-tight break-words flex-grow">{clip.title}</h4>
                          <p className="text-xs text-gray-400 mt-1">{t.by} <span className="font-semibold">{clip.creator}</span></p>
                          <p className="text-xs text-gray-500">{t.onChannel} {clip.channelTitle[language]}</p>
                          <div className="flex items-center justify-end mt-2">
                            <button onClick={() => handleLikeClip(clip.id)} className="flex items-center gap-2 text-sm text-gray-300 hover:text-pink-400 transition-colors">
                              <Heart className={`w-5 h-5 ${likedClips.has(clip.id) ? 'text-pink-500 fill-current' : 'text-gray-400'}`} />
                              <span className="font-semibold">{clip.likes}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Trophy className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400">{t.noClipsYet}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx global>{`.range-thumb::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:16px;height:16px;background:#f59e0b;cursor:pointer;border-radius:50%;border:2px solid #fff;margin-top:-7px}.range-thumb::-moz-range-thumb{width:16px;height:16px;background:#f59e0b;cursor:pointer;border-radius:50%;border:2px solid #fff}`}</style>
    </div>
  )
}