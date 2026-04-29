import { PrismaClient } from '@prisma/client';
import { CrearComentarioDTO, CrearRespuestaDTO, EntidadTipo } from './comentarios.types';
export class ComentariosRepository {
    constructor(private prisma: PrismaClient) { }
    private getEntidadFieldName = (tipo: EntidadTipo) => `${tipo}Id`;
    crear = (data: CrearComentarioDTO) => this.prisma.comentario.create({ data: { mensaje: data.mensaje, usuarioId: data.usuarioId, [this.getEntidadFieldName(data.entidadTipo)]: data.entidadId }, include: { usuario: { select: { usuarioId: true, nombre_completo: true, rol: true } } } });
    crearRespuesta = (data: CrearRespuestaDTO) => this.prisma.comentario.create({ data: { mensaje: data.mensaje, usuarioId: data.usuarioId, respuestaAId: data.comentarioPadreId }, include: { usuario: { select: { usuarioId: true, nombre_completo: true, rol: true } } } });
    obtenerPorEntidad = (entidadId: number, entidadTipo: EntidadTipo) => this.prisma.comentario.findMany({ where: { [this.getEntidadFieldName(entidadTipo)]: entidadId, respuestaAId: null }, include: { usuario: { select: { usuarioId: true, nombre_completo: true, rol: true } }, reacciones: { include: { tipoReaccion: true, usuario: { select: { nombre_completo: true } } } }, respuestas: { include: { usuario: { select: { usuarioId: true, nombre_completo: true, rol: true } }, reacciones: { include: { tipoReaccion: true, usuario: { select: { nombre_completo: true } } } } }, orderBy: { fecha_hora: 'asc' } } }, orderBy: { fecha_hora: 'desc' } });
}