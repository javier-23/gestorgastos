import { Router } from 'express'
import { pool } from '../db.js'
import { expenseSchema, expenseFiltersSchema, occurrencesFiltersSchema} from '../schemas/expense.js'
import { idSchema } from '../schemas/category.js'

const router = Router() // Crear un router (mini aplicación) para manejar las rutas

// Devuelve todos los valores de expenses con el id de categoria, color e icono
router.get('/', async (req, res) => {
    const filters = expenseFiltersSchema.safeParse(req.query)
    if (!filters.success) {
        return res.status(400).json({ error: filters.error.errors })
    }

    const { from, to, category } = filters.data

    const conditions = ['e.id_user = $1']
    const params = [req.username]

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

router.get('/occurrences', async (req, res) => {
    const filters = occurrencesFiltersSchema.safeParse(req.query)
    if (!filters.success) {
        return res.status(400).json({ error: filters.error.errors })
    }

    const { from, to, category } = filters.data

    try {
        // COALESCE: usa end_date si no es nulo, de lo contrario usa to
        // LEAST: toma la fecha más temprana entre end_date y to
        // generate_series(fechainicio,fechafin,intervalo)
        const { rows } = await pool.query(
            `SELECT e.id, e.date, e.total, e.concept, e.frequency, e.end_date,
                c.id AS category_id, c.name AS category_name,
                c.color AS category_color, c.icon AS category_icon
            FROM expenses e
            JOIN category c ON c.id = e.id_category
            CROSS JOIN LATERAL (
                SELECT d::date AS occurrence_date
                FROM generate_series(
                    e.date::timestamp,
                    LEAST($3::date, COALESCE(e.end_date, $3::date))::timestamp,
                    CASE e.frequency
                        WHEN 'weekly'  THEN interval '1 week'
                        WHEN 'monthly' THEN interval '1 month'
                        WHEN 'yearly'  THEN interval '1 year'
                        ELSE interval '100 years'
                    END
                ) AS d
            ) o
            WHERE e.id_user = $1
                AND o.occurrence_date >= $2::date
                AND ($4::int IS NULL OR e.id_category = $4)
            ORDER BY o.occurrence_date DESC, e.id DESC`,
            [req.username, from, to, category ?? null]
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
            `INSERT INTO expenses (date, total, concept, frequency, end_date, id_category, id_user)
            SELECT $1, $2, $3, $4, $5, $6, $7
            FROM category c
            WHERE c.id = $6 AND c.id_user = $7
            RETURNING *`,
            [date, total, concept ?? null,  frequency, end_date ?? null, id_category, req.username]
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

router.put('/:id', async (req, res) => {
    const id = idSchema.safeParse(req.params.id)
    if (!id.success) {
        return res.status(400).json({ error: 'ID inválido' })
    }

    const result = expenseSchema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).json({ error: result.error.errors })
    }

    const { date, total, concept, id_category, frequency, end_date } = result.data

    try{
        const { rows } = await pool.query(
            `UPDATE expenses
            SET date = $1, total = $2, concept = $3, id_category = $4, frequency = $5, end_date = $6
            WHERE id = $7 AND id_user = $8
                AND EXISTS (SELECT 1 FROM category WHERE id = $4 AND id_user = $8)
            RETURNING *`,
            [date, total, concept ?? null, id_category, frequency, end_date ?? null, id.data, req.username]
        )
        if (rows.length === 0) {
            return res.status(400).json({ error: 'El gasto no existe o la categoría no es válida' })
        }
        res.status(204).send()
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Error interno' })
    }
})

router.delete('/:id', async (req, res) => {
    const id = idSchema.safeParse(req.params.id)
    if (!id.success) {
        return res.status(400).json({ error: 'ID inválido' })
    }
    
    try{
        const { rows } = await pool.query(
            `DELETE FROM expenses
            WHERE id = $1 AND id_user = $2
            RETURNING *`,
            [id.data, req.username]
        )
        if (rows.length === 0) {
            return res.status(400).json({ error: 'El gasto no existe o no pertenece al usuario' })
        }
        res.status(204).send()
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Error interno' })
    }
})

export default router