import { Request, Response } from 'express';
import { TvService } from './tv.service';

export class TvController {
    constructor(private service: TvService) { }

    obtenerProgramas = async (req: Request, res: Response) => {
        try {
            const programas = await this.service.obtenerProgramas();
            res.status(200).json({ success: true, data: programas });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Error al obtener los programas',
            });
        }
    };

    obtenerDirectos = async (req: Request, res: Response) => {
        try { const data = await this.service.obtenerVideosEnVivo(); res.status(200).json({ success: true, data }); }
        catch (e) { res.status(500).json({ success: false, error: (e as Error).message }); }
    };

    crearVideo = async (req: Request, res: Response) => {
        try { const data = await this.service.crearVideo(req.body); res.status(201).json({ success: true, data }); }
        catch (e) { res.status(400).json({ success: false, error: (e as Error).message }); }
    };

    darLike = async (req: Request, res: Response) => {
        try { const data = await this.service.darLikeAVideo(Number(req.params.videoId)); res.status(200).json({ success: true, data }); }
        catch (e) { res.status(400).json({ success: false, error: (e as Error).message }); }
    };

    darDislike = async (req: Request, res: Response) => {
        try { const data = await this.service.darDislikeAVideo(Number(req.params.videoId)); res.status(200).json({ success: true, data }); }
        catch (e) { res.status(400).json({ success: false, error: (e as Error).message }); }
    };

    obtenerProgramacion = async (req: Request, res: Response) => {
        try {
            const programaId = Number(req.params.programaId);
            const fecha = req.query.fecha as string;
            if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
                return res.status(400).json({ success: false, error: 'Parámetro de fecha inválido. Usar formato YYYY-MM-DD.' });
            }
            const data = await this.service.obtenerProgramacionDelDia(programaId, fecha);
            res.status(200).json({ success: true, data });
        } catch (e) {
            res.status(500).json({ success: false, error: (e as Error).message });
        }
    };
    obtenerDestacados = async (req: Request, res: Response) => {
        try {
            const destacados = await this.service.obtenerDestacados();
            res.status(200).json({
                success: true,
                data: destacados,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Error al obtener destacados',
            });
        }
    };
}