import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db";
import { Product, IProduct } from "./models/Product";
import { calcularPrecoPrazo } from "correios-brasil";
import Stripe from "stripe";
import http from "http";
import { URLSearchParams } from "url";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log("--- NOVA REQUISIÇÃO ---");
  console.log("Timestamp:", new Date().toISOString());
  console.log("Método:", req.method);
  console.log("Caminho:", req.path);
  console.log("Query:", req.query);
  next();
});

connectDB()
  .then(() => console.log("MongoDB: Conexão inicial estabelecida com sucesso."))
  .catch((err: unknown) => {
    console.error("MongoDB: Erro INICIAL ao conectar:", (err as Error).message);
  });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface ResultadoCorreiosItem {
  Codigo: string;
  Valor: string;
  PrazoEntrega: string;
  MsgErro?: string;
  Erro?: string;
  [key: string]: any;
}

app.get(
  "/api/produtos",
  async (_req: Request, res: Response): Promise<void> => {
    console.log("ROTA: GET /api/produtos - Iniciando...");
    try {
      const produtos = await Product.find();
      console.log(`ROTA: GET /api/produtos - Encontrados ${produtos.length} produtos.`);
      res.json(produtos);
    } catch (err: unknown) {
      console.error("ROTA: GET /api/produtos - Erro:", err);
      res.status(500).json({
        error: (err as Error).message || "Erro interno ao buscar produtos.",
      });
    }
  }
);

app.get(
  "/api/produtos/:id",
  async (req: Request, res: Response): Promise<void> => {
    console.log(`ROTA: GET /api/produtos/${req.params.id} - Iniciando...`);
    try {
      const prod = await Product.findById(req.params.id);
      if (!prod) {
        console.log(`ROTA: GET /api/produtos/${req.params.id} - Produto não encontrado (404).`);
        res.status(404).json({ error: "Produto não encontrado" });
        return;
      }
      console.log(`ROTA: GET /api/produtos/${req.params.id} - Produto encontrado.`);
      res.json(prod);
    } catch (err: unknown) {
      console.error(`ROTA: GET /api/produtos/${req.params.id} - Erro:`, err);
      res.status(500).json({
        error: (err as Error).message || "Erro interno ao buscar produto.",
      });
    }
  }
);

app.post(
  "/api/produtos",
  async (req: Request, res: Response): Promise<void> => {
    console.log("ROTA: POST /api/produtos - Iniciando...");
    try {
      const novo = new Product(req.body as Partial<IProduct>);
      await novo.save();
      console.log("ROTA: POST /api/produtos - Produto criado:", novo._id);
      res.status(201).json(novo);
    } catch (err: unknown) {
      console.error("ROTA: POST /api/produtos - Erro:", err);
      if (err instanceof Error && "name" in err && err.name === "ValidationError") {
        res.status(400).json({
          error: "Dados inválidos para criação do produto.",
          details: (err as any).errors,
        });
        return;
      }
      res.status(500).json({
        error: (err as Error).message || "Erro interno ao criar produto.",
      });
    }
  }
);

app.put(
  "/api/produtos/:id",
  async (req: Request, res: Response): Promise<void> => {
    console.log(`ROTA: PUT /api/produtos/${req.params.id} - Iniciando...`);
    try {
      const updated = await Product.findByIdAndUpdate(
        req.params.id,
        req.body as Partial<IProduct>,
        { new: true, runValidators: true }
      );
      if (!updated) {
        console.log(`ROTA: PUT /api/produtos/${req.params.id} - Produto não encontrado (404).`);
        res.status(404).json({ error: "Produto não encontrado para atualização" });
        return;
      }
      console.log(`ROTA: PUT /api/produtos/${req.params.id} - Produto atualizado.`);
      res.json(updated);
    } catch (err: unknown) {
      console.error(`ROTA: PUT /api/produtos/${req.params.id} - Erro:`, err);
      if (err instanceof Error && "name" in err && err.name === "ValidationError") {
        res.status(400).json({
          error: "Dados inválidos para atualização do produto.",
          details: (err as any).errors,
        });
        return;
      }
      res.status(500).json({
        error: (err as Error).message || "Erro interno ao atualizar produto.",
      });
    }
  }
);

