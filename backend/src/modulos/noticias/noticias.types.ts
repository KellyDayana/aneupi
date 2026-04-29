import { EstadoNoticia } from '@prisma/client';

export interface CrearNoticiaDTO {
  titulo: string;
  extracto: string;
  contenido_noticia: string;
  url_imagen: string;
  url_preview_imagen: string;
  autorId: number;
  categoriaId: number;
  estado?: EstadoNoticia; // Opcional, por defecto será PENDIENTE_APROBACION
}

export interface ActualizarNoticiaDTO {
  titulo?: string;
  extracto?: string;
  contenido_noticia?: string;
  url_imagen?: string;
  url_preview_imagen?: string;
  categoriaId?: number;
  estado?: EstadoNoticia; // Permitir actualizar el estado
}

export interface CambiarEstadoNoticiaDTO {
  estado: EstadoNoticia;
}

export interface FiltrosNoticia {
  categoriaId?: number;
  autorId?: number;
  estado?: EstadoNoticia; // Filtrar por estado
  search?: string;
  skip?: number;
  take?: number;
  orderBy?: 'asc' | 'desc';
}

// Re-exportar el enum para facilitar el uso
export { EstadoNoticia };
