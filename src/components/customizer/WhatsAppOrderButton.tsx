import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCustomizerStore } from "@/store/customizer-store";
import { buildWhatsAppMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import { computeEstimatedPrice, getCategoryName } from "@/lib/customizer-selectors";
import type { ButtonProps } from "@/components/ui/button";

interface WhatsAppOrderButtonProps {
  extraNotes?: string;
  label?: string;
  variant?: ButtonProps["variant"];
  className?: string;
}

// Tombol yang membuka WhatsApp dengan pesan pesanan terstruktur
export function WhatsAppOrderButton({
  extraNotes,
  label = "Pesan via WhatsApp",
  variant = "gold",
  className,
}: WhatsAppOrderButtonProps) {
  const store = useCustomizerStore();

  const handleClick = () => {
    const estimatedPrice = computeEstimatedPrice(
      store.selectedModel,
      store.selectedFabric,
      store.sizeType === "custom",
    );

    const message = buildWhatsAppMessage({
      customerName: store.customerName,
      categoryName: getCategoryName(store.selectedCategory),
      model: store.selectedModel,
      fabric: store.selectedFabric,
      color: store.selectedColor,
      sizeType: store.sizeType,
      selectedSize: store.selectedSize,
      measurements: store.measurements,
      designDetails: store.designDetails,
      aiRecommendation: store.aiRecommendation,
      estimatedPrice,
      videoPreviewReady: store.videoPreviewState === "generated",
      extraNotes,
    });

    window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
  };

  return (
    <Button type="button" variant={variant} className={className} onClick={handleClick}>
      <MessageCircle className="h-4 w-4" />
      {label}
    </Button>
  );
}
