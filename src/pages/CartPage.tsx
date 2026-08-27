import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  applyPromoCode,
  fetchCart,
  removeItem,
  updateQuantity,
  type Cart,
} from "../api/cart";
import { CartLineItem } from "../components/CartLineItem";
import { formatCents } from "../components/PriceTag";

export function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCart()
      .then(setCart)
      .catch(() => setError("Could not load your cart."))
      .finally(() => setLoaded(true));
  }, []);

  const run = async (action: () => Promise<Cart>) => {
    try {
      setError(null);
      setCart(await action());
    } catch {
      setError("Something went wrong updating your cart.");
    }
  };

  if (!loaded) return <p className="muted">Loading…</p>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="empty-state">
        <h1>Your cart is empty</h1>
        <Link to="/" className="primary button-link">Browse e-bikes</Link>
        {error && <p className="error">{error}</p>}
      </div>
    );
  }

  const { totals } = cart;

  return (
    <div className="cart-page">
      <h1>Your cart</h1>
      {error && <p className="error">{error}</p>}
      <div className="cart-layout">
        <div className="cart-lines">
          {cart.items.map((item) => (
            <CartLineItem
              key={item.productId}
              item={item}
              onQuantityChange={(productId, quantity) =>
                run(() => updateQuantity(productId, quantity))
              }
              onRemove={(productId) => run(() => removeItem(productId))}
            />
          ))}
        </div>
        <aside className="totals-box">
          <div className="promo-row">
            <input
              placeholder="Promo code"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
            />
            <button onClick={() => run(() => applyPromoCode(promoInput || null))}>
              Apply
            </button>
          </div>
          <dl>
            <div><dt>Subtotal</dt><dd>{formatCents(totals.subtotalCents)}</dd></div>
            <div><dt>You save</dt><dd>−{formatCents(totals.discountCents)}</dd></div>
            <div><dt>Tax</dt><dd>{formatCents(totals.taxCents)}</dd></div>
            <div>
              <dt>Shipping</dt>
              <dd>{totals.shippingCents === 0 ? "Free" : formatCents(totals.shippingCents)}</dd>
            </div>
            <div className="grand-total">
              <dt>Total</dt><dd>{formatCents(totals.grandTotalCents)}</dd>
            </div>
          </dl>
          <button className="primary full-width" onClick={() => navigate("/checkout")}>
            Checkout
          </button>
        </aside>
      </div>
    </div>
  );
}
