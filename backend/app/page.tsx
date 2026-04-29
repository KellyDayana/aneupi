"use client"

import { useState, useEffect } from "react"
import {
  X,
  Film,
  ChevronDown,
  Calendar,
  Music,
  Newspaper,
  Globe,
  Leaf,
  Sparkles,
  Mail,
  Star,
  ArrowRight,
  // --- AÑADIDOS PARA EL MODAL ---
  Share2,
  Copy,
  Check,
  Link as LinkIcon,
} from "lucide-react"
import Link from "next/link"
import { AuthModal } from "@/components/auth-modal"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

type ReactionsState = {
  like: number
  love: number
  wow: number
  laugh: number
  sad: number
}
const DEFAULTS: ReactionsState = { like: 0, love: 0, wow: 0, laugh: 0, sad: 0 }

// --- AÑADIDO: ICONOS SVG ORIGINALES PARA REDES SOCIALES ---
const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M16.75 13.96c.27.13.42.26.5.41.08.15.12.31.12.51 0 .2-.04.38-.12.51-.08.13-.23.26-.5.41-.27.14-.63.28-1.06.41-.44.13-1.03.2-1.78.2-1.13 0-2.13-.23-2.99-.71-.86-.48-1.57-1.11-2.13-1.88-.56-.77-.95-1.64-1.18-2.61-.23-.97-.13-1.84.28-2.61.13-.25.29-.47.49-.67.2-.2.42-.33.67-.42.25-.09.5-.13.75-.13.23 0 .44.03.63.09.19.06.36.15.5.28l.12.12c.11.1.18.19.23.28.05.09.09.18.12.28.03.1.04.2.04.31 0 .1-.01.2-.04.31-.03.1-.09.2-.18.31-.09.11-.23.23-.42.38-.19.14-.33.26-.42.35-.09.09-.16.18-.2.26-.04.08-.06.16-.06.23 0 .08.01.16.04.23.03.08.08.16.15.26.21.28.49.57.82.86s.63.53.92.71c.09.06.18.1.26.13.08.03.15.04.23.04.08 0 .16-.02.23-.06.08-.04.15-.1.23-.18.08-.08.16-.18.26-.29.1-.11.23-.23.38-.35.15-.12.3-.23.46-.31.16-.08.33-.12.51-.12.2 0 .38.04.54.12.16.08.3.2.42.35z M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></svg>
)
const FacebookIcon = () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M12 2.04c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm2.25 10.12h-1.75v5.88h-2.5v-5.88h-1.25v-2.25h1.25v-1.5c0-1.25.75-2.5 2.5-2.5h1.75v2.25h-1c-.25 0-.5.25-.5.5v1.25h1.5l-.25 2.25z"></path></svg>
)
const XIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
)
// --- FIN DE ICONOS ---

type NewsArticle = {
  id: string;
  title: string;
  description?: string;
  excerpt?: string;
  category: string;
  date: string;
  image: string;
  badgeClass?: string;
}

type SocialShareButton = {
  name: string;
  icon: React.ReactNode;
  bgColor: string;
  hoverBgColor: string;
  textColor: string;
  action: () => void;
}

