// client/src/app/admin/page.tsx
"use client";

import React, {
  useState,
  useEffect,
  FormEvent,
  ChangeEvent,
} from "react";

interface FormState {
  name: string;
  price: string;
  images: string[];
  description: string;
  category: string;
  stock: string;
  ean: string;
  vendaUnidade: string;
  volume: string;
  unidadesPorCaixa: string;
  quantidadeMinima: string;
  pesoUnitario: string;
  pesoCaixa: string;
  ncm: string;
}

// Produto vindo da API (mongoose)
interface FetchedProduct {
  _id: string;
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
}

// Nosso tipo de produto no frontend
type Product = {
  id: string;
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
};

// Estado inicial do formulário
const emptyForm: FormState = {
  name: "",
  price: "",
  images: [""],
  description: "",
  category: "",
  stock: "",
  ean: "",
  vendaUnidade: "Garrafa",
  volume: "",
  unidadesPorCaixa: "",
  quantidadeMinima: "",
  pesoUnitario: "",
  pesoCaixa: "",
  ncm: "",
};

// Definição tipada dos campos técnicos
const techFields: Array<
  [keyof Omit<FormState, "images">, string]
> = [
  ["ean", "EAN"],
  ["vendaUnidade", "Unidade de Venda"],
  ["volume", "Volume"],
  ["unidadesPorCaixa", "Unidades por Caixa"],
  ["quantidadeMinima", "Quantidade Mínima"],
  ["pesoUnitario", "Peso Unitário"],
  ["pesoCaixa", "Peso da Caixa"],
  ["ncm", "NCM"],
];

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<FormState>({ ...emptyForm });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Busca produtos da API
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = (await res.json()) as FetchedProduct[];
      setProducts(
        data.map((p) => ({
          id: p._id,
          name: p.name,
          price: p.price,
          images: p.images,
          description: p.description,
          category: p.category,
          stock: p.stock,
          ean: p.ean,
          vendaUnidade: p.vendaUnidade,
          volume: p.volume,
          unidadesPorCaixa: p.unidadesPorCaixa,
          quantidadeMinima: p.quantidadeMinima,
          pesoUnitario: p.pesoUnitario,
          pesoCaixa: p.pesoCaixa,
          ncm: p.ncm,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Atualiza campos do form
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    idx?: number
  ) => {
    const { name, value } = e.target;
    if (name === "images" && typeof idx === "number") {
      const imgs = [...form.images];
      imgs[idx] = value;
      setForm({ ...form, images: imgs });
    } else {
      setForm((f) => ({ ...f, [name]: value } as FormState));
    }
  };

  const addImageField = () => {
    setForm((f) => ({ ...f, images: [...f.images, ""] }));
  };

  // Cria ou atualiza produto
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        name: form.name,
        price: parseFloat(form.price.replace(",", ".")),
        images: form.images.filter(Boolean),
        description: form.description,
        category: form.category,
        stock: parseInt(form.stock, 10),
        ean: form.ean,
        vendaUnidade: form.vendaUnidade,
        volume: form.volume,
        unidadesPorCaixa: parseInt(form.unidadesPorCaixa, 10),
        quantidadeMinima: form.quantidadeMinima,
        pesoUnitario: form.pesoUnitario,
        pesoCaixa: form.pesoCaixa,
        ncm: form.ncm,
      };

      const url = editingId
        ? `/api/products/${editingId}`
        : "/api/products";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);

      setMessage(
        editingId ? "Produto atualizado!" : "Produto criado!"
      );
      setForm({ ...emptyForm });
      setEditingId(null);
      await fetchProducts();
    } catch {
      setMessage("Erro ao salvar produto.");
    } finally {
      setLoading(false);
    }
  };

  // Preenche form para editar
  const handleEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      price: p.price.toFixed(2).replace(".", ","),
      images: [...p.images],
      description: p.description,
      category: p.category,
      stock: p.stock.toString(),
      ean: p.ean,
      vendaUnidade: p.vendaUnidade,
      volume: p.volume,
      unidadesPorCaixa: p.unidadesPorCaixa.toString(),
      quantidadeMinima: p.quantidadeMinima,
      pesoUnitario: p.pesoUnitario,
      pesoCaixa: p.pesoCaixa,
      ncm: p.ncm,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Exclui produto
  const handleDelete = async (id: string) => {
    if (!confirm("Confirma exclusão deste produto?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    await fetchProducts();
  };

  return (
    <div className="pt-[50px] pb-16 bg-gray-50">
      <div className="max-w-screen-xl mx-auto md:px-6 space-y-12">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Painel Admin
        </h1>

        {/* Formulário */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-8 space-y-6">
            {message && (
              <p
                className={`text-center ${
                  message.includes("Erro")
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {message}
              </p>
            )}

            {/* Nome & Preço */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-1">
                  Nome do Produto
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#CDAF70] outline-none"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Preço (R$)
                </label>
                <input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#CDAF70] outline-none"
                />
              </div>
            </div>

            {/* Imagens */}
            <div>
              <label className="block font-medium mb-1">
                URLs de Imagem
              </label>
              {form.images.map((_, idx) => (
                <input
                  key={idx}
                  name="images"
                  value={form.images[idx]}
                  onChange={(e) => handleChange(e, idx)}
                  placeholder="https://..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 mb-2 focus:ring-2 focus:ring-[#CDAF70] outline-none"
                />
              ))}
              <button
                type="button"
                onClick={addImageField}
                className="text-sm text-[#0d1b2b] hover:text-[#CDAF70]"
              >
                + Adicionar imagem
              </button>
            </div>

            {/* Descrição & Categoria */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-1">
                  Descrição
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#CDAF70] outline-none"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Categoria
                </label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#CDAF70] outline-none"
                />
              </div>
            </div>

            {/* Campos Técnicos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {techFields.map(([key, label]) => (
                <div key={key}>
                  <label className="block font-medium mb-1">
                    {label}
                  </label>
                  <input
                    name={key}
                    value={form[key] as string}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#CDAF70] outline-none"
                  />
                </div>
              ))}
            </div>

            {/* Estoque */}
            <div>
              <label className="block font-medium mb-1">
                Estoque
              </label>
              <input
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#CDAF70] outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0d1b2b] text-white py-3 rounded-xl font-medium transition-colors hover:bg-[#CDAF70] disabled:opacity-50"
            >
              {editingId ? "Salvar Alterações" : "Criar Produto"}
            </button>
          </div>
        </form>

        {/* Tabela de Produtos */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-lg">
            <thead>
              <tr className="bg-[#0d1b2b] text-white">
                <th className="px-6 py-3 text-left">Nome</th>
                <th className="px-6 py-3 text-left">Preço</th>
                <th className="px-6 py-3 text-left">Categoria</th>
                <th className="px-6 py-3 text-left">Estoque</th>
                <th className="px-6 py-3 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b last:border-none">
                  <td className="px-6 py-4">{p.name}</td>
                  <td className="px-6 py-4">
                    R$ {p.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">{p.category}</td>
                  <td className="px-6 py-4">{p.stock}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="px-3 py-1 bg-[#0d1b2b] text-white rounded transition-colors hover:bg-[#CDAF70]"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded transition-colors hover:bg-red-700"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
