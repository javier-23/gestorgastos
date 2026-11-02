import { Router } from 'express'
import { pool } from '../db.js'
import { monthSchema, budgetSchema } from '../schemas/budget.js'

const router = Router()

router.get('/:month', async (req, res) => {
    const month = monthSchema.safeParse(req.params.month)
    if(!month.success) {
        return res.status(400).json({ error: 'Mes inválido' })
    }

    try {
        const {rows} = await pool.query('SELECT id, month, total FROM budget WHERE month = $1::date AND id_user = $2', 
            [`${month.data}-01`, req.username])
        if(rows.length === 0) {
            return res.status(404).json({ error: 'Presupuesto no encontrado' })
        }
        res.json(rows[0])
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error al obtener el presupuesto' })
    }
})

router.put('/:month', async (req, res) => {
    const month = monthSchema.safeParse(req.params.month)
    if(!month.success) {
        return res.status(400).json({ error: 'Mes inválido' })
    }

    const budget = budgetSchema.safeParse(req.body)
    if(!budget.success) {
        return res.status(400).json({ error: 'Presupuesto inválido' })
    }

    try {
        const {rows} = await pool.query(
            `INSERT INTO budget (month, total, id_user)
            VALUES ($1::date, $2, $3)
            ON CONFLICT (month, id_user) DO UPDATE SET total = EXCLUDED.total
            RETURNING *`,
            [`${month.data}-01`, budget.data.total, req.username]
        )
        res.json(rows[0])
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error al actualizar el presupuesto' })
    }
})

export default router