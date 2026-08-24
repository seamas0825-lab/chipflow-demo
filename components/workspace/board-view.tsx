"use client"

import { useMemo } from "react"
import { ArrowDownRight, ArrowRight, Clock3, MessageSquareText, TriangleAlert } from "lucide-react"
import type { BomLine, LineStatus } from "@/lib/mock-data"
import { useWorkspace } from "@/lib/workspace-context"
import { ChannelDot, channelMeta, ExportControlBadge, riskLabel, statusMeta } from "@/components/workspace/status-badges"
import { cn } from "@/lib/utils"

const columns: { id: LineStatus; description: string }[] = [
  { id: "needs-sourcing", description: "Allocation risk or no confirmed channel yet" },
  { id: "deadstock-arbitrage", description: "Verified EU deadstock lots beat catalog pricing" },
  { id: "vector-alternative", description: "Parametric-matched substitutes identified" },
  { id: "ready-to-quote", description: "Sourced, scored, and cleared for PO" },
]

export function BoardView() {
  const { lines, setSelectedLineId, askCopilot } = useWorkspace()

  const grouped = useMemo(() => {
    const map = new Map<LineStatus, BomLine[]>()
    for (const col of columns) map.set(col.id, [])
    for (const line of lines) {
      const key: LineStatus = line.status === "sourced" ? "ready-to-quote" : line.status
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(line)
    }
    return map
  }, [lines])

  return (
    <div className="flex h-full gap-4 overflow-x-auto p-4 md:p-6">
      {columns.map((col) => {
        const items = grouped.get(col.id) ?? []
        const meta = statusMeta[col.id]
        return (
          <div key={col.id} className="flex h-full w-[300px] shrink-0 flex-col">
            <div className="mb-3 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <meta.icon className="h-3.5 w-3.5 text-muted-foreground" />
                <h3 className="text-sm font-medium">{meta.label}</h3>
              </div>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {items.length}
              </span>
            </div>
            <p className="mb-3 px-1 text-[11px] leading-relaxed text-muted-foreground">{col.description}</p>

            <div className="flex-1 space-y-3 overflow-y-auto pb-4 pr-0.5">
              {items.map((line) => {
                const risk = riskLabel(line.riskScore)
                const bestOffer = line.offers.find((o) => o.channel === line.bestChannel)
                return (
                  <button
                    key={line.id}
                    onClick={() => setSelectedLineId(line.id)}
                    className="group block w-full rounded-2xl border border-border bg-card p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-mono text-sm font-medium tracking-tight">{line.mpn}</p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">{line.manufacturer}</p>
                      </div>
                      <span className="shrink-0 rounded-md bg-secondary px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {line.refDes}
                      </span>
                    </div>

                    <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {line.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-semibold tracking-tight tabular-nums">
                          ${bestOffer?.unitPrice.toFixed(2)}
                        </span>
                        {line.savingsPct > 0 && (
                          <span className="flex items-center gap-0.5 text-[11px] font-medium text-emerald-600">
                            <ArrowDownRight className="h-3 w-3" />
                            {line.savingsPct}%
                          </span>
                        )}
                      </div>
                      {bestOffer && (
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <ChannelDot channel={bestOffer.channel} />
                          {channelMeta[bestOffer.channel].label}
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-border/70 pt-2.5">
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock3 className="h-3 w-3" />
                        {bestOffer?.leadTimeDays ?? "—"}d lead
                      </div>
                      <div className="flex items-center gap-1.5">
                        {line.exportControl !== "None" && <ExportControlBadge control={line.exportControl} />}
                        {line.riskScore >= 60 && (
                          <span className={cn("flex items-center gap-0.5 text-[11px] font-medium", risk.className)}>
                            <TriangleAlert className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                    </div>

                    {(col.id === "deadstock-arbitrage" || col.id === "vector-alternative") && (
                      <div
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          askCopilot(
                            col.id === "deadstock-arbitrage"
                              ? `Draft inquiry email for the ${line.mpn} deadstock lot`
                              : `Compare ${line.mpn} vs vector alternatives`,
                          )
                        }}
                        className="mt-3 flex items-center justify-between rounded-lg bg-accent/60 px-2.5 py-1.5 text-[11px] font-medium text-accent-foreground opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <span className="flex items-center gap-1.5">
                          <MessageSquareText className="h-3 w-3" />
                          Ask Copilot
                        </span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                )
              })}
              {items.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border px-4 py-8 text-center text-xs text-muted-foreground">
                  No lines in this stage
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
