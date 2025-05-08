import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db";
import { Product, IProduct } from "./models/Product";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB().catch((err) => {
  console.error("Erro ao conectar no DB:", err);
  process.exit(1);
});

app.get("/api/products", async (_req: Request, res: Response) => {
  const products = await Product.find();
  res.json(products);
});

app.post("/api/products", async (req: Request, res: Response) => {
  const novo = new Product(req.body as Partial<IProduct>);
  await novo.save();
  res.status(201).json(novo);
});

app.put("/api/products/:id", async (req: Request, res: Response) => {
  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    req.body as Partial<IProduct>,
    { new: true }
  );
  res.json(updated);
});

app.delete("/api/products/:id", async (req: Request, res: Response) => {
  await Product.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`erver running on http://localhost:${PORT}`)
);
