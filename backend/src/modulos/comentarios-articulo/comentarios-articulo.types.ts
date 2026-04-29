import { EstadoComentario, Prisma } from '@prisma/client';

export interface CrearComentarioArticuloDTO {
  mensaje: string;
  usuarioId: number;
  articuloId: number;
  respuestaAId?: number;
}

export interface ActualizarComentarioArticuloDTO {
  mensaje?: string;
  estado?: EstadoComentario;
}

export interface CambiarEstadoComentarioArticuloDTO {
  estado: EstadoComentario;
}

export type ComentarioArticulo = Prisma.ComentarioArticuloGetPayload<{
  include: {
    usuario: true;
    respuesta_a: true;
    respuestas: true;
  };
}>;

export { EstadoComentario };
