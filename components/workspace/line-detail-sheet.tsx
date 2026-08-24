"use client"

import { Clock3, MessageSquareText, PackageCheck, Send, ShieldCheck, Sparkles } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useWorkspace } from "@/lib/workspace-context"
import { ChannelDot, ConfidenceBadge, ExportControlBadge, StatusBadge } from "@/components/workspace/status-badges"
import { cn } from "@/lib/utils"

export function LineDetailSheet() {
  const { selectedLine, setSelectedLineId, askCopilot, opportunities, setView, setSelectedOpportunityId } =
    useWorkspace()

  const opp = selectedLine?.opportunityId
    ? opportunities.find((o) => o.id === selectedLine.opportunityId)
    : null

  return (
    <Sheet open={!!selectedLine} onOpenChange={(open) => !open && setSelectedLineId(null)}>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto p-0 sm:max-w-lg">
        {selectedLine && (
          <>
            <SheetHeader className="border-b border-border px-6 py-4">
              <div className="flex items-center justify-between">
                <SheetTitle className="font-mono text-base font-bold tracking-tight">
                  {selectedLine.mpn}
                </SheetTitle>
                <ConfidenceBadge score={selectedLine.confidence.mpn} />
              </div>
              <p className="text-xs text-muted-foreground">{selectedLine.description}</p>
            </SheetHeader>

            <div className="space-y-5 px-6 py-5 text-xs">
              {/* Status and Specs */}
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={selectedLine.status} />
                <ExportControlBadge control={selectedLine.exportControl} />
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {selectedLine.refDes} · {selectedLine.package}
                </span>
              </div>

              {/* Normalized Data Overview */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-secondary/30 p-3">
                  <p className="text-[11px] text-muted-foreground">Manufacturer</p>
                  <p className="mt-0.5 text-sm font-semibold">{selectedLine.manufacturer}</p>
                </div>
                <div className="rounded-xl border border-border bg-secondary/30 p-3">
                  <p className="text-[11px] text-muted-foreground">Demand Quantity</p>
                  <p className="mt-0.5 text-sm font-semibold tabular-nums">
                    {selectedLine.qty.toLocaleString()} pcs
                  </p>
                </div>
              </div>

              {/* Matched Opportunity Card if Available */}
              {opp && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase text-emerald-800 dark:text-emerald-300">
                      Matched Excess Opportunity ({opp.chipFlowScore}/100 Score)
                    </span>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      ${opp.potentialSavings.toLocaleString()} Savings
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Available in {opp.matchedLot.supplierDisplay} (Lot {opp.matchedLot.lotCode}) at $
                    {opp.matchedLot.unitPrice.toFixed(2)}/pc.
                  </p>
                  <Button
                    size="sm"
                    className="mt-3 w-full gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => {
                      setSelectedLineId(null)
                      setView("opportunities")
                    }}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Open Opportunity Card & Send RFQ
                  </Button>
                </div>
              )}

              {/* Channel Offers Comparison */}
              <div>
                <h4 className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Channel Quotes & Excess Lots
                </h4>
                <div className="space-y-2">
                  {selectedLine.offers.map((offer) => (
                    <div
                      key={offer.channel}
                      className={cn(
                        "flex items-center justify-between rounded-xl border p-3",
                        offer.channel === selectedLine.bestChannel
                          ? "border-primary/40 bg-accent/40"
                          : "border-border bg-card"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <ChannelDot channel={offer.channel} />
                        <div>
                          <span className="text-xs font-semibold">{offer.label}</span>
                          {offer.channel === selectedLine.bestChannel && (
                            <span className="ml-2 rounded-full bg-primary/10 px-1.5 py-0.2 text-[9px] font-semibold text-primary">
                              Best Offer
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 tabular-nums font-mono text-xs">
                        <span className="font-bold text-foreground">${offer.unitPrice.toFixed(2)}</span>
                        <span className="text-[11px] text-muted-foreground">{offer.stock.toLocaleString()} pcs</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedLine.notes && (
                <div className="flex gap-2 rounded-xl border border-border bg-secondary/30 p-3 text-xs leading-relaxed text-muted-foreground">
                  <PackageCheck className="h-4 w-4 shrink-0 text-primary" />
                  {selectedLine.notes}
                </div>
              )}

              <div className="border-t border-border pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 text-xs bg-transparent"
                  onClick={() => {
                    askCopilot(`Generate supplier verification inquiry for ${selectedLine.mpn} (${selectedLine.refDes}).`)
                  }}
                >
                  <MessageSquareText className="h-3.5 w-3.5" />
                  Consult Sourcing Copilot on this Part
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
