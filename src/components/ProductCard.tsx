import { Link } from "react-router-dom";
import type { ProductListItem } from "../api/catalog";
import { PriceTag } from "./PriceTag";
import { StockBadge } from "./StockBadge";

interface ProductCardProps {
  product: ProductListItem;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <img src={product.imageUrl} alt={product.name} className="product-image" />
      <div className="product-card-body">
        <span className="product-category">{product.category}</span>
        <h3>{product.name}</h3>
        <p className="tagline">{product.tagline}</p>
        <div className="product-card-footer">
          <PriceTag basePriceCents={product.basePriceCents} />
          <StockBadge stockCount={product.stockCount} />
        </div>
      </div>
    </Link>
  );
}
