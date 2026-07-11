import { useEffect, useRef, useState } from "react";
import { Loader2, MessageCircle, RotateCcw, Send, Sparkles, X } from "lucide-react";
import { askLuseAssistant } from "@/lib/luse-agent-api";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

const STORAGE_KEY = "luse-assistant-messages";
const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Halo Kak, saya Luse by lucy Assistant. Saya bisa membantu memilih model, bahan, warna, ukuran, dan menjelaskan proses custom.",
};

const suggestions = [
  "Bantu pilih gamis",
  "Bahan yang tidak panas",
  "Cara menentukan ukuran",
];

function loadMessages(): ChatMessage[] {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (!saved) return [WELCOME];
    const parsed = JSON.parse(saved) as ChatMessage[];
    return Array.isArray(parsed) && parsed.length ? parsed.slice(-20) : [WELCOME];
  } catch {
    return [WELCOME];
  }
}

export function LuseAssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(loadMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [retryMessage, setRetryMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20)));
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => () => requestRef.current?.abort(), []);

  const submit = async (rawMessage: string) => {
    const message = rawMessage.trim();
    if (!message || loading || message.length > 2000) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };

    setMessages((current) => [...current, userMessage].slice(-20));
    setInput("");
    setRetryMessage("");
    setLoading(true);

    const controller = new AbortController();
    requestRef.current = controller;

    try {
      const result = await askLuseAssistant(message, controller.signal);
      setMessages((current) =>
        [
          ...current,
          { id: crypto.randomUUID(), role: "assistant", content: result.answer } as ChatMessage,
        ].slice(-20),
      );
    } catch (error) {
      setRetryMessage(message);
      setMessages((current) =>
        [
          ...current,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content:
              error instanceof Error
                ? error.message
                : "Luse by lucy Assistant sementara tidak tersedia.",
          } as ChatMessage,
        ].slice(-20),
      );
    } finally {
      requestRef.current = null;
      setLoading(false);
    }
  };

  const clearConversation = () => {
    requestRef.current?.abort();
    setMessages([WELCOME]);
    setRetryMessage("");
    setLoading(false);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="fixed bottom-5 right-4 z-50 sm:bottom-7 sm:right-7">
      {open && (
        <section
          role="dialog"
          aria-label="Percakapan dengan Luse by lucy Assistant"
          className="mb-3 flex h-[min(650px,calc(100vh-110px))] w-[min(390px,calc(100vw-32px))] flex-col overflow-hidden rounded-[28px] border border-champagne/25 bg-ivory shadow-[0_24px_80px_rgba(48,39,30,0.22)]"
        >
          <header className="flex items-center justify-between border-b border-champagne/15 bg-white/80 px-5 py-4 backdrop-blur">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-champagne/15">
                <Sparkles className="h-5 w-5 text-champagne" />
              </span>
              <div>
                <h2 className="font-display text-lg font-semibold text-charcoal">Luse by lucy Assistant</h2>
                <p className="text-[11px] text-mink">Konsultasi modest fashion</p>
              </div>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                onClick={clearConversation}
                aria-label="Hapus percakapan"
                className="rounded-full p-2 text-mink transition hover:bg-champagne/10 hover:text-charcoal"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Tutup Luse by lucy Assistant"
                className="rounded-full p-2 text-mink transition hover:bg-champagne/10 hover:text-charcoal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </header>

          <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-5" aria-live="polite">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
              >
                <p
                  className={cn(
                    "max-w-[86%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    message.role === "user"
                      ? "rounded-br-md bg-charcoal text-white"
                      : "rounded-bl-md border border-champagne/15 bg-white/85 text-charcoal",
                  )}
                >
                  {message.content}
                </p>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-champagne/15 bg-white/85 px-4 py-3 text-sm text-mink">
                  <Loader2 className="h-4 w-4 animate-spin text-champagne" />
                  Luse by lucy sedang merangkai jawaban…
                </div>
              </div>
            )}

            {retryMessage && !loading && (
              <button
                type="button"
                onClick={() => submit(retryMessage)}
                className="text-xs font-semibold text-champagne underline-offset-4 hover:underline"
              >
                Coba kirim lagi
              </button>
            )}
            <div ref={endRef} />
          </div>

          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 px-4 pb-3">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => submit(suggestion)}
                  className="rounded-full border border-champagne/25 bg-white/70 px-3 py-2 text-xs text-charcoal transition hover:border-champagne hover:bg-white"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <form
            className="border-t border-champagne/15 bg-white/70 p-4"
            onSubmit={(event) => {
              event.preventDefault();
              void submit(input);
            }}
          >
            <div className="flex items-end gap-2 rounded-2xl border border-champagne/25 bg-white px-3 py-2 focus-within:border-champagne focus-within:ring-2 focus-within:ring-champagne/15">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value.slice(0, 2000))}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void submit(input);
                  }
                }}
                rows={1}
                maxLength={2000}
                placeholder="Tulis pertanyaan Kak…"
                aria-label="Pesan untuk Luse by lucy Assistant"
                className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-1 py-2 text-sm text-charcoal outline-none placeholder:text-mink/60"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Kirim pesan"
                className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-champagne text-white transition hover:bg-[#b8893f] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-mink/75">
              AI dapat keliru. Harga dan ketersediaan dikonfirmasi tim Luse by lucy.
            </p>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? "Tutup Luse by lucy Assistant" : "Buka Luse by lucy Assistant"}
        aria-expanded={open}
        className="ml-auto flex h-14 items-center gap-2 rounded-full bg-charcoal px-5 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(35,31,27,0.3)] transition hover:-translate-y-0.5 hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne motion-reduce:transform-none"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        <span>{open ? "Tutup" : "Tanya Luse by lucy"}</span>
      </button>
    </div>
  );
}
