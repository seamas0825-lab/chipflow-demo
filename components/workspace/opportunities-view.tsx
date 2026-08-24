"use client"

import { useState } from "react"
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileCheck,
  FileText,
  Filter,
  HelpCircle,
  Info,
  Layers,
  Lock,
  Mail,
  MapPin,
  MessageSquareText,
  Package,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingDown,
} from "lucide-react"
import { useWorkspace } from "@/lib/workspace-context"
import { MatchLevelBadge, TrustLevelBadge, ExportControlBadge } from "@/components/workspace/status-badges"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { SourcingOpportunity } from "@/lib/mock-data"

export function OpportunitiesView() {
  const { opportunities, sendRfq, reserveLot, askCopilot, setDropzoneOpen, setListExcessOpen } = useWorkspace()
  const [filterMatchLevel, setFilterMatchLevel] = useState<string>("all")
  const [activeRfqOpp, setActiveRfqOpp] = useState<SourcingOpportunity | null>(null)
  const [rfqQty, setRfqQty] = useState<number>(0)
  const [rfqPrice, setRfqPrice] = useState<number>(0)
  const [rfqNote, setRfqNote] = useState<string>("")
  const [rfqSentSuccess, setRfqSentSuccess] = useState<string | null>(null)

  const filtered = opportunities.filter((opp) => {
    if (filterMatchLevel === "exact") return opp.matchLevel === 1
    if (filterMatchLevel === "equiv") return opp.matchLevel === 2
    if (filterMatchLevel === "alt") return opp.matchLevel === 3
    return true
  })

  const totalPotentialSavings = opportunities.reduce((acc, o) => acc + o.potentialSavings, 0)
  const totalConfirmedSavings = opportunities.reduce((acc, o) => acc + o.confirmedSavings, 0)

  const handleOpenRfqModal = (opp: SourcingOpportunity) => {
    setActiveRfqOpp(opp)
    setRfqQty(opp.demandQty)
    setRfqPrice(opp.matchedLot.unitPrice)
    setRfqNote(`Inquiry for ${opp.demandQty} pcs ${opp.demandMpn} (Lot ${opp.matchedLot.lotCode}). Requesting factory CoC, inspection report, and dispatch confirmation to regional EMS hub.`)
  }

  const handleConfirmRfq = () => {
    if (!activeRfqOpp) return
    const id = sendRfq(activeRfqOpp.id, rfqQty, rfqPrice, rfqNote)
    setRfqSentSuccess(id)
    setTimeout(() => {
      setRfqSentSuccess(null)
      setActiveRfqOpp(null)
    }, 1500)
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4 md:p-6">
      {/* Top Banner: Liquidity & Savings KPI */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-4 dark:border-emerald-900/60">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium text-emerald-800 dark:text-emerald-300">Confirmed Savings</span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Locked Deal
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400 tabular-nums">
            ${totalConfirmedSavings.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Reserved in Escrow (Lot DE-4410)</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Potential Savings</span>
            <TrendingDown className="h-3.5 w-3.5 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums">
            ${totalPotentialSavings.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Across {opportunities.length} matched excess lots</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Matched Excess Coverage</span>
            <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums">83.3%</p>
          <p className="mt-1 text-[11px] text-muted-foreground">15 of 18 BOM lines covered</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Avg. RFQ Turnaround</span>
            <Clock3 className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums">4.2 hrs</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Verified Nordic & DACH EMS sellers</p>
        </div>
      </div>

      {/* Filter and Actions Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">Sourcing Opportunities</span>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
            {filtered.length} active
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-xl bg-secondary p-1 text-xs">
            <button
              onClick={() => setFilterMatchLevel("all")}
              className={cn(
                "rounded-lg px-2.5 py-1 font-medium transition-colors",
                filterMatchLevel === "all" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              All Matches
            </button>
            <button
              onClick={() => setFilterMatchLevel("exact")}
              className={cn(
                "rounded-lg px-2.5 py-1 font-medium transition-colors",
                filterMatchLevel === "exact" ? "bg-card text-emerald-700 shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Exact MPN (L1)
            </button>
            <button
              onClick={() => setFilterMatchLevel("equiv")}
              className={cn(
                "rounded-lg px-2.5 py-1 font-medium transition-colors",
                filterMatchLevel === "equiv" ? "bg-card text-amber-700 shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Equivalent (L2)
            </button>
          </div>

          <Button size="sm" variant="outline" className="gap-1.5 rounded-lg bg-transparent text-xs" onClick={() => setListExcessOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
            List Excess Lot
          </Button>

          <Button size="sm" className="gap-1.5 rounded-lg text-xs" onClick={() => setDropzoneOpen(true)}>
            <Layers className="h-3.5 w-3.5" />
            Ingest New BOM
          </Button>
        </div>
      </div>

      {/* Sourcing Opportunity Cards Grid */}
      <div className="space-y-4">
        {filtered.map((opp) => {
          const lot = opp.matchedLot
          const savingsPerUnit = opp.distributorMedianPrice - lot.unitPrice
          const savingsPct = Math.round((savingsPerUnit / opp.distributorMedianPrice) * 100)

          return (
            <div
              key={opp.id}
              className={cn(
                "group relative rounded-2xl border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md",
                opp.status === "reserved"
                  ? "border-blue-200 bg-blue-50/20 dark:border-blue-900/40"
                  : "border-border"
              )}
            >
              {/* Card Header: Demand MPN + Match Score + Status */}
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/70 pb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-base font-bold tracking-tight text-foreground">
                      {opp.demandMpn}
                    </span>
                    <span className="rounded-md bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground">
                      {opp.refDes}
                    </span>
                    <MatchLevelBadge level={opp.matchLevel} />
                    <ExportControlBadge control={opp.compliance.eccn} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {opp.manufacturer} · {opp.description}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Interactive ChipFlow Match Score Badge */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-left transition-all hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/60">
                        <div className="text-right">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                            ChipFlow Score
                          </p>
                          <p className="font-mono text-sm font-bold text-emerald-900 dark:text-emerald-200">
                            {opp.chipFlowScore} / 100
                          </p>
                        </div>
                        <HelpCircle className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 rounded-2xl p-4 shadow-xl" side="bottom" align="end">
                      <div className="border-b border-border pb-2.5">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold">ChipFlow Match Score</h4>
                          <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                            {opp.chipFlowScore} / 100
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          Multi-dimensional risk & feasibility evaluation
                        </p>
                      </div>

                      <div className="mt-3 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">MPN Match (25%)</span>
                          <span className="font-mono font-medium">{opp.scoreBreakdown.mpnMatch} / 25</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Supplier Trust (20%)</span>
                          <span className="font-mono font-medium">{opp.scoreBreakdown.supplierTrust} / 20</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Price & Savings (15%)</span>
                          <span className="font-mono font-medium">{opp.scoreBreakdown.priceScore} / 15</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Traceability / CoC (15%)</span>
                          <span className="font-mono font-medium">{opp.scoreBreakdown.traceability} / 15</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date Code (10%)</span>
                          <span className="font-mono font-medium">{opp.scoreBreakdown.dateCode} / 10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Lead Time (10%)</span>
                          <span className="font-mono font-medium">{opp.scoreBreakdown.leadTime} / 10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Logistics Parity (5%)</span>
                          <span className="font-mono font-medium">{opp.scoreBreakdown.logistics} / 5</span>
                        </div>
                      </div>

                      <div className="mt-3 rounded-xl bg-secondary/50 p-2.5 text-[11px] text-muted-foreground">
                        <p className="font-medium text-foreground">Audit Highlights:</p>
                        <ul className="mt-1 space-y-1">
                          {opp.scoreBreakdown.notes.map((n, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600" />
                              <span>{n}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Status Indicator */}
                  {opp.status === "reserved" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      <Lock className="h-3 w-3" />
                      Lot Reserved
                    </span>
                  )}
                  {opp.status === "supplier-contacted" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      <Clock3 className="h-3 w-3" />
                      RFQ Sent
                    </span>
                  )}
                  {opp.status === "inventory-confirmed" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      <CheckCircle2 className="h-3 w-3" />
                      Seller Confirmed
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body: Demand vs. Supply Comparison */}
              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
                {/* Demand Side */}
                <div className="rounded-xl border border-border/80 bg-secondary/20 p-3.5 lg:col-span-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Buyer BOM Demand
                  </p>
                  <div className="mt-2 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Required Quantity:</span>
                      <span className="font-semibold tabular-nums">{opp.demandQty.toLocaleString()} pcs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Target Unit Price:</span>
                      <span className="font-semibold tabular-nums">${opp.demandTargetPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Market Median (Franchised):</span>
                      <span className="text-muted-foreground tabular-nums line-through">
                        ${opp.distributorMedianPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Supply Match Side (The Lot) */}
                <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/30 p-3.5 dark:border-emerald-900/60 dark:bg-emerald-950/20 lg:col-span-5">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                      Matched Private EMS Lot
                    </p>
                    <TrustLevelBadge level={lot.trustLevel} />
                  </div>

                  <div className="mt-2 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Available Quantity:</span>
                      <span className="font-bold text-emerald-900 dark:text-emerald-200 tabular-nums">
                        {lot.quantity.toLocaleString()} pcs (Lot {lot.lotCode})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Offered Unit Price:</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                        ${lot.unitPrice.toFixed(2)}{" "}
                        <span className="text-[10px] font-normal text-emerald-600">(-{savingsPct}%)</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Location & Warehouse:</span>
                      <span className="flex items-center gap-1 font-medium text-foreground">
                        <MapPin className="h-3 w-3 text-emerald-600" />
                        {lot.supplierDisplay}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Date Code / Pack:</span>
                      <span className="font-medium">
                        DC {lot.dateCode} · {lot.packaging} · {lot.condition}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Savings & Direct Actions */}
                <div className="flex flex-col justify-between rounded-xl border border-border/80 bg-secondary/30 p-3.5 lg:col-span-3">
                  <div>
                    <span className="text-[11px] font-medium text-muted-foreground">Potential Project Savings</span>
                    <p className="mt-1 text-xl font-extrabold text-emerald-700 dark:text-emerald-400 tabular-nums">
                      ${opp.potentialSavings.toLocaleString()}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {lot.cocAvailable && (
                        <span className="inline-flex items-center gap-1 rounded bg-card px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground border">
                          <FileCheck className="h-2.5 w-2.5 text-emerald-600" />
                          CoC Verified
                        </span>
                      )}
                      {lot.originalInvoice && (
                        <span className="inline-flex items-center gap-1 rounded bg-card px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground border">
                          <FileText className="h-2.5 w-2.5 text-blue-600" />
                          Orig. Invoice
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    {opp.status === "reserved" ? (
                      <Button size="sm" variant="secondary" className="w-full gap-1.5 text-xs text-blue-700" disabled>
                        <Lock className="h-3 w-3" />
                        Reserved in Escrow
                      </Button>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          className="flex-1 gap-1.5 rounded-lg text-xs"
                          onClick={() => handleOpenRfqModal(opp)}
                        >
                          <Send className="h-3 w-3" />
                          Send RFQ
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 rounded-lg text-xs bg-card"
                          onClick={() => reserveLot(opp.id, lot.id)}
                          title="Lock lot directly into project escrow"
                        >
                          Reserve
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="px-2"
                      onClick={() =>
                        askCopilot(
                          `Explain why ${opp.demandMpn} was matched with Lot ${lot.lotCode} from ${lot.supplierDisplay} and detail the price delta and risk audit.`
                        )
                      }
                      title="Ask Copilot for audit details"
                    >
                      <MessageSquareText className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Send RFQ Modal */}
      {activeRfqOpp && (
        <Dialog open={!!activeRfqOpp} onOpenChange={(open) => !open && setActiveRfqOpp(null)}>
          <DialogContent className="sm:max-w-lg rounded-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-bold">
                <Mail className="h-4 w-4 text-primary" />
                Send RFQ to {activeRfqOpp.matchedLot.supplierDisplay}
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                Official inquiry for {activeRfqOpp.demandMpn} (Lot {activeRfqOpp.matchedLot.lotCode})
              </p>
            </DialogHeader>

            {rfqSentSuccess ? (
              <div className="my-6 flex flex-col items-center justify-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">RFQ #{rfqSentSuccess} Dispatched</p>
                <p className="text-xs text-muted-foreground">
                  Seller notification sent. Response usually arrives within 4 hours.
                </p>
              </div>
            ) : (
              <div className="space-y-4 py-2 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Demand Quantity</label>
                    <Input
                      type="number"
                      value={rfqQty}
                      onChange={(e) => setRfqQty(Number(e.target.value))}
                      className="mt-1 font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Target Unit Price ($)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={rfqPrice}
                      onChange={(e) => setRfqPrice(Number(e.target.value))}
                      className="mt-1 font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Inquiry Message & Terms</label>
                  <Textarea
                    value={rfqNote}
                    onChange={(e) => setRfqNote(e.target.value)}
                    rows={4}
                    className="mt-1 text-xs leading-relaxed"
                  />
                </div>

                <div className="rounded-xl border border-border bg-secondary/30 p-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    ChipFlow Trust & Anonymity Guarantee
                  </div>
                  <p className="mt-1 text-[11px] leading-normal">
                    Seller identity is shielded until formal escrow lock. Trade terms protect both buyer inspection
                    rights and seller inventory confidentiality.
                  </p>
                </div>

                <DialogFooter className="mt-4 gap-2">
                  <Button variant="outline" size="sm" onClick={() => setActiveRfqOpp(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleConfirmRfq} className="gap-1.5">
                    <Send className="h-3 w-3" />
                    Dispatch RFQ
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
