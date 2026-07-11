import type { ColorOption, DesignDetails, Fabric } from "@/types";

interface VideoPromptInput {
  categoryName: string;
  fabric: Fabric | null;
  color: ColorOption | null;
  designDetails: DesignDetails;
}

// Membuat prompt video preview secara dinamis dari pilihan customizer
export function buildVideoPrompt({
  categoryName,
  fabric,
  color,
  designDetails,
}: VideoPromptInput): string {
  const fabricName = fabric?.name ?? "premium fabric";
  const colorName = color?.name ?? "soft neutral";
  const cutting = designDetails.cutting || "Regular";
  const sleeve =
    [designDetails.sleeveModel, designDetails.sleeveLength].filter(Boolean).join(" ") ||
    "Regular";
  const neckline = designDetails.neckline || "Bulat";
  const length = designDetails.outfitLength || "Standar";
  const details =
    designDetails.accents.length > 0
      ? designDetails.accents.join(", ")
      : "minimal elegant detailing";

  return [
    "Create a short realistic fashion video of an Indonesian muslim woman model wearing a custom modest outfit by Luse by lucy.",
    "The model stands in a clean premium fashion studio with soft beige background. She slowly walks forward, turns slightly to show the outfit details, then gently rotates to show the back and side view.",
    "Use elegant modest fashion, premium boutique commercial style, soft cinematic lighting, realistic fabric movement, natural pose, and clean camera movement. Duration 5 to 10 seconds.",
    "Avoid revealing pose, overdramatic movement, unrealistic fabric physics, crowded background, and excessive jewelry.",
    "",
    "Outfit details:",
    `Category: ${categoryName}`,
    `Fabric: ${fabricName}`,
    `Color: ${colorName}`,
    `Cutting: ${cutting}`,
    `Sleeve: ${sleeve}`,
    `Neckline: ${neckline}`,
    `Length: ${length}`,
    `Details: ${details}`,
  ].join("\n");
}
