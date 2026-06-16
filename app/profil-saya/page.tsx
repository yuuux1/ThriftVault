"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type StoredUser = {
  id?: number;
  name?: string;
  email?: string;
};

export default function ProfilSayaPage() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setUser(null);
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-changed"));
    router.push("/login");
  };

  return (
    <main className="relative overflow-hidden bg-[linear-gradient(180deg,#fff9f0_0%,#fffdf9_44%,#ffffff_100%)]">
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_left,rgba(15,156,154,0.18),transparent_45%),radial-gradient(circle_at_top_right,rgba(255,120,103,0.15),transparent_40%)]" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 lg:px-8 lg:py-16">
        <section className="overflow-hidden rounded-[2rem] border border-[rgba(15,156,154,0.12)] bg-white/85 shadow-[0_24px_70px_rgba(15,24,40,0.08)] backdrop-blur">
          <div className="grid gap-8 p-8 md:grid-cols-[1.4fr_0.9fr] md:p-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--thrift-rose)]">
                Profil Saya
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--thrift-ink)] md:text-5xl">
                Kelola akun dan produk yang kamu upload dari satu tempat.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                Dari sini kamu bisa membuka daftar produk sendiri, menghapus item yang sudah tidak dijual, atau lanjut upload barang baru.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/produk-saya"
                  className="inline-flex items-center justify-center rounded-xl bg-[var(--thrift-teal)] px-5 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5 hover:opacity-95"
                >
                  Buka Produk Saya
                </Link>
                <Link
                  href="/jual"
                  className="inline-flex items-center justify-center rounded-xl border border-[rgba(15,156,154,0.18)] bg-white px-5 py-3 font-semibold text-[var(--thrift-teal)] transition-colors hover:bg-[rgba(15,156,154,0.06)]"
                >
                  Jual Barang Baru
                </Link>
              </div>
            </div>

            <aside className="rounded-[1.75rem] border border-[rgba(15,156,154,0.12)] bg-[linear-gradient(180deg,rgba(15,156,154,0.08),rgba(255,255,255,0.92))] p-6 shadow-[0_18px_50px_rgba(15,24,40,0.06)]">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--thrift-teal)] text-2xl font-bold text-white">
                  {(user?.name?.charAt(0) || "?").toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Akun aktif
                  </p>
                  <p className="truncate text-xl font-bold text-[var(--thrift-ink)]">
                    {user?.name || "Belum login"}
                  </p>
                  <p className="truncate text-sm text-slate-500">
                    {user?.email || "Masuk untuk melihat informasi akun"}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                <div className="rounded-2xl bg-white/90 px-4 py-4">
                  <p className="text-sm font-semibold text-[var(--thrift-ink)]">
                    Akses cepat
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Produk Saya sekarang bisa dibuka dari halaman ini atau dropdown akun di navbar.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center rounded-xl border border-[rgba(15,156,154,0.18)] bg-white px-5 py-3 font-semibold text-[var(--thrift-ink)] transition-colors hover:bg-[rgba(15,156,154,0.06)]"
                >
                  Logout
                </button>
              </div>
            </aside>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <Link
            href="/produk-saya"
            className="group rounded-[1.75rem] border border-[rgba(15,156,154,0.12)] bg-white/90 p-6 shadow-[0_14px_40px_rgba(15,24,40,0.06)] transition-transform hover:-translate-y-1"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--thrift-rose)]">
              Produk Saya
            </p>
            <h2 className="mt-3 text-2xl font-bold text-[var(--thrift-ink)]">
              Lihat dan hapus produk yang pernah kamu upload.
            </h2>
            <p className="mt-3 max-w-xl text-slate-600">
              Masuk ke daftar produk untuk mengelola stok, membuka detail, dan menghapus item yang sudah tidak diperlukan.
            </p>
          </Link>

          <Link
            href="/jual"
            className="group rounded-[1.75rem] border border-[rgba(15,156,154,0.12)] bg-[linear-gradient(135deg,rgba(15,156,154,0.08),rgba(255,255,255,0.96))] p-6 shadow-[0_14px_40px_rgba(15,24,40,0.06)] transition-transform hover:-translate-y-1"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--thrift-rose)]">
              Jual Barang
            </p>
            <h2 className="mt-3 text-2xl font-bold text-[var(--thrift-ink)]">
              Upload produk baru dari profil kamu.
            </h2>
            <p className="mt-3 max-w-xl text-slate-600">
              Gunakan halaman jual untuk menambahkan item thrift baru ke toko kamu.
            </p>
          </Link>
        </section>
      </div>
    </main>
  );
}
