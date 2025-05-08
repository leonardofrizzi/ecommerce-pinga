import { Schema, model, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  images: string[];
  description: string;
  category: string;
  stock: number;
  ean: string;
  vendaUnidade: string;
  volume: string;
  unidadesPorCaixa: number;
  quantidadeMinima: string;
  pesoUnitario: string;
  pesoCaixa: string;
  ncm: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], default: [] },
    description: { type: String, default: "" },
    category: { type: String, default: "" },
    stock: { type: Number, default: 0 },
    // campos adicionais:
    ean: { type: String, default: "" },
    vendaUnidade: { type: String, default: "" },
    volume: { type: String, default: "" },
    unidadesPorCaixa: { type: Number, default: 0 },
    quantidadeMinima: { type: String, default: "" },
    pesoUnitario: { type: String, default: "" },
    pesoCaixa: { type: String, default: "" },
    ncm: { type: String, default: "" }
  },
  { timestamps: true }
);

export const Product = model<IProduct>("Product", ProductSchema);
