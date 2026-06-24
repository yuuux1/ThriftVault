"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
  is_sold: number;
}

export default function ProdukSayaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    fetch(`/api/my-products?seller_id=${user.id}`)
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  async function handleDelete(productId: number) {
    const confirmDelete = confirm("Yakin ingin menghapus produk?");
    if (!confirmDelete) return;

    await fetch("/api/products/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    setProducts(products.filter((p) => p.id !== productId));
  }

  async function handleToggleSold(product: Product) {
    const newStatus = product.is_sold === 1 ? 0 : 1;
    const label = newStatus === 1 ? "sold out" : "tersedia";
    const confirmToggle = confirm(
      `Tandai produk "${product.name}" sebagai ${label}?`
    );
    if (!confirmToggle) return;

    setLoadingId(product.id);

    const res = await fetch("/api/products/sold", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, is_sold: newStatus === 1 }),
    });

    if (res.ok) {
      setProducts(
        products.map((p) =>
          p.id === product.id ? { ...p, is_sold: newStatus } : p
        )
      );
    }

    setLoadingId(null);
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--thrift-ink)]">
          Produk Saya
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {products.length} produk terdaftar
        </p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[rgba(15,156,154,0.2)] bg-amber-50/20 p-16 text-center">
          <p className="text-base font-bold text-[var(--thrift-ink)]">
            Belum Ada Produk
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Kamu belum menjual produk apapun.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const isSold = product.is_sold === 1;
            const isLoading = loadingId === product.id;

            return (
              <div
                key={product.id}
                className={`
                  relative border rounded-2xl overflow-hidden bg-[rgba(255,249,238,0.88)]
                  shadow-sm transition-all duration-300
                  ${isSold ? "opacity-80" : "hover:shadow-md hover:-translate-y-1"}
                `}
              >
                {/* Badge sold out */}
                {isSold && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-gray-800 text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shadow">
                      Sold Out
                    </span>
                  </div>
                )}

                {/* Foto produk */}
                <div className="relative h-52 w-full bg-amber-50">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className={`object-cover transition-all duration-300 ${isSold ? "grayscale" : ""}`}
                    />
                  ) : (
                    <div className="h-full w-full bg-amber-100" />
                  )}
                </div>

                {/* Info produk */}
                <div className="p-4">
                  <h3 className="font-bold text-[var(--thrift-ink)] line-clamp-1">
                    {product.name}
                  </h3>
                  <p className={`text-sm font-semibold mt-1 ${isSold ? "text-slate-400 line-through" : "text-[var(--thrift-rose)]"}`}>
                    Rp {Number(product.price).toLocaleString("id-ID")}
                  </p>

                  {/* Tombol aksi */}
                  <div className="flex gap-2 mt-4">
                    {/* Toggle Sold Out */}
                    <button
                      onClick={() => handleToggleSold(product)}
                      disabled={isLoading}
                      className={`
                        flex-1 flex items-center justify-center gap-1.5
                        text-xs font-semibold px-3 py-2 rounded-xl
                        transition-all duration-200 border
                        ${isLoading ? "opacity-60 cursor-not-allowed" : ""}
                        ${isSold
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                        }
                      `}
                    >
                      {isLoading ? (
                        <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : isSold ? (
                        <>
                          <span>✓</span>
                          <span>Tandai Tersedia</span>
                        </>
                      ) : (
                        <>
                          <span>✕</span>
                          <span>Tandai Sold Out</span>
                        </>
                      )}
                    </button>

                    {/* Hapus */}
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="
                        flex items-center justify-center
                        text-xs font-semibold px-3 py-2 rounded-xl
                        bg-red-50 text-red-600 border border-red-200
                        hover:bg-red-100 transition-all duration-200
                      "
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}