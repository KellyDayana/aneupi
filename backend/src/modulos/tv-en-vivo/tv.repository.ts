import { PrismaClient } from '@prisma/client';
import { CrearVideoDTO, ActualizarVideoDTO } from './tv.tipes';

export class TvRepository {
    constructor(private prisma: PrismaClient) { }

    async crear(data: CrearVideoDTO) {
        return this.prisma.tvVideo.create({
            data,
            include: { programa: true, categoria: true },
        });
    }

    async obtenerDirectos() {
        return this.prisma.tvVideo.findMany({
            where: { enVivo: true },
            orderBy: { fechaPublicacion: 'desc' },
            include: { programa: true, categoria: true },
        });
    }

    // --- AGREGADO: Método necesario para la ruta /destacados ---
    async obtenerDestacados() {
        return this.prisma.tvVideo.findMany({
            take: 5,
            orderBy: { likes: 'desc' },
            include: { programa: true, categoria: true },
        });
    }

    async obtenerPorId(id: number) {
        return this.prisma.tvVideo.findUnique({
            where: { videoId: id },
            include: { programa: true, categoria: true },
        });
    }

    async actualizar(id: number, data: ActualizarVideoDTO) {
        return this.prisma.tvVideo.update({
            where: { videoId: id },
            data,
            include: { programa: true, categoria: true },
        });
    }

    async darLike(videoId: number) {
        return this.prisma.tvVideo.update({
            where: { videoId: videoId },
            data: { likes: { increment: 1 } },
            select: { likes: true, dislikes: true },
        });
    }

    async darDislike(videoId: number) {
        return this.prisma.tvVideo.update({
            where: { videoId: videoId },
            data: { dislikes: { increment: 1 } },
            select: { likes: true, dislikes: true },
        });
    }

    async obtenerProgramacionPorDia(programaId: number, fechaInicio: Date, fechaFin: Date) {
        return this.prisma.programacionItem.findMany({
            where: {
                programaId: programaId,
                fecha_hora_inicio: { gte: fechaInicio, lt: fechaFin },
            },
            orderBy: { fecha_hora_inicio: 'asc' },
        });
    }

    async obtenerTodosLosProgramas() {
        return this.prisma.programa.findMany({
            orderBy: {
                nombre: 'asc',
            },
            // AGREGADO: Incluir presentador para que el frontend tenga esa info
            include: {
                presentador: {
                    select: {
                        nombre_completo: true,
                        email: true,
                    },
                },
            },
        });
    }
}