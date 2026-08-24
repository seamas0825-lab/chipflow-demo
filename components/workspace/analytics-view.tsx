"use client"

import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Boxes,
  Building2,
  CheckCircle2,
  Clock3,
  DollarSign,
  Globe2,
  Lock,
  PieChart,
  ShieldCheck,
  TrendingDown,
  Users,
} from "lucide-react"
import { useWorkspace } from "@/lib/workspace-context"
import { project } from "@/lib/mock-data"
import { Progress } from "@/components/ui/progress"

export function AnalyticsView() {
  const { opportunities, lines, inventoryLots, rfqs } = useWorkspace()

  const confirmedSavings = opportunities.reduce((acc, o) => acc + o.confirmedSavings, 0)
  const potentialSavings = opportunities.reduce((acc, o) => acc + o.potentialSavings, 0)
  const totalBOMBudget = project.originalBudget

  const funnelSteps = [
    { label: "BOM Lines Ingested", value: lines.length, pct: 100, color: "bg-blue-500" },
    { label: "Sourcing Shortages / High Cost", value: 12, pct: 66.7, color: "bg-indigo-500" },
    { label: "Excess Lots Matched (L1/L2)", value: opportunities.length, pct: 27.8, color: "bg-emerald-500" },
    { label: "RFQs Dispatched", value: rfqs.length, pct: 16.7, color: "bg-amber-500" },
    { label: "Seller Confirmed Inventory", value: 2, pct: 11.1, color: "bg-teal-500" },
    { label: "Escrow Reserved / Locked", value: 1, pct: 5.6, color: "bg-emerald-600" },
  ]

  const emsHubs = [
    { city: "Gothenburg, Sweden", hub: "NordicEMS Hub", lots: 3, value: 18400, trust: "Level 3" },
    { city: "Munich, Germany", hub: "Bavaria Automotive Logistics", lots: 2, value: 14200, trust: "Level 4" },
    { city: "Espoo, Finland", hub: "Otaniemi Tech Supply", lots: 1, value: 7440, trust: "Level 3" },
    { city: "Stuttgart, Germany", hub: "Stuttgart West Hub", lots: 1, value: 3888, trust: "Level 3" },
  ]

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Realized ROI vs Potential Banner */}
      <div>
        <h3 className="text-base font-bold text-foreground">Procurement Value & Liquidity Metrics</h3>
        <p className="text-xs text-muted-foreground">
          Clear distinction between confirmed transaction savings and potential excess inventory matches.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
            <span className="font-semibold">Confirmed Locked Savings</span>
            <Lock className="h-3.5 w-3.5" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 tabular-nums">
            ${confirmedSavings.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Realized across executed escrow lots</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold">Potential Opportunity Savings</span>
            <TrendingDown className="h-3.5 w-3.5 text-primary" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-foreground tabular-nums">
            ${potentialSavings.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Across {opportunities.length} open opportunities</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold">Total Baseline BOM Budget</span>
            <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-foreground tabular-nums">
            ${totalBOMBudget.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Based on spot franchised distribution</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold">Excess Pool Liquidity</span>
            <Boxes className="h-3.5 w-3.5 text-blue-500" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
            ${inventoryLots.reduce((acc, l) => acc + l.quantity * l.unitPrice, 0).toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">In active verified European EMS lots</p>
        </div>
      </div>

      {/* Sourcing Conversion Funnel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-7 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h4 className="text-sm font-bold text-foreground">BOM Demand × Excess Sourcing Funnel</h4>
              <p className="text-[11px] text-muted-foreground">
                Conversion lifecycle from raw BOM import to closed transaction
              </p>
            </div>
            <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold">18 Total Lines</span>
          </div>

          <div className="mt-5 space-y-4">
            {funnelSteps.map((step, i) => (
              <div key={i} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-medium">
                  <span className="text-foreground">{step.label}</span>
                  <span className="font-mono tabular-nums font-bold">
                    {step.value} <span className="text-[10px] font-normal text-muted-foreground">({step.pct}%)</span>
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className={`h-full ${step.color} rounded-full transition-all`} style={{ width: `${step.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Hubs */}
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h4 className="text-sm font-bold text-foreground">European EMS Supply Network</h4>
              <p className="text-[11px] text-muted-foreground">Verified warehouse locations & stock value</p>
            </div>
            <Globe2 className="h-4 w-4 text-emerald-600" />
          </div>

          <div className="mt-4 divide-y divide-border text-xs">
            {emsHubs.map((hub, i) => (
              <div key={i} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{hub.city}</p>
                  <p className="text-[10px] text-muted-foreground">{hub.hub}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    ${hub.value.toLocaleString()}
                  </p>
                  <span className="rounded bg-secondary px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                    {hub.trust}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
