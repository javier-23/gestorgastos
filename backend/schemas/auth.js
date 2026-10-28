import { z } from 'zod'

export const registerSchema = z.object({
  username: z.string().trim().min(3, 'El nombre de usuario debe tener al menos 3 caracteres').max(30, 'El nombre de usuario no puede tener más de 30 caracteres')
        .regex(/^[a-zA-Z0-9_]+$/, 'El nombre de usuario solo puede contener letras, números y guiones bajos'),
  name: z.string().trim().min(1, 'El nombre es obligatorio').max(50, 'El nombre no puede tener más de 50 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(72, 'La contraseña no puede tener más de 72 caracteres'),
})

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'El nombre de usuario es obligatorio'),
  password: z.string().min(1, 'La contraseña es obligatoria').max(72, 'La contraseña no puede tener más de 72 caracteres'),
})