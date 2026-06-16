export default function SearchBar() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <input
        type="text"
        placeholder="Cari hoodie, jaket, kemeja..."
        className="
          w-full
          border
          border-[rgba(15,156,154,0.22)]
          bg-[rgba(255,249,238,0.92)]
          rounded-2xl
          px-4
          py-3
          shadow-sm
          outline-none
          focus:ring-2
          focus:ring-[var(--thrift-teal)]
        "
      />
    </section>
  );
}