// server/src/index.ts
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db";
import { Product, IProduct } from "./models/Product";
import { calcularPrecoPrazo } from "correios-brasil";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB()
  .then(() => console.log("MongoDB conectado com sucesso"))
  .catch((err) => {
    console.error("Erro ao conectar no DB:", err);
    process.exit(1);
  });

// 1) LISTAR TODOS OS PRODUTOS
app.get("/api/produtos", async (_req: Request, res: Response) => {
  console.log("[API] GET /api/produtos");
  try {
    const produtos = await Product.find();
    console.log(`[API] Encontrados ${produtos.length} produtos`);
    return res.json(produtos);
  } catch (err: any) {
    console.error("[API] Erro buscando produtos:", err);
    return res.status(500).json({ error: err.message });
  }
});

// 2) BUSCAR PRODUTO POR ID
app.get("/api/produtos/:id", async (req: Request, res: Response) => {
  console.log(`[API] GET /api/produtos/${req.params.id}`);
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) {
      console.warn(`[API] Produto ${req.params.id} não encontrado`);
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    return res.json(prod);
  } catch (err: any) {
    console.error(`[API] Erro buscando produto ${req.params.id}:`, err);
    return res.status(500).json({ error: err.message });
  }
});

// 3) CRIAR NOVO PRODUTO
app.post("/api/produtos", async (req: Request, res: Response) => {
  console.log("[API] POST /api/produtos", req.body);
  try {
    const novo = new Product(req.body as Partial<IProduct>);
    await novo.save();
    return res.status(201).json(novo);
  } catch (err: any) {
    console.error("[API] Erro criando produto:", err);
    return res.status(500).json({ error: err.message });
  }
});

// 4) ATUALIZAR PRODUTO
app.put("/api/produtos/:id", async (req: Request, res: Response) => {
  console.log(`[API] PUT /api/produtos/${req.params.id}`, req.body);
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body as Partial<IProduct>,
      { new: true }
    );
    if (!updated) {
      console.warn(`[API] Produto ${req.params.id} não encontrado para update`);
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    return res.json(updated);
  } catch (err: any) {
    console.error(`[API] Erro atualizando produto ${req.params.id}:`, err);
    return res.status(500).json({ error: err.message });
  }
});

// 5) DELETAR PRODUTO
app.delete("/api/produtos/:id", async (req: Request, res: Response) => {
  console.log(`[API] DELETE /api/produtos/${req.params.id}`);
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      console.warn(`[API] Produto ${req.params.id} não encontrado para delete`);
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    return res.sendStatus(204);
  } catch (err: any) {
    console.error(`[API] Erro deletando produto ${req.params.id}:`, err);
    return res.status(500).json({ error: err.message });
  }
});

// 6) ROTA DE FRETE (Correios)
app.get("/api/frete", async (req: Request, res: Response) => {
  console.log("[API] GET /api/frete", req.query);
  const {
    cepDestino = "",
    peso = "1",
    valor = "0",
  } = req.query as Record<string, string>;

  try {
    const resultado = await calcularPrecoPrazo({
      nCdEmpresa: "",                // seu contrato (opcional)
      sDsSenha: "",                  // sua senha (opcional)
      nCdServico: ["04014", "04510"],// PAC e SEDEX
      sCepOrigem: "37704273",        // seu CEP de origem
      sCepDestino: cepDestino,
      nVlPeso: peso,                 // peso em kg (string)
      nCdFormato: "1",               // formato da embalagem (1=caixa/pacote)
      nVlComprimento: "20",          // comprimento em cm
      nVlAltura: "5",                // altura em cm
      nVlLargura: "15",              // largura em cm
      nVlDiametro: "0",              // diâmetro em cm
      sCdMaoPropria: "N",            // include mão própria?
      nVlValorDeclarado: valor,      // valor declarado
      sCdAvisoRecebimento: "N",      // aviso de recebimento?
    });
    return res.json(resultado);
  } catch (err: any) {
    console.error("[API] Erro simulando frete:", err);
    return res.status(500).json({ error: "Não foi possível calcular frete" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server rodando em http://localhost:${PORT}`));
