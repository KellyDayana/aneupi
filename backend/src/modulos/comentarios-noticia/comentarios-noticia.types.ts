// en src/modulos/comentarios-noticia/comentarios-noticia.types.ts (CORREGIDO)
import { EstadoComentario, Prisma } from '@prisma/client';

export interface CrearComentarioNoticiaDTO {
  mensaje: string;
  usuarioId: number;      // Corregido
  noticiaId: number;      // Corregido
  respuestaAId?: number; // Corregido
}

export interface ActualizarComentarioNoticiaDTO {
  mensaje?: string;
  estado?: EstadoComentario;
}

export interface CambiarEstadoComentarioNoticiaDTO {
  estado: EstadoComentario;
}

export type ComentarioNoticia = Prisma.ComentarioNoticiaGetPayload<{
  include: {
    usuario: true;
    respuesta_a: true;
    respuestas: true;
  };
}>;

export { EstadoComentario };