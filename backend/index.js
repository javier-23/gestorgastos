import express from 'express'

const app = express()
const PORT = process.env.PORT ?? 1234

app.get('/', (req, res) => {
  res.send('Hola mundo desde Express')
})

app.listen(PORT, () => {  
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
})