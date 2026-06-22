import { motion } from "framer-motion";
import { AlertCircle, Edit3, MessageCircle, RefreshCw, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { VideoPreviewFrame } from "@/components/video-preview/VideoPreviewFrame";
import { WhatsAppOrderButton } from "@/components/customizer/WhatsAppOrderButton";
import { useCustomizerStore } from "@/store/customizer-store";

interface VideoPreviewPanelProps {
  canGenerate: boolean;
  onEditDesign?: () => void;
  onCompleteDesign?: () => void;
}

// Panel state machine untuk video preview (empty / ready / generating / generated / failed)
export function VideoPreviewPanel({
  canGenerate,
  onEditDesign,
  onCompleteDesign,
}: VideoPreviewPanelProps) {
  const navigate = useNavigate();
  const state = useCustomizerStore((s) => s.videoPreviewState);
  const setState = useCustomizerStore((s) => s.setVideoPreviewState);

  const startGenerating = () => {
    setState("generating");
    // Simulasi proses (MVP, belum pakai AI video sungguhan). 20% gagal untuk demo.
    window.setTimeout(() => {
      setState(Math.random() < 0.2 ? "failed" : "generated");
    }, 2600);
  };

  if (state === "generating") {
    return (
      <div className="preview-frame relative flex aspect-[3/4] flex-col items-center justify-center gap-5 p-8 text-center">
        <motion.div
          className="flex h-16 w-16 items-center justify-center rounded-full bg-white/80"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="h-7 w-7 text-champagne" />
        </motion.div>
        <p className="font-display text-lg text-charcoal">
          LUCE AI sedang menyiapkan preview outfit Anda…
        </p>
        <div className="h-1.5 w-40 overflow-hidden rounded-full bg-white/60">
          <div className="shimmer h-full w-full" />
        </div>
      </div>
    );
  }

  if (state === "failed") {
    return (
      <div className="rounded-luxe border border-champagne/20 bg-white/75 p-6 text-center shadow-soft">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blush/30">
          <AlertCircle className="h-6 w-6 text-[#b46a63]" />
        </div>
        <h3 className="mt-4 font-display text-xl font-semibold text-charcoal">
          Preview belum bisa dibuat
        </h3>
        <p className="mt-2 text-sm text-mink">
          Preview tidak dapat dibuat saat ini. Desain Anda tetap tersimpan dan bisa dilanjutkan.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Button variant="gold" onClick={startGenerating}>
            <RefreshCw className="h-4 w-4" />
            Coba lagi
          </Button>
          <WhatsAppOrderButton
            variant="outline"
            label="Lanjut dengan ringkasan desain"
            extraNotes="Video preview gagal dibuat, lanjut dengan ringkasan desain."
          />
          <Button variant="ghost" onClick={() => navigate("/contact")}>
            Hubungi admin
          </Button>
        </div>
      </div>
    );
  }

  if (state === "generated") {
    return (
      <div className="space-y-4">
        <VideoPreviewFrame caption="Preview outfit custom Anda telah siap" />
        <div className="grid grid-cols-2 gap-2">
          <WhatsAppOrderButton label="Lanjut pesan" className="col-span-2" />
          <Button variant="outline" onClick={startGenerating}>
            <RefreshCw className="h-4 w-4" />
            Buat ulang
          </Button>
          <Button variant="outline" onClick={onEditDesign}>
            <Edit3 className="h-4 w-4" />
            Edit desain
          </Button>
          <Button variant="ghost" className="col-span-2" onClick={() => navigate("/ai-stylist")}>
            <MessageCircle className="h-4 w-4" />
            Chat dengan stylist
          </Button>
        </div>
      </div>
    );
  }

  // empty / ready
  return (
    <div className="preview-frame relative flex aspect-[3/4] flex-col items-center justify-center gap-5 p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/80">
        <Sparkles className="h-6 w-6 text-champagne" />
      </div>
      {canGenerate ? (
        <>
          <p className="font-display text-lg text-charcoal">
            Desain Anda siap untuk video preview.
          </p>
          <Button variant="gold" onClick={startGenerating}>
            Generate video preview
          </Button>
        </>
      ) : (
        <>
          <p className="font-display text-lg text-charcoal">
            Video preview Anda akan muncul di sini setelah desain selesai.
          </p>
          <Button variant="outline" onClick={onCompleteDesign}>
            Lengkapi desain
          </Button>
        </>
      )}
    </div>
  );
}
