"use client"

import { useState } from "react"
import { Menu, X, Home, Film, Tv, Search, User, ChevronDown, Music, Play, Star } from "lucide-react"
import Link from "next/link"

export default function CinePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [entertainmentOpen, setEntertainmentOpen] = useState(false)

  const movies = [
    {
      title: "El Último Guardián",
      description:
        "En un mundo al borde del colapso, un héroe solitario debe enfrentar su pasado para salvar el futuro de la humanidad. Una épica aventura llena de acción, emoción y momentos inolvidables.",
      year: "2025",
      rating: "16+",
      duration: "2h 24min",
      match: "98%",
      image: "/action-movie-hero-background-dark-cinematic.jpg",
      genre: "Acción",
    },
    {
      title: "Lazos Familiares",
      description:
        "Una conmovedora historia sobre una familia que debe superar sus diferencias para mantenerse unida en tiempos difíciles.",
      year: "2024",
      rating: "13+",
      duration: "1h 52min",
      match: "95%",
      image: "/family-drama-movie-poster-parents-child.jpg",
      genre: "Drama Familiar",
    },
    {
      title: "Ciudad de Sombras",
      description:
        "Un detective debe resolver el caso más complejo de su carrera mientras enfrenta sus propios demonios internos.",
      year: "2025",
      rating: "18+",
      duration: "2h 10min",
      match: "92%",
      image: "/action-movie-silhouette-city.jpg",
      genre: "Thriller",
    },
  ]

  const upcomingMovies = [
    {
      title: "Horizonte Infinito",
      releaseDate: "Noviembre 2025",
      image: "/sci-fi-movie-poster.png",
      genre: "Ciencia Ficción",
    },
    {
      title: "El Secreto del Bosque",
      releaseDate: "Diciembre 2025",
      image: "/mystery-forest-movie.jpg",
      genre: "Misterio",
    },
    {
      title: "Amor en Tiempos Modernos",
      releaseDate: "Enero 2026",
      image: "/romantic-comedy-poster.jpg",
      genre: "Comedia Romántica",
    },
    {
      title: "La Última Batalla",
      releaseDate: "Febrero 2026",
      image: "/war-epic-movie.jpg",
      genre: "Bélico",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
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
        <nav className="p-4">
          <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <Film className="w-5 h-5" />
              <span>Noticias</span>
            </div>
            <ChevronDown className="w-5 h-5" />
          </button>
          <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <Tv className="w-5 h-5" />
              <span>Deportes</span>
            </div>
            <ChevronDown className="w-5 h-5" />
          </button>
          <div>
            <button
              onClick={() => setEntertainmentOpen(!entertainmentOpen)}
              className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Film className="w-5 h-5" />
                <span>Entretenimiento</span>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${entertainmentOpen ? "rotate-180" : ""}`} />
            </button>
            {entertainmentOpen && (
              <div className="ml-8 space-y-1">
                <Link
                  href="/cine"
                  className="block p-3 bg-white/10 rounded-lg transition-colors"
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
          <button className="w-full flex items-center justify-between p-4 bg-[#f5f0e8] text-[#003952] rounded-lg">
            <div className="flex items-center gap-3">
              <Tv className="w-5 h-5" />
              <span>Guía</span>
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <Film className="w-5 h-5" />
              <span>Estilo</span>
            </div>
            <ChevronDown className="w-5 h-5" />
          </button>
        </nav>
      </div>

      {/* Overlay */}
      {menuOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setMenuOpen(false)} />}

      {/* Header */}
      <header className="bg-[#e8e4d9] py-6">
        <div className="container mx-auto px-4">
          <Link href="/">
            <img src="/logo.png" alt="ANEUPI TV Internacional" className="h-20 mx-auto cursor-pointer" />
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
              <Link
                href="/cine"
                className="flex items-center gap-2 text-sm hover:opacity-70 border-b-2 border-yellow-400 pb-1 text-white"
              >
                <Film className="w-4 h-4" />
                <span>Cine</span>
              </Link>
              <a href="#" className="flex items-center gap-2 text-sm hover:opacity-70 text-white">
                <Tv className="w-4 h-4" />
                <span>TV en Vivo</span>
              </a>
            </div>
            <div className="flex items-center gap-4 text-white">
              <button className="text-sm hover:opacity-70">
                ES
                <ChevronDown className="w-3 h-3 inline ml-1" />
              </button>
              <button className="hover:opacity-70">
                <Search className="w-5 h-5" />
              </button>
              <button className="flex items-center gap-2 text-sm hover:opacity-70">
                <User className="w-5 h-5" />
                <span>Iniciar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9) 40%, rgba(0,0,0,0.3)), url(${movies[0].image})`,
          }}
        />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-4 text-balance">{movies[0].title}</h1>
            <div className="flex items-center gap-4 mb-4 text-sm">
              <span className="text-green-400 font-bold">{movies[0].match} Match</span>
              <span>{movies[0].year}</span>
              <span className="border border-white/50 px-2 py-0.5">{movies[0].rating}</span>
              <span>{movies[0].duration}</span>
            </div>
            <p className="text-lg mb-6 leading-relaxed">{movies[0].description}</p>
            <div className="flex gap-4">
              <button className="bg-white text-black px-8 py-3 rounded flex items-center gap-2 font-semibold hover:bg-white/90 transition-colors">
                <Play className="w-5 h-5 fill-current" />
                Reproducir
              </button>
              <button className="bg-gray-700/80 text-white px-8 py-3 rounded flex items-center gap-2 font-semibold hover:bg-gray-700 transition-colors">
                Más información
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Movies */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6">Películas Destacadas</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.slice(1).map((movie, idx) => (
            <div
              key={idx}
              className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="relative h-64">
                <img src={movie.image || "/placeholder.svg"} alt={movie.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{movie.match}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{movie.title}</h3>
                <div className="flex items-center gap-3 mb-3 text-sm text-gray-400">
                  <span>{movie.year}</span>
                  <span className="border border-gray-600 px-2 py-0.5">{movie.rating}</span>
                  <span>{movie.duration}</span>
                </div>
                <p className="text-gray-300 text-sm line-clamp-2">{movie.description}</p>
                <span className="inline-block mt-3 text-xs bg-blue-600 px-3 py-1 rounded">{movie.genre}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Movies */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6">Próximos Estrenos</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {upcomingMovies.map((movie, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="relative h-80 rounded-lg overflow-hidden mb-3">
                <img
                  src={movie.image || "/placeholder.svg"}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-xs bg-red-600 px-2 py-1 rounded">{movie.genre}</span>
                </div>
              </div>
              <h3 className="font-bold mb-1 group-hover:text-blue-400 transition-colors">{movie.title}</h3>
              <p className="text-sm text-gray-400">{movie.releaseDate}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-[#003952] text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">
            Tu fuente de noticias nacionales, cobertura deportiva y entretenimiento de calidad
          </p>
        </div>
      </footer>
    </div>
  )
}
