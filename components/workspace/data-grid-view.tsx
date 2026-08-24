"use client"

import { useState } from "react"
import {
  ArrowRight,
  ChevronDown,
  Clock3,
  Layers,
  MessageSquareText,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react"
import { useWorkspace } from "@/lib/workspace-context"
import {
  ChannelDot,
  channelMeta,
  ConfidenceBadge,
  ExportControlBadge,
  StatusBadge,
} from "@/components/workspace/status-badges"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function DataGridView() {
  const { lines, setSelectedLineId, askCopilot, setView } = useWorkspace()
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filtered = lines.filter((l) =>
    l.mpn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.rawMpn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.refDes.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex h-full flex-col p-4 md:p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">
            <strong className="text-foreground">{lines.length}</strong> standardized BOM lines
          </span>
          <div className="relative w-60">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filter MPN, RefDes, MFR..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 rounded-xl pl-8 text-xs"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 rounded-lg text-xs bg-card"
            onClick={() => setView("opportunities")}
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            View Matched Opportunities
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[1100px] border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-secondary/95 backdrop-blur-sm">
            <tr className="text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2.5">Ref</th>
              <th className="px-4 py-2.5">Standardized Part</th>
              <th className="px-4 py-2.5">Raw / Normalized</th>
              <th className="px-4 py-2.5">Qty</th>
              <th className="px-4 py-2.5">Target / Best Offer</th>
              <th className="px-4 py-2.5">Tier Pricing</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">Compliance</th>
              <th className="px-4 py-2.5 text-right">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs">
            {filtered.map((line, idx) => {
              const bestOffer = line.offers.find((o) => o.channel === line.bestChannel) ?? line.offers[0]
              return (
                <tr
                  key={line.id}
                  onMouseEnter={() => setHoveredRow(line.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => setSelectedLineId(line.id)}
                  className={cn(
                    "cursor-pointer transition-colors",
                    idx % 2 === 1 && "bg-secondary/20",
                    hoveredRow === line.id && "bg-accent/40"
                  )}
                >
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{line.refDes}</td>
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs font-bold text-foreground">{line.mpn}</p>
                    <p className="text-[11px] text-muted-foreground">{line.manufacturer}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px]">
                    <span className="text-muted-foreground line-through mr-1.5">{line.rawMpn}</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">{line.normalizedMpn}</span>
                  </td>
                  <td className="px-4 py-3 tabular-nums font-medium text-muted-foreground">
                    {line.qty.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <ChannelDot channel={bestOffer.channel} />
                      <span className="tabular-nums font-bold text-emerald-700 dark:text-emerald-400">
                        ${bestOffer.unitPrice.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        (tgt ${line.targetPrice.toFixed(2)})
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Popover>
                      <PopoverTrigger
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground"
                      >
                        {line.tiers.length} tiers
                        <ChevronDown className="h-3 w-3" />
                      </PopoverTrigger>
                      <PopoverContent className="w-56 rounded-xl p-3" onClick={(e) => e.stopPropagation()}>
                        <p className="mb-2 text-xs font-medium">Tiered pricing — {line.mpn}</p>
                        <div className="space-y-1">
                          {line.tiers.map((tier) => (
                            <div key={tier.qty} className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">{tier.qty.toLocaleString()}+ units</span>
                              <span className="tabular-nums font-medium">${tier.unitPrice.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={line.status} />
                  </td>
                  <td className="px-4 py-3">
                    <ExportControlBadge control={line.exportControl} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ConfidenceBadge score={line.confidence.mpn} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
