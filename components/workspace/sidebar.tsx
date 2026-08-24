"use client"

import Link from "next/link"
import {
  BarChart3,
  Boxes,
  ChevronDown,
  Layers,
  Mail,
  Plus,
  Settings,
  Sparkles,
  Table2,
  UploadCloud,
} from "lucide-react"
import { useWorkspace, type ViewMode } from "@/lib/workspace-context"
import { project } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems: Array<{ id: ViewMode; label: string; icon: any; count?: number }> = [
  { id: "opportunities", label: "Sourcing Matches", icon: Sparkles },
  { id: "grid", label: "BOM DataGrid", icon: Table2 },
  { id: "inventory", label: "Excess Inventory", icon: Boxes },
  { id: "rfqs", label: "RFQs & Deals", icon: Mail },
  { id: "analytics", label: "Procurement ROI", icon: BarChart3 },
]

const otherProjects = [
  { name: "Automotive ECU — Rev B", lines: 14, status: "Quoting" },
  { name: "Nordic Cold-Chain Gateway", lines: 27, status: "Active" },
]

export function WorkspaceSidebar() {
  const { view, setView, setDropzoneOpen, setListExcessOpen, opportunities, rfqs } = useWorkspace()

  return (
    <aside className="hidden h-full w-[240px] flex-col border-r border-border bg-sidebar md:flex">
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 px-5 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Boxes className="h-4 w-4" />
          </div>
          <span className="text-[15px] font-bold tracking-tight">ChipFlow</span>
        </Link>
      </div>

      {/* Action Buttons */}
      <div className="space-y-1.5 px-3">
        <Button
          onClick={() => setDropzoneOpen(true)}
          className="w-full justify-start gap-2 rounded-xl text-xs h-9"
          variant="default"
        >
          <UploadCloud className="h-3.5 w-3.5" />
          Ingest BOM (Buyer)
        </Button>
        <Button
          onClick={() => setListExcessOpen(true)}
          className="w-full justify-start gap-2 rounded-xl text-xs h-9 bg-secondary/80 text-foreground hover:bg-secondary"
          variant="outline"
        >
          <Plus className="h-3.5 w-3.5 text-emerald-600" />
          List Excess (Seller)
        </Button>
      </div>

      {/* Active Project Selector */}
      <div className="mt-4 px-3">
        <button className="flex w-full items-center justify-between rounded-xl border border-border/60 bg-sidebar-accent/40 px-3 py-2 text-left transition-colors hover:bg-sidebar-accent">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-sidebar-foreground">{project.name}</p>
            <p className="text-[10px] text-muted-foreground">{project.code} · 18 Lines</p>
          </div>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="mt-4 flex-1 space-y-0.5 px-3">
        {navItems.map((item) => {
          const active = view === item.id
          let badgeCount: number | undefined
          if (item.id === "opportunities") badgeCount = opportunities.length
          if (item.id === "rfqs") badgeCount = rfqs.length

          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors",
                active
                  ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              )}
            >
              <div className="flex items-center gap-2.5">
                <item.icon className="h-4 w-4" />
                {item.label}
              </div>
              {badgeCount !== undefined && badgeCount > 0 && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.2 text-[10px] font-mono",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  {badgeCount}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Other Projects */}
      <div className="px-3 pb-4">
        <div className="mb-2 flex items-center justify-between px-2">
          <span className="text-[11px] font-medium text-muted-foreground">Other Sourcing Projects</span>
          <button className="text-muted-foreground hover:text-foreground">
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="space-y-1">
          {otherProjects.map((p) => (
            <button
              key={p.name}
              className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[11px] text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
            >
              <span className="truncate">{p.name}</span>
              <span className="shrink-0 rounded-full bg-secondary px-1.5 py-0.2 text-[9px]">{p.lines}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
