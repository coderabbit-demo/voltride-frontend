// Frontend's local copy of the cart contracts, plus localStorage cart-id
// management.

export interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  basePriceCents: number;
}

export interface CartTotals {
  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  shippingCents: number;
  grandTotalCents: number;
}

export interface Cart {
  cartId: string;
  items: CartItem[];
  totals: CartTotals;
}

const CART_KEY = "voltride.cartId";

export function getStoredCartId(): string | null {
  return localStorage.getItem(CART_KEY);
}

export function clearStoredCartId(): void {
  localStorage.removeItem(CART_KEY);
}

async function ensureCartId(): Promise<string> {
  const existing = getStoredCartId();
  if (existing) return existing;
  const res = await fetch("/api/cart/carts", { method: "POST" });
  if (!res.ok) throw new Error("Failed to create cart");
  const body = (await res.json()) as { cartId: string };
  localStorage.setItem(CART_KEY, body.cartId);
  return body.cartId;
}

export async function fetchCart(): Promise<Cart | null> {
  const cartId = getStoredCartId();
  if (!cartId) return null;
  const res = await fetch(`/api/cart/carts/${cartId}`);
  if (res.status === 404) {
    clearStoredCartId();
    return null;
  }
  if (!res.ok) throw new Error("Failed to load cart");
  return (await res.json()) as Cart;
}

async function postCartItem(cartId: string, productId: string, quantity: number): Promise<Response> {
  return fetch(`/api/cart/carts/${cartId}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function addToCart(productId: string, quantity: number): Promise<Cart> {
  const cartId = await ensureCartId();
  let res = await postCartItem(cartId, productId, quantity);
  if (res.status === 404) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    // The cart service keeps carts in memory, so a service restart
    // invalidates the cartId saved in localStorage. Start a fresh cart.
    if (body.error === "cart_not_found") {
      clearStoredCartId();
      const freshCartId = await ensureCartId();
      res = await postCartItem(freshCartId, productId, quantity);
    }
  }
  if (!res.ok) throw new Error("Failed to add to cart");
  return (await res.json()) as Cart;
}

export async function updateQuantity(productId: string, quantity: number): Promise<Cart> {
  const cartId = getStoredCartId();
  if (!cartId) throw new Error("No cart");
  const res = await fetch(`/api/cart/carts/${cartId}/items/${productId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error("Failed to update quantity");
  return (await res.json()) as Cart;
}

export async function removeItem(productId: string): Promise<Cart> {
  const cartId = getStoredCartId();
  if (!cartId) throw new Error("No cart");
  const res = await fetch(`/api/cart/carts/${cartId}/items/${productId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to remove item");
  return (await res.json()) as Cart;
}

export async function applyPromoCode(promoCode: string | null): Promise<Cart> {
  const cartId = getStoredCartId();
  if (!cartId) throw new Error("No cart");
  const res = await fetch(`/api/cart/carts/${cartId}/promo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ promoCode }),
  });
  if (!res.ok) throw new Error("Failed to apply promo code");
  return (await res.json()) as Cart;
}
