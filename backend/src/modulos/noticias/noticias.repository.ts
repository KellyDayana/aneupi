// src/modulos/noticias/noticias.repository.ts (ADAPTADO A camelCase)

import { PrismaClient, Prisma, EstadoNoticia } from '@prisma/client';
import { CrearNoticiaDTO, ActualizarNoticiaDTO, FiltrosNoticia } from './noticias.types';

export class NoticiasRepository {
  constructor(private prisma: PrismaClient) { }

  async crear(data: CrearNoticiaDTO) {
    return await this.prisma.noticia.create({
      data: {
        titulo: data.titulo,
        extracto: data.extracto,
        contenido_noticia: data.contenido_noticia,
        url_imagen: data.url_imagen,
        url_preview_imagen: data.url_preview_imagen,
        autorId: data.autorId,
        categoriaId: data.categoriaId,
        estado: data.estado,
      },
      include: {
        autor: {
          select: {
            usuarioId: true,
            nombre_completo: true,
            email: true,
          },
        },
        categoria: true,
      },
    });
  }

  async obtenerTodas(filtros: FiltrosNoticia) {
    const where: Prisma.NoticiaWhereInput = {};

    if (filtros.categoriaId) where.categoriaId = filtros.categoriaId;
    if (filtros.autorId) where.autorId = filtros.autorId;
    if (filtros.estado) where.estado = filtros.estado;
    if (filtros.search) {
      where.OR = [
        { titulo: { contains: filtros.search, mode: 'insensitive' } },
        { extracto: { contains: filtros.search, mode: 'insensitive' } },
        { contenido_noticia: { contains: filtros.search, mode: 'insensitive' } },
      ];
    }

    return await this.prisma.noticia.findMany({
      where,
      include: {
        autor: {
          select: {
            usuarioId: true,
            nombre_completo: true,
            email: true,
          },
        },
        categoria: true,
        _count: {
          select: {
            comentarios: true,
          },
        },
      },
      skip: filtros.skip || 0,
      take: filtros.take || 10,
      orderBy: {
        fechaPublicacion: filtros.orderBy || 'desc',
      },
    });
  }

  async obtenerPorId(id: number) {
    return await this.prisma.noticia.findUnique({
      where: { noticiaId: id },
      include: {
        autor: {
          select: {
            usuarioId: true,
            nombre_completo: true,
            email: true,
            rol: true,
          },
        },
        categoria: true,
        comentarios: { // Esta parte depende de tu módulo `comentarios-noticia`
          where: {
            respuestaAId: null,
          },
          include: {
            usuario: { select: { usuarioId: true, nombre_completo: true, } },
            respuestas: {
              include: { usuario: { select: { usuarioId: true, nombre_completo: true, } } },
            },
          },
          orderBy: { fecha_hora: 'desc' },
        },
      },
    });
  }

  async actualizar(id: number, data: ActualizarNoticiaDTO) {
    return await this.prisma.noticia.update({
      where: { noticiaId: id },
      data,
      include: {
        autor: { select: { usuarioId: true, nombre_completo: true, email: true } },
        categoria: true,
      },
    });
  }

  async eliminar(id: number) {
    return await this.prisma.noticia.delete({
      where: { noticiaId: id },
    });
  }

  async ocultarNoticia(id: number) {
    return await this.prisma.noticia.update({
      where: { noticiaId: id },
      data: { estado: EstadoNoticia.OCULTO },
      include: {
        autor: { select: { usuarioId: true, nombre_completo: true, email: true } },
        categoria: true,
      },
    });
  }

  async incrementarVistas(id: number) {
    return await this.prisma.noticia.update({
      where: { noticiaId: id },
      data: { vistas: { increment: 1 } },
    });
  }

  async cambiarEstado(id: number, estado: EstadoNoticia) {
    return await this.prisma.noticia.update({
      where: { noticiaId: id },
      data: { estado },
      include: {
        autor: { select: { usuarioId: true, nombre_completo: true, email: true } },
        categoria: true,
      },
    });
  }

  async obtenerMasVistas(limit: number = 10) {
    return await this.prisma.noticia.findMany({
      take: limit,
      orderBy: { vistas: 'desc' },
      include: {
        autor: { select: { usuarioId: true, nombre_completo: true, } },
        categoria: true,
      },
    });
  }
}