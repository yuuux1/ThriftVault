import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  id: number;
  name: string;
  price: number;
  image_url?: string | null;
  isSold?: boolean;
};

export default function ProductCard({
  id,
  name,
  price,
  image_url,
  isSold = false,
}: ProductCardProps) {
  return (
    <Link
      href={`/produk/${id}`}
      className={`
        block
        border
        border-[rgba(15,156,154,0.16)]
        rounded-2xl
        p-4
        bg-[rgba(255,249,238,0.88)]
        shadow-sm
        transition-all
        duration-300
        group
        ${isSold
          ? "opacity-70 cursor-not-allowed pointer-events-none"
          : "hover:shadow-md hover:-translate-y-1 cursor-pointer"
        }
      `}
    >
      {/* BAGIAN FOTO / PLACEHOLDER */}
      <div className="h-56 relative rounded-xl overflow-hidden mb-4 bg-amber-50">
        {image_url ? (
          <Image
            src={image_url}
            alt={name}
            fill
            className={`object-cover transition-transform duration-300 ${isSold ? "grayscale" : "group-hover:scale-105"}`}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-amber-100 text-amber-500 font-semibold" />
        )}

        {/* SOLD OUT OVERLAY */}
        {isSold && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="
              bg-white
              text-gray-800
              text-xs
              font-bold
              tracking-widest
              uppercase
              px-3
              py-1.5
              rounded-full
              border
              border-gray-300
              shadow
            ">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <h3 className={`font-semibold line-clamp-1 transition-colors duration-300 ${isSold ? "text-gray-400" : "text-[var(--thrift-ink)] group-hover:text-[var(--thrift-teal)]"}`}>
        {name}
      </h3>

      <p className={`font-bold mt-2 ${isSold ? "text-gray-400 line-through" : "text-[var(--thrift-rose)]"}`}>
        Rp {Number(price).toLocaleString("id-ID")}
      </p>
    </Link>
  );
}