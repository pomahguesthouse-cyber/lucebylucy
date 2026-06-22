import { useState, useCallback } from "react";
import { Bookmark, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mannequin } from "@/components/Mannequin";
import { cn } from "@/lib/utils";
import { swatchColor, swatchClass, garmentColor } from "@/lib/helpers";
import { modelOptions, fabricOptions, colorOptions, sizeOptions, type ColorKey } from "@/data/content";

function CustomizerGroup({
  title,
  options,
  value,
  onChange,
  thumbnail,
  swatches,
  compact,
}: {
  title: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  thumbnail?: boolean;
  swatches?: boolean;
  compact?: boolean;
}) {
  return (
    <div className="mt-5">
      <p className="mb-3 text-sm font-bold">{title}</p>
      <div
        className={cn(
          "flex flex-wrap gap-3 rounded-2xl bg-white/75 p-3",
          thumbnail && "grid grid-cols-4",
          compact && "grid grid-cols-5",
        )}
      >
        {options.map((option, index) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            aria-label={swatches ? `Bahan ${option}` : option}
            className={cn(
              "rounded-xl border border-transparent bg-white px-3 py-2 text-sm font-semibold text-mink transition hover:border-champagne",
              value === option && "border-champagne text-champagne shadow-soft",
              thumbnail && "grid h-16 place-items-center px-1 py-1",
              compact && "h-9 px-0 text-xs",
              swatches && "h-9 w-9 rounded-full p-0 text-transparent",
              swatches && swatchClass(index),
            )}
          >
            {thumbnail ? (
              <span
                className={cn(
                  "h-12 w-8 rounded-t-full",
                  garmentColor(index === 0 ? "ivory" : index === 1 ? "sand" : index === 2 ? "sage" : "blush"),
                )}
              />
            ) : (
              option
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

const viewLabels = ["Depan", "Samping", "Belakang"] as const;

export function CustomStudioSection() {
  const [color, setColor] = useState<ColorKey>("sage");
  const [model, setModel] = useState("Gamis A-Line");
  const [fabric, setFabric] = useState("Toyobo");
  const [size, setSize] = useState("Custom");
  const [activeView, setActiveView] = useState(0);
  const [saved, setSaved] = useState(false);

  const handleReset = useCallback(() => {
    setColor("sage");
    setModel("Gamis A-Line");
    setFabric("Toyobo");
    setSize("Custom");
    setActiveView(0);
    setSaved(false);
  }, []);

  const handleSave = useCallback(() => {
    const design = { model, fabric, color, size, savedAt: new Date().toISOString() };
    const existing = JSON.parse(localStorage.getItem("luce-saved-designs") || "[]");
    existing.push(design);
    localStorage.setItem("luce-saved-designs", JSON.stringify(existing));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }, [model, fabric, color, size]);

  return (
    <section id="custom-studio" className="container py-7">
      <div data-reveal className="grid gap-6 rounded-[28px] bg-gradient-to-br from-white/75 to-[#dfd0bf]/65 p-4 shadow-luxe lg:grid-cols-[340px_1fr]">
        <Card className="rounded-[24px] bg-white/70 p-5 shadow-none">
          <h2 className="font-display text-[2rem] leading-tight tracking-[-0.04em]">
            Rancang busanamu dalam beberapa klik
          </h2>
          <CustomizerGroup title="1. Model" options={modelOptions} value={model} onChange={setModel} thumbnail />
          <CustomizerGroup title="2. Bahan" options={fabricOptions} value={fabric} onChange={setFabric} swatches />
          <div className="mt-5">
            <p className="mb-3 text-sm font-bold">3. Warna</p>
            <div className="flex gap-3">
              {colorOptions.map((item) => (
                <button
                  key={item}
                  onClick={() => setColor(item)}
                  className={cn(
                    "h-10 w-10 rounded-full border-2 border-white shadow-soft ring-offset-2 transition hover:scale-105",
                    swatchColor(item),
                    color === item && "ring-2 ring-champagne",
                  )}
                  aria-label={`Warna ${item}`}
                />
              ))}
            </div>
          </div>
          <CustomizerGroup title="4. Ukuran" options={sizeOptions} value={size} onChange={setSize} compact />
          <div className="mt-6 grid grid-cols-[1fr_100px] gap-3">
            <Button size="sm" onClick={handleSave}>
              {saved ? "✓ Tersimpan!" : "Simpan Desain"}{" "}
              {!saved && <Bookmark className="h-3.5 w-3.5" />}
            </Button>
            <Button size="sm" variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>

          {/* Toast notification */}
          <div
            className={cn(
              "mt-3 overflow-hidden rounded-xl bg-champagne/10 text-center text-sm font-semibold text-champagne transition-all duration-300",
              saved ? "max-h-12 py-2.5 opacity-100" : "max-h-0 py-0 opacity-0",
            )}
          >
            Desain berhasil disimpan! ✨
          </div>
        </Card>

        <div className="relative min-h-[520px] overflow-hidden rounded-[24px] bg-gradient-to-br from-[#cdbcaa] via-[#ede3d7] to-white">
          {/* View buttons */}
          <div className="absolute left-7 top-7 z-10 grid gap-3">
            {viewLabels.map((view, index) => (
              <button
                key={view}
                onClick={() => setActiveView(index)}
                className={cn(
                  "rounded-xl border bg-white/80 px-5 py-3 text-sm font-semibold shadow-soft transition",
                  activeView === index
                    ? "border-champagne text-champagne"
                    : "border-white/70 text-mink hover:border-champagne/40",
                )}
              >
                {view}
              </button>
            ))}
            <button
              onClick={() => setActiveView(3)}
              className={cn(
                "rounded-xl px-5 py-3 text-sm font-bold shadow-soft transition",
                activeView === 3
                  ? "bg-champagne text-white"
                  : "bg-white/90 text-champagne hover:bg-champagne/10",
              )}
            >
              360°
            </button>
          </div>

          {/* Zoom controls */}
          <div className="absolute right-7 top-7 z-10 flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-sm shadow-soft">
            <span>Zoom</span>
            <button aria-label="Zoom out" className="rounded-full p-1 transition hover:bg-champagne/10">
              <Minus className="h-4 w-4" />
            </button>
            <button aria-label="Zoom in" className="rounded-full p-1 transition hover:bg-champagne/10">
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Decorative elements */}
          <div className="absolute right-12 top-28 h-56 w-28 rounded-t-full bg-white/25" />
          <div className="absolute bottom-12 right-16 h-32 w-20 rounded-b-full border-l border-[#96a079]/40">
            <span className="absolute left-4 top-6 h-12 w-5 -rotate-12 rounded-full bg-[#8a9875]" />
            <span className="absolute left-10 top-16 h-14 w-5 rotate-12 rounded-full bg-[#aab592]" />
          </div>
          <div className="absolute bottom-12 left-1/2 h-20 w-[380px] -translate-x-1/2 rounded-[50%] bg-white/55 blur-sm" />

          {/* Mannequin with view rotation */}
          <Mannequin
            color={color}
            className={cn(
              "absolute left-1/2 top-14 -translate-x-1/2 scale-[1.08] transition-transform duration-500",
              activeView === 1 && "[transform:translateX(-50%)_scale(1.08)_rotateY(45deg)]",
              activeView === 2 && "[transform:translateX(-50%)_scale(1.08)_rotateY(180deg)]",
              activeView === 3 && "animate-[mannequin-spin_4s_linear_infinite]",
            )}
            detailed
          />

          {/* Current config label */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/85 px-5 py-2 text-xs font-semibold text-mink shadow-soft">
            {model} · {fabric} · {color} · {size}
          </div>
        </div>
      </div>
    </section>
  );
}
