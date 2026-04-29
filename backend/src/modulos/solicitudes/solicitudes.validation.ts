import { z } from 'zod';
export const crearSolicitudSchema = z.object({
  nombre_completo: z.string().min(3, "El nombre es muy corto"),
  profesion: z.string().optional(),
  cedula_identificacion: z.string().optional(),
  email: z.string().email("Email inválido"),
  telefono_contacto: z.string().min(7, "Teléfono inválido"),
  tema_titulo: z.string().min(5, "El tema es muy corto"),
  descripcion_proposito: z.string().min(20, "La descripción es muy corta"),
  tipo_entrevista: z.string(),
});