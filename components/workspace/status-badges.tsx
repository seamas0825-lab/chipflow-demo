import type { ExportControl, LineStatus, ChannelKey } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { AlertTriangle, CheckCircle2, Globe2, PackageSearch, Recycle, Sparkles } from "lucide-react"

export const statusMeta: Record<
  LineStatus,
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  sourced: {
    label: "Sourced",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  "needs-sourcing": {
    label: "Needs Sourcing",
    className: "bg-amber-50 text-amber-800 border-amber-200",
    icon: PackageSearch,
  },
  "deadstock-arbitrage": {
    label: "Deadstock Arbitrage",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: Recycle,
  },
  "vector-alternative": {
    label: "Vector Alternative",
    className: "bg-sky-50 text-sky-700 border-sky-200",
    icon: Sparkles,
  },
  "ready-to-quote": {
    label: "Ready to Quote",
    className: "bg-zinc-100 text-zinc-700 border-zinc-200",
    icon: CheckCircle2,
  },
}

export function StatusBadge({ status, className }: { status: LineStatus; className?: string }) {
  const meta = statusMeta[status]
  const Icon = meta.icon
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium leading-none",
        meta.className,
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {meta.label}
    </span>
  )
}

export function ExportControlBadge({ control, className }: { control: ExportControl; className?: string }) {
  if (control === "None") return null
  const isItar = control === "ITAR"
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium leading-none",
        isItar ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-emerald-50 text-emerald-700 border-emerald-200",
        className,
      )}
    >
      {isItar ? <AlertTriangle className="h-3 w-3" /> : <Globe2 className="h-3 w-3" />}
      {control}
    </span>
  )
}

export const channelMeta: Record<ChannelKey, { label: string; dot: string }> = {
  lcsc: { label: "LCSC", dot: "bg-indigo-500" },
  mouser: { label: "Mouser", dot: "bg-sky-500" },
  digikey: { label: "DigiKey", dot: "bg-emerald-500" },
  deadstock: { label: "EU Deadstock", dot: "bg-amber-500" },
}

export function ChannelDot({ channel }: { channel: ChannelKey }) {
  return <span className={cn("inline-block h-2 w-2 shrink-0 rounded-full", channelMeta[channel].dot)} />
}

export function riskLabel(score: number) {
  if (score >= 60) return { label: "High risk", className: "text-rose-600" }
  if (score >= 30) return { label: "Moderate", className: "text-amber-600" }
  return { label: "Low risk", className: "text-emerald-600" }
}
