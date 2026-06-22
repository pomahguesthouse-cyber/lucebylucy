import { useCustomizerStore } from "@/store/customizer-store";
import { getCategoryName, computeEstimatedPrice } from "@/lib/customizer-selectors";
import { formatPrice } from "@/lib/format";

const videoStateLabel: Record<string, string> = {
  empty: "Belum dibuat",
  ready: "Siap dibuat",
  generating: "Sedang diproses",
  generated: "Sudah dibuat",
  failed: "Gagal — desain tetap tersimpan",
};

export function DesignSummaryCard() {
  const {
    customerName,
    selectedCategory,
    selectedModel,
    selectedFabric,
    selectedColor,
    sizeType,
    selectedSize,
    designDetails,
    videoPreviewState,
  } = useCustomizerStore();

  const estimatedPrice = computeEstimatedPrice(
    selectedModel,
    selectedFabric,
    sizeType === "custom",
  );

  const designText =
    [
      designDetails.neckline,
      designDetails.sleeveModel,
      designDetails.outfitLength,
      designDetails.cutting,
      ...designDetails.accents,
    ]
      .filter(Boolean)
      .join(", ") || "Detail minimalis";

  const rows = [
    { label: "Nama", value: customerName || "-" },
    { label: "Kategori", value: getCategoryName(selectedCategory) || "-" },
    { label: "Model", value: selectedModel?.name ?? "-" },
    { label: "Bahan", value: selectedFabric?.name ?? "-" },
    { label: "Warna", value: selectedColor?.name ?? "-" },
    {
      label: "Ukuran",
      value: sizeType === "standard" ? `Standar (${selectedSize})` : "Custom measurement",
    },
    { label: "Detail desain", value: designText },
    { label: "Video preview", value: videoStateLabel[videoPreviewState] },
  ];

  return (
    <div className="rounded-luxe border border-champagne/20 bg-white/75 p-6 shadow-soft">
      <h3 className="font-display text-xl font-semibold text-charcoal">Ringkasan desain</h3>
      <dl className="mt-4 divide-y divide-champagne/10">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start justify-between gap-4 py-2.5">
            <dt className="text-xs uppercase tracking-wide text-mink">{row.label}</dt>
            <dd className="text-right text-sm font-medium text-charcoal">{row.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex items-center justify-between rounded-2xl bg-ivory/70 px-4 py-3">
        <span className="text-xs uppercase tracking-wide text-mink">Estimasi harga</span>
        <span className="text-base font-semibold text-champagne">
          {estimatedPrice ? formatPrice(estimatedPrice) : "Menunggu kalkulasi"}
        </span>
      </div>
      <p className="mt-3 text-[11px] text-mink">
        Estimasi belum termasuk konfirmasi final tim untuk bahan dan tingkat kerumitan.
      </p>
    </div>
  );
}
