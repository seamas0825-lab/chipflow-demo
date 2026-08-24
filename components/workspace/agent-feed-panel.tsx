"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2, Pause, Play, Radar, Search, ShoppingBag, Sparkles } from "lucide-react"
import { agentMessagePool, seedAgentLog, type AgentLogEntry } from "@/lib/mock-data"
import { useWorkspace } from "@/lib/workspace-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const siteMeta: Record<AgentLogEntry["site"], { label: string; icon: typeof Search; className: string }> = {
  lcsc: { label: "LCSC", icon: Search, className: "bg-indigo-50 text-indigo-600" },
  mouser: { label: "Mouser", icon: ShoppingBag, className: "bg-sky-50 text-sky-600" },
  digikey: { label: "DigiKey", icon: ShoppingBag, className: "bg-emerald-50 text-emerald-600" },
}

function now() {
  return new Date().toLocaleTimeString([], { hour12: false })
}

export function AgentFeedPanel() {
  const { agentFeedOpen } = useWorkspace()
  const [entries, setEntries] = useState<AgentLogEntry[]>(seedAgentLog)
  const [running, setRunning] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const poolIndex = useRef(0)

  useEffect(() => {
    if (!running || !agentFeedOpen) return
    const interval = setInterval(() => {
      const next = agentMessagePool[poolIndex.current % agentMessagePool.length]
      poolIndex.current += 1
      setEntries((prev) => [
        ...prev.slice(-24),
        { id: `a-${Date.now()}`, site: next.site, message: next.message, status: next.status, timestamp: now() },
      ])
    }, 3200)
    return () => clearInterval(interval)
  }, [running, agentFeedOpen])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [entries])

  if (!agentFeedOpen) return null

  return (
    <aside className="hidden h-full w-[300px] shrink-0 flex-col border-l border-border bg-card lg:flex">
      <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span
              className={cn(
                "absolute inline-flex h-full w-full rounded-full bg-emerald-400",
                running && "animate-ping",
              )}
            />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <Radar className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm font-medium">Browser Agent</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-lg"
          onClick={() => setRunning((r) => !r)}
        >
          {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </Button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3">
        <div className="space-y-2.5">
          {entries.map((entry, idx) => {
            const meta = siteMeta[entry.site]
            const isLast = idx === entries.length - 1
            return (
              <div
                key={entry.id}
                className="flex gap-2.5 rounded-xl border border-border/70 bg-secondary/40 p-2.5 animate-in fade-in slide-in-from-bottom-1 duration-300"
              >
                <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-lg", meta.className)}>
                  <meta.icon className="h-3 w-3" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-foreground">{meta.label}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{entry.timestamp}</span>
                  </div>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{entry.message}</p>
                </div>
                {entry.status === "running" && isLast && (
                  <Loader2 className="h-3 w-3 shrink-0 animate-spin text-muted-foreground" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-1.5 border-t border-border px-4 py-3 text-[11px] text-muted-foreground">
        <Sparkles className="h-3 w-3 text-primary" />
        Monitoring 3 channels · {running ? "live" : "paused"}
      </div>
    </aside>
  )
}
