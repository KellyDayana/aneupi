"use client"

import { useState } from "react"
import {
  Menu,
  X,
  Home,
  Film,
  Tv,
  Search,
  User,
  ChevronDown,
  Calendar,
  Music,
  Newspaper,
  Globe,
  Leaf,
  Sparkles,
  Mail,
  Star,
  Clock,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { AuthModal } from "@/components/auth-modal"
import { SiteFooter } from "@/components/site-footer"

export default function LoUltimo() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [entertainmentOpen, setEntertainmentOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  const latestNews = [
    {
      title: "Última hora: Nuevo acuerdo comercial entre Ecuador y la Unión Europea",
      excerpt:
        "El gobierno ecuatoriano anuncia un histórico acuerdo que beneficiará a múltiples sectores de la economía nacional.",
      image: "/generic-movie-poster.png?height=300&width=400&query=business+handshake+flags",
      category: "ECONOMÍA",
      date: "Hace 15 minutos",
      time: "16 Oct 2025, 14:45",
    },
    {
      title: "Alerta meteorológica: Fuertes lluvias esperadas en la costa ecuatoriana",
      excerpt: "El INAMHI emite advertencia para las próximas 48 horas en las provincias costeras del país.",
      image: "/generic-movie-poster.png?height=300&width=400&query=heavy+rain+storm",
      category: "CLIMA",
      date: "Hace 32 minutos",
      time: "16 Oct 2025, 14:28",
    },
    {
      title: "Selección ecuatoriana se prepara para el próximo partido eliminatorio",
      excerpt: "La Tri intensifica entrenamientos de cara al crucial encuentro de la próxima semana.",
      image: "/generic-movie-poster.png?height=300&width=400&query=soccer+training+ecuador",
      category: "DEPORTES",
      date: "Hace 1 hora",
      time: "16 Oct 2025, 14:00",
    },
    {
      title: "Descubren nueva especie de rana en la Amazonía ecuatoriana",
      excerpt:
        "Científicos ecuatorianos e internacionales anuncian el hallazgo de una especie única en la región amazónica.",
      image: "/generic-movie-poster.png?height=300&width=400&query=amazon+rainforest+frog",
      category: "CIENCIA",
      date: "Hace 2 horas",
      time: "16 Oct 2025, 13:00",
    },
    {
      title: "Inauguran nuevo hospital en Guayaquil con tecnología de última generación",
      excerpt: "El centro médico contará con equipamiento de punta para atender a miles de pacientes.",
      image: "/generic-movie-poster.png?height=300&width=400&query=modern+hospital+building",
      category: "SALUD",
      date: "Hace 3 horas",
      time: "16 Oct 2025, 12:00",
    },
    {
      title: "Precio del petróleo alcanza nuevo máximo en el mercado internacional",
      excerpt: "El barril de crudo supera los $90 dólares, impactando la economía global.",
      image: "/generic-movie-poster.png?height=300&width=400&query=oil+barrels+industry",
      category: "ECONOMÍA",
      date: "Hace 4 horas",
      time: "16 Oct 2025, 11:00",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar Menu */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-[#003952] text-white transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button onClick={() => setMenuOpen(false)} className="hover:opacity-70">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4 overflow-y-auto max-h-[calc(100vh-88px)]">
          <Link
            href="/lo-ultimo"
            className="w-full flex items-center gap-3 p-4 bg-white/10 rounded-lg transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">LO ÚLTIMO</span>
          </Link>

          <Link
            href="/noticias"
            className="w-full flex items-center gap-3 p-4 hover:bg-white/5 rounded-lg transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            <Newspaper className="w-5 h-5" />
            <span className="font-medium">NOTICIAS</span>
          </Link>

          <Link
            href="/mundo"
            className="w-full flex items-center gap-3 p-4 hover:bg-white/5 rounded-lg transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            <Globe className="w-5 h-5" />
            <span className="font-medium">MUNDO</span>
          </Link>

          <Link
            href="/ecuaterra"
            className="w-full flex items-center gap-3 p-4 hover:bg-white/5 rounded-lg transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            <Leaf className="w-5 h-5" />
            <span className="font-medium">ECUATERRA</span>
          </Link>

          <Link
            href="/estilo"
            className="w-full flex items-center gap-3 p-4 hover:bg-white/5 rounded-lg transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">ESTILO</span>
          </Link>

          <Link
            href="/newsletters"
            className="w-full flex items-center gap-3 p-4 hover:bg-white/5 rounded-lg transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            <Mail className="w-5 h-5" />
            <span className="font-medium">NEWSLETTERS</span>
          </Link>

          <Link
            href="/especiales"
            className="w-full flex items-center gap-3 p-4 hover:bg-white/5 rounded-lg transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            <Star className="w-5 h-5" />
            <span className="font-medium">ESPECIALES</span>
          </Link>

          <div className="border-t border-white/10 my-4"></div>

          <div>
            <button
              onClick={() => setEntertainmentOpen(!entertainmentOpen)}
              className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Film className="w-5 h-5" />
                <span className="font-medium">ENTRETENIMIENTO</span>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${entertainmentOpen ? "rotate-180" : ""}`} />
            </button>
            {entertainmentOpen && (
              <div className="ml-8 space-y-1">
                <Link
                  href="/cine"
                  className="block p-3 hover:bg-white/5 rounded-lg transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <Film className="w-4 h-4" />
                    <span>Cine</span>
                  </div>
                </Link>
                <Link
                  href="/musica"
                  className="block p-3 hover:bg-white/5 rounded-lg transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <Music className="w-4 h-4" />
                    <span>Música</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Overlay */}
      {menuOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setMenuOpen(false)} />}

      {/* Header */}
      <header className="bg-[#e8e4d9] py-6">
        <div className="container mx-auto px-4">
          <Link href="/">
            <img
              src="/images/design-mode/AneupiTV-BupbLIMM_edited_edited.png"
              alt="ANEUPI TV Internacional"
              className="h-20 mx-auto cursor-pointer"
            />
          </Link>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-[#003952] sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <button onClick={() => setMenuOpen(true)} className="hover:opacity-70 transition-opacity text-white">
                <Menu className="w-6 h-6" />
              </button>
              <Link href="/" className="flex items-center gap-2 text-sm hover:opacity-70 text-white">
                <Home className="w-4 h-4" />
                <span>Inicio</span>
              </Link>
              <Link href="#" className="flex items-center gap-2 text-sm hover:opacity-70 text-white">
                <Film className="w-4 h-4" />
                <span>Entretenimiento</span>
                <ChevronDown className="w-4 h-4" />
              </Link>
              <Link href="/tv-en-vivo" className="flex items-center gap-2 text-sm hover:opacity-70 text-white">
                <Tv className="w-4 h-4" />
                <span>TV en Vivo</span>
              </Link>
            </div>
            <div className="flex items-center gap-4 text-white">
              <button className="text-sm hover:opacity-70">
                ES
                <ChevronDown className="w-3 h-3 inline ml-1" />
              </button>
              <button className="hover:opacity-70">
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-2 text-sm hover:opacity-70"
              >
                <User className="w-5 h-5" />
                <span>Iniciar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-8 h-8 text-red-600" />
            <h1 className="text-4xl font-bold text-gray-900">Lo Último</h1>
          </div>
          <p className="text-gray-600 text-lg">Las noticias más recientes actualizadas en tiempo real</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestNews.map((article, idx) => (
            <article
              key={idx}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase rounded">
                  {article.category}
                </div>
                <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 text-xs rounded flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.date}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors leading-tight text-balance">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">{article.excerpt}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>{article.time}</span>
                    </div>
                    <button className="flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors font-semibold text-xs">
                      Leer más <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      <SiteFooter />
    </div>
  )
}
