import { PrismaClient } from '@prisma/client';
import { TvRepository } from './tv.repository';
import { TvService } from './tv.service';
import { TvController } from './tv.controller';
import { createTvRouter } from './tv.routes';

export function createTvModule(prisma: PrismaClient) {
    const repository = new TvRepository(prisma);
    const service = new TvService(repository);
    const controller = new TvController(service);
    const router = createTvRouter(controller);
    return { repository, service, controller, router };
}