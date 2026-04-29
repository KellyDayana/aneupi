// en src/modulos/articulos/articulos.types.ts (CORREGIDO)
import { EstadoNoticia } from '@prisma/client';

export type EstadoArticulo = EstadoNoticia;

export interface CrearArticuloDTO {
  titulo: string;
  descripcion: string;
  contenido: string;
  url_imagen: string;
  url_preview_imagen: string;
  tiempo_lectura: number;
  autorId: number;       // DEBE SER camelCase
  categoriaId: number;   // DEBE SER camelCase
  estado?: EstadoArticulo;
}

export interface ActualizarArticuloDTO {
  titulo?: string;
  descripcion?: string;
  contenido?: string;
  url_imagen?: string;
  url_preview_imagen?: string;
  tiempo_lectura?: number;
  categoriaId?: number; // Corregido
  estado?: EstadoArticulo;
}

export interface CambiarEstadoArticuloDTO {
  estado: EstadoArticulo;
}

export interface FiltrosArticulo {
  categoriaId?: number; // Corregido
  autorId?: number; // Corregido
  estado?: EstadoArticulo;
  search?: string;
  skip?: number;
  take?: number;
  orderBy?: 'asc' | 'desc';
}

export interface ActualizarTiempoLecturaDTO {
  tiempo_lectura: number;
}

export interface IncrementarTiempoLecturaDTO {
  incremento: number;
}