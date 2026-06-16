"use client";

import { useEffect, useState } from "react";

export default function ProdukSayaPage() {

  const [products, setProducts] =
    useState<any[]>([]);

  useEffect(() => {

    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    fetch(
      `/api/my-products?seller_id=${user.id}`
    )
      .then((res) => res.json())
      .then(setProducts);

  }, []);

  async function handleDelete(
    productId: number
  ) {

    const confirmDelete =
      confirm(
        "Yakin ingin menghapus produk?"
      );

    if (!confirmDelete) return;

    await fetch(
      "/api/products/delete",
      {
        method: "DELETE",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          productId,
        }),
      }
    );

    setProducts(
      products.filter(
        (p) => p.id !== productId
      )
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-8">
        Produk Saya
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        {products.map((product) => (

          <div
            key={product.id}
            className="border rounded-xl p-4"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="
                w-full
                h-56
                object-cover
                rounded-lg
              "
            />

            <h3 className="font-bold mt-3">
              {product.name}
            </h3>

            <p>
              Rp{" "}
              {Number(
                product.price
              ).toLocaleString("id-ID")}
            </p>

            <button
              onClick={() =>
                handleDelete(product.id)
              }
              className="
                mt-4
                bg-red-500
                text-white
                px-4
                py-2
                rounded-lg
              "
            >
              Hapus
            </button>

          </div>

        ))}

      </div>

    </main>
  );
}