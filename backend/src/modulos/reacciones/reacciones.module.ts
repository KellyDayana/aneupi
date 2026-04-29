import { PrismaClient } from '@prisma/client';
import { ReaccionesRepository } from './reacciones.repository';
import { ReaccionesService } from './reacciones.service';
import { ReaccionesController } from './reacciones.controller';

export function createReaccionesModule(prisma: PrismaClient) {
    const repository = new ReaccionesRepository(prisma);
    const service = new ReaccionesService(repository);
    const controller = new ReaccionesController(service);

    return { repository, service, controller };
}