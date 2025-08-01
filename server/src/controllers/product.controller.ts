import { Request, Response } from 'express'
import { Product, IProduct } from '../models/Product'

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  console.log("Controller getAllProducts: GET /api/produtos")
  try {
    const produtos = await Product.find()
    res.json(produtos)
  } catch (err) {
    console.error("Controller getAllProducts Error:", err)
    res.status(500).json({ error: (err as Error).message || "Erro interno ao buscar produtos." })
  }
}

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  console.log(`Controller getProductById: GET /api/produtos/${id}`)
  try {
    const prod = await Product.findById(id)
    if (!prod) {
      res.status(404).json({ error: "Produto não encontrado" })
      return
    }
    res.json(prod)
  } catch (err) {
    console.error("Controller getProductById Error:", err)
    res.status(500).json({ error: (err as Error).message || "Erro interno ao buscar produto." })
  }
}

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  console.log("Controller createProduct: POST /api/produtos")
  try {
    const novo = new Product(req.body as Partial<IProduct>)
    await novo.save()
    res.status(201).json(novo)
  } catch (err) {
    console.error("Controller createProduct Error:", err)
    if (err instanceof Error && (err as any).name === "ValidationError") {
      res.status(400).json({ error: "Dados inválidos para criação do produto.", details: (err as any).errors })
      return
    }
    res.status(500).json({ error: (err as Error).message || "Erro interno ao criar produto." })
  }
}

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  console.log(`Controller updateProduct: PUT /api/produtos/${id}`)
  try {
    const updated = await Product.findByIdAndUpdate(
      id,
      req.body as Partial<IProduct>,
      { new: true, runValidators: true }
    )
    if (!updated) {
      res.status(404).json({ error: "Produto não encontrado para atualização" })
      return
    }
    res.json(updated)
  } catch (err) {
    console.error("Controller updateProduct Error:", err)
    if (err instanceof Error && (err as any).name === "ValidationError") {
      res.status(400).json({ error: "Dados inválidos para atualização do produto.", details: (err as any).errors })
      return
    }
    res.status(500).json({ error: (err as Error).message || "Erro interno ao atualizar produto." })
  }
}

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  console.log(`Controller deleteProduct: DELETE /api/produtos/${id}`)
  try {
    const deleted = await Product.findByIdAndDelete(id)
    if (!deleted) {
      res.status(404).json({ error: "Produto não encontrado para deletar" })
      return
    }
    res.sendStatus(204)
  } catch (err) {
    console.error("Controller deleteProduct Error:", err)
    res.status(500).json({ error: (err as Error).message || "Erro interno ao deletar produto." })
  }
}
