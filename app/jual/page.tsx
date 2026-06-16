"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ToastBanner from "@/components/ui/ToastBanner";

interface Category {
  id: number;
  name: string;
}

const MAX_IMAGES = 5;

export default function JualPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [conditionPercentage, setConditionPercentage] = useState("90");
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function showNotice(type: "success" | "error", message: string) {
    setNotice({ type, message });
    window.setTimeout(() => setNotice(null), 2800);
  }

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      window.location.href = "/login";
      return;
    }
    async function fetchCategories() {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    }
    fetchCategories();
  }, []);

  // Clean up object URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addFiles(files: FileList | File[]) {
    const incoming = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    );
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) return;
    const toAdd = incoming.slice(0, remaining);
    const newPreviews = toAdd.map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...toAdd]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  }

  function removeImage(index: number) {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      addFiles(e.target.files);
      // Reset so the same file can be picked again if removed
      e.target.value = "";
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const formData = new FormData();
      formData.append("seller_id", user.id);
      formData.append("category_id", categoryId);
      formData.append("name", name);
      formData.append("price", price);
      formData.append("condition_percentage", conditionPercentage);
      formData.append("description", description);

      images.forEach((img) => {
        formData.append("images[]", img);
      });

      const response = await fetch("/api/products/create", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        showNotice("error", data.message || "Gagal menambahkan produk.");
        return;
      }

      showNotice("success", "Produk berhasil ditambahkan.");
      // Reset form
      setImages([]);
      setPreviews([]);
      setName("");
      setCategoryId("");
      setPrice("");
      setConditionPercentage("90");
      setDescription("");
    } catch (error) {
      console.error(error);
      showNotice("error", "Terjadi kesalahan saat menyimpan produk.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden pb-24">
      {/* Background gradient */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[500px] bg-[radial-gradient(circle_at_top,rgba(15,156,154,0.10),transparent_55%),radial-gradient(circle_at_top_right,rgba(255,120,103,0.07),transparent_40%)]" />

      <div className="mx-auto max-w-2xl px-6 pt-10 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <span className="inline-flex items-center rounded-full bg-[rgba(15,156,154,0.1)] px-3.5 py-1 text-sm font-semibold text-[var(--thrift-teal)] border border-[rgba(15,156,154,0.12)]">
            Jual Barang
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--thrift-ink)] md:text-4xl">
            Upload Produk Baru
          </h1>
          <p className="mt-2 text-slate-500">
            Isi detail produk kamu dan upload maksimal 5 foto.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">

          {/* ── FOTO PRODUK ── */}
          <div className="rounded-3xl border border-[rgba(15,156,154,0.12)] bg-white/80 p-6 shadow-sm backdrop-blur">
            <label className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
              Foto Produk
              <span className="ml-2 normal-case text-xs font-normal text-slate-400">
                ({images.length}/{MAX_IMAGES} foto)
              </span>
            </label>

            {/* Drop zone — only shown if slot available */}
            {images.length < MAX_IMAGES && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  flex cursor-pointer flex-col items-center justify-center gap-3
                  rounded-2xl border-2 border-dashed p-8 transition-all duration-200
                  ${
                    isDragging
                      ? "border-[var(--thrift-teal)] bg-[rgba(15,156,154,0.06)] scale-[1.01]"
                      : "border-[rgba(15,156,154,0.25)] bg-[rgba(15,156,154,0.02)] hover:bg-[rgba(15,156,154,0.05)] hover:border-[rgba(15,156,154,0.4)]"
                  }
                `}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(15,156,154,0.08)] text-[var(--thrift-teal)]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-[var(--thrift-ink)]">
                    Klik atau drag &amp; drop foto di sini
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    PNG, JPG, WEBP — maks. {MAX_IMAGES} foto
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}

            {/* Preview grid */}
            {previews.length > 0 && (
              <div className={`grid gap-3 grid-cols-5 ${images.length < MAX_IMAGES ? "mt-4" : ""}`}>
                {previews.map((src, i) => (
                  <div key={i} className="relative group aspect-square">
                    <div className="relative h-full w-full overflow-hidden rounded-xl border border-[rgba(15,156,154,0.12)] bg-slate-50 shadow-sm">
                      <Image
                        src={src}
                        alt={`preview-${i}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      {/* Badge utama */}
                      {i === 0 && (
                        <span className="absolute bottom-1 left-1 rounded-md bg-[var(--thrift-teal)] px-1.5 py-0.5 text-[10px] font-bold text-white leading-none">
                          Utama
                        </span>
                      )}
                    </div>
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:bg-rose-600"
                      aria-label="Hapus foto"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}

                {/* Add more slot inside grid */}
                {images.length < MAX_IMAGES && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[rgba(15,156,154,0.25)] text-[var(--thrift-teal)] hover:bg-[rgba(15,156,154,0.05)] hover:border-[rgba(15,156,154,0.4)] transition-all duration-200"
                    aria-label="Tambah foto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <span className="mt-1 text-[10px] font-semibold">Tambah</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ── DETAIL PRODUK ── */}
          <div className="rounded-3xl border border-[rgba(15,156,154,0.12)] bg-white/80 p-6 shadow-sm backdrop-blur space-y-5">
            <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Detail Produk</p>

            {/* Kategori */}
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-[var(--thrift-ink)]">Kategori</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full rounded-xl border border-[rgba(15,156,154,0.18)] bg-white px-4 py-3 text-sm text-[var(--thrift-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--thrift-teal)] transition"
              >
                <option value="">Pilih Kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Nama Produk */}
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-[var(--thrift-ink)]">Nama Produk</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Contoh: Jaket Denim Vintage Levis"
                className="w-full rounded-xl border border-[rgba(15,156,154,0.18)] bg-white px-4 py-3 text-sm text-[var(--thrift-ink)] placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--thrift-teal)] transition"
              />
            </div>

            {/* Kondisi */}
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-[var(--thrift-ink)]">Kondisi (%)</label>
              <input
                type="number"
                value={conditionPercentage}
                onChange={(e) => setConditionPercentage(e.target.value)}
                min={1}
                max={100}
                required
                className="w-full rounded-xl border border-[rgba(15,156,154,0.18)] bg-white px-4 py-3 text-sm text-[var(--thrift-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--thrift-teal)] transition"
              />
            </div>

            {/* Harga */}
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-[var(--thrift-ink)]">Harga (Rp)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">Rp</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min={0}
                  placeholder="50000"
                  className="w-full rounded-xl border border-[rgba(15,156,154,0.18)] bg-white pl-10 pr-4 py-3 text-sm text-[var(--thrift-ink)] placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--thrift-teal)] transition"
                />
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-[var(--thrift-ink)]">Deskripsi</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ceritakan kondisi, merek, atau detail lain dari produk kamu..."
                className="w-full rounded-xl border border-[rgba(15,156,154,0.18)] bg-white px-4 py-3 text-sm text-[var(--thrift-ink)] placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--thrift-teal)] transition resize-none"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[var(--thrift-teal)] py-4 text-center text-lg font-bold text-white shadow-lg shadow-teal-500/10 hover:opacity-95 hover:shadow-teal-500/20 active:scale-[0.99] transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Jual Sekarang 🚀"}
          </button>
        </form>
      </div>

      {notice && <ToastBanner variant={notice.type} message={notice.message} />}
    </main>
  );
}