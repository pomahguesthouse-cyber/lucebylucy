import type {
  AIRecommendation,
  ColorOption,
  DesignDetails,
  Fabric,
  ProductModel,
} from "@/types";

interface RecommendationInput {
  categoryName: string;
  model: ProductModel | null;
  fabric: Fabric | null;
  color: ColorOption | null;
  designDetails: DesignDetails;
}

// Membuat rekomendasi AI statis (mock) berdasarkan pilihan user untuk MVP
export function buildAIRecommendation({
  categoryName,
  model,
  fabric,
  color,
  designDetails,
}: RecommendationInput): AIRecommendation {
  const fabricName = fabric?.name ?? "bahan pilihan";
  const colorName = color?.name ?? "warna pilihan";
  const cutting = designDetails.cutting || "Regular";

  const detailParts = [
    designDetails.neckline && `kerah ${designDetails.neckline.toLowerCase()}`,
    designDetails.sleeveModel && `lengan ${designDetails.sleeveModel.toLowerCase()}`,
    designDetails.outfitLength && `panjang ${designDetails.outfitLength.toLowerCase()}`,
    designDetails.accents.length > 0 &&
      `aksen ${designDetails.accents.join(", ").toLowerCase()}`,
  ].filter(Boolean);

  const designDetailText =
    detailParts.length > 0 ? detailParts.join(", ") : "detail minimalis yang elegan";

  return {
    designName: `${model?.name ?? categoryName} Signature`,
    category: categoryName,
    fabric: fabricName,
    color: colorName,
    cutting,
    designDetails: designDetailText,
    suitableOccasion: model?.bestFor ?? "Acara semi formal & keluarga",
    productionNotes: `Kombinasi ${fabricName} dengan potongan ${cutting.toLowerCase()} memberikan jatuh kain yang anggun dan tetap modest. Detail ${designDetailText} realistis untuk diproduksi. Final ukuran dan ketersediaan bahan akan dikonfirmasi tim setelah review.`,
  };
}
