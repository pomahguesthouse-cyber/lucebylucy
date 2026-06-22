import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminDesignRequestCard } from "@/components/admin/AdminDesignRequestCard";
import { designRequests } from "@/data/admin-requests";
import type { DesignRequestStatus } from "@/types";
import { cn } from "@/lib/utils";

const filters: { label: string; value: DesignRequestStatus | "all" }[] = [
  { label: "Semua", value: "all" },
  { label: "Submitted", value: "submitted" },
  { label: "Waiting review", value: "waiting_review" },
  { label: "Need revision", value: "need_revision" },
  { label: "Approved", value: "approved" },
];

export function AdminDesignRequests() {
  const [filter, setFilter] = useState<DesignRequestStatus | "all">("all");

  const list =
    filter === "all"
      ? designRequests
      : designRequests.filter((r) => r.status === filter);

  return (
    <AdminLayout
      title="Design requests"
      description="Tinjau detail desain, ukuran, rekomendasi AI, dan prompt video sebelum konfirmasi produksi."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFilter(item.value)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition",
              filter === item.value
                ? "border-champagne bg-champagne/15 text-charcoal"
                : "border-champagne/25 bg-white/70 text-mink hover:border-champagne/50",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="rounded-luxe border border-champagne/15 bg-white/60 p-12 text-center text-mink">
          Tidak ada permintaan dengan status ini.
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {list.map((request) => (
            <AdminDesignRequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
