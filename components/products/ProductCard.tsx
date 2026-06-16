import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  id: number;
  name: string;
  price: number;
  image_url?: string | null;
};

export default function ProductCard({
  id,
  name,
  price,
  image_url,
}: ProductCardProps) {
  return (
    <Link
      href={`/produk/${id}`}
      className="
        block
        border
        border-[rgba(15,156,154,0.16)]
        rounded-2xl
        p-4
        bg-[rgba(255,249,238,0.88)]
        shadow-sm
        hover:shadow-md
        transition-all
        duration-300
        hover:-translate-y-1
        cursor-pointer
        group
      "
    >
      {/* BAGIAN FOTO / PLACEHOLDER */}
      <div className="h-56 relative rounded-xl overflow-hidden mb-4 bg-amber-50">
        {image_url ? (
          <Image
            src={image_url}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-amber-100 text-amber-500 font-semibold" />
        )}
      </div>

      <h3 className="font-semibold text-[var(--thrift-ink)] group-hover:text-[var(--thrift-teal)] transition-colors duration-300 line-clamp-1">
        {name}
      </h3>

      <p className="font-bold mt-2 text-[var(--thrift-rose)]">
        Rp {Number(price).toLocaleString("id-ID")}
      </p>
    </Link>
  );
}