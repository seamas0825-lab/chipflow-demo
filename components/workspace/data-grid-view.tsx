"use client"

import { useState } from "react"
import {
  ChevronDown,
  Clock3,
  MessageSquareText,
  MoreHorizontal,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react"
import { useWorkspace } from "@/lib/workspace-context"
import {
  ChannelDot,
  channelMeta,
  ExportControlBadge,
  StatusBadge,
} from "@/components/workspace/status-badges"
import { Button, buttonVariants } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function DataGridView() {
  const { lines, setSelectedLineId, askCopilot } = useWorkspace()
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  return (
    <div className="flex h-full flex-col p-4 md:p-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{lines.length}</span> lines · updated 2 min ago
        </div>
        <Button variant="outline" size="sm" className="gap-2 rounded-lg bg-transparent">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Columns
        </Button>
      </div>

      <div className="flex-1 overflow-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[1100px] border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-secondary/95 backdrop-blur-sm">
            <tr className="text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2.5">Ref</th>
              <th className="px-4 py-2.5">Part</th>
              <th className="px-4 py-2.5">Qty</th>
              <th className="px-4 py-2.5">Best offer</th>
              <th className="px-4 py-2.5">Multi-tier pricing</th>
              <th className="px-4 py-2.5">Lead time</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">Export</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {lines.map((line, idx) => {
              const bestOffer = line.offers.find((o) => o.channel === line.bestChannel) ?? line.offers[0]
              return (
                <tr
                  key={line.id}
                  onMouseEnter={() => setHoveredRow(line.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => setSelectedLineId(line.id)}
                  className={cn(
                    "cursor-pointer transition-colors",
                    idx % 2 === 1 && "bg-secondary/30",
                    hoveredRow === line.id && "bg-accent/40",
                  )}
                >
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{line.refDes}</td>
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs font-medium tracking-tight">{line.mpn}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{line.manufacturer}</p>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-xs text-muted-foreground">{line.qty.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <ChannelDot channel={bestOffer.channel} />
                      <span className="tabular-nums text-sm font-medium">${bestOffer.unitPrice.toFixed(3)}</span>
                      <span className="text-[11px] text-muted-foreground">{channelMeta[bestOffer.channel].label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Popover>
                      <PopoverTrigger
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
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
                              <span className="tabular-nums font-medium">${tier.unitPrice.toFixed(3)}</span>
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock3 className="h-3 w-3" />
                      {bestOffer.leadTimeDays}d
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={line.status} />
                  </td>
                  <td className="px-4 py-3">
                    <ExportControlBadge control={line.exportControl} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {line.alternatives.length > 0 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-lg text-primary hover:bg-accent"
                          onClick={(e) => {
                            e.stopPropagation()
                            askCopilot(`Compare ${line.mpn} vs vector alternatives`)
                          }}
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          onClick={(e) => e.stopPropagation()}
                          className={cn(
                            buttonVariants({ variant: "ghost", size: "icon" }),
                            "h-7 w-7 rounded-lg",
                          )}
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem onClick={() => setSelectedLineId(line.id)}>View details</DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => askCopilot(`Draft inquiry email for ${line.mpn}`)}
                          >
                            <MessageSquareText className="h-3.5 w-3.5" />
                            Draft inquiry email
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => askCopilot(`Check export control status for ${line.mpn}`)}>
                            Check export control
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
