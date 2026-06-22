export function swatchClass(index: number) {
  return ["bg-sage", "bg-[#d7c6ad]", "bg-[#efece5]", "bg-blush", "bg-charcoal"][index] ?? "bg-sand";
}

export function swatchColor(color: string) {
  return (
    {
      sage: "bg-sage",
      ivory: "bg-[#eee9df]",
      blush: "bg-blush",
      navy: "bg-[#1d2539]",
      black: "bg-charcoal",
    } as Record<string, string>
  )[color];
}

export function garmentColor(color: string) {
  return (
    {
      sage: "bg-gradient-to-br from-sage to-[#98a086]",
      ivory: "bg-gradient-to-br from-[#f1ece2] to-[#d5c8b5]",
      blush: "bg-gradient-to-br from-blush to-[#c99891]",
      sand: "bg-gradient-to-br from-sand to-[#cdb58d]",
      navy: "bg-gradient-to-br from-[#1d2539] to-[#090d18]",
    } as Record<string, string>
  )[color] ?? "bg-sand";
}

export function mannequinTone(color: string) {
  return (
    {
      sage: "mannequin-sage",
      ivory: "mannequin-ivory",
      blush: "mannequin-blush",
      navy: "mannequin-navy",
      black: "mannequin-black",
      sand: "mannequin-sand",
    } as Record<string, string>
  )[color] ?? "mannequin-sage";
}

export function productBg(tone: string) {
  return (
    {
      sage: "bg-gradient-to-br from-[#e9e8de] to-[#c4c9b4]",
      navy: "bg-gradient-to-br from-[#ece4da] to-[#7b817f]",
      blush: "bg-gradient-to-br from-[#f2dfd9] to-[#e7c5c0]",
      sand: "bg-gradient-to-br from-[#e9d9c6] to-[#c2a58b]",
    } as Record<string, string>
  )[tone] ?? "bg-sand";
}

export function fabricBg(tone: string) {
  return (
    {
      ivory: "bg-[radial-gradient(circle_at_20%_30%,#fff,transparent_26%),linear-gradient(135deg,#f1eee6,#d8c9b5)]",
      rose: "bg-[radial-gradient(circle_at_15%_30%,#fff,transparent_24%),linear-gradient(135deg,#e8c7c2,#c99c97)]",
      gold: "bg-[radial-gradient(circle_at_40%_20%,#fff,transparent_22%),linear-gradient(135deg,#f3e2bf,#c89b52)]",
      linen: "bg-[repeating-linear-gradient(45deg,rgba(255,255,255,.2)_0_3px,transparent_3px_9px),linear-gradient(135deg,#d9d1c1,#b9ab95)]",
      rayon: "bg-[radial-gradient(circle_at_20%_30%,#cab4a6,transparent_24%),linear-gradient(135deg,#7b6358,#d0b5a8)]",
    } as Record<string, string>
  )[tone] ?? "bg-sand";
}
