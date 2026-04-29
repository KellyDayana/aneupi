import { TvRepository } from './tv.repository';
// Asegúrate de importar tus DTOs si los necesitas, o usa 'any' si prefieres flexibilidad por ahora
import { CrearVideoDTO } from './tv.tipes';

export class TvService {
    // CAMBIO IMPORTANTE: Inyectamos el Repository, no PrismaClient
    constructor(private repository: TvRepository) { }

    async obtenerProgramas() {
        return this.repository.obtenerTodosLosProgramas();
    }

    async obtenerVideosEnVivo() {
        return this.repository.obtenerDirectos();
    }

    async obtenerDestacados() {
        return this.repository.obtenerDestacados();
    }

    async crearVideo(data: CrearVideoDTO) {
        // Aquí pasamos la data al repositorio
        return this.repository.crear(data);
    }

    async darLikeAVideo(videoId: number) {
        return this.repository.darLike(videoId);
    }

    async darDislikeAVideo(videoId: number) {
        return this.repository.darDislike(videoId);
    }

    async obtenerProgramacionDelDia(programaId: number, fecha: string) {
        // Lógica de negocio: Calcular inicio y fin del día
        const startOfDay = new Date(`${fecha}T00:00:00.000Z`);
        const endOfDay = new Date(`${fecha}T23:59:59.999Z`);

        // Llamada al repositorio con las fechas calculadas
        return this.repository.obtenerProgramacionPorDia(programaId, startOfDay, endOfDay);
    }
}