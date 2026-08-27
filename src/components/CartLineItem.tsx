import type { CartItem } from "../api/cart";
import { formatCents } from "./PriceTag";

interface CartLineItemProps {
  item: CartItem;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartLineItem({ item, onQuantityChange, onRemove }: CartLineItemProps) {
  return (
    <div className="cart-line">
      <div className="cart-line-info">
        <strong>{item.name}</strong>
        <span className="muted">{formatCents(item.basePriceCents)} each</span>
      </div>
      <div className="cart-line-actions">
        <button
          onClick={() => onQuantityChange(item.productId, item.quantity - 1)}
          disabled={item.quantity <= 1}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="quantity">{item.quantity}</span>
        <button
          onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
          aria-label="Increase quantity"
        >
          +
        </button>
        <button className="link-button" onClick={() => onRemove(item.productId)}>
          Remove
        </button>
      </div>
    </div>
  );
}
