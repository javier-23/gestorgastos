import { Router } from 'express'
import { pool } from '../db.js'
import { monthSchema } from '../schemas/budget.js'

const router = Router()

const OCCURRENCES = `
  WITH month_range AS (
    SELECT $2::date AS first_day,
           ($2::date + interval '1 month' - interval '1 day')::date AS last_day
  ),
  occ AS (
    SELECT e.total, e.id_category
    FROM expenses e
    CROSS JOIN month_range r
    CROSS JOIN LATERAL (
      SELECT d::date AS occurrence_date
      FROM generate_series(
        e.date::timestamp,
        LEAST(r.last_day, COALESCE(e.end_date, r.last_day))::timestamp,
        CASE e.frequency
          WHEN 'weekly'  THEN interval '1 week'
          WHEN 'monthly' THEN interval '1 month'
          WHEN 'yearly'  THEN interval '1 year'
          ELSE interval '100 years'
        END
      ) AS d
    ) o
    WHERE e.id_user = $1
      AND o.occurrence_date >= r.first_day
  )
`

router.get('/', async (req, res) => {
  const month = monthSchema.safeParse(req.query.month)
  if (!month.success) {
    return res.status(400).json({ error: 'month es obligatorio, formato YYYY-MM' })
  }
  const firstDay = `${month.data}-01`

  try {
    const [byCategory, spent, budget] = await Promise.all([
      pool.query(
        `${OCCURRENCES}
         SELECT c.id, c.name, c.color, c.icon, SUM(occ.total) AS total
         FROM occ
         JOIN category c ON c.id = occ.id_category
         GROUP BY c.id, c.name, c.color, c.icon
         ORDER BY total DESC`,
        [req.username, firstDay]
      ),
      pool.query(
        `${OCCURRENCES}
         SELECT COALESCE(SUM(total), 0) AS spent FROM occ`,
        [req.username, firstDay]
      ),
      pool.query(
        'SELECT total FROM budget WHERE id_user = $1 AND month = $2::date',
        [req.username, firstDay]
      )
    ])

    const spentTotal = Number(spent.rows[0].spent)
    const budgetTotal = budget.rows[0] ? Number(budget.rows[0].total) : null

    res.json({
      month: month.data,
      budget: budgetTotal,
      spent: spentTotal,
      remaining: budgetTotal === null
        ? null
        : Math.round((budgetTotal - spentTotal) * 100) / 100,
      byCategory: byCategory.rows
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error interno' })
  }
})

export default router