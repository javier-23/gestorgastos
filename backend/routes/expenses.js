import { Router } from 'express'
import { pool } from '../db.js'
import { expenseSchema, expenseFiltersSchema, occurrencesFiltersSchema} from '../schemas/expense.js'
import { idSchema } from '../schemas/category.js'

const router = Router() // Crear un router (mini aplicación) para manejar las rutas
const TEST_USER='test'



export default router