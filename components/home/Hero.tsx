import Image from "next/image";

export default function Hero() {
  return (
    <section>
      <div className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Bagian Kiri */}
          <div>
            <span className="inline-flex items-center rounded-full bg-[var(--thrift-teal)] px-4 py-2 text-sm font-medium text-white shadow-lg shadow-[rgba(15,156,154,0.22)]">
              Koleksi Terbaru
            </span>

            <h1 className="text-5xl font-bold mt-6 leading-tight text-[var(--thrift-ink)]">
              Temukan Harta Karun Fashion Thrift
            </h1>

            <p className="text-[rgba(23,53,58,0.78)] mt-6 text-lg max-w-xl">
              Dapatkan berbagai fashion item berkualitas
              dengan harga yang ramah di kantong.
            </p>

            <div className="flex gap-4 mt-8">
              <button className="rounded-xl bg-[var(--thrift-rose)] px-6 py-3 font-medium text-white shadow-lg shadow-[rgba(217,95,133,0.22)] transition-transform hover:-translate-y-0.5">
                Belanja Sekarang
              </button>

              <button className="rounded-xl border border-[var(--thrift-teal)] px-6 py-3 font-medium text-[var(--thrift-teal)] transition-colors hover:bg-[rgba(15,156,154,0.08)]">
                Mulai Jual 
              </button>
            </div>
          </div>

          {/* Bagian Kanan */}
          <div>
            <Image
              src="/banners/hero.jpeg"
              alt="Hero Banner"
              width={700}
              height={500}
              className="rounded-3xl object-cover shadow-2xl shadow-[rgba(23,53,58,0.16)] ring-8 ring-[rgba(245,235,201,0.75)]"
            />
          </div>

        </div>

      </div>
    </section>
  );
}