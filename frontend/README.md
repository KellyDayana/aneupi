# Frontend Aneupi TV

Interfaz web de la página de INICIO de ANEUPI·TV

## Tecnologías
- Next.js (App Router)  
- React + TypeScript  
- Tailwind CSS (utilidades en clases)  
- Lucide Icons (lucide-react)  
- Next/Image (o uso de <img> en public/)  
- ESLint / Prettier (configuración de proyecto recomendado)  

## Estructura principal
- app/page.tsx — Página principal / layout y lógica de UI (carrusel, listas, comentarios).  
- components/ — Componentes reutilizables (SiteHeader, SiteFooter, AuthModal, etc.).  
- public/ — Imágenes y assets (thumbnails, avatares).  
- styles/ o globals.css — Estilos globales (Tailwind config).  

## Funcionalidades clave
- Carrusel de noticia principal con autoplay/pause.  
- Buscador con filtros básicos (categoria / país).  
- Páginas de listas: Más Noticias, Videos y Noticiero.  
- Sistema simple de comentarios y votos (estado local / localStorage).  
- Integración para compartir en redes (links externos).

## Comandos rápidos
- Instalar dependencias: `npm install` o `pnpm install`
- Forzar instalar dependencias: `npm install --legacy-peer-deps`  
- Desarrollo (hot-reload): `npm run dev`