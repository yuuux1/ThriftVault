"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import ToastBanner from "@/components/ui/ToastBanner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

    const [loading, setLoading] =
  useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  function showNotice(type: "success" | "error", message: string) {
    setNotice({ type, message });
    window.setTimeout(() => setNotice(null), 2600);
  }

  async function handleLogin(
  e: React.FormEvent
) {
  e.preventDefault();

  try {
    setLoading(true);

    const response = await fetch(
      "/api/login",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data =
      await response.json();

    if (!response.ok || !data.success) {
      showNotice("error", data.message || "Email atau password salah");
      return;
    }

    localStorage.setItem(
      "token",
      data.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    window.dispatchEvent(
      new Event("auth-changed")
    );

    showNotice("success", "Login berhasil. Mengalihkan ke beranda...");

    window.setTimeout(() => router.replace("/"), 700);

  } catch (error) {
    console.error(error);

    showNotice("error", "Terjadi kesalahan saat login.");
  } finally {
    setLoading(false);
  }
}

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#fff9f0_0%,#fffdf9_44%,#ffffff_100%)] px-6 py-12">
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_left,rgba(15,156,154,0.18),transparent_45%),radial-gradient(circle_at_top_right,rgba(255,120,103,0.15),transparent_40%)]" />

      <div className="relative w-full max-w-md rounded-[2rem] border border-[rgba(15,156,154,0.12)] bg-white/90 p-8 shadow-[0_24px_70px_rgba(15,24,40,0.08)] backdrop-blur">

        <h1 className="text-3xl font-bold text-center mb-6">
          Masuk
        </h1>

        <form
  onSubmit={handleLogin}
          className="space-y-4"
>

          <div>
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="mt-1 w-full rounded-xl border border-[rgba(15,156,154,0.16)] px-4 py-3 text-[var(--thrift-ink)] focus:border-[var(--thrift-teal)] focus:outline-none focus:ring-1 focus:ring-[var(--thrift-teal)]"
            />
          </div>

          <div>
            <label>Password</label>

            <div className="relative mt-1">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-[rgba(15,156,154,0.16)] px-4 py-3 pr-12 text-[var(--thrift-ink)] focus:border-[var(--thrift-teal)] focus:outline-none focus:ring-1 focus:ring-[var(--thrift-teal)]"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition-colors hover:text-[var(--thrift-teal)]"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          <button
  type="submit"
  disabled={loading}
    className="w-full rounded-xl bg-[var(--thrift-teal)] py-3 font-semibold text-white shadow-lg shadow-teal-500/10 transition-opacity hover:opacity-95 disabled:opacity-50"
>
  {loading
    ? "Memproses..."
    : "Masuk"}
</button>

        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Belum punya akun?
          <Link
            href="/register"
            className="ml-2 font-semibold text-[var(--thrift-teal)]"
          >
            Daftar
          </Link>
        </p>

      </div>
      {notice && <ToastBanner variant={notice.type} message={notice.message} />}
    </main>
  );
}