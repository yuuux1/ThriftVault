"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/products/ProductCard";

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
  is_sold: number;
}

type NewestProductsProps = {
  selectedCategoryId: number | null;
  onClearFilter: () => void;
};

export default function NewestProducts({
  selectedCategoryId,
  onClearFilter,
}: NewestProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const url = selectedCategoryId
          ? `/api/products?categoryId=${selectedCategoryId}`
          : "/api/products";
        const response = await fetch(url);
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [selectedCategoryId]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[var(--thrift-ink)]">
          {selectedCategoryId ? "Produk Terkait" : "Produk Terbaru"}
        </h2>

        {selectedCategoryId && (
          <button
            onClick={onClearFilter}
            className="text-xs font-bold bg-[var(--thrift-rose)] text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            Tampilkan Semua
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-80 rounded-2xl bg-amber-100/30 animate-pulse border border-[rgba(15,156,154,0.08)]"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[rgba(15,156,154,0.2)] bg-amber-50/20 p-12 text-center">
          <p className="text-base font-bold text-[var(--thrift-ink)]">
            Belum Ada Produk
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Belum ada produk yang dijual dalam kategori ini.
          </p>
          <button
            onClick={onClearFilter}
            className="mt-4 inline-flex items-center justify-center rounded-xl bg-[var(--thrift-teal)] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            Lihat Produk Lain
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={Number(product.price)}
              image_url={product.image_url}
              isSold={product.is_sold === 1}
            />
          ))}
        </div>
      )}
    </section>
  );
}