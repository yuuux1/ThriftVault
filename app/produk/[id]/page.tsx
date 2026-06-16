"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ToastBanner from "@/components/ui/ToastBanner";

type ProductDetail = {
  id: number;
  seller_id: number;
  category_id: number;
  name: string;
  slug: string;
  price: number;
  size: string;
  condition_percentage: number;
  description: string;
  created_at: string;
  image_url: string | null;
  images?: string[];
  category_name: string;
  seller_name: string;
  seller_email: string;
};

export default function ProdukDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const [chatLoading, setChatLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showNotice = (type: "success" | "error", message: string) => {
    setNotice({ type, message });
    window.setTimeout(() => setNotice(null), 2800);
  };

  const handleStartChat = async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      showNotice("error", "Harap login terlebih dahulu untuk memulai chat.");
      router.push("/login");
      return;
    }

    try {
      setChatLoading(true);
      const currentUser = JSON.parse(storedUser);

      if (Number(currentUser.id) === Number(product?.seller_id)) {
        showNotice("error", "Ini adalah produk Anda sendiri.");
        setChatLoading(false);
        return;
      }

      const res = await fetch("/api/chats/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          buyer_id: currentUser.id,
          seller_id: product?.seller_id,
          product_id: product?.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showNotice("error", data.message || "Gagal memulai chat.");
        return;
      }

      showNotice("success", "Chat berhasil dibuka.");
      router.push(`/chat?id=${data.conversationId}`);
    } catch (err) {
      console.error(err);
      showNotice("error", "Terjadi kesalahan saat memulai chat.");
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    async function fetchProductDetail() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Produk tidak ditemukan.");
          } else {
            setError("Gagal memuat detail produk.");
          }
          return;
        }
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan koneksi.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProductDetail();
    }
  }, [id]);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [product?.id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--thrift-teal)] border-t-transparent"></div>
        <p className="text-sm font-semibold text-slate-500">Memuat detail produk...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          ✕
        </div>
        <h2 className="text-2xl font-bold text-[var(--thrift-ink)]">{error || "Produk tidak ditemukan"}</h2>
        <p className="mt-2 text-slate-500">Pastikan URL yang Anda tuju sudah benar.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-[var(--thrift-teal)] px-6 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const mailSubject = encodeURIComponent(`Tanya Produk: ${product.name}`);
  const mailBody = encodeURIComponent(
    `Halo ${product.seller_name},\n\nSaya tertarik dengan produk "${product.name}" yang Anda jual di ThriftVault dengan harga Rp ${Number(
      product.price
    ).toLocaleString("id-ID")}.\n\nApakah produk ini masih tersedia?\n\nTerima kasih!`
  );
  const emailLink = `mailto:${product.seller_email}?subject=${mailSubject}&body=${mailBody}`;

  return (
    <main className="relative min-h-screen overflow-hidden pb-24">
      {/* Background radial highlight */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[500px] bg-[radial-gradient(circle_at_top,rgba(15,156,154,0.12),transparent_55%),radial-gradient(circle_at_top_left,rgba(255,120,103,0.08),transparent_40%)]" />

      <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-8">
          <Link href="/" className="hover:text-[var(--thrift-teal)] transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <span className="text-slate-400">{product.category_name || "Produk"}</span>
          <span>/</span>
          <span className="truncate max-w-[200px] text-[var(--thrift-ink)] font-semibold">
            {product.name}
          </span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Column: Product Image */}
          <div className="lg:col-span-7">
            {((product.images && product.images.length > 0) || product.image_url) ? (
              <div className="space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-[2.5rem] border border-[rgba(15,156,154,0.12)] bg-amber-50/40 p-4 shadow-xl backdrop-blur-sm">
                  <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-white">
                    <Image
                      src={product.images?.[selectedImageIndex] || product.image_url || ""}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      priority
                    />
                  </div>
                </div>

                {(product.images?.length || 0) > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {product.images?.map((imageUrl, index) => (
                      <button
                        key={`${imageUrl}-${index}`}
                        type="button"
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative aspect-square overflow-hidden rounded-2xl border-2 transition-all ${
                          selectedImageIndex === index
                            ? "border-[var(--thrift-teal)] ring-2 ring-[rgba(15,156,154,0.18)]"
                            : "border-transparent opacity-80 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={imageUrl}
                          alt={`${product.name} ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="relative aspect-square overflow-hidden rounded-[2.5rem] border border-[rgba(15,156,154,0.12)] bg-amber-50/40 p-4 shadow-xl backdrop-blur-sm">
                <div className="flex h-full w-full items-center justify-center rounded-[2rem] bg-white text-amber-500">
                  <span className="text-lg font-bold">Foto Produk</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Details & Actions */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            {/* Tag / Category */}
            <div>
              <span className="inline-flex items-center rounded-full bg-[rgba(15,156,154,0.1)] px-3.5 py-1 text-sm font-semibold text-[var(--thrift-teal)] border border-[rgba(15,156,154,0.12)]">
                {product.category_name || "Thrift"}
              </span>
            </div>

            {/* Title & Price */}
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[var(--thrift-ink)] md:text-4xl">
                {product.name}
              </h1>
              <p className="mt-3 text-3xl font-black text-[var(--thrift-rose)]">
                Rp {Number(product.price).toLocaleString("id-ID")}
              </p>
            </div>

            {/* Specifications Cards */}
            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-2xl border border-[rgba(15,156,154,0.1)] bg-white/70 p-4 shadow-sm backdrop-blur">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Kondisi</span>
                <p className="mt-1 text-lg font-extrabold text-[var(--thrift-ink)]">
                  {product.condition_percentage}%
                </p>
              </div>
            </div>

            {/* Seller Info Card */}
            <div className="rounded-3xl border border-[rgba(15,156,154,0.12)] bg-[linear-gradient(180deg,rgba(15,156,154,0.04),rgba(255,255,255,0.85))] p-5 shadow-md backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--thrift-teal)]">Penjual</p>
              <div className="mt-3 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--thrift-teal)] font-bold text-white text-lg">
                  {(product.seller_name?.charAt(0) || "U").toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h4 className="truncate text-base font-bold text-[var(--thrift-ink)]">
                    {product.seller_name || "User ThriftVault"}
                  </h4>
                  <p className="truncate text-sm text-slate-500">{product.seller_email}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Deskripsi Produk</h3>
              <div className="rounded-2xl border border-[rgba(15,156,154,0.08)] bg-white/50 p-5 leading-relaxed text-slate-600 shadow-inner">
                {product.description || "Tidak ada deskripsi untuk produk ini."}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-col gap-3">
              <button
                onClick={handleStartChat}
                disabled={chatLoading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[var(--thrift-rose)] py-4 text-center text-lg font-bold text-white shadow-lg shadow-rose-500/10 hover:opacity-95 hover:shadow-rose-500/20 active:scale-[0.99] transition-all duration-200 disabled:opacity-50"
              >
                {chatLoading ? "Memulai Chat..." : "Chat dengan Penjual"}
              </button>

              <a
                href={emailLink}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border border-[rgba(15,156,154,0.22)] bg-white/80 py-4 text-center text-lg font-semibold text-[var(--thrift-teal)] hover:bg-[rgba(15,156,154,0.06)] active:scale-[0.99] transition-all duration-200"
              >
                Hubungi via Email
              </a>
            </div>
          </div>
        </div>
      </div>

      {notice && <ToastBanner variant={notice.type} message={notice.message} />}
    </main>
  );
}
