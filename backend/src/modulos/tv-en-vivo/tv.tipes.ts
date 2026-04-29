export interface CrearVideoDTO {
    titulo: string;
    descripcion: string;
    urlVideo: string;
    urlThumbnail: string;
    duracionSegundos: number;
    enVivo?: boolean;
    programaId: number;
    categoriaId: number;
}

export interface ActualizarVideoDTO {
    titulo?: string;
    descripcion?: string;
    urlVideo?: string;
    urlThumbnail?: string;
    duracionSegundos?: number;
    enVivo?: boolean;
    programaId?: number;
    categoriaId?: number;
}