export default function AneupiTV() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [entertainmentOpen, setEntertainmentOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [newsToShare, setNewsToShare] = useState<NewsArticle | null>(null)
  const [linkCopied, setLinkCopied] = useState(false)

  const openShareModal = (newsItem: NewsArticle) => {
    setNewsToShare(newsItem)
    setShareModalOpen(true)
  }

  const closeShareModal = () => {
    setShareModalOpen(false)
    setTimeout(() => {
      setLinkCopied(false)
      setNewsToShare(null)
    }, 300)
  }

  const getShareUrl = () => {
    if (!newsToShare) return ""
    return `${window.location.origin}/noticias/${newsToShare.id}`
  }

  const handleCopyLink = () => {
    const url = getShareUrl()
    if (!url) return
    navigator.clipboard.writeText(url)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const shareOnWhatsApp = () => { if (!newsToShare) return; const url = encodeURIComponent(getShareUrl()); const text = encodeURIComponent(`¡Mira esto!: ${newsToShare.title}`); window.open(`https://wa.me/?text=${text}%20${url}`, "_blank") }
  const shareOnFacebook = () => { if (!newsToShare) return; const url = encodeURIComponent(getShareUrl()); window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank") }
  const shareOnX = () => { if (!newsToShare) return; const url = encodeURIComponent(getShareUrl()); const text = encodeURIComponent(`¡Mira esto!: ${newsToShare.title}`); window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank") }
  
  // --- ARRAY DE BOTONES SOCIALES MODIFICADO PARA USAR ICONOS ORIGINALES ---
  const socialButtons: SocialShareButton[] = [
    { name: "WhatsApp", icon: <WhatsAppIcon />, bgColor: "bg-[#25D366]", hoverBgColor: "hover:bg-[#1DAA50]", textColor: "text-white", action: shareOnWhatsApp },
    { name: "Facebook", icon: <FacebookIcon />, bgColor: "bg-[#1877F2]", hoverBgColor: "hover:bg-[#166bda]", textColor: "text-white", action: shareOnFacebook },
    { name: "X", icon: <XIcon />, bgColor: "bg-black", hoverBgColor: "hover:bg-gray-800", textColor: "text-white", action: shareOnX },
  ]
  // --- FIN DE MODIFICACIÓN ---

  const featuredNews: NewsArticle = {
    id: "featured-1",
    title: "Terrorismo en Ecuador | 19 coches bomba se han detectado en siete años",
    description: "Los últimos cuatro casos se han reportado en menos de tres semanas en Guayaquil. Desde 2018, los grupos criminales iniciaron con esta modalidad para causar pánico.",
    category: "LA NOTICIA A FONDO",
    date: "16 Oct 2025",
    image: "/action-movie-hero-background-dark-cinematic.jpg",
    badgeClass: "bg-blue-600",
  }

  const sidebarNews: NewsArticle[] = [
    { id: "sidebar-1", title: "Dirigentes indígenas y el Gobierno llegan a un acuerdo y termina el paro en Imbabura", excerpt: "La reunión entre ambas partes se realizó este 15 de octubre en Otavalo. Hoy, la ciudad fue testigo del registro manifestaciones y la provincia de Imbabura empezó a retornar la normalidad.", image: "/generic-movie-poster.png?height=200&width=300&query=indigenous+protest+ecuador", category: "ECUADOR", date: "16 Oct 2025" },
    { id: "sidebar-2", title: "Indígenas de Imbabura dicen que hay grupos indígenas que desconocen el acuerdo con el Gobierno", excerpt: "Representantes de comunidades indígenas manifestaron su preocupación por sectores que no aceptan los términos del acuerdo.", image: "/generic-movie-poster.png?height=200&width=300&query=indigenous+meeting", category: "ECUADOR", date: "16 Oct 2025" },
    { id: "sidebar-3", title: "Ecuador acumula ocho prórrogas sin renovar contratos con operadoras telefónicas", excerpt: "Las empresas de telecomunicaciones operan bajo extensiones temporales mientras se define el marco regulatorio definitivo.", image: "/generic-movie-poster.png?height=200&width=300&query=telecommunications+phone", category: "ECUADOR", date: "15 Oct 2025" },
    { id: "sidebar-4", title: "Ecuador recibe una propuesta de EE. UU. para eliminar aranceles a productos agrícolas como el banano", excerpt: "La propuesta busca fortalecer las relaciones comerciales entre ambos países y beneficiar al sector agrícola ecuatoriano.", image: "/generic-movie-poster.png?height=200&width=300&query=banana+plantation+ecuador", category: "ECONOMÍA", date: "15 Oct 2025" },
    { id: "sidebar-5", title: "EE. UU.: El Gobierno Trump autorizó operaciones encubiertas en Venezuela, según The New York Times", excerpt: "Según reportes de prensa internacional, la administración estadounidense habría aprobado acciones de inteligencia en territorio venezolano.", image: "/action-movie-silhouette-city.jpg", category: "EE. UU.", date: "14 Oct 2025" },
    { id: "sidebar-6", title: "Reconstrucción del atentado en Guayaquil: cuándo, cómo y dónde actuaron los responsables", excerpt: "Autoridades investigan los detalles del ataque que conmocionó a la ciudad portuaria la semana pasada.", image: "/generic-movie-poster.png?height=200&width=300&query=crime+scene+investigation", category: "SEGURIDAD", date: "14 Oct 2025" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* ... Código del Sidebar y Header (sin cambios) ... */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-[#003952] text-white transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}><div className="flex items-center justify-between p-6 border-b border-white/10"><h2 className="text-xl font-semibold">Menu</h2><button onClick={() => setMenuOpen(false)} className="hover:opacity-70"><X className="w-6 h-6" /></button></div><nav className="p-4 overflow-y-auto max-h-[calc(100vh-88px)]"><Link href="/lo-ultimo" className="w-full flex items-center gap-3 p-4 hover:bg-white/5 rounded-lg transition-colors" onClick={() => setMenuOpen(false)}><Sparkles className="w-5 h-5" /><span className="font-medium">LO ÚLTIMO</span></Link><Link href="/noticias" className="w-full flex items-center gap-3 p-4 hover:bg-white/5 rounded-lg transition-colors" onClick={() => setMenuOpen(false)}><Newspaper className="w-5 h-5" /><span className="font-medium">NOTICIAS</span></Link><Link href="/mundo" className="w-full flex items-center gap-3 p-4 hover:bg-white/5 rounded-lg transition-colors" onClick={() => setMenuOpen(false)}><Globe className="w-5 h-5" /><span className="font-medium">MUNDO</span></Link><Link href="/ecuaterra" className="w-full flex items-center gap-3 p-4 hover:bg-white/5 rounded-lg transition-colors" onClick={() => setMenuOpen(false)}><Leaf className="w-5 h-5" /><span className="font-medium">ECUATERRA</span></Link><Link href="/estilo" className="w-full flex items-center gap-3 p-4 hover:bg-white/5 rounded-lg transition-colors" onClick={() => setMenuOpen(false)}><Sparkles className="w-5 h-5" /><span className="font-medium">ESTILO</span></Link><Link href="/newsletters" className="w-full flex items-center gap-3 p-4 hover:bg-white/5 rounded-lg transition-colors" onClick={() => setMenuOpen(false)}><Mail className="w-5 h-5" /><span className="font-medium">NEWSLETTERS</span></Link><Link href="/especiales" className="w-full flex items-center gap-3 p-4 hover:bg-white/5 rounded-lg transition-colors" onClick={() => setMenuOpen(false)}><Star className="w-5 h-5" /><span className="font-medium">ESPECIALES</span></Link><div className="border-t border-white/10 my-4"></div><div><button onClick={() => setEntertainmentOpen(!entertainmentOpen)} className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-lg transition-colors"><div className="flex items-center gap-3"><Film className="w-5 h-5" /><span className="font-medium">ENTRETENIMIENTO</span></div><ChevronDown className={`w-5 h-5 transition-transform ${entertainmentOpen ? "rotate-180" : ""}`} /></button>{entertainmentOpen && (<div className="ml-8 space-y-1"><Link href="/cine" className="block p-3 hover:bg-white/5 rounded-lg transition-colors" onClick={() => setMenuOpen(false)}><div className="flex items-center gap-3"><Film className="w-4 h-4" /><span>Cine</span></div></Link><Link href="/musica" className="block p-3 hover:bg-white/5 rounded-lg transition-colors" onClick={() => setMenuOpen(false)}><div className="flex items-center gap-3"><Music className="w-4 h-4" /><span>Música</span></div></Link></div>)}</div></nav></div>
      {menuOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setMenuOpen(false)} />}
      <SiteHeader activeSection="home" />

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <article className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="relative h-[400px]">
                <img src={featuredNews.image || "/placeholder.svg"} alt={featuredNews.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 text-xs font-bold uppercase">{featuredNews.category}</div>
              </div>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-4 text-gray-900 leading-tight text-balance">{featuredNews.title}</h1>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">{featuredNews.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{featuredNews.date}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openShareModal(featuredNews)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors" aria-label="Compartir"><Share2 className="w-5 h-5" /></button>
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold">Leer más <ArrowRight className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </article>

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Más Noticias</h2>
              <div className="space-y-6">
                {sidebarNews.slice(3).map((article) => (
                  <article key={article.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex gap-4 p-4">
                      <div className="relative w-48 h-32 flex-shrink-0"><img src={article.image || "/placeholder.svg"} alt={article.title} className="w-full h-full object-cover rounded" /></div>
                      <div className="flex-1">
                        <span className="inline-block bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase mb-2">{article.category}</span>
                        <h3 className="text-lg font-bold mb-2 text-gray-900 hover:text-blue-600 transition-colors text-balance">{article.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{article.excerpt}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors">Leer más <ArrowRight className="w-3 h-3" /></button>
                          <button onClick={() => openShareModal(article)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors" aria-label="Compartir"><Share2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6 text-gray-900 border-b-2 border-blue-600 pb-2">Últimas Noticias</h2>
              <div className="space-y-6">
                {sidebarNews.slice(0, 3).map((article, idx) => (
                  <article key={article.id} className="group">
                    <div className="relative h-40 mb-3 overflow-hidden rounded"><img src={article.image || "/placeholder.svg"} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /></div>
                    <span className="inline-block bg-red-600 text-white px-2 py-1 text-xs font-bold uppercase mb-2">{article.category}</span>
                    <h3 className="text-base font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors leading-tight text-balance">{article.title}</h3>
                    <div className="mt-2 flex items-center justify-between">
                      <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-xs transition-colors">Leer más <ArrowRight className="w-3 h-3" /></button>
                      <button onClick={() => openShareModal(article)} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-blue-600" aria-label="Compartir"><Share2 className="w-4 h-4" /></button>
                    </div>
                    {idx < 2 && <div className="border-b border-gray-200 mt-4" />}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <SiteFooter />

      {shareModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50 animate-in fade-in-0" onClick={closeShareModal} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
            <div className="relative m-4 font-sans">
              <div className="absolute -top-18 left-1/2 -translate-x-1/2">
                <div className="w-36 h-36 rounded-full bg-white p-1 shadow-lg flex items-center justify-center">
                  <img src="/gatito-plis-logo.png" alt="Logo Gatito Plis" className="w-full h-full object-contain" />
                </div>
              </div>
              <div className="bg-white text-gray-900 rounded-xl shadow-2xl p-6 pt-20">
                <button onClick={closeShareModal} className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 transition-colors p-1 rounded-full hover:bg-gray-100"><X className="w-6 h-6" /></button>
                <h3 className="text-2xl font-bold text-center">¡Comparte la noticia!</h3>
                <p className="text-sm text-gray-500 mt-2 text-center">"{newsToShare?.title}"</p>
                <div className="flex justify-center items-center gap-4 overflow-x-auto py-6">
                  <div className="flex flex-col items-center gap-2 text-center w-20">
                    <button className="w-14 h-14 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700"><LinkIcon className="w-7 h-7" /></button>
                    <span className="text-xs text-gray-500">Insertar</span>
                  </div>
                  {socialButtons.map((social) => (
                    <div key={social.name} className="flex flex-col items-center gap-2 text-center w-20">
                      <button onClick={social.action} className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${social.textColor} ${social.bgColor} ${social.hoverBgColor}`}>{social.icon}</button>
                      <span className="text-xs text-gray-500">{social.name}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <div className="flex items-center border border-gray-300 rounded-lg p-1 bg-gray-50">
                    <p className="flex-grow bg-transparent px-3 text-sm text-gray-500 truncate">{getShareUrl()}</p>
                    <button onClick={handleCopyLink} className={`px-5 py-2 rounded-md text-sm font-semibold transition-all w-28 text-center ${linkCopied ? "bg-green-100 text-green-700" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}>
                      {linkCopied ? "¡Copiado!" : "Copiar"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}