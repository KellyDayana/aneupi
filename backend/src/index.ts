import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import logger from './config/logger';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { initializeWebSocket } from './websocket';
import { createNewslettersModule } from './modulos/newsletters'; // Importación activa

export let io: Server;
async function startServer() {

  // Inicializamos Prisma con la extensión
  const prisma = new PrismaClient().$extends(withAccelerate()) as any;
  const app = express();

  app.use(express.json());
  app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));


  // --- INICIALIZACIÓN DE MÓDULOS CON IMPORTACIÓN DINÁMICA ---

  // 1. Módulos independientes y proveedores de servicios
  const { createReaccionesModule } = await import('./modulos/reacciones/reacciones.module');
  const { createAuthModule } = await import('./modulos/auth/auth.module');
  const { createTvModule } = await import('./modulos/tv-en-vivo/tv.module');
  const { createSolicitudesModule } = await import('./modulos/solicitudes/solicitudes.module');

  const newslettersModule = createNewslettersModule(prisma); // Módulo activo
  const reaccionesModule = createReaccionesModule(prisma);
  const authModule = createAuthModule(prisma);
  const tvModule = createTvModule(prisma);
  const solicitudesModule = createSolicitudesModule(prisma);

  // 2. Módulos que dependen de los anteriores
  const { createNoticiasModule } = await import('./modulos/noticias/noticias.module');
  const { createArticulosModule } = await import('./modulos/articulos/articulos.module');

  const noticiasModule = createNoticiasModule(prisma, reaccionesModule.service);
  const articulosModule = createArticulosModule(prisma, reaccionesModule.service);

  // 3. Módulos de comentarios que dependen de los repositorios
  const { createComentariosNoticiaModule } = await import('./modulos/comentarios-noticia/comentarios-noticia.module');
  const { createComentariosArticuloModule } = await import('./modulos/comentarios-articulo/comentarios-articulo.module');

  const comentariosNoticiaModule = createComentariosNoticiaModule(prisma, noticiasModule.repositories.noticias);
  const comentariosArticuloModule = createComentariosArticuloModule(prisma, articulosModule.repositories.articulos);

  // --- CONFIGURACIÓN DE RUTAS ---
  const { createReaccionesRouter } = await import('./modulos/reacciones/reacciones.routes');
  const { createNoticiasRouter } = await import('./modulos/noticias/noticias.routes');
  const { createArticulosRouter } = await import('./modulos/articulos/articulos.routes');

  app.use('/api/auth', authModule.router);
  app.use('/api/solicitudes-entrevista', solicitudesModule.router);
  app.use('/api/tv-en-vivo', tvModule.router);
  app.use('/api/reacciones', createReaccionesRouter(reaccionesModule.controller));
  app.use('/api/noticias', createNoticiasRouter(noticiasModule.controllers.noticias, comentariosNoticiaModule.controller));
  app.use('/api/articulos', createArticulosRouter(articulosModule.controllers.articulos, comentariosArticuloModule.controller));
  app.use('/api/newsletters', newslettersModule.router); // Ruta activa

  // --- MANEJO DE ERRORES Y RUTAS BASE ---
  app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

  app.get('/', (req, res) => {
    res.json({
      message: 'API Unificada de Noticias ANEUPI TV',
      version: '2.0.0',
      endpoints: {
        auth: '/api/auth',
        noticias: '/api/noticias',
        articulos: '/api/articulos',
        reacciones: '/api/reacciones',
        tvEnVivo: '/api/tv-en-vivo',
        solicitudesEntrevista: '/api/solicitudes-entrevista',
        newsletters: '/api/newsletters',
        health: '/health',
      },
    });
  });

  app.use((req, res) => res.status(404).json({ success: false, error: 'Ruta no encontrada' }));

  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error(`${req.method} ${req.originalUrl} - ${err.message} - ${err.stack}`);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  });

  // --- INICIO DEL SERVIDOR ---
  const PORT = process.env.PORT || 3001;
  const httpServer = http.createServer(app);

  io = new Server(httpServer, {
    cors: { origin: process.env.CORS_ORIGIN || "*" }
  });
  initializeWebSocket(io);

  httpServer.listen(PORT, () => {
    console.log(`
🚀 Servidor listo en: http://localhost:${PORT}
🔌 WebSocket escuchando conexiones...
📰 API de Noticias: http://localhost:${PORT}/api/noticias
📝 API de Artículos: http://localhost:${PORT}/api/articulos
📺 API de TV en Vivo: http://localhost:${PORT}/api/tv-en-vivo/directos
📧 API Newsletters: http://localhost:${PORT}/api/newsletters
💚 Health check: http://localhost:${PORT}/health
    `);
  });
}

startServer().catch(error => {
  console.error("❌❌❌ ERROR FATAL AL INICIAR:", error);
   process.exit(1);
});