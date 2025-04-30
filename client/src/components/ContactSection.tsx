// client/src/components/ContactSection.tsx
"use client";

import { useState } from "react";

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Enviado:", form);
  };

  return (
    <section id="contact" className="md:pt-[50px] pb-16 bg-gray-50">
      <div className="max-w-screen-xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6 md:p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Fale Conosco
          </h2>
          <p className="text-gray-600 mb-8 text-center">
            Estamos aqui para ajudar. Envie sua mensagem que retornaremos o mais
            breve possível.
          </p>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Seu nome"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#CDAF70]"
              required
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Seu e-mail"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#CDAF70]"
              required
            />
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Seu telefone"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#CDAF70]"
            />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Sua mensagem"
              rows={5}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#CDAF70]"
              required
            />
            <button
              type="submit"
              className="self-center px-8 py-3 bg-[#0d1b2b] text-white font-medium rounded-xl transition-colors hover:bg-[#CDAF70]"
            >
              Enviar Mensagem
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
