import { ComentariosRepository } from './comentarios.repository';
import { CrearComentarioDTO, CrearRespuestaDTO, EntidadTipo } from './comentarios.types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
export class ComentariosService {
    constructor(private repository: ComentariosRepository) { }
    private formatReacciones = (reacciones: any[]) => Object.values(reacciones?.reduce((acc, r) => { const e = r.tipoReaccion.nombre; if (!acc[e]) acc[e] = { emoji: e, count: 0, users: [] }; acc[e].count++; acc[e].users.push(r.usuario.nombre_completo); return acc; }, {}) || {});
    private transformarComentario = (c: any): any => ({ id: c.comentarioId, name: c.usuario.nombre_completo, text: c.mensaje, time: formatDistanceToNow(new Date(c.fecha_hora), { addSuffix: true, locale: es }), badge: ['admin', 'moderador'].includes(c.usuario.rol), replies: c.respuestas?.map((r: any) => this.transformarComentario(r)) || [], reactions: this.formatReacciones(c.reacciones) });
    crearComentario = async (data: CrearComentarioDTO) => this.transformarComentario(await this.repository.crear(data));
    crearRespuesta = async (data: CrearRespuestaDTO) => this.transformarComentario(await this.repository.crearRespuesta(data));
    obtenerComentarios = async (entidadId: number, entidadTipo: EntidadTipo) => (await this.repository.obtenerPorEntidad(entidadId, entidadTipo)).map((c: any) => this.transformarComentario(c));
}