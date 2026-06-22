import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Send, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";

interface Message {
  id: number;
  role: "ai" | "user";
  text: string;
}

const initialMessages: Message[] = [
  {
    id: 0,
    role: "ai",
    text: "Halo Kak! Saya stylist LUCE. Boleh cerita acara apa yang ingin Kak datangi? Nanti saya bantu pilih model, bahan, dan warna yang elegan. 💛",
  },
];

const quickPrompts = [
  "Gamis untuk acara keluarga",
  "Abaya warna netral",
  "Rekomendasi bahan adem",
  "Dress untuk pesta",
];

// Balasan mock (MVP) — belum terhubung AI sungguhan
function getStylistReply(input: string): string {
  const text = input.toLowerCase();
  if (text.includes("bahan")) {
    return "Untuk cuaca hangat, saya sarankan Airflow atau Katun Madina ya Kak, adem dan nyaman. Kalau ingin kesan lebih mewah, Toyobo juga cantik dan tidak menerawang.";
  }
  if (text.includes("abaya")) {
    return "Abaya warna netral seperti Mocca atau Charcoal sangat elegan, Kak. Padukan dengan bahan Satin Silk atau Wolfis Premium untuk jatuh kain yang anggun. Mau saya bantu lanjut ke customizer?";
  }
  if (text.includes("pesta") || text.includes("dress")) {
    return "Untuk pesta, Dress Modest Classic dengan warna Dusty Rose atau Champagne terlihat istimewa, Kak. Tambahkan aksen pita agar makin manis. Ukuran custom akan membuat jatuhnya makin pas.";
  }
  if (text.includes("keluarga") || text.includes("gamis")) {
    return "Untuk acara keluarga, Gamis A-Line Elegance dengan bahan Toyobo dan warna Sage Green sangat anggun, Kak. Potongan A-line melangsingkan dan tetap modest. Lanjut desain, yuk?";
  }
  return "Baik Kak, biar saya bantu lebih tepat — boleh sebutkan acara, warna favorit, dan budget perkiraannya? Nanti saya rekomendasikan model serta bahan yang cocok ya. 💛";
}

export function AIStylist() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const counter = useRef(1);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMessage: Message = { id: counter.current++, role: "user", text: trimmed };
    const aiMessage: Message = {
      id: counter.current++,
      role: "ai",
      text: getStylistReply(trimmed),
    };
    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setInput("");
  };

  return (
    <SiteLayout>
      <div className="container py-10 md:py-14">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-champagne/15">
              <Sparkles className="h-5 w-5 text-champagne" />
            </span>
            <div>
              <h1 className="font-display text-2xl font-semibold text-charcoal">AI Stylist LUCE</h1>
              <p className="text-sm text-mink">Konsultasi gaya modest yang elegan</p>
            </div>
          </div>

          <div className="mt-6 flex h-[460px] flex-col overflow-hidden rounded-luxe border border-champagne/15 bg-white/60 shadow-soft">
            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.role === "user" ? "flex justify-end" : "flex justify-start"
                  }
                >
                  <div
                    className={
                      message.role === "user"
                        ? "max-w-[80%] rounded-2xl rounded-br-sm bg-charcoal px-4 py-2.5 text-sm text-porcelain"
                        : "max-w-[80%] rounded-2xl rounded-bl-sm bg-ivory px-4 py-2.5 text-sm text-charcoal"
                    }
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-champagne/15 p-3">
              <div className="mb-2 flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => send(prompt)}
                    className="rounded-full border border-champagne/25 bg-white/70 px-3 py-1 text-xs text-mink hover:border-champagne/50 hover:text-charcoal"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              <form
                className="flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tulis pertanyaan Anda…"
                  className="flex-1 rounded-full border border-champagne/25 bg-white/80 px-4 py-2.5 text-sm text-charcoal outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/30"
                />
                <Button type="submit" variant="gold" size="sm" aria-label="Kirim pesan">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-mink">
            Rekomendasi bersifat panduan. Untuk pesan,{" "}
            <Link to="/customize" className="text-champagne hover:underline">
              lanjut ke customizer
            </Link>
            .
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}
