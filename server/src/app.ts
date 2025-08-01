import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { connectDB } from './config/db'
import productRouter from './routes/product.routes'
import checkoutRouter from './routes/checkout.routes'

const app = express()
app.use(cors())
app.use(express.json())

app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

connectDB().then(() => console.log('MongoDB OK')).catch(console.error)

app.use('/api/produtos', productRouter)
app.use('/api/checkout', checkoutRouter)

app.use((_req, res: Response) => res.status(404).json({ message: 'Rota não encontrada' }))

export default app