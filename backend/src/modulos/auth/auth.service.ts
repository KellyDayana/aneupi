import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { registerSchema, loginSchema } from './auth.validation';

export class AuthService {
  constructor(private prisma: PrismaClient) {}
  async register(data: z.infer<typeof registerSchema>) {
    const existingUser = await this.prisma.usuario.findUnique({ where: { email: data.email } });
    if (existingUser) throw new Error("El email ya está en uso");
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await this.prisma.usuario.create({
      data: { nombre_completo: data.nombre_completo, email: data.email, contrasena_hash: hashedPassword, rol: 'usuario' },
    });
    const { contrasena_hash, ...user } = newUser;
    return user;
  }
  async login(data: z.infer<typeof loginSchema>) {
    const user = await this.prisma.usuario.findUnique({ where: { email: data.email } });
    if (!user) throw new Error("Credenciales inválidas");
    const isPasswordValid = await bcrypt.compare(data.password, user.contrasena_hash);
    if (!isPasswordValid) throw new Error("Credenciales inválidas");
    const jwtSecret = process.env.JWT_SECRET || 'tu_secreto_por_defecto_muy_seguro';
    const token = jwt.sign({ usuarioId: user.usuarioId, rol: user.rol }, jwtSecret, { expiresIn: '7d' });
    const { contrasena_hash, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }
}