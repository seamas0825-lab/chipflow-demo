"use client"

import { useEffect, useRef, useState } from "react"
import {
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  ChevronRight,
  Copy,
  Database,
  FileCheck,
  Languages,
  Loader2,
  Mail,
  MessageSquareText,
  Package,
  Send,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from "lucide-react"
import { useWorkspace } from "@/lib/workspace-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface StructuredMessage {
  id: string
  role: "user" | "assistant"
  text: string
  time: string
  intent?: string
  toolsCalled?: string[]
  sourcesChecked?: string[]
  evidencePoints?: string[]
  recommendedActions?: Array<{ label: string; action: () => void }>
  emailTemplate?: {
    lang: "sv" | "en" | "zh"
    subject: string
    body: string
  }
}

const initialMessages: StructuredMessage[] = [
  {
    id: "M1",
    role: "assistant",
    time: "07:30",
    text: "ChipFlow Sourcing Copilot initialized. Grounded in European EMS verified excess lots, real-time franchised distributor data, and official manufacturer compliance databases.",
    intent: "Session Initialization",
    toolsCalled: ["db.inventoryLots.scan()", "api.distributorPrice.compare()", "compliance.eccn.verify()"],
    sourcesChecked: [
      "NordicEMS Gothenburg Lot A29177",
      "Bavaria Logistics Hub Lot M77812",
      "DigiKey / Mouser API Feeds",
      "STMicroelectronics Official Compliance Record",
    ],
    evidencePoints: [
      "15 of 18 BOM lines successfully matched with verified excess stock.",
      "Total identified project savings: $34,200.00 (avg 34% cost reduction).",
      "Active Escrow reservation locked: $1,224.00 for TPS62130RGTR in Munich.",
    ],
    recommendedActions: [],
  },
]

