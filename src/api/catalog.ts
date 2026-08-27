// Frontend's local copy of the catalog contracts.

export interface ProductListItem {
  id: string;
  name: string;
  tagline: string;
  category: string;
  basePriceCents: number;
  imageUrl: string;
  inStock: boolean;
  stockCount: number;
}

export interface ProductSpecs {
  motorWatts: number;
  batteryWh: number;
  rangeKm: number;
  weightKg: number;
  topSpeedKph: number;
}

export interface ProductDetail extends ProductListItem {
  description: string;
  specs: ProductSpecs;
  restockEtaDays: number;
  pricing: {
    unitPriceCents: number;
    discountPercent: number;
    surchargePercent: number;
  };
}

export async function fetchProducts(): Promise<ProductListItem[]> {
  const res = await fetch("/api/catalog/products");
  if (!res.ok) throw new Error("Failed to load products");
  const body = (await res.json()) as { products: ProductListItem[] };
  return body.products;
}

export async function fetchProduct(id: string): Promise<ProductDetail> {
  const res = await fetch(`/api/catalog/products/${id}`);
  if (!res.ok) throw new Error("Failed to load product");
  return (await res.json()) as ProductDetail;
}
