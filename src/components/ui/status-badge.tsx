import { cn } from "@/lib/utils";

type Tone = "neutral" | "gold" | "sage" | "blush" | "charcoal";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-white/80 text-mink border-champagne/25",
  gold: "bg-champagne/15 text-[#9a7136] border-champagne/30",
  sage: "bg-sage/20 text-[#5c6650] border-sage/40",
  blush: "bg-blush/25 text-[#a8635c] border-blush/40",
  charcoal: "bg-charcoal/90 text-porcelain border-charcoal",
};

const designRequestTone: Record<string, Tone> = {
  draft: "neutral",
  preview_requested: "neutral",
  preview_generated: "gold",
  submitted: "gold",
  waiting_review: "gold",
  need_revision: "blush",
  approved: "sage",
  waiting_payment: "gold",
  in_production: "gold",
  ready: "sage",
  completed: "charcoal",
  cancelled: "blush",
};

const videoTone: Record<string, Tone> = {
  not_requested: "neutral",
  queued: "neutral",
  generating: "gold",
  generated: "sage",
  failed: "blush",
  cancelled: "blush",
};

const paymentTone: Record<string, Tone> = {
  unpaid: "blush",
  down_payment: "gold",
  paid: "sage",
  refunded: "neutral",
};

const productionTone: Record<string, Tone> = {
  pending_confirmation: "neutral",
  design_confirmed: "gold",
  pattern_created: "gold",
  cutting: "gold",
  sewing: "gold",
  quality_control: "gold",
  ready_to_ship: "sage",
  completed: "charcoal",
  cancelled: "blush",
};

function humanize(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

interface StatusBadgeProps {
  status: string;
  type?: "design" | "video" | "payment" | "production";
}

export function StatusBadge({ status, type = "design" }: StatusBadgeProps) {
  const toneMap =
    type === "video"
      ? videoTone
      : type === "payment"
        ? paymentTone
        : type === "production"
          ? productionTone
          : designRequestTone;
  const tone = toneMap[status] ?? "neutral";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
        toneClasses[tone],
      )}
    >
      {humanize(status)}
    </span>
  );
}
