"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAccountOpen(false);
    window.dispatchEvent(new Event("auth-changed"));
    router.push("/login");
  };

  useEffect(() => {
    const readUser = () => {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setUserName("");
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);
        setUserName(parsedUser?.name || "");
      } catch {
        setUserName("");
      }
    };

    readUser();

    window.addEventListener("storage", readUser);
    window.addEventListener("auth-changed", readUser);

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      window.removeEventListener("storage", readUser);
      window.removeEventListener("auth-changed", readUser);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <nav className="border-b border-[rgba(15,156,154,0.18)] bg-[rgba(255,249,238,0.82)] backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-[var(--thrift-teal)]"
        >
          ThriftVault
        </Link>

        {/* Menu kanan */}
        <div className="flex items-center gap-4">
          {userName && (
            <Link
              href="/chat"
              className="
                flex items-center gap-2
                rounded-xl
                border border-[rgba(15,156,154,0.18)]
                bg-white/70
                px-4 py-2.5
                font-semibold
                text-[var(--thrift-teal)]
                transition-colors
                hover:bg-white
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.2"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21.75l2.755-3.89a1.071 1.071 0 01.865-.501c1.153-.086 2.294-.213 3.423-.379 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                />
              </svg>
              <span>Chat</span>
            </Link>
          )}

          {userName ? (
            <div ref={accountMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsAccountOpen((current) => !current)}
                className="flex items-center gap-3 rounded-xl border border-[rgba(15,156,154,0.18)] bg-white/70 px-4 py-2 transition-colors hover:bg-white"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--thrift-teal)] text-sm font-bold text-white">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="leading-tight text-left">
                  <p className="text-xs text-slate-500">Akun</p>
                  <p className="max-w-[160px] truncate font-semibold text-[var(--thrift-teal)]">
                    {userName}
                  </p>
                </div>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="none"
                  className={`h-5 w-5 text-[var(--thrift-teal)] transition-transform ${
                    isAccountOpen ? "rotate-180" : ""
                  }`}
                >
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {isAccountOpen ? (
                <div className="absolute right-0 top-full z-50 mt-3 w-[320px] overflow-hidden rounded-2xl border border-[rgba(15,156,154,0.12)] bg-white shadow-[0_18px_50px_rgba(15,24,40,0.12)]">
                  <div className="flex items-center gap-4 border-b border-slate-100 px-5 py-5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--thrift-teal)] text-2xl font-bold text-white">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Profile
                      </p>
                      <p className="mt-1 truncate text-lg font-bold text-[var(--thrift-ink)]">
                        {userName}
                      </p>
                      <p className="text-sm text-slate-500">
                        Akun aktif di ThriftVault
                      </p>
                    </div>
                  </div>

                  <div className="px-5 py-4">
                    <Link
                      href="/profil-saya"
                      onClick={() => setIsAccountOpen(false)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-semibold text-[var(--thrift-ink)] transition-colors hover:bg-[rgba(15,156,154,0.08)] hover:text-[var(--thrift-teal)]"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(15,156,154,0.12)] text-[var(--thrift-teal)]">
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 20 20"
                          fill="none"
                          className="h-5 w-5"
                        >
                          <path
                            d="M10 9.25C11.5188 9.25 12.75 8.01878 12.75 6.5C12.75 4.98122 11.5188 3.75 10 3.75C8.48122 3.75 7.25 4.98122 7.25 6.5C7.25 8.01878 8.48122 9.25 10 9.25Z"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          />
                          <path
                            d="M4.75 15.25C5.66877 12.7986 7.71637 11.25 10 11.25C12.2836 11.25 14.3312 12.7986 15.25 15.25"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                      <span>
                        Profil Saya
                        <span className="block text-sm font-normal text-slate-500">
                          Lihat akun dan produk yang kamu upload
                        </span>
                      </span>
                    </Link>

                    <Link
                      href="/produk-saya"
                      onClick={() => setIsAccountOpen(false)}
                      className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-semibold text-[var(--thrift-ink)] transition-colors hover:bg-[rgba(15,156,154,0.08)] hover:text-[var(--thrift-teal)]"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(15,156,154,0.12)] text-[var(--thrift-teal)]">
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 20 20"
                          fill="none"
                          className="h-5 w-5"
                        >
                          <path
                            d="M5 6.5H15"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                          <path
                            d="M6.5 6.5L7.3 14.2C7.38 14.98 8.04 15.58 8.82 15.58H11.18C11.96 15.58 12.62 14.98 12.7 14.2L13.5 6.5"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8.5 6.5V5.4C8.5 4.84 8.94 4.4 9.5 4.4H10.5C11.06 4.4 11.5 4.84 11.5 5.4V6.5"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                      <span>
                        Produk Saya
                        <span className="block text-sm font-normal text-slate-500">
                          Kelola dan hapus produk yang diunggah
                        </span>
                      </span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-semibold text-[var(--thrift-ink)] transition-colors hover:bg-[rgba(15,156,154,0.08)] hover:text-[var(--thrift-teal)]"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(15,156,154,0.12)] text-[var(--thrift-teal)]">
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 20 20"
                          fill="none"
                          className="h-5 w-5"
                        >
                          <path
                            d="M7.5 4.5H4.75C4.33579 4.5 4 4.83579 4 5.25V14.75C4 15.1642 4.33579 15.5 4.75 15.5H7.5"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                          <path
                            d="M11 13L14 10L11 7"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14 10H7"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                      <span>
                        Logout
                        <span className="block text-sm font-normal text-slate-500">
                          Keluar dari akun ini
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <Link
              href="/login"
              className="
                font-semibold
                text-[var(--thrift-teal)]
                hover:text-[var(--thrift-rose)]
                transition-colors
              "
            >
              Login/Daftar
            </Link>
          )}

          <Link
            href="/jual"
            className="
              flex items-center gap-2
              bg-[var(--thrift-teal)]
              text-white
              px-5 py-3
              rounded-xl
              font-semibold
              hover:opacity-90
              transition
            "
          >
            <span className="text-xl leading-none">+</span>
            Jual
          </Link>
        </div>
      </div>
    </nav>
  );
}