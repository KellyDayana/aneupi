export type NewsItem = {
  id: string
  title: string
  excerpt?: string
  description?: string
  category: string
  image?: string
  date: string
  featured?: boolean
  likes?: number
  views?: number
}

export const initialNews: NewsItem[] = [
  {
    id: "art-1",
    title: "Dirigentes indígenas y el Gobierno llegan a un acuerdo y termina el paro en Imbabura",
    excerpt:
      "La reunión entre ambas partes se realizó este 15 de octubre en Otavalo. Hoy, la ciudad fue testigo del registro manifestaciones y la provincia de Imbabura empezó a retornar la normalidad.",
    image: "/business-innovation-forum.jpg",
    category: "ECUADOR",
    date: "16 Oct 2025",
    likes: 0,
    views: 0,
  },
  {
    id: "art-2",
    title: "Indígenas de Imbabura dicen que hay grupos indígenas que desconocen el acuerdo con el Gobierno",
    excerpt: "Sectores mantienen posiciones enfrentadas tras el anuncio; siguen negociaciones locales.",
    image: "/community-voices-people-speaking.jpg",
    category: "ECUADOR",
    date: "16 Oct 2025",
    likes: 0,
    views: 0,
  },
  {
    id: "f3",
    title: "Deporte: victoria histórica en el torneo",
    description: "El equipo nacional consigue una victoria histórica en la final.",
    category: "DEPORTES",
    date: "14 Oct 2025",
    image: "/finanzas-para-emprendedores.jpg",
    views: 0,
  },
  {
    id: "f4",
    title: "Cultura: festival internacional de cine",
    description: "Se inaugura el festival con una selección de cine independiente.",
    category: "CULTURA",
    date: "13 Oct 2025",
    image: "/documentary-filming.png",
    views: 0,
  },
]