"use client"

import Link from "next/link"
import {
  BarChart3,
  Boxes,
  ChevronDown,
  KanbanSquare,
  Plus,
  Settings,
  Table2,
  UploadCloud,
} from "lucide-react"
import { useWorkspace } from "@/lib/workspace-context"
import { project } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const viewItems = [
  { id: "board" as const, label: "AI Board", icon: KanbanSquare },
  { id: "grid" as const, label: "Pro DataGrid", icon: Table2 },
  { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
]

const otherProjects = [
  { name: "Halo Sensor Puck v2", lines: 9, status: "Quoting" },
  { name: "Nordic Cold-Chain Tracker", lines: 27, status: "Draft" },
]

export function WorkspaceSidebar() {
  const { view, setView, setDropzoneOpen } = useWorkspace()

  return (
    <aside className="hidden h-full w-[240px] flex-col border-r border-border bg-sidebar md:flex">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Boxes className="h-4 w-4" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight">ChipFlow</span>
        </Link>
      </div>

      <div className="px-3">
        <Button
          onClick={() => setDropzoneOpen(true)}
          className="w-full justify-start gap-2 rounded-xl"
          variant="default"
        >
          <UploadCloud className="h-4 w-4" />
          Ingest new BOM
        </Button>
      </div>

      <div className="mt-6 px-3">
        <button className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-sidebar-accent">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-sidebar-foreground">{project.name}</p>
            <p className="text-xs text-muted-foreground">{project.code}</p>
          </div>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        </button>
      </div>

      <nav className="mt-2 flex-1 space-y-0.5 px-3">
        {viewItems.map((item) => {
          const active = view === item.id
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="px-3 pb-2">
        <div className="mb-2 flex items-center justify-between px-2">
          <span className="text-xs font-medium text-muted-foreground">Other projects</span>
          <button className="text-muted-foreground hover:text-foreground">
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="space-y-0.5">
          {otherProjects.map((p) => (
            <button
              key={p.name}
              className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
            >
              <span className="truncate">{p.name}</span>
              <span className="shrink-0 rounded-full bg-secondary px-1.5 py-0.5 text-[10px]">{p.lines}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-sidebar-border px-3 py-3">
        <button className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground">
          <Settings className="h-4 w-4" />
          Settings
        </button>
        <div className="mt-2 flex items-center gap-2.5 px-2.5 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground">
            AK
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-sidebar-foreground">Anna Karlsson</p>
            <p className="truncate text-[11px] text-muted-foreground">Sourcing Lead</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
