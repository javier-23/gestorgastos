// Para CRUD categorías
import { Router } from 'express'
import { pool } from '../db.js'
import { categorySchema, idSchema } from '../schemas/category.js'

const router = Router() // Crear un router (mini aplicación) para manejar las rutas
const TEST_USER='test'

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
  const parsed = categorySchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({
      // Mapeamos los errores de validación para que sean más legibles
      error: parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`)
    })
  }
  const { name, color, icon, type } = parsed.data

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

// Actualizar con id categoría y id usuario (para que no pueda actualizar categorías de otros usuarios)
router.put('/:id', async (req, res) => {
  // Validad id
  const parsedId = idSchema.safeParse(req.params.id)
  if (!parsedId.success) {
    return res.status(400).json({ error: 'id inválido' })
  }
  const { id } = parsedId.data

  // Validar body
  const parsedBody = categorySchema.safeParse(req.body)
  if (!parsedBody.success) {
    return res.status(400).json({ error: 'Datos inválidos' })
  }
  const { name, color, icon, type } = parsedBody.data

    try{
      const { rows } = await pool.query(
        'UPDATE category SET name = $1, color = $2, icon = $3, type = $4 WHERE id = $5 AND id_user = $6 RETURNING *',
        [name, color, icon, type, id, TEST_USER]
      )
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Categoría no encontrada' })
      }
      res.json(rows[0])
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ error: 'Ya existe una categoría con ese nombre' })
      }
      console.error(err)
      res.status(500).json({ error: 'Error interno' })
    }
})

// Eliminar con id categoría y id usuario (para que no pueda eliminar categorías de otros usuarios)
router.delete('/:id', async (req, res) => {
  // Validar id
  const parsedId = idSchema.safeParse(req.params.id)
  if (!parsedId.success) {
    return res.status(400).json({ error: 'id inválido' })
  }
  const { id } = parsedId.data

    try {
        const { rowCount } = await pool.query(
            'DELETE FROM category WHERE id = $1 AND id_user = $2',
            [id, TEST_USER]
        )
        if (rowCount === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' })
        }
        res.json({ message: 'Categoría eliminada' })
    } catch (err) {
      if (err.code === '23503') {
        return res.status(409).json({ error: 'La categoría tiene gastos asociados' })
      }
        console.error(err)
        res.status(500).json({ error: 'Error interno' })
    }
})

export default router