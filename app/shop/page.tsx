async function getProducts() {
  const res = await fetch(
    "http://localhost:3000/api/test-db",
    {
      cache: "no-store",
    }
  );

  return res.json();
}

type ShopProduct = {
  id: number;
  name: string;
  brand: string;
  price: number;
  size?: string;
  condition_percentage?: number;
};

export default async function ShopPage() {
  const products = (await getProducts()) as ShopProduct[];

  return (
    <main className="mx-auto max-w-7xl p-8">
      <h1 className="text-3xl font-bold mb-6 text-[var(--thrift-ink)]">
        Thrift Shop
      </h1>

      {products.map((product) => (
        <div
          key={product.id}
          className="border border-[rgba(15,156,154,0.16)] p-4 rounded-2xl mb-4 bg-[rgba(255,249,238,0.9)] shadow-sm"
        >
          <h2 className="text-xl font-semibold text-[var(--thrift-ink)]">
            {product.name}
          </h2>

          <p className="text-[rgba(23,53,58,0.74)]">Brand: {product.brand}</p>

          <p className="text-[rgba(23,53,58,0.74)]">
            Harga: Rp{" "}
            {Number(product.price).toLocaleString(
              "id-ID"
            )}
          </p>

          <p className="text-[rgba(23,53,58,0.74)]">
            Kondisi: {product.condition_percentage}%
          </p>
        </div>
      ))}
    </main>
  );
}