"use client";

import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import { API_BASE_URL } from "@/utils/api";

const stripePromise = loadStripe(
  "pk_live_51R6aKTGdQrTu9hK3LggAl4OGzSvzEhtFneb4PC3uJNCBCeD9TxNUBTWxlnxeHAwOGXCO9wyxcYT7jatAKIEi7aIV0021K0WMml"
);

interface CustomerForm {
  fullName: string;
  email: string;
  cep: string;
  address: string;
  number: string;
  complement: string;
  city: string;
  state: string;
}

export default function CheckoutPage() {
  const { items } = useCart();

  const [form, setForm] = useState<CustomerForm>({
    fullName: "",
    email: "",
    cep: "",
    address: "",
    number: "",
    complement: "",
    city: "",
    state: "",
  });
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [couponMsg, setCouponMsg] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleCouponChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCoupon(e.target.value);
    setCouponMsg(null);
  }

  const productsTotal = items.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const shippingTotal = items.reduce(
    (sum, p) => sum + (p.shipping?.price || 0) * p.quantity,
    0
  );
  const grandTotal = productsTotal + shippingTotal - discount;

  function applyCoupon() {
    if (!coupon.trim()) {
      setCouponMsg("Informe um cupom.");
      return;
    }
    if (coupon.toUpperCase() === "PINGA10") {
      setDiscount(0.1 * productsTotal);
      setCouponMsg("Cupom aplicado: 10% de desconto!");
    } else {
      setDiscount(0);
      setCouponMsg("Cupom inválido.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const origin = window.location.origin;
      const payload = {
        items: items.map((i) => ({
          name: i.name,
          amount: Math.round(i.price * 100),
          quantity: i.quantity,
        })),
        successUrl: `${origin}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${origin}/`,
      };
      const res = await fetch(`${API_BASE_URL}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Status ${res.status}`);
      }

      const stripe = await stripePromise;
      await stripe!.redirectToCheckout({ sessionId: data.sessionId });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Erro inesperado");
      setLoading(false);
    }
  }

  return (
    <div className="pt-[50px] pb-16 bg-gray-50 px-4 sm:px-6">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Finalizar Pedido
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-6 rounded-xl shadow"
          >
            <div>
              <label className="block text-gray-700 mb-1">Nome completo</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#CDAF70] outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#CDAF70] outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">CEP</label>
                <input
                  name="cep"
                  value={form.cep}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#CDAF70] outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Número</label>
                <input
                  name="number"
                  value={form.number}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#CDAF70] outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Endereço</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#CDAF70] outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Complemento</label>
              <input
                name="complement"
                value={form.complement}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#CDAF70] outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Cidade</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#CDAF70] outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Estado</label>
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#CDAF70] outline-none"
                />
              </div>
            </div>

            {errorMsg && <p className="text-red-500">{errorMsg}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-center bg-blue-600 text-white py-3 rounded-xl transition-colors hover:bg-blue-700 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Processando..." : "Pagar"}
            </button>
          </form>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Resumo do Pedido
              </h2>
              <ul className="divide-y divide-gray-100">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden mr-4 bg-gray-100">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            priority={false}
                          />
                        )}
                      </div>

                      <div>
                        <p className="text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} × R${" "}
                          {item.price.toFixed(2).replace(".", ",")}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-800">
                      R${" "}
                      {(item.quantity * item.price)
                        .toFixed(2)
                        .replace(".", ",")}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-4 space-y-2 text-gray-800">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>R$ {productsTotal.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete:</span>
                  <span>R$ {shippingTotal.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Desconto:</span>
                  <span>- R$ {discount.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>R$ {grandTotal.toFixed(2).replace(".", ",")}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Tem um cupom de desconto?
              </h3>
              <div className="flex gap-2">
                <input
                  value={coupon}
                  onChange={handleCouponChange}
                  placeholder="Digite seu cupom"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#CDAF70] outline-none"
                />
                <button
                  onClick={applyCoupon}
                  className="bg-[#0d1b2b] text-white px-4 py-2 rounded-xl hover:bg-[#CDAF70] transition-colors"
                >
                  Aplicar
                </button>
              </div>
              {couponMsg && (
                <p className="mt-2 text-sm text-gray-600">{couponMsg}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
