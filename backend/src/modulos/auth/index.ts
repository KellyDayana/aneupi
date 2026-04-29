import { PrismaClient } from '@prisma/client';
import { AuthService } from './auth.service';
import { createAuthRouter } from './auth.routes';
export function createAuthModule(prisma: PrismaClient) {
  const service = new AuthService(prisma);
  const router = createAuthRouter(service);
  return { service, router };
}