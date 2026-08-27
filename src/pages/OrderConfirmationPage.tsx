import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchOrder, type Order } from "../api/orders";
import { fetchOrderNotifications, type NotificationRecord } from "../api/notifications";
import { formatCents } from "../components/PriceTag";

export function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    fetchOrder(orderId)
      .then(setOrder)
      .catch(() => setError("Could not load this order."));
    fetchOrderNotifications(orderId).then(setNotifications);
  }, [orderId]);

  if (error) return <p className="error">{error}</p>;
  if (!order) return <p className="muted">Loading…</p>;

  return (
    <div className="confirmation-page">
      <h1>🎉 Order confirmed</h1>
      <p>
        Order <strong>{order.orderId}</strong> · estimated delivery in{" "}
        <strong>{order.estimatedDeliveryDays} days</strong>
      </p>

      <div className="order-summary">
        {order.items.map((item) => (
          <div key={item.productId} className="order-line">
            <span>
              {item.name} <span className="muted">×{item.quantity}</span>
            </span>
            <span>{formatCents(item.lineTotalCents)}</span>
          </div>
        ))}
        <div className="order-line grand-total">
          <span>Total charged</span>
          <span>{formatCents(order.grandTotalCents)}</span>
        </div>
      </div>

      {notifications.length > 0 && (
        <div className="inbox-preview">
          <h2>📬 Your inbox</h2>
          {notifications.map((n) => (
            <div key={n.notificationId} className="email-card">
              <div className="email-header">
                <strong>{n.subject}</strong>
                <span className="muted">{new Date(n.sentAt).toLocaleTimeString()}</span>
              </div>
              <p>{n.previewText}</p>
            </div>
          ))}
        </div>
      )}

      <Link to="/" className="button-link">Keep shopping</Link>
    </div>
  );
}
