import { z } from 'zod';

export const suscribirSchema = z.object({
  email: z.string().email("El email proporcionado no es válido."),
  newsletterIds: z.array(z.number().int()).optional(), 
});