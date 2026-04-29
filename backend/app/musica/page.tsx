"use client"

import { useState } from "react"
import { Menu, X, Home, Film, Tv, Search, User, ChevronDown, Music, Play, Heart } from "lucide-react"
import Link from "next/link"

export default function MusicaPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [entertainmentOpen, setEntertainmentOpen] = useState(false)

  const featuredArtist = {
    name: "Luna Martínez",
    genre: "Pop Latino",
    description:
      "La sensación del momento con su nuevo álbum 'Horizontes'. Una mezcla perfecta de ritmos latinos contemporáneos con letras que conectan con toda una generación.",
    image: "/female-latin-pop-singer-concert.jpg",
    listeners: "5.2M",
    songs: "48",
  }

  const topArtists = [
    {
      name: "Carlos Vega",
      genre: "Rock Alternativo",
      image: "/male-rock-artist.jpg",
      listeners: "3.8M",
    },
    {
      name: "María Santos",
      genre: "Balada",
      image: "/female-ballad-singer.jpg",
      listeners: "4.1M",
    },
    {
      name: "Los Hermanos del Sur",
      genre: "Cumbia",
      image: "/cumbia-band.jpg",
      listeners: "2.9M",
    },
  ]

  const topSongs = [
    {
      title: "Corazón Valiente",
      artist: "Luna Martínez",
      album: "Horizontes",
      duration: "3:45",
      image: "/pop-album-cover.png",
    },
    {
      title: "Caminos Perdidos",
      artist: "Carlos Vega",
      album: "Ecos del Pasado",
      duration: "4:12",
      image: "/rock-album-cover.png",
    },
    {
      title: "Amor Eterno",
      artist: "María Santos",
      album: "Sentimientos",
      duration: "3:58",
      image: "/ballad-album-art.jpg",
    },
    {
      title: "Fiesta en la Playa",
      artist: "Los Hermanos del Sur",
      album: "Verano Tropical",
      duration: "3:22",
      image: "/tropical-music-cover.jpg",
    },
    {
      title: "Sueños de Libertad",
      artist: "Luna Martínez",
      album: "Horizontes",
      duration: "4:05",
      image: "/pop-album-art.jpg",
    },
  ]

  const playlists = [
    {
      name: "Éxitos Latinos 2025",
      description: "Lo mejor de la música latina actual",
      image: "/latin-music-playlist.jpg",
      songs: 50,
    },
    {
      name: "Rock en Español",
      description: "Los clásicos y lo nuevo del rock latino",
      image: "/spanish-rock-playlist.jpg",
      songs: 75,
    },
    {
      name: "Baladas Románticas",
      description: "Para los momentos especiales",
      image: "/romantic-ballads-playlist.jpg",
      songs: 60,
    },
    {
      name: "Ritmos Tropicales",
      description: "Cumbia, salsa y más para bailar",
      image: "/tropical-rhythms-playlist.jpg",
      songs: 80,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-gray-900 to-black text-white">
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
                  className="block p-3 bg-white/10 rounded-lg transition-colors"
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
                href="/musica"
                className="flex items-center gap-2 text-sm hover:opacity-70 border-b-2 border-yellow-400 pb-1 text-white"
              >
                <Music className="w-4 h-4" />
                <span>Música</span>
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
      <section className="relative h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(88,28,135,0.9) 40%, rgba(88,28,135,0.3)), url(${featuredArtist.image})`,
          }}
        />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <span className="text-sm uppercase tracking-wider text-purple-300 mb-2 block">Artista Destacado</span>
            <h1 className="text-6xl font-bold mb-4">{featuredArtist.name}</h1>
            <p className="text-xl mb-4 text-purple-200">{featuredArtist.genre}</p>
            <p className="text-lg mb-6 leading-relaxed">{featuredArtist.description}</p>
            <div className="flex items-center gap-6 mb-6 text-sm">
              <div>
                <span className="text-purple-300">Oyentes</span>
                <p className="text-2xl font-bold">{featuredArtist.listeners}</p>
              </div>
              <div>
                <span className="text-purple-300">Canciones</span>
                <p className="text-2xl font-bold">{featuredArtist.songs}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="bg-purple-600 text-white px-8 py-3 rounded-full flex items-center gap-2 font-semibold hover:bg-purple-700 transition-colors">
                <Play className="w-5 h-5 fill-current" />
                Reproducir
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-full flex items-center gap-2 font-semibold hover:bg-white/10 transition-colors">
                <Heart className="w-5 h-5" />
                Seguir
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Top Artists */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6">Artistas Populares</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {topArtists.map((artist, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="relative h-64">
                <img
                  src={artist.image || "/placeholder.svg"}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{artist.name}</h3>
                <p className="text-purple-300 mb-3">{artist.genre}</p>
                <p className="text-sm text-gray-400">{artist.listeners} oyentes mensuales</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Songs */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6">Canciones Más Escuchadas</h2>
        <div className="bg-gray-900/50 rounded-lg p-6">
          <div className="space-y-4">
            {topSongs.map((song, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <span className="text-gray-400 w-8 text-center">{idx + 1}</span>
                <img src={song.image || "/placeholder.svg"} alt={song.title} className="w-16 h-16 rounded" />
                <div className="flex-1">
                  <h4 className="font-semibold group-hover:text-purple-400 transition-colors">{song.title}</h4>
                  <p className="text-sm text-gray-400">{song.artist}</p>
                </div>
                <span className="text-sm text-gray-400">{song.album}</span>
                <span className="text-sm text-gray-400">{song.duration}</span>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart className="w-5 h-5 text-gray-400 hover:text-purple-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Playlists */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6">Playlists Recomendadas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {playlists.map((playlist, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="relative h-64 rounded-lg overflow-hidden mb-3">
                <img
                  src={playlist.image || "/placeholder.svg"}
                  alt={playlist.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <button className="absolute bottom-4 right-4 bg-purple-600 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110">
                  <Play className="w-5 h-5 fill-current" />
                </button>
              </div>
              <h3 className="font-bold mb-1 group-hover:text-purple-400 transition-colors">{playlist.name}</h3>
              <p className="text-sm text-gray-400">{playlist.description}</p>
              <p className="text-xs text-gray-500 mt-1">{playlist.songs} canciones</p>
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
