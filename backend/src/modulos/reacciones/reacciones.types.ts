import { TipoReaccion } from '@prisma/client';
export { TipoReaccion };

export enum TipoEntidad {
  NOTICIA = 'NOTICIA',
  ARTICULO = 'ARTICULO',
  COMENTARIO_NOTICIA = 'COMENTARIO_NOTICIA',
  COMENTARIO_ARTICULO = 'COMENTARIO_ARTICULO',
}

export interface ManejarReaccionDTO {
  usuarioId: number;
  tipoEntidad: TipoEntidad;
  entidadId: number;
  tipoReaccion: TipoReaccion;
}

export interface ConteoReacciones {
  [key: string]: number;
}

export interface ReaccionUsuario {
  tieneReaccion: boolean;
  tipoReaccion?: TipoReaccion;
  reaccionId?: number;
}