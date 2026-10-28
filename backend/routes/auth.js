import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../db.js'
import { registerSchema, loginSchema } from '../schemas/auth.js'

const router = Router()

router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors })
  }

  const { user, name, password } = parsed.data

  try {
    const hash = await bcrypt.hash(password, 10)
    await pool.query('INSERT INTO users (user, name, password) VALUES ($1, $2, $3)', [user, name, hash])
    res.status(201).json({ message: 'Usuario registrado correctamente' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error interno' })
  }
})

export default router