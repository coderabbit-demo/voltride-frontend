import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { clearStoredCartId, getStoredCartId } from "../api/cart";
import { placeOrder, CheckoutError } from "../api/orders";

export function CheckoutPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    line1: "",
    city: "",
    postalCode: "",
    country: "US",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (field: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const cartId = getStoredCartId();
    if (!cartId) {
      setError("Your cart is empty.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const order = await placeOrder({
        cartId,
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        shippingAddress: {
          line1: form.line1,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
        },
      });
      clearStoredCartId();
      navigate(`/orders/${order.orderId}`);
    } catch (err) {
      setError(err instanceof CheckoutError ? err.message : "Checkout failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="checkout-form">
        <label>
          Full name
          <input required value={form.customerName} onChange={set("customerName")} />
        </label>
        <label>
          Email
          <input required type="email" value={form.customerEmail} onChange={set("customerEmail")} />
        </label>
        <label>
          Address
          <input required value={form.line1} onChange={set("line1")} />
        </label>
        <div className="form-row">
          <label>
            City
            <input required value={form.city} onChange={set("city")} />
          </label>
          <label>
            Postal code
            <input required value={form.postalCode} onChange={set("postalCode")} />
          </label>
          <label>
            Country
            <input required value={form.country} onChange={set("country")} />
          </label>
        </div>
        <button className="primary" type="submit" disabled={submitting}>
          {submitting ? "Placing order…" : "Place order"}
        </button>
      </form>
    </div>
  );
}
