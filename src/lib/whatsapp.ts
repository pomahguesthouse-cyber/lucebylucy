import type {
  AIRecommendation,
  ColorOption,
  DesignDetails,
  Fabric,
  Measurements,
  ProductModel,
  SizeType,
} from "@/types";
import { ADMIN_WHATSAPP } from "@/lib/constants";
import { formatPrice } from "@/lib/format";

interface WhatsAppOrderInput {
  customerName: string;
  categoryName: string;
  model: ProductModel | null;
  fabric: Fabric | null;
  color: ColorOption | null;
  sizeType: SizeType;
  selectedSize: string;
  measurements: Measurements;
  designDetails: DesignDetails;
  aiRecommendation: AIRecommendation | null;
  estimatedPrice: number | null;
  videoPreviewReady: boolean;
  extraNotes?: string;
}

const measurementLabels: Record<keyof Measurements, string> = {
  height: "Tinggi",
  weight: "Berat",
  bust: "Lingkar dada",
  waist: "Lingkar pinggang",
  hip: "Lingkar pinggul",
  shoulder: "Bahu",
  armLength: "Panjang lengan",
  armCircumference: "Lingkar lengan",
  dressLength: "Panjang baju",
};

function formatMeasurements(measurements: Measurements): string {
  const filled = (Object.keys(measurements) as (keyof Measurements)[])
    .filter((key) => measurements[key].trim() !== "")
    .map((key) => `${measurementLabels[key]} ${measurements[key]} cm`);
  return filled.length > 0 ? filled.join(", ") : "-";
}

// Membuat pesan WhatsApp terstruktur agar user tidak perlu mengetik ulang detail
export function buildWhatsAppMessage(input: WhatsAppOrderInput): string {
  const designText = [
    input.designDetails.neckline && `Kerah: ${input.designDetails.neckline}`,
    input.designDetails.sleeveLength && `Panjang lengan: ${input.designDetails.sleeveLength}`,
    input.designDetails.sleeveModel && `Model lengan: ${input.designDetails.sleeveModel}`,
    input.designDetails.outfitLength && `Panjang baju: ${input.designDetails.outfitLength}`,
    input.designDetails.cutting && `Cutting: ${input.designDetails.cutting}`,
    input.designDetails.accents.length > 0 &&
      `Aksen: ${input.designDetails.accents.join(", ")}`,
  ]
    .filter(Boolean)
    .join("; ") || "-";

  const ukuran =
    input.sizeType === "standard" ? `Standar (${input.selectedSize})` : "Custom measurement";

  const lines = [
    "Halo LUCE, saya ingin konsultasi/pesan desain custom berikut:",
    "",
    `Nama: ${input.customerName || "-"}`,
    `Kategori: ${input.categoryName || "-"}`,
    `Model: ${input.model?.name ?? "-"}`,
    `Bahan: ${input.fabric?.name ?? "-"}`,
    `Warna: ${input.color?.name ?? "-"}`,
    `Ukuran: ${ukuran}`,
    `Measurement: ${formatMeasurements(input.measurements)}`,
    `Detail desain: ${designText}`,
    `Catatan AI: ${input.aiRecommendation?.designName ?? "-"} — ${input.aiRecommendation?.suitableOccasion ?? "-"}`,
    `Estimasi harga: ${input.estimatedPrice ? formatPrice(input.estimatedPrice) : "Menunggu kalkulasi"}`,
    `Video preview: ${input.videoPreviewReady ? "Sudah dibuat" : "Belum dibuat"}`,
    `Catatan tambahan: ${input.extraNotes?.trim() || "-"}`,
    "",
    "Mohon dicek ketersediaan bahan, harga final, dan estimasi produksi.",
  ];

  return lines.join("\n");
}

export function buildWhatsAppLink(message: string, phone: string = ADMIN_WHATSAPP): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
