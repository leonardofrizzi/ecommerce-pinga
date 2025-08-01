import { Request, Response } from 'express'
import Stripe from 'stripe'

interface CheckoutItem {
  name: string
  amount: number
  quantity: number
  description?: string
  images?: string[]
}

interface CheckoutBody {
  items: CheckoutItem[]
  successUrl: string
  cancelUrl: string
  shippingCost?: number
  customerEmail?: string
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const createCheckout = async (
  req: Request<{}, {}, CheckoutBody>,
  res: Response
): Promise<void> => {
  const { items, successUrl, cancelUrl, shippingCost, customerEmail } = req.body

  if (!items.length) {
    res.status(400).json({ error: 'Nenhum item fornecido para checkout.' })
    return
  }
  if (!successUrl || !cancelUrl) {
    res.status(400).json({ error: 'URLs de sucesso e cancelamento são obrigatórias.' })
    return
  }

  try {
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(item => ({
      price_data: {
        currency: 'brl',
        product_data: {
          name: item.name,
          ...(item.description && { description: item.description }),
          ...(item.images?.length && { images: item.images }),
        },
        unit_amount: Math.round(item.amount),
      },
      quantity: item.quantity,
    }))

    if (shippingCost && shippingCost > 0) {
      line_items.push({
        price_data: {
          currency: 'brl',
          product_data: { name: 'Custo de Envio' },
          unit_amount: Math.round(shippingCost),
        },
        quantity: 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      billing_address_collection: 'required',
      shipping_address_collection: { allowed_countries: ['BR'] },
      customer_email: customerEmail,
    })

    res.json({ sessionId: session.id, url: session.url })
  } catch (err) {
    if (err instanceof Stripe.errors.StripeError) {
      const e = err as Stripe.errors.StripeError
      res
        .status(e.statusCode || 500)
        .json({ error: e.message, type: e.type, code: e.code })
    } else {
      res.status(500).json({ error: (err as Error).message })
    }
  }
}