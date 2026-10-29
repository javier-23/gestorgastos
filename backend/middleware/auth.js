import jwt from 'jsonwebtoken'

export function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization
  
  if(!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' })
  }

  const token = authHeader.slice(7) // Eliminar 'Bearer ' del inicio

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] }) // Hace las dos verificaciones: firma y expiración, si falla lanza excepción (por eso dentro de try/catch)
    req.username = decoded.data // Guardamos la información del usuario en la solicitud
    next()
  } catch (err) {
    const message = err.name === 'TokenExpiredError' ? 'Token expirado' : 'Token inválido'
    return res.status(401).json({ error: message })
  }
}