app.delete(
  "/api/produtos/:id",
  async (req: Request, res: Response): Promise<void> => {
    console.log(`ROTA: DELETE /api/produtos/${req.params.id} - Iniciando...`);
    try {
      const deleted = await Product.findByIdAndDelete(req.params.id);
      if (!deleted) {
        console.log(`ROTA: DELETE /api/produtos/${req.params.id} - Produto não encontrado (404).`);
        res.status(404).json({ error: "Produto não encontrado para deletar" });
        return;
      }
      console.log(`ROTA: DELETE /api/produtos/${req.params.id} - Produto deletado.`);
      res.sendStatus(204);
    } catch (err: unknown) {
      console.error(`ROTA: DELETE /api/produtos/${req.params.id} - Erro:`, err);
      res.status(500).json({
        error: (err as Error).message || "Erro interno ao deletar produto.",
      });
    }
  }
);

app.get("/api/frete", async (req: Request, res: Response): Promise<void> => {
  console.log("ROTA: GET /api/frete - Iniciando com query:", req.query);
  const cepDestinoInput = req.query.cepDestino as string | undefined;
  const pesoInput = req.query.peso as string | undefined;
  const valorInput = req.query.valor as string | undefined;

  if (!cepDestinoInput) {
    console.log("ROTA: GET /api/frete - Erro: cepDestino faltando.");
    res.status(400).json({ error: "Parâmetro 'cepDestino' é obrigatório." });
    return;
  }
  const cepDestinoFinal = cepDestinoInput.replace(/\D/g, "");
  if (cepDestinoFinal.length !== 8) {
    console.log("ROTA: GET /api/frete - Erro: cepDestino inválido.");
    res.status(400).json({ error: "CEP de destino inválido. Deve conter 8 números." });
    return;
  }

  if (!pesoInput) {
    console.log("ROTA: GET /api/frete - Erro: peso faltando.");
    res.status(400).json({ error: "Parâmetro 'peso' é obrigatório." });
    return;
  }
  const pesoNumerico = parseFloat(pesoInput.replace(",", "."));
  if (isNaN(pesoNumerico) || pesoNumerico <= 0) {
    console.log("ROTA: GET /api/frete - Erro: peso inválido.");
    res.status(400).json({ error: "Peso inválido. Deve ser um número maior que zero." });
    return;
  }
  const pesoFinalFormatado = pesoNumerico.toFixed(3);

  let valorDeclaradoFinalFormatado = "0,00";
  if (valorInput) {
    const valorNumerico = parseFloat(valorInput.replace(",", "."));
    if (!isNaN(valorNumerico) && valorNumerico >= 0) {
      valorDeclaradoFinalFormatado = valorNumerico.toFixed(2).replace(".", ",");
    }
  }

  const argsBaseCorreios = {
    sCepOrigem: "37704273",
    sCepDestino: cepDestinoFinal,
    nVlPeso: pesoFinalFormatado,
    nCdFormato: "1",
    nVlComprimento: "20",
    nVlAltura: "2",
    nVlLargura: "11",
    nVlDiametro: "0",
    sCdMaoPropria: "N",
    nVlValorDeclarado: valorDeclaradoFinalFormatado,
    sCdAvisoRecebimento: "N",
    nCdServico: ["04014", "04510"],
    nCdEmpresa: "",
    sDsSenha: "",
    StrRetorno: "xml",
    nIndicaCalculo: "3",
  };

  const queryParams = new URLSearchParams({
      sCepOrigem: argsBaseCorreios.sCepOrigem,
      sCepDestino: argsBaseCorreios.sCepDestino,
      nVlPeso: argsBaseCorreios.nVlPeso,
      nCdFormato: argsBaseCorreios.nCdFormato,
      nVlComprimento: argsBaseCorreios.nVlComprimento,
      nVlAltura: argsBaseCorreios.nVlAltura,
      nVlLargura: argsBaseCorreios.nVlLargura,
      nVlDiametro: argsBaseCorreios.nVlDiametro,
      sCdMaoPropria: argsBaseCorreios.sCdMaoPropria,
      nVlValorDeclarado: argsBaseCorreios.nVlValorDeclarado,
      sCdAvisoRecebimento: argsBaseCorreios.sCdAvisoRecebimento,
      nCdServico: argsBaseCorreios.nCdServico.join(","),
      nCdEmpresa: argsBaseCorreios.nCdEmpresa,
      sDsSenha: argsBaseCorreios.sDsSenha,
      StrRetorno: argsBaseCorreios.StrRetorno,
      nIndicaCalculo: argsBaseCorreios.nIndicaCalculo,
  });

  const urlCorreiosHttp = `http://cws.correios.com.br/calculador/CalcPrecoPrazo.aspx?${queryParams.toString()}`;
  console.log("ROTA: GET /api/frete - Chamando Correios:", urlCorreiosHttp);

  try {
    await new Promise((resolve, reject) => {
      const reqHttp = http.get(urlCorreiosHttp, (resHttp) => {
        let data = "";
        resHttp.setEncoding("utf8");
        resHttp.on("data", (chunk) => { data += chunk; });
        resHttp.on("end", () => {
          if (resHttp.statusCode === 200 && data.toLowerCase().includes("<servicos>")) {
            resolve(true);
          } else {
            reject(new Error(`Erro HTTP: ${resHttp.statusCode} - Resposta: ${data.substring(0, 200)}`));
          }
        });
      });
      reqHttp.on("error", (e: NodeJS.ErrnoException) => reject(e));
      reqHttp.setTimeout(20000, () => reqHttp.destroy(new Error("Timeout da requisição Correios")));
      reqHttp.end();
    });

    console.log("ROTA: GET /api/frete - Sucesso na chamada Correios (Teste HTTP).");
    res.json([ { Codigo: "TEST_HTTP_OK", Valor: "1.00", PrazoEntrega: "1", Erro: "0", MsgErro: "Teste de conexão HTTP direta aos Correios bem-sucedido." } ]);

  } catch (error: any) {
    console.error("ROTA: GET /api/frete - Erro na chamada Correios:", error);
    res.status(504).json({ error: `Falha na conexão com os Correios: ${error.message}` });
  }
});


