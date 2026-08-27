// Frontend's local copy of the orders contracts.

export interface ShippingAddress {
  line1: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CheckoutRequest {
  cartId: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: ShippingAddress;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  lineTotalCents: number;
}

export interface Order {
  orderId: string;
  status: string;
  items: OrderItem[];
  grandTotalCents: number;
  estimatedDeliveryDays: number;
  reservationId: string;
  notificationId: string;
}

export class CheckoutError extends Error {
  constructor(
    message: string,
    public code: string,
    public productId?: string,
  ) {
    super(message);
  }
}

export async function placeOrder(req: CheckoutRequest): Promise<Order> {
  const res = await fetch("/api/orders/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as {
      error?: string;
      productId?: string;
    };
    throw new CheckoutError(
      body.error === "insufficient_stock"
        ? "Sorry, one of your items just sold out."
        : "Checkout failed. Please try again.",
      body.error ?? "unknown",
      body.productId,
    );
  }
  return (await res.json()) as Order;
}

export async function fetchOrder(orderId: string): Promise<Order> {
  const res = await fetch(`/api/orders/orders/${orderId}`);
  if (!res.ok) throw new Error("Failed to load order");
  return (await res.json()) as Order;
}
