"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { apiPersistence } from "@/lib/api-persistence"

type Language = "es" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations: Record<Language, Record<string, string>> = {
  es: {
    // Navigation
    "nav.home": "Inicio",
    "nav.articles": "Articulos",
    "nav.live": "TV en Vivo",
    "nav.login": "Iniciar Sesión",
    "nav.logout": "Cerrar Sesión",


    // General
    "general.search": "Buscar",
    "general.close": "Cerrar",
    "general.open": "Abrir",
    "general.readMore": "Leer más",
    "general.share": "Compartir",
    "general.send": "Enviar",

    // Live TV
    "live.title": "TV en Vivo",
    "live.schedule": "Programación",
    "live.chat": "Comentarios",
    "live.sendMessage": "Enviar mensaje",
    "live.typePlaceholder": "Escribe un mensaje...",
    "live.liveNow": "EN VIVO",
    "live.viewers": "espectadores",
    "live.react": "Reaccionar",
    "live.reply": "Responder",
    "live.writeReply": "Escribe una respuesta...",
    "live.remindNext": "Recordar próxima transmisión",
    "live.reminding": "Recordando",
    "live.availableChannels": "Canales Disponibles",
    "live.featured": "Relevante",
    "live.popular": "POPULAR",
    "live.remindStart": "Recordar inicio",
    "live.loginToComment": "Inicia sesión en Aagale para comentar",
    "live.watch": "Ver ahora",

    // Home Page
    "home.featuredCategory": "LA NOTICIA A FONDO",
    "home.latestNews": "Últimas Noticias",
    "home.moreNews": "Más Noticias",
    "home.category.ecuador": "ECUADOR",
    "home.category.economy": "ECONOMÍA",
    "home.category.usa": "EE. UU.",
    "home.category.security": "SEGURIDAD",

    // Cinema Page
    "cinema.title": "Cine",
    "cinema.play": "Reproducir",
    "cinema.moreInfo": "Más información",
    "cinema.featured": "Películas Destacadas",
    "cinema.upcoming": "Próximos Estrenos",
    "cinema.match": "Match",
    "cinema.genre.action": "Acción",
    "cinema.genre.drama": "Drama Familiar",
    "cinema.genre.thriller": "Thriller",
    "cinema.genre.scifi": "Ciencia Ficción",
    "cinema.genre.mystery": "Misterio",
    "cinema.genre.romance": "Comedia Romántica",
    "cinema.genre.war": "Bélico",

    // Footer
    "footer.aboutUs": "Nosotros",
    "footer.aboutText":
      "ANEUPI TV Internacional es tu fuente confiable de noticias nacionales, cobertura deportiva y entretenimiento de calidad.",
    "footer.quickLinks": "Enlaces Rápidos",
    "footer.moreInfo": "Más Información",
    "footer.followUs": "Síguenos",
    "footer.stayConnected": "Mantente conectado con nosotros en redes sociales",
    "footer.rights": "Todos los derechos reservados.",
    "footer.news": "Noticias",
    "footer.world": "Mundo",
    "footer.style": "Estilo",
    "footer.liveTV": "TV en Vivo",
    "footer.specials": "Especiales",
    "footer.newsletters": "Newsletters",
    "footer.articles": "Artículos",
    "footer.privacy": "Política de Privacidad",
    "footer.tagline": "Tu fuente de noticias nacionales, cobertura deportiva y entretenimiento de calidad",

    // Buttons
    "button.like": "Me gusta",
    "button.dislike": "No me gusta",
    "button.fullscreen": "Pantalla completa",
    "button.showComments": "Mostrar comentarios",
    "button.hideComments": "Ocultar comentarios",

    // Interview
    "interview.offer": "Ofrecer Entrevista",

    // Comments
    "comments.count": "comentarios",
    "comments.count.singular": "comentario",
    
    // Time
    "time.now": "Ahora",
    "time.ago": "Hace",
    "time.min": "min",
    "time.minutes": "minutos",
    "time.hour": "hora",
    "time.hours": "horas",
    "time.day": "día",
    "time.days": "días",

    // Video Quality
    "quality.title": "Calidad",

    // Share Modal
    "share.title": "Compartir en",
    "share.copyLink": "Copiar enlace",
    "share.copied": "Copiado",
    "share.linkCopied": "Enlace copiado",
    "share.defaultTitle": "TV en Vivo - ANEUPI",

    // Terms Modal
    "terms.title": "Términos y condiciones",
    "terms.welcome": "¡Bienvenido!",
    "terms.mainRules": "Reglas de uso principales",
    "terms.cancel": "Cancelar",
    "terms.subtitle": "Para acceder a la sección de TV en vivo, por favor revisa y acepta los términos y condiciones y las reglas de uso.",
    "terms.rule1Title": "Respeto y cordialidad:",
    "terms.rule1": "Los usuarios deben mantener un lenguaje respetuoso en comentarios y publicaciones.",
    "terms.rule2Title": "Contenido permitido:",
    "terms.rule2": "No publicar contenido ilegal, discriminatorio o que infrinja derechos de terceros.",
    "terms.rule3Title": "Privacidad:",
    "terms.rule3": "No compartir datos personales de terceros sin consentimiento.",
    "terms.rule4Title": "Moderación:",
    "terms.rule4": "El equipo puede eliminar o moderar contenido que infrinja estas reglas.",
    "terms.rule5Title": "Uso responsable:",
    "terms.rule5": "Uso responsable y con fines informativos.",
    "terms.accept": "Acepto los términos y condiciones y las reglas de uso",
    "terms.acceptAndContinue": "Aceptar y continuar",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.articles": "Articles",
    "nav.live": "Live TV",
    "nav.login": "Sign In",
    "nav.logout": "Sign Out",


    // General
    "general.search": "Search",
    "general.close": "Close",
    "general.open": "Open",
    "general.readMore": "Read more",
    "general.share": "Share",
    "general.send": "Send",

    // Live TV
    "live.title": "Live TV",
    "live.schedule": "Schedule",
    "live.chat": "Comments",
    "live.sendMessage": "Send message",
    "live.typePlaceholder": "Type a message...",
    "live.liveNow": "LIVE",
    "live.viewers": "viewers",
    "live.react": "React",
    "live.reply": "Reply",
    "live.writeReply": "Write a reply...",
    "live.remindNext": "Remind next broadcast",
    "live.reminding": "Reminding",
    "live.availableChannels": "Available Channels",
    "live.featured": "Most popular",
    "live.popular": "POPULAR",
    "live.remindStart": "Remind start",
    "live.loginToComment": "Sign in to Aagale to comment",
    "live.watch": "Watch now",

    // Home Page
    "home.featuredCategory": "IN-DEPTH NEWS",
    "home.latestNews": "Latest News",
    "home.moreNews": "More News",
    "home.category.ecuador": "ECUADOR",
    "home.category.economy": "ECONOMY",
    "home.category.usa": "U.S.A.",
    "home.category.security": "SECURITY",

    // Cinema Page
    "cinema.title": "Cinema",
    "cinema.play": "Play",
    "cinema.moreInfo": "More info",
    "cinema.featured": "Featured Movies",
    "cinema.upcoming": "Coming Soon",
    "cinema.match": "Match",
    "cinema.genre.action": "Action",
    "cinema.genre.drama": "Family Drama",
    "cinema.genre.thriller": "Thriller",
    "cinema.genre.scifi": "Science Fiction",
    "cinema.genre.mystery": "Mystery",
    "cinema.genre.romance": "Romantic Comedy",
    "cinema.genre.war": "War",

    // Footer
    "footer.aboutUs": "About Us",
    "footer.aboutText":
      "ANEUPI TV Internacional is your trusted source for national news, sports coverage and quality entertainment.",
    "footer.quickLinks": "Quick Links",
    "footer.moreInfo": "More Information",
    "footer.followUs": "Follow Us",
    "footer.stayConnected": "Stay connected with us on social media",
    "footer.rights": "All rights reserved.",
    "footer.news": "News",
    "footer.world": "World",
    "footer.style": "Style",
    "footer.liveTV": "Live TV",
    "footer.specials": "Specials",
    "footer.newsletters": "Newsletters",
    "footer.articles": "Articles",
    "footer.privacy": "Privacy Policy",
    "footer.tagline": "Your source for national news, sports coverage and quality entertainment",

    // Buttons
    "button.like": "Like",
    "button.dislike": "Dislike",
    "button.fullscreen": "Fullscreen",
    "button.showComments": "Show comments",
    "button.hideComments": "Hide comments",

    // Interview
    "interview.offer": "Offer Interview",

    // Comments
    "comments.count": "comments",
    "comments.count.singular": "comment",
    
    // Time
    "time.now": "Now",
    "time.ago": "ago",
    "time.min": "min",
    "time.minutes": "minutes",
    "time.hour": "hour",
    "time.hours": "hours",
    "time.day": "day",
    "time.days": "days",

    // Video Quality
    "quality.title": "Quality",

    // Share Modal
    "share.title": "Share on",
    "share.copyLink": "Copy link",
    "share.copied": "Copied",
    "share.linkCopied": "Link copied",
    "share.defaultTitle": "Live TV - ANEUPI",

    // Terms Modal
    "terms.title": "Terms and conditions",
    "terms.welcome": "Welcome!",
    "terms.mainRules": "Main usage rules",
    "terms.cancel": "Cancel",
    "terms.subtitle": "To access the live TV section, please review and accept the terms and conditions and usage rules.",
    "terms.rule1Title": "Respect and cordiality:",
    "terms.rule1": "Users must maintain respectful language in comments and posts.",
    "terms.rule2Title": "Permitted content:",
    "terms.rule2": "Do not publish illegal, discriminatory content or content that infringes third-party rights.",
    "terms.rule3Title": "Privacy:",
    "terms.rule3": "Do not share personal data of third parties without consent.",
    "terms.rule4Title": "Moderation:",
    "terms.rule4": "The team may remove or moderate content that violates these rules.",
    "terms.rule5Title": "Responsible use:",
    "terms.rule5": "Responsible use and for informational purposes.",
    "terms.accept": "I accept the terms and conditions and usage rules",
    "terms.acceptAndContinue": "Accept and continue",
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadLanguage() {
      try {
        const savedLanguage = await apiPersistence.getSinglePreference("language")
        if (savedLanguage && (savedLanguage === "es" || savedLanguage === "en")) {
          setLanguageState(savedLanguage)
          document.documentElement.lang = savedLanguage
        } else {
          // Fallback a localStorage
          const storedLanguage = localStorage.getItem("language") as Language
          if (storedLanguage && (storedLanguage === "es" || storedLanguage === "en")) {
            setLanguageState(storedLanguage)
            document.documentElement.lang = storedLanguage
          }
        }
      } catch (error) {
        console.error("Error loading language from API:", error)
        // Fallback a localStorage
        try {
          const storedLanguage = localStorage.getItem("language") as Language
          if (storedLanguage && (storedLanguage === "es" || storedLanguage === "en")) {
            setLanguageState(storedLanguage)
            document.documentElement.lang = storedLanguage
          }
        } catch (fallbackError) {
          console.error("Error loading language from localStorage:", fallbackError)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadLanguage()
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    document.documentElement.lang = lang
    // Guardar en API
    apiPersistence.setSinglePreference("language", lang).catch((error) => {
      console.error("Error saving language to API:", error)
      // Fallback a localStorage
      try {
        localStorage.setItem("language", lang)
      } catch (fallbackError) {
        console.error("Error saving language to localStorage:", fallbackError)
      }
    })
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
