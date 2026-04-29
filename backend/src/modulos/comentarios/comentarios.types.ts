export type EntidadTipo = 'noticia' | 'articulo' | 'video';
export interface CrearComentarioDTO { mensaje: string; usuarioId: number; entidadId: number; entidadTipo: EntidadTipo; }
export interface CrearRespuestaDTO { mensaje: string; usuarioId: number; comentarioPadreId: number; }