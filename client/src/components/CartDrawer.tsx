"use client";

import Image from "next/image";
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingCart } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

export default function CartDrawer() {
  const router = useRouter();
  const {
    drawerOpen,
    toggleDrawer,
    items,
    updateQuantity,
    removeFromCart,
    totalPrice,
  } = useCart();

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 flex flex-col ${
        drawerOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">
          Seu Carrinho ({items.length})
        </h2>
        <button
          onClick={toggleDrawer}
          className="p-1 text-gray-500 hover:text-gray-700"
        >
          <FiX size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {items.length === 0 ? (
          <p className="text-center text-gray-500">Carrinho vazio</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-start gap-4">
              <div className="relative w-14 h-14 rounded overflow-hidden bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  priority={false}
                />
              </div>

              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-600">
                  R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="px-2 text-gray-700">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    <FiPlus size={14} />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-4 text-red-500 hover:text-red-700 flex items-center"
                  >
                    <FiTrash2 size={16} />
                    <span className="ml-1 text-sm">Remover</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div className="border-t p-4 bg-white">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-700 font-medium">Subtotal</span>
            <span className="text-lg text-gray-900 font-semibold">
              R$ {totalPrice.toFixed(2).replace(".", ",")}
            </span>
          </div>
          <button
            onClick={() => {
              toggleDrawer();
              router.push("/checkout");
            }}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:from-blue-600 hover:to-blue-700 transition"
          >
            <FiShoppingCart size={20} />
            <span className="font-medium">Finalizar Compra</span>
          </button>
        </div>
      )}
    </div>
  );
}
