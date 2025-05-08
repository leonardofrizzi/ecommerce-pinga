// client/src/contexts/CartContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/components/ProductCard";

export interface FreteOption {
  code: string;
  service: string;
  price: number;
  deadline: number;
}

export interface CartItem extends Product {
  quantity: number;
  shipping?: FreteOption;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + product.quantity, shipping: product.shipping }
            : p
        );
      }
      return [...prev, product];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((p) => p.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, quantity: Math.max(1, quantity) } : p
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, p) => sum + p.quantity, 0);
  const totalPrice = items.reduce(
    (sum, p) => sum + p.quantity * p.price + (p.shipping?.price || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
