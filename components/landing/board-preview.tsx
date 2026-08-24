import { ArrowDownRight, Boxes, CircleDot, Globe2, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const previewCards = [
  {
    column: "Deadstock Arbitrage",
    mpn: "STM32F103C8T6",
    manufacturer: "STMicroelectronics",
    price: "$1.26",
    delta: "-34%",
    tag: "EU · SE",
  },
  {
    column: "Vector Alternative",
    mpn: "SP3232EEY-L/TR",
    manufacturer: "MaxLinear",
    price: "$1.53",
    delta: "EAR99",
    tag: "94% match",
  },
  {
    column: "Ready to Quote",
    mpn: "USB4105-GF-A",
    manufacturer: "GCT",
    price: "$0.54",
    delta: "-18%",
    tag: "LCSC",
  },
]

export function LandingBoardPreview() {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-xl shadow-zinc-950/[0.04] md:p-5">
      <div className="flex items-center justify-between border-b border-border/70 pb-3">
        <div className="flex items-center gap-2">
          <Boxes className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">STM32 IoT Gateway — Rev C</span>
          <Badge variant="secondary" className="rounded-full text-[11px] font-normal">
            18 lines
          </Badge>
        </div>
        <div className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Copilot optimized 3 lines just now
        </div>
      </div>
      <div className="grid gap-3 pt-4 sm:grid-cols-3">
        {previewCards.map((card) => (
          <div key={card.mpn} className="rounded-xl border border-border bg-secondary/40 p-4">
            <div className="mb-3 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
              <CircleDot className="h-3 w-3 text-primary" />
              {card.column}
            </div>
            <p className="font-mono text-sm font-medium tracking-tight text-foreground">{card.mpn}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{card.manufacturer}</p>
            <div className="mt-4 flex items-end justify-between">
              <span className="text-lg font-semibold tracking-tight tabular-nums">{card.price}</span>
              <span className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                <ArrowDownRight className="h-3 w-3" />
                {card.delta}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground">
              <Globe2 className="h-3 w-3" />
              {card.tag}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
