"use client"

import {
  BarChart3,
  Boxes,
  Mail,
  MessageSquareText,
  Radar,
  Search,
  Sparkles,
  Table2,
  UploadCloud,
} from "lucide-react"
import { useWorkspace, type ViewMode } from "@/lib/workspace-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const viewItems: Array<{ id: ViewMode; label: string; icon: any }> = [
  { id: "opportunities", label: "Sourcing Matches", icon: Sparkles },
  { id: "grid", label: "BOM DataGrid", icon: Table2 },
  { id: "inventory", label: "Excess Stock", icon: Boxes },
  { id: "rfqs", label: "RFQs", icon: Mail },
  { id: "analytics", label: "ROI Metrics", icon: BarChart3 },
]

export function WorkspaceTopBar() {
  const {
    view,
    setView,
    agentFeedOpen,
    setAgentFeedOpen,
    copilotOpen,
    setCopilotOpen,
    setDropzoneOpen,
  } = useWorkspace()

  return (
    <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur-sm md:px-6">
      {/* View Switcher pills */}
      <div className="flex items-center gap-1 rounded-xl bg-secondary p-1">
        {viewItems.map((item) => {
          const active = view === item.id
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition-all",
                active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          )
        })}
      </div>

      {/* Global Sourcing Search */}
      <div className="relative ml-2 hidden max-w-xs flex-1 md:block">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Global search MPN, Lot, MFR..."
          className="h-8 rounded-lg pl-8 text-xs"
        />
      </div>

      {/* Right Tools: Ingest BOM, Agent Feed, Grounded Copilot */}
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="hidden gap-1.5 rounded-lg text-xs bg-transparent sm:inline-flex"
          onClick={() => setDropzoneOpen(true)}
        >
          <UploadCloud className="h-3.5 w-3.5" />
          Ingest BOM
        </Button>

        <Button
          variant={agentFeedOpen ? "secondary" : "outline"}
          size="sm"
          className={cn("gap-1.5 rounded-lg text-xs", !agentFeedOpen && "bg-transparent")}
          onClick={() => setAgentFeedOpen(!agentFeedOpen)}
        >
          <Radar className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Agent Feed</span>
        </Button>

        <Button
          variant={copilotOpen ? "secondary" : "default"}
          size="sm"
          className="gap-1.5 rounded-lg text-xs"
          onClick={() => setCopilotOpen(!copilotOpen)}
        >
          <MessageSquareText className="h-3.5 w-3.5" />
          Sourcing Copilot
        </Button>
      </div>
    </div>
  )
}
