import { ShieldCheck, CheckCircle2, AlertTriangle, Clock3, Sparkles, Building2, Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ChannelKey, ExportControl, LineStatus, MatchLevel, TrustLevel } from "@/lib/mock-data"

export const channelMeta: Record<ChannelKey, { label: string; dotClass: string; badgeClass: string }> = {
  lcsc: {
    label: "LCSC (Direct)",
    dotClass: "bg-blue-500",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800",
  },
  mouser: {
    label: "Mouser (US)",
    dotClass: "bg-amber-500",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
  },
  digikey: {
    label: "DigiKey (US)",
    dotClass: "bg-rose-500",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800",
  },
  deadstock: {
    label: "EU EMS Excess",
    dotClass: "bg-emerald-500",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
  },
}

export function ChannelDot({ channel }: { channel: ChannelKey }) {
  return <span className={cn("inline-block h-2 w-2 rounded-full", channelMeta[channel].dotClass)} />
}

export function ExportControlBadge({ control }: { control: ExportControl }) {
  if (control === "None") return null
  const isEAR99 = control === "EAR99"
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium",
        isEAR99
          ? "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-300"
          : "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950/50 dark:text-purple-300"
      )}
    >
      <ShieldCheck className="h-3 w-3" />
      {control} Verified
    </span>
  )
}

export function StatusBadge({ status }: { status: LineStatus }) {
  switch (status) {
    case "matched":
      return (
        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
          <Sparkles className="mr-1 h-3 w-3" />
          Excess Matched
        </Badge>
      )
    case "reserved":
      return (
        <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Lot Reserved
        </Badge>
      )
    case "rfq-pending":
      return (
        <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
          <Clock3 className="mr-1 h-3 w-3" />
          RFQ In Progress
        </Badge>
      )
    case "sourced":
      return (
        <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-300">
          Distributor Stock
        </Badge>
      )
    case "shortage":
      return (
        <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Shortage Risk
        </Badge>
      )
  }
}

export function MatchLevelBadge({ level }: { level: MatchLevel }) {
  if (level === 1) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
        <CheckCircle2 className="h-3 w-3" />
        Level 1 · Exact MPN Match
      </span>
    )
  }
  if (level === 2) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
        <AlertTriangle className="h-3 w-3" />
        Level 2 · MFR Equivalent (Review Req.)
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-[11px] font-semibold text-purple-800 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300">
      <Sparkles className="h-3 w-3" />
      Level 3 · Suggested Alternative
    </span>
  )
}

export function TrustLevelBadge({ level }: { level: TrustLevel }) {
  const configs: Record<TrustLevel, { label: string; bg: string; text: string; border: string }> = {
    0: { label: "Level 0 · Unverified", bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300" },
    1: { label: "Level 1 · Company Verified", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    2: { label: "Level 2 · Inventory Verified", bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
    3: { label: "Level 3 · Traceability Verified", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    4: { label: "Level 4 · ChipFlow Inspected", bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  }
  const c = configs[level]
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium", c.bg, c.text, c.border)}>
      <ShieldCheck className="h-3 w-3 shrink-0" />
      {c.label}
    </span>
  )
}

export function ConfidenceBadge({ score }: { score: number }) {
  const isHigh = score >= 90
  const isMed = score >= 70 && score < 90
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-mono font-medium",
        isHigh
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
          : isMed
          ? "bg-amber-50 text-amber-700 border border-amber-200"
          : "bg-rose-50 text-rose-700 border border-rose-200"
      )}
      title={`Parser Confidence: ${score}%`}
    >
      {score}% Conf.
    </span>
  )
}
