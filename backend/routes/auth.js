import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../db.js'
import { registerSchema, loginSchema } from '../schemas/auth.js'

const router = Router()

router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`) })
  }

  const { username, name, password } = parsed.data

  try {
    const hash = await bcrypt.hash(password, 10)
    await pool.query(
      'INSERT INTO users (username, name, password) VALUES ($1, $2, $3)', 
      [username, name, hash]
    )
    res.status(201).json({username, name})
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Ese usuario ya existe' })
    }
    console.error(err)
    res.status(500).json({ error: 'Error interno' })
  }
})

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors })
  }
  const { username, password } = parsed.data

  try {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE username = $1', 
      [username]
    )

    const valid = rows[0] && await bcrypt.compare(password, rows[0].password)
    if (!valid) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos'})
    }

    // Si es correcto, generamos un token JWT con la información del usuario y lo enviamos al cliente
    // Cabecera, payload y firma
    const token = jwt.sign(
      { data: rows[0].username }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    )
    res.json({ token, username: rows[0].username, name: rows[0].name })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error interno' })
  } 
})


export default router