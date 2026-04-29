import { Request, Response } from 'express';
import { ComentariosService } from './comentarios.service';
import { EntidadTipo } from './comentarios.types';
export class ComentariosController {
    constructor(private service: ComentariosService) { }
    obtenerComentarios = async (req: Request, res: Response) => { try { const { entidadTipo, entidadId } = req.params; const data = await this.service.obtenerComentarios(Number(entidadId), entidadTipo as EntidadTipo); res.status(200).json({ success: true, data }); } catch (e) { res.status(500).json({ success: false, error: 'Error al obtener comentarios' }); } };
    crearComentario = async (req: Request, res: Response) => { try { const usuarioId = req.user!.usuarioId; const { mensaje, entidadId, entidadTipo } = req.body; const data = await this.service.crearComentario({ mensaje, usuarioId, entidadId, entidadTipo }); res.status(201).json({ success: true, data }); } catch (e) { res.status(400).json({ success: false, error: 'Error al crear comentario' }); } };
    crearRespuesta = async (req: Request, res: Response) => { try { const usuarioId = req.user!.usuarioId; const { comentarioId } = req.params; const { mensaje } = req.body; const data = await this.service.crearRespuesta({ mensaje, usuarioId, comentarioPadreId: Number(comentarioId) }); res.status(201).json({ success: true, data }); } catch (e) { res.status(400).json({ success: false, error: 'Error al crear respuesta' }); } };
}