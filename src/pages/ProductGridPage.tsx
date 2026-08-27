import { useEffect, useState } from "react";
import { fetchProducts, type ProductListItem } from "../api/catalog";
import { ProductCard } from "../components/ProductCard";

export function ProductGridPage() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setError("Could not load the catalog. Are all services running?"));
  }, []);

  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <section className="hero">
        <h1>E-bikes with spark.</h1>
        <p>Free shipping on orders over $3,000 · Use code VOLT10 for 10% off</p>
      </section>
      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
