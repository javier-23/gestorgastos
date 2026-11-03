import express from 'express'
import { pool } from './db.js' // Importar la conexión a la base de datos
import categoriesRouter from './routes/categories.js' // Importar el router de categorías
import expensesRouter from './routes/expenses.js' // Importar el router de gastos
import authRouter from './routes/auth.js' // Importar el router de autenticación
import {authenticateToken} from './middleware/auth.js' // Importar el middleware de autenticación
import budgetsRouter from './routes/budgets.js' // Importar el router de presupuestos
import summaryRouter from './routes/summary.js' // Importar el router de resumen
import cors from 'cors' // Importar CORS

const app = express()
app.use(cors({ origin: 'https://localhost:5173' })) // Habilitar CORS para todas las rutas
app.use(express.json())
const PORT = process.env.PORT ?? 1234

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ status: 'ok', db: 'connected' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ status: 'error', db: 'disconnected' })
  }
})

app.use('/categories', authenticateToken, categoriesRouter)
app.use('/expenses', authenticateToken, expensesRouter)
app.use('/auth', authRouter)
app.use('/budgets', authenticateToken, budgetsRouter)
app.use('/summary', authenticateToken, summaryRouter)

app.listen(PORT, () => {  
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
})