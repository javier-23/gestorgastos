import { z } from 'zod'

const ICONS = ['utensils', 'home', 'shopping-cart', 'car', 'heart', 'gamepad', 'briefcase', 'gift']

export const categorySchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio').max(100),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'El color debe ser un hex tipo #RRGGBB'),
  icon: z.enum(ICONS, 'Icono no permitido')
})

export const idSchema = z.coerce.number().int().positive({ message: 'El ID debe ser un número entero positivo' })