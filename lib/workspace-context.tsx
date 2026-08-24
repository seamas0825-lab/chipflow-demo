"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import { bomLines as seedLines, type BomLine } from "@/lib/mock-data"

export type ViewMode = "board" | "grid" | "analytics"

interface WorkspaceContextValue {
  lines: BomLine[]
  view: ViewMode
  setView: (view: ViewMode) => void
  selectedLineId: string | null
  setSelectedLineId: (id: string | null) => void
  selectedLine: BomLine | null
  copilotOpen: boolean
  setCopilotOpen: (open: boolean) => void
  agentFeedOpen: boolean
  setAgentFeedOpen: (open: boolean) => void
  dropzoneOpen: boolean
  setDropzoneOpen: (open: boolean) => void
  copilotSeedPrompt: string | null
  askCopilot: (prompt: string) => void
  clearCopilotSeed: () => void
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [lines] = useState<BomLine[]>(seedLines)
  const [view, setView] = useState<ViewMode>("board")
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null)
  const [copilotOpen, setCopilotOpen] = useState(false)
  const [agentFeedOpen, setAgentFeedOpen] = useState(true)
  const [dropzoneOpen, setDropzoneOpen] = useState(false)
  const [copilotSeedPrompt, setCopilotSeedPrompt] = useState<string | null>(null)

  const selectedLine = useMemo(() => lines.find((l) => l.id === selectedLineId) ?? null, [lines, selectedLineId])

  const askCopilot = (prompt: string) => {
    setCopilotSeedPrompt(prompt)
    setCopilotOpen(true)
  }

  const value: WorkspaceContextValue = {
    lines,
    view,
    setView,
    selectedLineId,
    setSelectedLineId,
    selectedLine,
    copilotOpen,
    setCopilotOpen,
    agentFeedOpen,
    setAgentFeedOpen,
    dropzoneOpen,
    setDropzoneOpen,
    copilotSeedPrompt,
    askCopilot,
    clearCopilotSeed: () => setCopilotSeedPrompt(null),
  }

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider")
  return ctx
}
