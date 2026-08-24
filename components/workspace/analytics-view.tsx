"use client"

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis } from "recharts"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { channelMixData, kpis, leadTimeData, savingsTrendData } from "@/lib/mock-data"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

const channelColors = ["#6366f1", "#10b981", "#0ea5e9", "#f59e0b", "#a1a1aa"]

const channelConfig: ChartConfig = {
  value: { label: "Share" },
  LCSC: { label: "LCSC", color: channelColors[0] },
  DigiKey: { label: "DigiKey", color: channelColors[1] },
  Mouser: { label: "Mouser", color: channelColors[2] },
  "EU Deadstock": { label: "EU Deadstock", color: channelColors[3] },
  Other: { label: "Other", color: channelColors[4] },
}

const leadTimeConfig: ChartConfig = {
  lcsc: { label: "LCSC", color: "#6366f1" },
  mouser: { label: "Mouser", color: "#0ea5e9" },
  digikey: { label: "DigiKey", color: "#10b981" },
}

const savingsConfig: ChartConfig = {
  baseline: { label: "Baseline cost", color: "#a1a1aa" },
  optimized: { label: "Optimized cost", color: "#6366f1" },
}

export function AnalyticsView() {
  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{kpi.label}</p>
            <p className="mt-1.5 text-xl font-semibold tracking-tight tabular-nums">{kpi.value}</p>
            <p
              className={cn(
                "mt-1 flex items-center gap-1 text-[11px] font-medium",
                kpi.positive ? "text-emerald-600" : "text-rose-600",
              )}
            >
              {kpi.positive ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
              {kpi.delta}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <h3 className="text-sm font-medium">Channel mix</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Share of sourced spend by channel</p>
          <ChartContainer config={channelConfig} className="mx-auto mt-4 aspect-square max-h-[240px]">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie data={channelMixData} dataKey="value" nameKey="channel" innerRadius={58} outerRadius={92} strokeWidth={3}>
                {channelMixData.map((entry, index) => (
                  <Cell key={entry.channel} fill={channelColors[index % channelColors.length]} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="channel" />} />
            </PieChart>
          </ChartContainer>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-3">
          <h3 className="text-sm font-medium">Lead-time breakdown by category</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Average days-to-ship across sourcing channels</p>
          <ChartContainer config={leadTimeConfig} className="mt-4 h-[240px] w-full">
            <BarChart data={leadTimeData} barGap={4}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="category"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={11}
                interval={0}
                angle={-12}
                textAnchor="end"
                height={44}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="lcsc" fill="var(--color-lcsc)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="mouser" fill="var(--color-mouser)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="digikey" fill="var(--color-digikey)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-card p-5">
        <h3 className="text-sm font-medium">Sourcing savings over time</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Baseline catalog cost vs. ChipFlow-optimized cost across the project lifecycle
        </p>
        <ChartContainer config={savingsConfig} className="mt-4 h-[260px] w-full">
          <AreaChart data={savingsTrendData}>
            <defs>
              <linearGradient id="fillOptimized" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-optimized)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-optimized)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="fillBaseline" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-baseline)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--color-baseline)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              type="monotone"
              dataKey="baseline"
              stroke="var(--color-baseline)"
              fill="url(#fillBaseline)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="optimized"
              stroke="var(--color-optimized)"
              fill="url(#fillOptimized)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  )
}
