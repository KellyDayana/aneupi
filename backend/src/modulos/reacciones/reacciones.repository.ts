// en src/modulos/reacciones/reacciones.repository.ts (NUEVA VERSIÓN CORREGIDA)
import { PrismaClient } from '@prisma/client';
import { TipoReaccion, TipoEntidad, ManejarReaccionDTO, ConteoReacciones, ReaccionUsuario } from './reacciones.types';

export class ReaccionesRepository {
  constructor(private prisma: PrismaClient) { }

  async manejarReaccion(data: ManejarReaccionDTO) {
    const { usuarioId, tipoEntidad, entidadId, tipoReaccion } = data;

    // CORRECCIÓN: Usamos if/else para construir el 'where' de forma explícita
    let reaccionExistente;
    if (tipoEntidad === TipoEntidad.NOTICIA) {
      reaccionExistente = await this.prisma.reaccionContenido.findUnique({
        where: { unique_usuario_noticia: { usuarioId, noticiaId: entidadId } },
      });
    } else if (tipoEntidad === TipoEntidad.ARTICULO) {
      reaccionExistente = await this.prisma.reaccionContenido.findUnique({
        where: { unique_usuario_articulo: { usuarioId, articuloId: entidadId } },
      });
    } else if (tipoEntidad === TipoEntidad.COMENTARIO_NOTICIA) {
      reaccionExistente = await this.prisma.reaccionContenido.findUnique({
        where: { unique_usuario_comentario_noticia: { usuarioId, comentarioNoticiaId: entidadId } },
      });
    } else if (tipoEntidad === TipoEntidad.COMENTARIO_ARTICULO) {
      reaccionExistente = await this.prisma.reaccionContenido.findUnique({
        where: { unique_usuario_comentario_articulo: { usuarioId, comentarioArticuloId: entidadId } },
      });
    } else {
      throw new Error(`Tipo de entidad no soportado: ${tipoEntidad}`);
    }

    if (reaccionExistente) {
      if (reaccionExistente.tipoReaccion === tipoReaccion) {
        await this.prisma.reaccionContenido.delete({ where: { reaccionId: reaccionExistente.reaccionId } });
        return { accion: 'eliminada', reaccion: null };
      }
      const reaccionActualizada = await this.prisma.reaccionContenido.update({
        where: { reaccionId: reaccionExistente.reaccionId },
        data: { tipoReaccion },
      });
      return { accion: 'actualizada', reaccion: reaccionActualizada };
    }

    // Para crear, podemos usar una clave dinámica
    const idField = `${tipoEntidad.toLowerCase()}Id`;
    const nuevaReaccion = await this.prisma.reaccionContenido.create({
      data: {
        usuarioId,
        tipoReaccion,
        [idField]: entidadId,
      },
    });
    return { accion: 'creada', reaccion: nuevaReaccion };
  }

  async obtenerReaccionUsuario(usuarioId: number, tipoEntidad: TipoEntidad, entidadId: number): Promise<ReaccionUsuario> {
    // CORRECCIÓN: Usamos if/else aquí también
    let reaccion;
    if (tipoEntidad === TipoEntidad.NOTICIA) {
      reaccion = await this.prisma.reaccionContenido.findUnique({ where: { unique_usuario_noticia: { usuarioId, noticiaId: entidadId } } });
    } else if (tipoEntidad === TipoEntidad.ARTICULO) {
      reaccion = await this.prisma.reaccionContenido.findUnique({ where: { unique_usuario_articulo: { usuarioId, articuloId: entidadId } } });
    } else if (tipoEntidad === TipoEntidad.COMENTARIO_NOTICIA) {
      reaccion = await this.prisma.reaccionContenido.findUnique({ where: { unique_usuario_comentario_noticia: { usuarioId, comentarioNoticiaId: entidadId } } });
    } else if (tipoEntidad === TipoEntidad.COMENTARIO_ARTICULO) {
      reaccion = await this.prisma.reaccionContenido.findUnique({ where: { unique_usuario_comentario_articulo: { usuarioId, comentarioArticuloId: entidadId } } });
    } else {
      throw new Error(`Tipo de entidad no soportado: ${tipoEntidad}`);
    }

    if (!reaccion) return { tieneReaccion: false };

    return {
      tieneReaccion: true,
      tipoReaccion: reaccion.tipoReaccion,
      reaccionId: reaccion.reaccionId,
    };
  }

  // --- El resto de los métodos NO usan findUnique y son seguros ---
  // Los dejo aquí para que el archivo esté completo.

  async obtenerConteoReacciones(tipoEntidad: TipoEntidad, entidadId: number): Promise<ConteoReacciones> {
    const idField = `${tipoEntidad.toLowerCase()}Id`;
    const reacciones = await this.prisma.reaccionContenido.groupBy({
      by: ['tipoReaccion'],
      where: { [idField]: entidadId },
      _count: { tipoReaccion: true },
    });
    const conteo: ConteoReacciones = {};
    reacciones.forEach((r) => { conteo[r.tipoReaccion] = r._count.tipoReaccion; });
    return conteo;
  }

  async obtenerReaccionesPorEntidad(tipoEntidad: TipoEntidad, entidadId: number) {
    const idField = `${tipoEntidad.toLowerCase()}Id`;
    return this.prisma.reaccionContenido.findMany({
      where: { [idField]: entidadId },
      include: { usuario: { select: { usuarioId: true, nombre_completo: true } } },
      orderBy: { fechaCreacion: 'desc' },
    });
  }

  async eliminarReaccionesPorEntidad(tipoEntidad: TipoEntidad, entidadId: number) {
    const idField = `${tipoEntidad.toLowerCase()}Id`;
    return this.prisma.reaccionContenido.deleteMany({ where: { [idField]: entidadId } });
  }

  async obtenerConteoMultiple(tipoEntidad: TipoEntidad, entidadIds: number[]) {
    const idField = `${tipoEntidad.toLowerCase()}Id`;
    const reacciones = await this.prisma.reaccionContenido.groupBy({
      by: [idField as any, 'tipoReaccion'],
      where: { [idField]: { in: entidadIds } },
      _count: { tipoReaccion: true },
    });
    const resultado: { [entidadId: number]: ConteoReacciones } = {};
    entidadIds.forEach((id) => { resultado[id] = {}; });
    reacciones.forEach((r: any) => {
      const entidadId = r[idField];
      if (entidadId === null) return;
      if (!resultado[entidadId]) resultado[entidadId] = {};
      resultado[entidadId][r.tipoReaccion] = r._count.tipoReaccion;
    });
    return resultado;
  }
}