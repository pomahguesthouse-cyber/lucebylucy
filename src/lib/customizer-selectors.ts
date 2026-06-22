import { categories } from "@/data/categories";
import type { CategoryId, Fabric, ProductModel } from "@/types";

export function getCategoryName(id: CategoryId | null): string {
  return categories.find((c) => c.id === id)?.name ?? "";
}

// Hitung estimasi harga: harga dasar model + modifier bahan + biaya custom
export function computeEstimatedPrice(
  model: ProductModel | null,
  fabric: Fabric | null,
  isCustomSize: boolean,
): number | null {
  if (!model) return null;
  const fabricModifier = fabric?.priceModifier ?? 0;
  const customFee = isCustomSize ? 50000 : 0;
  return model.basePrice + fabricModifier + customFee;
}
