import { SolicitudesRepository } from './solicitudes.repository';
import { z } from 'zod';
import { crearSolicitudSchema } from './solicitudes.validation';

export class SolicitudesService {
  constructor(private repository: SolicitudesRepository) {}
  
  async crearSolicitud(data: z.infer<typeof crearSolicitudSchema>, usuarioId?: number) {
    // Aquí podrías añadir lógica de negocio, como enviar un email de notificación.
    return this.repository.crear(data, usuarioId);
  }
}