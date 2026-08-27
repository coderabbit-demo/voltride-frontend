export function formatCents(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

interface PriceTagProps {
  basePriceCents: number;
  unitPriceCents?: number;
}

export function PriceTag({ basePriceCents, unitPriceCents }: PriceTagProps) {
  const discounted = unitPriceCents !== undefined && unitPriceCents < basePriceCents;
  return (
    <span className="price-tag">
      {discounted && <s className="price-original">{formatCents(basePriceCents)}</s>}
      <strong>{formatCents(unitPriceCents ?? basePriceCents)}</strong>
    </span>
  );
}
