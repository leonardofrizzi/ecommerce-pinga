import { Router } from 'express'
import { createCheckout } from '../controllers/checkout.controller'

const checkoutRouter = Router()

checkoutRouter.post('/', createCheckout)

export default checkoutRouter