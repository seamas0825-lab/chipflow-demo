"use client"

import { CheckCircle2, FileCheck, Lock, MapPin, Send, ShieldCheck, Sparkles, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MatchLevelBadge, TrustLevelBadge } from "@/components/workspace/status-badges"

export function LandingBoardPreview() {
  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-2xl backdrop-blur-sm dark:bg-card/90">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-3 w-3 rounded-full bg-emerald-500" />
          <span className="font-mono text-sm font-bold text-foreground">STM32F103C8T6</span>
          <span className="rounded bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground">U1 · Rev C</span>
          <MatchLevelBadge level={1} />
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1 text-right dark:border-emerald-800 dark:bg-emerald-950/60">
            <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300">ChipFlow Score</span>
            <p className="font-mono text-sm font-bold text-emerald-900 dark:text-emerald-200">94 / 100</p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12 text-xs">
        {/* Demand */}
        <div className="rounded-2xl border border-border bg-secondary/30 p-4 lg:col-span-4">
          <p className="font-semibold uppercase tracking-wider text-muted-foreground text-[10px]">
            Buyer BOM Demand
          </p>
          <div className="mt-2.5 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quantity Required:</span>
              <span className="font-bold tabular-nums">2,400 pcs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Target Budget:</span>
              <span className="font-semibold tabular-nums">$1.92 / pc</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Franchised Spot Price:</span>
              <span className="line-through tabular-nums">$2.39 / pc</span>
            </div>
          </div>
        </div>

        {/* Supply Lot */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/30 lg:col-span-5">
          <div className="flex items-center justify-between">
            <p className="font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 text-[10px]">
              Matched Private EMS Lot
            </p>
            <TrustLevelBadge level={3} />
          </div>
          <div className="mt-2.5 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Available Stock:</span>
              <span className="font-bold text-emerald-950 dark:text-emerald-200 tabular-nums">
                8,400 pcs (Lot A29177)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Offered Unit Price:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                $1.26 / pc <span className="text-[10px] text-emerald-600 font-normal">(-34% under target)</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Location:</span>
              <span className="flex items-center gap-1 font-medium text-foreground">
                <MapPin className="h-3 w-3 text-emerald-600" /> Verified EMS · Gothenburg, Sweden
              </span>
            </div>
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>Date Code / Packaging:</span>
              <span>DC 2224 · Factory Sealed Tray</span>
            </div>
          </div>
        </div>

        {/* Action & Savings */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-secondary/40 p-4 lg:col-span-3">
          <div>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">Identified Savings</span>
            <p className="mt-1 text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 tabular-nums">
              $1,584.00
            </p>
            <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
              <FileCheck className="h-3 w-3 text-emerald-600" />
              <span>Original CoC & Invoice Verified</span>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button size="sm" className="flex-1 gap-1.5 rounded-xl text-xs">
              <Send className="h-3 w-3" />
              Send RFQ
            </Button>
            <Button size="sm" variant="outline" className="rounded-xl text-xs bg-card">
              Reserve Lot
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