app.post(
  "/api/checkout",
  async (req: Request, res: Response): Promise<void> => {
    console.log("ROTA: POST /api/checkout - Iniciando...");
    const { items, successUrl, cancelUrl, shippingCost, customerEmail } = req.body;
    console.log("ROTA: POST /api/checkout - Itens:", items ? items.length : 0);

    if (!items || items.length === 0) {
      console.log("ROTA: POST /api/checkout - Erro: Sem itens.");
      res.status(400).json({ error: "Nenhum item fornecido para checkout." });
      return;
    }
    if (!successUrl || !cancelUrl) {
      console.log("ROTA: POST /api/checkout - Erro: Sem URLs.");
      res.status(400).json({ error: "URLs de sucesso e cancelamento são obrigatórias." });
      return;
    }

    try {
      console.log("ROTA: POST /api/checkout - Preparando line_items...");
      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
        items.map(
          (item: {
            name: string;
            amount: number;
            quantity: number;
            description?: string;
            images?: string[];
          }) => ({
            price_data: {
              currency: "brl",
              product_data: {
                name: item.name,
                ...(item.description && { description: item.description }),
                ...(item.images &&
                  item.images.length > 0 && { images: item.images }),
              },
              unit_amount: Math.round(item.amount),
            },
            quantity: item.quantity,
          })
        );

      if (shippingCost && shippingCost > 0) {
        console.log("ROTA: POST /api/checkout - Adicionando custo de envio...");
        line_items.push({
          price_data: {
            currency: "brl",
            product_data: { name: "Custo de Envio" },
            unit_amount: Math.round(shippingCost),
          },
          quantity: 1,
        });
      }

      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        success_url: successUrl,
        cancel_url: cancelUrl,
        billing_address_collection: "required",
        shipping_address_collection: { allowed_countries: ["BR"] },
      };

      if (customerEmail) {
        sessionParams.customer_email = customerEmail;
      }

      console.log("ROTA: POST /api/checkout - Criando sessão Stripe...");
      const session = await stripe.checkout.sessions.create(sessionParams);
      console.log("ROTA: POST /api/checkout - Sessão criada:", session.id);
      res.json({ sessionId: session.id, url: session.url });

    } catch (err: unknown) {
      console.error("❌ ROTA: POST /api/checkout - Erro Stripe:", err);
      if (err instanceof Stripe.errors.StripeError) {
        const stripeError = err as Stripe.errors.StripeError;
        res.status(stripeError.statusCode || 500).json({
          error: stripeError.message || "Erro ao criar sessão de checkout.",
          type: stripeError.type,
          code: stripeError.code,
        });
      } else {
        res.status(500).json({
          error:
            (err as Error).message ||
            "Erro desconhecido ao processar o checkout.",
        });
      }
    }
  }
);

app.use((_req: Request, res: Response) => {
  console.log("ROTA: Nenhuma rota encontrada - Retornando 404");
  res.status(404).json({ message: "Rota não encontrada neste servidor" });
});

export default app;
