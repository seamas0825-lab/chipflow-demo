"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import {
  bomLines as seedLines,
  inventoryLots as seedLots,
  sourcingOpportunities as seedOpportunities,
  rfqRecords as seedRfqs,
  type BomLine,
  type InventoryLot,
  type SourcingOpportunity,
  type RfqRecord,
} from "@/lib/mock-data"

export type ViewMode = "opportunities" | "grid" | "inventory" | "rfqs" | "analytics"

interface WorkspaceContextValue {
  lines: BomLine[]
  opportunities: SourcingOpportunity[]
  inventoryLots: InventoryLot[]
  rfqs: RfqRecord[]
  view: ViewMode
  setView: (view: ViewMode) => void
  selectedLineId: string | null
  setSelectedLineId: (id: string | null) => void
  selectedLine: BomLine | null
  selectedOpportunityId: string | null
  setSelectedOpportunityId: (id: string | null) => void
  selectedOpportunity: SourcingOpportunity | null
  selectedLotId: string | null
  setSelectedLotId: (id: string | null) => void
  selectedLot: InventoryLot | null
  copilotOpen: boolean
  setCopilotOpen: (open: boolean) => void
  agentFeedOpen: boolean
  setAgentFeedOpen: (open: boolean) => void
  dropzoneOpen: boolean
  setDropzoneOpen: (open: boolean) => void
  listExcessOpen: boolean
  setListExcessOpen: (open: boolean) => void
  copilotSeedPrompt: string | null
  askCopilot: (prompt: string) => void
  clearCopilotSeed: () => void
  sendRfq: (opportunityId: string, customQty?: number, targetPrice?: number, note?: string) => string
  reserveLot: (opportunityId: string, lotId: string) => void
  addInventoryLot: (lot: Omit<InventoryLot, "id" | "listedAt" | "status">) => void
  importBomLines: (newLines: BomLine[], projectName?: string) => void
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<BomLine[]>(seedLines)
  const [opportunities, setOpportunities] = useState<SourcingOpportunity[]>(seedOpportunities)
  const [inventoryLots, setInventoryLots] = useState<InventoryLot[]>(seedLots)
  const [rfqs, setRfqs] = useState<RfqRecord[]>(seedRfqs)
  const [view, setView] = useState<ViewMode>("opportunities")
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null)
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null)
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null)
  const [copilotOpen, setCopilotOpen] = useState(false)
  const [agentFeedOpen, setAgentFeedOpen] = useState(true)
  const [dropzoneOpen, setDropzoneOpen] = useState(false)
  const [listExcessOpen, setListExcessOpen] = useState(false)
  const [copilotSeedPrompt, setCopilotSeedPrompt] = useState<string | null>(null)

  const selectedLine = useMemo(() => lines.find((l) => l.id === selectedLineId) ?? null, [lines, selectedLineId])
  const selectedOpportunity = useMemo(
    () => opportunities.find((o) => o.id === selectedOpportunityId) ?? null,
    [opportunities, selectedOpportunityId]
  )
  const selectedLot = useMemo(
    () => inventoryLots.find((lot) => lot.id === selectedLotId) ?? null,
    [inventoryLots, selectedLotId]
  )

  const askCopilot = (prompt: string) => {
    setCopilotSeedPrompt(prompt)
    setCopilotOpen(true)
  }

  const sendRfq = (opportunityId: string, customQty?: number, targetPrice?: number, note?: string) => {
    const opp = opportunities.find((o) => o.id === opportunityId)
    if (!opp) return ""

    const rfqId = `RFQ-2026-${Math.floor(100 + Math.random() * 900)}`
    const newRfq: RfqRecord = {
      id: rfqId,
      opportunityId: opp.id,
      mpn: opp.demandMpn,
      demandQty: customQty || opp.demandQty,
      offeredLotId: opp.matchedLot.id,
      supplierDisplay: opp.matchedLot.supplierDisplay,
      targetUnitPrice: targetPrice || opp.matchedLot.unitPrice,
      offeredUnitPrice: opp.matchedLot.unitPrice,
      currency: "USD",
      status: "sent",
      sentDate: new Date().toISOString().replace("T", " ").substring(0, 16),
      validUntil: new Date(Date.now() + 3 * 86400000).toISOString().substring(0, 10),
      messages: [
        {
          id: `M-${Date.now()}`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          sender: "buyer",
          senderName: "Eliot (ChipFlow Procurement)",
          text:
            note ||
            `RFQ for ${customQty || opp.demandQty} pcs of ${opp.demandMpn} (Lot ${opp.matchedLot.lotCode}). Please confirm factory CoC and delivery to regional hub.`,
        },
      ],
    }

    setRfqs((prev) => [newRfq, ...prev])
    setOpportunities((prev) =>
      prev.map((o) => (o.id === opportunityId ? { ...o, status: "supplier-contacted" } : o))
    )
    setLines((prev) =>
      prev.map((l) => (l.opportunityId === opportunityId ? { ...l, status: "rfq-pending" } : l))
    )
    return rfqId
  }

  const reserveLot = (opportunityId: string, lotId: string) => {
    setOpportunities((prev) =>
      prev.map((o) =>
        o.id === opportunityId
          ? {
              ...o,
              status: "reserved",
              confirmedSavings: o.potentialSavings,
            }
          : o
      )
    )
    setInventoryLots((prev) =>
      prev.map((lot) => (lot.id === lotId ? { ...lot, status: "reserved" } : lot))
    )
    setLines((prev) =>
      prev.map((l) => (l.opportunityId === opportunityId ? { ...l, status: "reserved" } : l))
    )
  }

  const addInventoryLot = (lot: Omit<InventoryLot, "id" | "listedAt" | "status">) => {
    const newLot: InventoryLot = {
      ...lot,
      id: `LOT-NEW-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "available",
      listedAt: new Date().toISOString().substring(0, 10),
    }
    setInventoryLots((prev) => [newLot, ...prev])
  }

  const importBomLines = (newLines: BomLine[]) => {
    setLines(newLines)
    // generate matching opportunities for new lines if matched
    setView("opportunities")
  }

  const value: WorkspaceContextValue = {
    lines,
    opportunities,
    inventoryLots,
    rfqs,
    view,
    setView,
    selectedLineId,
    setSelectedLineId,
    selectedLine,
    selectedOpportunityId,
    setSelectedOpportunityId,
    selectedOpportunity,
    selectedLotId,
    setSelectedLotId,
    selectedLot,
    copilotOpen,
    setCopilotOpen,
    agentFeedOpen,
    setAgentFeedOpen,
    dropzoneOpen,
    setDropzoneOpen,
    listExcessOpen,
    setListExcessOpen,
    copilotSeedPrompt,
    askCopilot,
    clearCopilotSeed: () => setCopilotSeedPrompt(null),
    sendRfq,
    reserveLot,
    addInventoryLot,
    importBomLines,
  }

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider")
  return ctx
}