export function CopilotDrawer() {
  const {
    copilotOpen,
    setCopilotOpen,
    copilotSeedPrompt,
    clearCopilotSeed,
    sendRfq,
    reserveLot,
    opportunities,
    inventoryLots,
  } = useWorkspace()

  const [messages, setMessages] = useState<StructuredMessage[]>(initialMessages)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (copilotSeedPrompt && copilotOpen) {
      handleUserQuery(copilotSeedPrompt)
      clearCopilotSeed()
    }
  }, [copilotSeedPrompt, copilotOpen])

  const handleUserQuery = (queryText: string) => {
    const userMsg: StructuredMessage = {
      id: `U-${Date.now()}`,
      role: "user",
      text: queryText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    // Simulate structured tool execution and evidence generation
    setTimeout(() => {
      let assistantMsg: StructuredMessage

      if (queryText.toLowerCase().includes("stm32") || queryText.includes("U1")) {
        const opp = opportunities.find((o) => o.demandMpn.includes("STM32"))
        assistantMsg = {
          id: `A-${Date.now()}`,
          role: "assistant",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: "Here is the verified sourcing audit and evidence for STM32F103C8T6:",
          intent: "Part Sourcing & Excess Verification Audit",
          toolsCalled: [
            "inventory_lot.lookup('LOT-SE-9912')",
            "distributor_median.calculate('STM32F103C8T6')",
            "traceability.audit_coc('NordicEMS')",
          ],
          sourcesChecked: [
            "NordicEMS Gothenburg Hub (Lot A29177)",
            "STMicroelectronics Product Lifecycle Notice",
            "Mouser ($2.41) & DigiKey ($2.38) spot price feeds",
          ],
          evidencePoints: [
            "Exact MPN Match (LQFP-48, 64KB Flash, 100% pin parity).",
            "Quantity Sufficient: Demand 2,400 pcs vs Available 8,400 pcs in Sweden.",
            "Offered Unit Price: $1.26 vs Market Median $2.39 (34% savings below target).",
            "Full Factory CoC & Original Invoices verified in Trust Vault.",
            "Date Code: 2224 (< 36 months, factory sealed dry-pack).",
            "Transit time: 3-4 business days via DHL Express EU Hub.",
          ],
          recommendedActions: [
            {
              label: "Send RFQ to Gothenburg EMS ($1.26/pc)",
              action: () => {
                if (opp) sendRfq(opp.id)
              },
            },
            {
              label: "Lock Lot in Escrow ($1,584 Savings)",
              action: () => {
                if (opp) reserveLot(opp.id, opp.matchedLot.id)
              },
            },
          ],
        }
      } else if (queryText.toLowerCase().includes("email") || queryText.includes("邮件") || queryText.includes("瑞典")) {
        assistantMsg = {
          id: `A-${Date.now()}`,
          role: "assistant",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: "Generated verified trilingual supplier outreach draft for Swedish EMS procurement:",
          intent: "Supplier Negotiation & RFQ Synthesis",
          toolsCalled: ["translator.sourcing_spec.generate('sv')", "rfq.format_terms()"],
          sourcesChecked: ["Nordic Procurement Standard Protocol", "EAR99 Compliance Terms"],
          emailTemplate: {
            lang: "sv",
            subject: "Förfrågan om överskottslager (RFQ) — STM32F103C8T6 (Lot A29177)",
            body: `Hej NordicEMS Sourcing Team,\n\nVi önskar reservera 2 400 st STM32F103C8T6 från ert verifierade parti LOT-2024-A29177 till målpriset $1.26/st.\n\nVänligen bekräfta fabriksförseglat skick (CoC) och beräknad leveranstid till vårt europeiska logistiknav.\n\nVänliga hälsningar,\nEliot / ChipFlow Global Procurement`,
          },
          recommendedActions: [
            {
              label: "Dispatch Email via Connected Swedish Desk",
              action: () => alert("Email dispatched to Swedish EMS desk."),
            },
          ],
        }
      } else {
        assistantMsg = {
          id: `A-${Date.now()}`,
          role: "assistant",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: `Analysis complete for: "${queryText}". Checked database across ${inventoryLots.length} verified EMS lots and live distributor API connections.`,
          intent: "General Sourcing Query",
          toolsCalled: ["crossborder_matcher.query()", "risk_engine.score()"],
          sourcesChecked: ["Nordic EMS Network", "DACH Automotive EMS Hub", "Texas Instruments Export DB"],
          evidencePoints: [
            "All pricing data cross-checked against DigiKey, Mouser, and LCSC.",
            "Excess lots require minimum Trust Level 2 for automatic recommendation.",
            "Export control compliance flagged automatically on dual-use ECCNs.",
          ],
          recommendedActions: [
            {
              label: "View All Active Opportunities",
              action: () => {},
            },
          ],
        }
      }

      setMessages((prev) => [...prev, assistantMsg])
      setLoading(false)
    }, 700)
  }

  return (
    <Sheet open={copilotOpen} onOpenChange={setCopilotOpen}>
      <SheetContent side="right" className="w-full gap-0 overflow-hidden p-0 sm:max-w-xl flex flex-col">
        {/* Header */}
        <SheetHeader className="border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <SheetTitle className="text-sm font-bold tracking-tight">ChipFlow Sourcing Copilot</SheetTitle>
                <p className="text-[11px] text-muted-foreground">
                  Grounded Procurement Agent · Tool Calling & Evidence Based
                </p>
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Message Thread */}
        <div className="flex-1 space-y-4 overflow-y-auto p-6 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex flex-col space-y-2 rounded-2xl p-4 leading-relaxed",
                msg.role === "user"
                  ? "ml-8 bg-primary text-primary-foreground"
                  : "mr-4 border border-border bg-card shadow-sm text-foreground"
              )}
            >
              <div className="flex items-center justify-between text-[10px] opacity-70">
                <span className="font-bold">{msg.role === "user" ? "Buyer (You)" : "ChipFlow Copilot"}</span>
                <span>{msg.time}</span>
              </div>

              <p className="text-xs font-medium">{msg.text}</p>

              {/* Tools & Sources metadata */}
              {msg.toolsCalled && msg.toolsCalled.length > 0 && (
                <div className="rounded-xl border border-border/80 bg-secondary/40 p-2.5 space-y-1 text-[11px]">
                  <div className="flex items-center gap-1 font-semibold text-muted-foreground">
                    <Database className="h-3 w-3 text-primary" />
                    <span>Tools Executed:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {msg.toolsCalled.map((t, i) => (
                      <span key={i} className="rounded bg-card px-1.5 py-0.5 font-mono text-[10px] border">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Evidence Points */}
              {msg.evidencePoints && msg.evidencePoints.length > 0 && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 dark:border-emerald-900/60 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-200">
                  <div className="flex items-center gap-1 font-semibold text-emerald-800 dark:text-emerald-300">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Verified Sourcing Evidence:</span>
                  </div>
                  <ul className="mt-1.5 space-y-1 text-[11px]">
                    {msg.evidencePoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Email Template Card */}
              {msg.emailTemplate && (
                <div className="rounded-xl border border-border bg-secondary/50 p-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="flex items-center gap-1">
                      <Languages className="h-3 w-3 text-primary" />
                      Svenska (Swedish) Outreach Draft
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-[10px]"
                      onClick={() => navigator.clipboard.writeText(msg.emailTemplate?.body || "")}
                    >
                      <Copy className="mr-1 h-2.5 w-2.5" /> Copy
                    </Button>
                  </div>
                  <p className="font-semibold text-foreground text-[11px]">Subject: {msg.emailTemplate.subject}</p>
                  <pre className="whitespace-pre-wrap font-sans text-[11px] text-muted-foreground leading-normal">
                    {msg.emailTemplate.body}
                  </pre>
                </div>
              )}

              {/* Recommended Actions Buttons */}
              {msg.recommendedActions && msg.recommendedActions.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-border/60">
                  {msg.recommendedActions.map((action, i) => (
                    <Button
                      key={i}
                      size="sm"
                      className="h-7 gap-1 rounded-lg text-[11px] bg-primary text-primary-foreground"
                      onClick={action.action}
                    >
                      <ArrowRight className="h-3 w-3" />
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground p-3">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>Querying verified EMS inventory and running compliance lookup...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Query Input */}
        <div className="border-t border-border p-4 bg-card">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (input.trim()) handleUserQuery(input.trim())
            }}
            className="flex items-center gap-2"
          >
            <Input
              placeholder="Ask about part audit, Swedish EMS lot, CoC, or RFQ..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="h-10 text-xs rounded-xl"
            />
            <Button size="sm" type="submit" disabled={!input.trim() || loading} className="rounded-xl h-10 px-4">
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <button
              onClick={() => handleUserQuery("Why is STM32F103C8T6 matched with Gothenburg EMS lot?")}
              className="rounded-md border border-border bg-secondary/40 px-2 py-1 text-[10px] text-muted-foreground hover:text-foreground"
            >
              Why STM32 match?
            </button>
            <button
              onClick={() => handleUserQuery("Generate Swedish supplier RFQ email for Lot A29177")}
              className="rounded-md border border-border bg-secondary/40 px-2 py-1 text-[10px] text-muted-foreground hover:text-foreground"
            >
              Swedish RFQ Email
            </button>
            <button
              onClick={() => handleUserQuery("Check EAR99 and 5A992 compliance conflicts for this BOM")}
              className="rounded-md border border-border bg-secondary/40 px-2 py-1 text-[10px] text-muted-foreground hover:text-foreground"
            >
              Compliance Audit
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
