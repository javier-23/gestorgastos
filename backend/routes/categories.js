// Para CRUD categorías
import { Router } from 'express'
import { pool } from '../db.js'

const router = Router() // Crear un router (mini aplicación) para manejar las rutas
const USER='test'

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM category WHERE id_user = $1 ORDER BY name',
      [TEST_USER]
    )
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error interno' })
  }
})

router.post('/', async (req, res) => {
    const { name,color,icon,type } = req.body

    if(!name || !color){
        return res.status(400).json({ error: 'Faltan campos obligatorios' })
    }

    try {
        const { rows } = await pool.query(
            'INSERT INTO category (name, color, icon, type, id_user) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, color, icon, type, TEST_USER]
        )
        res.status(201).json(rows[0])
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Ya existe una categoría con ese nombre' })
        }
        console.error(err)
        res.status(500).json({ error: 'Error interno' })
    }
})

export default router