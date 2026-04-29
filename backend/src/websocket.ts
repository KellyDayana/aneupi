import { Server, Socket } from 'socket.io';
import logger from './config/logger';

// Un objeto para llevar la cuenta de en qué sala está cada socket
const socketIdToVideoRoom = new Map<string, string>();

export function initializeWebSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    logger.info(`🔌 Nuevo cliente conectado: ${socket.id}`);

    // --- 1. EVENTO PARA UNIRSE A UNA SALA ---
    // El frontend lo emitirá cuando un usuario entre a ver un video.
    socket.on('joinRoom', (videoId: number) => {
      // Dejamos cualquier sala anterior para no recibir notificaciones dobles
      const previousRoom = socketIdToVideoRoom.get(socket.id);
      if (previousRoom) {
        socket.leave(previousRoom);
      }
      
      const roomName = `video-${videoId}`;
      socket.join(roomName);
      socketIdToVideoRoom.set(socket.id, roomName); // Guardamos la sala actual del socket
      logger.info(`[Socket ${socket.id}] se unió a la sala: ${roomName}`);

      // Emitimos el nuevo contador de espectadores a TODOS en la sala
      const viewerCount = io.sockets.adapter.rooms.get(roomName)?.size || 0;
      io.to(roomName).emit('updateViewerCount', viewerCount);
    });

    // --- 2. EVENTO PARA ABANDONAR UNA SALA ---
    // El frontend lo emitirá cuando el usuario cambie de video.
    socket.on('leaveRoom', (videoId: number) => {
      const roomName = `video-${videoId}`;
      socket.leave(roomName);
      socketIdToVideoRoom.delete(socket.id);
      logger.info(`[Socket ${socket.id}] abandonó la sala: ${roomName}`);

      // Actualizamos el contador para los que quedan
      const viewerCount = io.sockets.adapter.rooms.get(roomName)?.size || 0;
      io.to(roomName).emit('updateViewerCount', viewerCount);
    });
    
    // --- 3. EVENTO DE DESCONEXIÓN ---
    // Se dispara automáticamente cuando el usuario cierra la pestaña.
    socket.on('disconnect', () => {
      logger.info(`🔌 Cliente desconectado: ${socket.id}`);
      
      const roomName = socketIdToVideoRoom.get(socket.id);
      if (roomName) {
        // Si el socket estaba en una sala, actualizamos el contador de esa sala
        const viewerCount = (io.sockets.adapter.rooms.get(roomName)?.size || 1) - 1;
        io.to(roomName).emit('updateViewerCount', viewerCount);
        socketIdToVideoRoom.delete(socket.id);
      }
    });
  });
}