interface StockBadgeProps {
  stockCount: number;
}

export function StockBadge({ stockCount }: StockBadgeProps) {
  if (stockCount <= 0) {
    return <span className="badge badge-out">Backordered</span>;
  }
  if (stockCount <= 3) {
    return <span className="badge badge-low">Low stock ({stockCount})</span>;
  }
  return <span className="badge badge-in">In stock ({stockCount})</span>;
}
