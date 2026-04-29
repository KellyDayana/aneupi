import { PrismaClient } from '@prisma/client';

export class NewslettersRepository {
  constructor(private prisma: PrismaClient) { }

  async obtenerTodos() {
    return this.prisma.newsletter.findMany({
      include: {
        _count: { select: { suscriptores: true } },
      },
      orderBy: { titulo: 'asc' },
    });
  }

  async suscribir(email: string, newsletterIds?: number[]) {
    return this.prisma.suscriptor.upsert({
      where: { email },
      update: {
        newsletters: {
          connect: newsletterIds ? newsletterIds.map(id => ({ newsletterId: id })) : undefined,
        },
      },
      create: {
        email,
        newsletters: {
          connect: newsletterIds ? newsletterIds.map(id => ({ newsletterId: id })) : undefined,
        },
      },
    });
  }
}