import Link from "next/link"
import {
  ArrowRight,
  Boxes,
  Building2,
  CheckCircle2,
  FileCheck,
  FileSpreadsheet,
  Globe2,
  Lock,
  MessageSquareText,
  Plus,
  Radar,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  UploadCloud,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LandingBoardPreview } from "@/components/landing/board-preview"

const valuePillars = [
  {
    icon: Boxes,
    title: "BOM Demand × Private Excess Matching",
    description:
      "Directly match your project BOM lines against verified private excess lots from EMS factories across Sweden, Germany, and Finland.",
  },
  {
    icon: Sparkles,
    title: "3-Level Supply Match Engine",
    description:
      "Level 1 Exact Match, Level 2 Manufacturer Equivalent, and Level 3 Suggested Alternatives with rigorous parametric review flags.",
  },
  {
    icon: ShieldCheck,
    title: "5-Tier Inventory Trust Layer",
    description:
      "Every lot is verified for Original CoC, Date Code, factory packaging photos, and third-party inspection reports with anonymous EMS protection.",
  },
  {
    icon: MessageSquareText,
    title: "Grounded Procurement Copilot",
    description:
      "Not generic AI chat: queries verified inventory databases, calculates real cost deltas, and dispatches structured RFQs with trilingual outreach.",
  },
]

const stats = [
  { label: "Confirmed Locked Savings", value: "$8,420" },
  { label: "Potential Project Savings", value: "$34,200" },
  { label: "Avg. RFQ Turnaround", value: "4.2 hrs" },
  { label: "Matched Excess Coverage", value: "83.3%" },
]

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Boxes className="h-4.5 w-4.5" />
            </div>
            <span className="text-[15px] font-bold tracking-tight">ChipFlow</span>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#platform" className="transition-colors hover:text-foreground">
              Match Engine
            </a>
            <a href="#trust" className="transition-colors hover:text-foreground">
              Trust Layer
            </a>
            <a href="#network" className="transition-colors hover:text-foreground">
              EMS Network
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex rounded-xl bg-transparent">
              <Link href="/workspace">Seller Portal</Link>
            </Button>
            <Button asChild size="sm" className="rounded-xl gap-1.5 shadow-sm">
              <Link href="/workspace">
                Open Workspace
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/50 px-3.5 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Turn excess inventory into matched demand · 让闲置库存自动找到正在采购它的人</span>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl sm:leading-[1.1]">
            Find hidden inventory <br className="hidden sm:inline" />
            for your BOM.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground leading-relaxed md:text-lg">
            Upload your BOM and ChipFlow matches shortages and high-cost parts with verified excess inventory from EMS
            suppliers across Europe.
          </p>

          {/* Dual CTAs for Buyer & Seller */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Button asChild size="lg" className="rounded-2xl gap-2 px-6 shadow-md">
              <Link href="/workspace">
                <UploadCloud className="h-4 w-4" />
                Upload BOM (Buyer)
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-2xl gap-2 px-6 bg-card">
              <Link href="/workspace">
                <Plus className="h-4 w-4 text-emerald-600" />
                List Excess Inventory (Seller)
              </Link>
            </Button>
          </div>

          {/* Interactive Preview Card */}
          <div className="mt-14 text-left">
            <LandingBoardPreview />
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="border-y border-border/80 bg-secondary/30 py-10 px-6">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s, idx) => (
            <div key={idx} className="text-center">
              <p className="font-mono text-2xl font-extrabold tracking-tight text-foreground md:text-3xl tabular-nums">
                {s.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Value Pillars */}
      <section id="platform" className="py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Engineered for verified transactions, not generic AI chat.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Built specifically around lot traceability, factory CoC verification, and cross-border EMS liquidity.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {valuePillars.map((p, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-bold text-foreground">{p.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Layer Section */}
      <section id="trust" className="border-t border-border bg-secondary/20 py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-8 dark:border-emerald-900/60 dark:bg-emerald-950/20 md:p-12">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>ChipFlow Inventory Trust Layer</span>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">
              Where can you buy reliable, verified excess parts at scale?
            </h2>
            <p className="mt-3 max-w-2xl text-xs text-muted-foreground leading-relaxed sm:text-sm">
              In cross-border component procurement, authenticity is everything. ChipFlow enforces 5-tier verification
              including Original Factory CoC, Date Code inspection, supplier audit history, and escrow protection.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
              <div className="rounded-2xl border border-border/80 bg-card p-4">
                <p className="font-bold text-foreground">1. Factory Sealed & CoC</p>
                <p className="mt-1 text-muted-foreground text-[11px]">
                  Original manufacturer certificates & high-res dry-pack packaging photos verified.
                </p>
              </div>
              <div className="rounded-2xl border border-border/80 bg-card p-4">
                <p className="font-bold text-foreground">2. Anonymous Protection</p>
                <p className="mt-1 text-muted-foreground text-[11px]">
                  EMS sellers list excess anonymously by region (e.g. Gothenburg, Sweden) until formal escrow.
                </p>
              </div>
              <div className="rounded-2xl border border-border/80 bg-card p-4">
                <p className="font-bold text-foreground">3. Escrow Transaction Lock</p>
                <p className="mt-1 text-muted-foreground text-[11px]">
                  Funds released only after physical inspection and incoming quality control (IQC) clearance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="border-t border-border py-12 px-6 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">
            Ready to find verified excess supply for your BOM?
          </h2>
          <p className="mt-2 text-xs text-muted-foreground">
            Ingest your Excel or CSV BOM and discover matched European EMS lots in seconds.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild size="default" className="rounded-xl gap-2">
              <Link href="/workspace">
                <UploadCloud className="h-4 w-4" />
                Launch ChipFlow Workspace
              </Link>
            </Button>
          </div>
          <p className="mt-8 text-[11px] text-muted-foreground">
            ChipFlow © 2026 · Gothenburg · Stockholm · Munich · Shenzhen · EAR99 Verified Liquidity Network
          </p>
        </div>
      </footer>
    </main>
  )
}
