"use client"

import { Clock3, MessageSquareText, PackageCheck, Sparkles } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useWorkspace } from "@/lib/workspace-context"
import { ChannelDot, channelMeta, ExportControlBadge, StatusBadge } from "@/components/workspace/status-badges"
import { cn } from "@/lib/utils"

export function LineDetailSheet() {
  const { selectedLine, setSelectedLineId, askCopilot } = useWorkspace()

  return (
    <Sheet open={!!selectedLine} onOpenChange={(open) => !open && setSelectedLineId(null)}>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto p-0 sm:max-w-lg">
        {selectedLine && (
          <>
            <SheetHeader className="border-b border-border px-6 py-4">
              <SheetTitle className="font-mono text-base tracking-tight">{selectedLine.mpn}</SheetTitle>
              <p className="text-sm text-muted-foreground">{selectedLine.description}</p>
            </SheetHeader>

            <div className="space-y-6 px-6 py-5">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={selectedLine.status} />
                <ExportControlBadge control={selectedLine.exportControl} />
                <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                  {selectedLine.refDes} · {selectedLine.package}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-secondary/40 p-3">
                  <p className="text-[11px] text-muted-foreground">Manufacturer</p>
                  <p className="mt-0.5 text-sm font-medium">{selectedLine.manufacturer}</p>
                </div>
                <div className="rounded-xl border border-border bg-secondary/40 p-3">
                  <p className="text-[11px] text-muted-foreground">Quantity</p>
                  <p className="mt-0.5 text-sm font-medium tabular-nums">{selectedLine.qty.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-xs font-medium text-muted-foreground">Channel offers</h4>
                <div className="space-y-2">
                  {selectedLine.offers.map((offer) => (
                    <div
                      key={offer.channel}
                      className={cn(
                        "flex items-center justify-between rounded-xl border px-3 py-2.5",
                        offer.channel === selectedLine.bestChannel
                          ? "border-primary/30 bg-accent/40"
                          : "border-border bg-card",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <ChannelDot channel={offer.channel} />
                        <span className="text-sm font-medium">{offer.label}</span>
                        {offer.channel === selectedLine.bestChannel && (
                          <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                            Best
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="tabular-nums font-medium">${offer.unitPrice.toFixed(3)}</span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock3 className="h-3 w-3" />
                          {offer.leadTimeDays || "—"}d
                        </span>
                        <span className="text-muted-foreground">{offer.stock.toLocaleString()} in stock</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedLine.alternatives.length > 0 && (
                <div>
                  <h4 className="mb-2 text-xs font-medium text-muted-foreground">Vector alternatives</h4>
                  <div className="space-y-2">
                    {selectedLine.alternatives.map((alt) => (
                      <div key={alt.mpn} className="rounded-xl border border-border bg-secondary/40 p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm font-medium">{alt.mpn}</span>
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                            {alt.matchScore}% match
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">{alt.manufacturer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedLine.notes && (
                <div className="flex gap-2 rounded-xl border border-border bg-secondary/40 p-3 text-xs leading-relaxed text-muted-foreground">
                  <PackageCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
                  {selectedLine.notes}
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <Button
                  className="flex-1 gap-2 rounded-xl"
                  onClick={() => askCopilot(`Draft inquiry email for ${selectedLine.mpn}`)}
                >
                  <MessageSquareText className="h-4 w-4" />
                  Draft inquiry email
                </Button>
                {selectedLine.alternatives.length > 0 && (
                  <Button
                    variant="outline"
                    className="flex-1 gap-2 rounded-xl bg-transparent"
                    onClick={() => askCopilot(`Compare ${selectedLine.mpn} vs vector alternatives`)}
                  >
                    <Sparkles className="h-4 w-4" />
                    Compare alternatives
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
