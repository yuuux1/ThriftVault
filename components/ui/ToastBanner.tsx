"use client";

type ToastBannerProps = {
  message: string;
  variant: "success" | "error";
};

export default function ToastBanner({ message, variant }: ToastBannerProps) {
  return (
    <div className="fixed right-4 top-4 z-50 max-w-sm animate-[fadeIn_0.2s_ease-out]">
      <div
        className={`rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-sm ${
          variant === "success"
            ? "border-emerald-200 bg-emerald-50/95 text-emerald-800"
            : "border-rose-200 bg-rose-50/95 text-rose-800"
        }`}
      >
        <p className="text-sm font-semibold leading-relaxed">{message}</p>
      </div>
    </div>
  );
}