import { Router } from 'express'
import { pool } from '../db.js'
import { expenseSchema, expenseFiltersSchema, occurrencesFiltersSchema} from '../schemas/expense.js'
import { idSchema } from '../schemas/category.js'

const router = Router() // Crear un router (mini aplicación) para manejar las rutas
const TEST_USER='test'

// Devuelve todos los valores de expenses con el id de categoria, color e icono
router.get('/', async (req, res) => {
    const filters = expenseFiltersSchema.safeParse(req.query)
    if (!filters.success) {
        return res.status(400).json({ error: filters.error.errors })
    }

    const { from, to, category } = filters.data

    const conditions = ['e.id_user = $1']
    const params = [TEST_USER]

    if (from) {
        params.push(from)
        conditions.push('e.date >= $${params.length}')
    }
    if (to) {
        params.push(to)
        conditions.push('e.date <= $${params.length}')
    }
    if (category) {
        params.push(category)
        conditions.push('e.id_category = $${params.length}')
    }

    try{
        const {rows} = await pool.query(
            `SELECT e.id, e.date, e.total, e.concept, e.frecuency, e.end_date,
              c.id AS category_id, c.name AS category_name,
              c.color AS category_color, c.icon AS category_icon
            FROM expenses e
            JOIN category c ON c.id = e.id_category
            WHERE ${conditions.join(' AND ')}
            ORDER BY e.date DESC, e.id DESC`,
            params
        )
        res.json(rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Error interno' })
    }
})

router.post('/', async (req, res) => {
    const result = expenseSchema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).json({ error: result.error.errors })
    }

    const { date, total, concept, id_category, frequency, end_date } = result.data

    try{
        const { rows } = await pool.query(
            `INSERT INTO expenses (date, total, concept, id_category, id_user)
            SELECT $1, $2, $3, c.id, $5, $6, $7
            FROM category c
            WHERE c.id = $4 AND c.id_user = $5
            RETURNING *`,
            [date, total, concept ?? null, id_category, TEST_USER, frequency, end_date ?? null]
        )
        if (rows.length === 0) {
            return res.status(400).json({ error: 'La categoría no existe o no pertenece al usuario' })
        }
        res.status(201).json(rows[0])
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Error interno' })
    }
})

export default router