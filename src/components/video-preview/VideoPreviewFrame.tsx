import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPreviewFrameProps {
  label?: string;
  caption?: string;
  className?: string;
  showPlay?: boolean;
  mediaUrl?: string | null;
  mediaType?: "image" | "video" | null;
}

// Frame preview butik untuk menampilkan placeholder video model
export function VideoPreviewFrame({
  label = "LUCE Studio Preview",
  caption = "Model mengenakan outfit custom Anda",
  className,
  showPlay = true,
  mediaUrl,
  mediaType,
}: VideoPreviewFrameProps) {
  return (
    <div className={cn("preview-frame relative aspect-[3/4] overflow-hidden", className)}>
      {mediaUrl ? (
        mediaType === "video" ? (
          <video
            src={mediaUrl}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img src={mediaUrl} alt={caption} className="absolute inset-0 h-full w-full object-cover" />
        )
      ) : (
        <div className="absolute inset-x-0 bottom-0 flex justify-center">
          <div className="h-[78%] w-[42%] rounded-t-[120px] bg-gradient-to-b from-white/70 to-champagne/30" />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-charcoal/10" />

      <div className="absolute left-4 top-4 rounded-full bg-white/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-champagne">
        {label}
      </div>

      {showPlay && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/85 shadow-soft">
            <Play className="ml-1 h-6 w-6 text-champagne" fill="currentColor" />
          </div>
        </div>
      )}

      <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/70 px-4 py-3 backdrop-blur">
        <p className="text-sm font-medium text-charcoal">{caption}</p>
      </div>
    </div>
  );
}
