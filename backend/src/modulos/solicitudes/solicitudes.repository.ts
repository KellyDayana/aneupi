import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { crearSolicitudSchema } from './solicitudes.validation';

export class SolicitudesRepository {
    constructor(private prisma: PrismaClient) { }

    async crear(data: z.infer<typeof crearSolicitudSchema>, usuarioId?: number) {
        return this.prisma.solicitudEntrevista.create({
            data: {
                ...data,
                estado: 'pendiente', // Asignamos un estado por defecto
                usuarioId,
            },
        });
    }
}