import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProduct, type ProductDetail } from "../api/catalog";
import { addToCart } from "../api/cart";
import { PriceTag, formatCents } from "../components/PriceTag";
import { StockBadge } from "../components/StockBadge";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchProduct(id)
      .then(setProduct)
      .catch(() => setError("Could not load this product."));
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!product) return <p className="muted">Loading…</p>;

  const handleAdd = async () => {
    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      navigate("/cart");
    } catch {
      setError("Could not add to cart. Are all services running?");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="product-detail">
      <img src={product.imageUrl} alt={product.name} className="detail-image" />
      <div className="detail-info">
        <span className="product-category">{product.category}</span>
        <h1>{product.name}</h1>
        <p className="tagline">{product.tagline}</p>
        <p>{product.description}</p>

        <div className="detail-price-row">
          <PriceTag
            basePriceCents={product.basePriceCents}
            unitPriceCents={product.pricing.unitPriceCents}
          />
          {product.pricing.discountPercent > 0 && (
            <span className="badge badge-deal">{product.pricing.discountPercent}% off</span>
          )}
          {product.pricing.surchargePercent > 0 && (
            <span className="badge badge-low">
              +{product.pricing.surchargePercent}% low-stock surcharge
            </span>
          )}
          <StockBadge stockCount={product.stockCount} />
        </div>

        {product.stockCount <= 0 && (
          <p className="muted">Restocks in ~{product.restockEtaDays} days.</p>
        )}

        <table className="specs-table">
          <tbody>
            <tr><td>Motor</td><td>{product.specs.motorWatts} W</td></tr>
            <tr><td>Battery</td><td>{product.specs.batteryWh} Wh</td></tr>
            <tr><td>Range</td><td>{product.specs.rangeKm} km</td></tr>
            <tr><td>Weight</td><td>{product.specs.weightKg} kg</td></tr>
            <tr><td>Top speed</td><td>{product.specs.topSpeedKph} km/h</td></tr>
          </tbody>
        </table>

        <div className="add-to-cart-row">
          <label>
            Qty
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            />
          </label>
          <button className="primary" onClick={handleAdd} disabled={adding}>
            {adding
              ? "Adding…"
              : `Add to cart — ${formatCents(product.pricing.unitPriceCents * quantity)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
