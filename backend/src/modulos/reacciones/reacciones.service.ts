import { ReaccionesRepository } from './reacciones.repository';
import { TipoReaccion, TipoEntidad, ManejarReaccionDTO } from './reacciones.types';

export class ReaccionesService {
  constructor(private repository: ReaccionesRepository) { }

  async manejarReaccion(data: ManejarReaccionDTO) {
    if (!Object.values(TipoReaccion).includes(data.tipoReaccion)) {
      throw new Error(`Tipo de reacción inválido: ${data.tipoReaccion}`);
    }
    if (!Object.values(TipoEntidad).includes(data.tipoEntidad)) {
      throw new Error(`Tipo de entidad inválido: ${data.tipoEntidad}`);
    }
    if (data.usuarioId <= 0 || data.entidadId <= 0) {
      throw new Error('IDs de usuario y entidad deben ser mayores a 0');
    }
    return await this.repository.manejarReaccion(data);
  }

  async obtenerConteoReacciones(tipoEntidad: TipoEntidad, entidadId: number) {
    const conteo = await this.repository.obtenerConteoReacciones(tipoEntidad, entidadId);
    const total = Object.values(conteo).reduce((sum, count) => sum + count, 0);
    return { ...conteo, total };
  }

  async obtenerReaccionUsuario(usuarioId: number, tipoEntidad: TipoEntidad, entidadId: number) {
    return await this.repository.obtenerReaccionUsuario(usuarioId, tipoEntidad, entidadId);
  }

  async obtenerReaccionesPorEntidad(tipoEntidad: TipoEntidad, entidadId: number) {
    return await this.repository.obtenerReaccionesPorEntidad(tipoEntidad, entidadId);
  }

  async eliminarReaccionesPorEntidad(tipoEntidad: TipoEntidad, entidadId: number) {
    return await this.repository.eliminarReaccionesPorEntidad(tipoEntidad, entidadId);
  }

  async obtenerConteoMultiple(tipoEntidad: TipoEntidad, entidadIds: number[]) {
    if (entidadIds.length === 0) return {};
    return await this.repository.obtenerConteoMultiple(tipoEntidad, entidadIds);
  }
}