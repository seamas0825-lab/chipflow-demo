import Link from "next/link"
import { ArrowRight, Boxes, FileStack, Globe2, MessageSquareText, Radar, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LandingBoardPreview } from "@/components/landing/board-preview"

const features = [
  {
    icon: FileStack,
    title: "Universal BOM ingestion",
    description:
      "Drop Excel, PDF quotations, or a screenshot of a supplier drawing. ChipFlow OCRs and structures every line automatically.",
  },
  {
    icon: Radar,
    title: "Cross-border arbitrage",
    description:
      "Surface European deadstock lots and verified alternates the moment a part goes on allocation — with traceability built in.",
  },
  {
    icon: MessageSquareText,
    title: "Persistent AI copilot",
    description:
      "Ask for parametric diffs, trilingual supplier outreach, or an export-control read — right beside your BOM, always in context.",
  },
  {
    icon: ShieldCheck,
    title: "Export-control aware",
    description: "Every line is scored for EAR99/ITAR exposure, with vector alternatives suggested automatically.",
  },
]

const stats = [
  { label: "Avg. cost reduction", value: "18.3%" },
  { label: "Sourcing channels monitored", value: "40+" },
  { label: "Languages for outreach", value: "SV · EN · ZH" },
  { label: "Median line resolution", value: "4 min" },
]

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Boxes className="h-4.5 w-4.5" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">ChipFlow</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#platform" className="transition-colors hover:text-foreground">
              Platform
            </a>
            <a href="#workflow" className="transition-colors hover:text-foreground">
              Workflow
            </a>
            <a href="#trust" className="transition-colors hover:text-foreground">
              Trust &amp; Compliance
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
              <Link href="/workspace">Sign in</Link>
            </Button>
            <Button size="sm" className="rounded-full px-4" asChild>
              <Link href="/workspace">
                Open workspace
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.4] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-8 md:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="outline"
              className="mx-auto mb-6 gap-1.5 rounded-full border-accent bg-accent/60 px-3 py-1 text-accent-foreground"
            >
              <Globe2 className="h-3.5 w-3.5" />
              Built for cross-border component sourcing
            </Badge>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
              Procurement intelligence for every BOM line, in every market.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
              ChipFlow reads your BOM in any format, negotiates across LCSC, Mouser, DigiKey and European deadstock
              channels, and hands your team an optimized, export-control-checked sourcing plan.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" className="rounded-full px-6" asChild>
                <Link href="/workspace">
                  Open the workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-6 bg-transparent" asChild>
                <Link href="/workspace">See a live BOM</Link>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto mt-16 max-w-5xl">
            <LandingBoardPreview />
          </div>
        </div>
      </section>

      <section className="border-t border-border/70 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center md:text-left">
                <p className="font-mono text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground md:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="platform" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            One workspace, from raw quotation to purchase order.
          </h2>
          <p className="mt-4 text-balance leading-relaxed text-muted-foreground">
            ChipFlow combines document intelligence, live channel monitoring, and a conversational copilot so your
            sourcing team spends time deciding — not transcribing.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-transform duration-300 group-hover:scale-105">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold tracking-tight">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="trust" className="border-t border-border/70">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="flex flex-col items-center justify-between gap-8 rounded-2xl border border-border bg-card p-8 md:flex-row md:p-12">
            <div className="max-w-lg text-center md:text-left">
              <h3 className="text-2xl font-semibold tracking-tight">Ready to see your BOM optimized?</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Drop in a BOM and watch ChipFlow's copilot and browser agents work the channels in real time.
              </p>
            </div>
            <Button size="lg" className="rounded-full px-6" asChild>
              <Link href="/workspace">
                Open the workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <Boxes className="h-3.5 w-3.5" />
            <span>ChipFlow © {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-5">
            <span>Stockholm · Shenzhen · Chicago</span>
            <span>EAR99 / ITAR aware sourcing</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
