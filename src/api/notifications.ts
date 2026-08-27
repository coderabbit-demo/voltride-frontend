// Frontend's local copy of the notifications contracts.

export interface NotificationRecord {
  notificationId: string;
  orderId: string;
  channel: string;
  status: string;
  subject: string;
  previewText: string;
  sentAt: string;
}

export async function fetchOrderNotifications(orderId: string): Promise<NotificationRecord[]> {
  const res = await fetch(`/api/notifications/notifications?orderId=${encodeURIComponent(orderId)}`);
  if (!res.ok) return [];
  const body = (await res.json()) as { notifications: NotificationRecord[] };
  return body.notifications;
}
