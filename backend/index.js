import express from 'express'
import { pool } from './db.js' // Importar la conexión a la base de datos

const app = express()
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

app.listen(PORT, () => {  
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
})