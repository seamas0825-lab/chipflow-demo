"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Copy, CornerDownLeft, Globe2, Send, ShieldCheck, Sparkles } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useWorkspace } from "@/lib/workspace-context"
import { bomLines, quickPrompts, seedChat } from "@/lib/mock-data"
import { ExportControlBadge } from "@/components/workspace/status-badges"
import { cn } from "@/lib/utils"

type RichKind =
  | { type: "text"; content: string }
  | { type: "diff"; mpn: string }
  | { type: "email"; mpn: string }
  | { type: "export"; mpn: string }

interface Message {
  id: string
  role: "user" | "assistant"
  timestamp: string
  rich: RichKind
}

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function findLine(prompt: string) {
  const lower = prompt.toLowerCase()
  const byMpn = bomLines.find((l) => lower.includes(l.mpn.toLowerCase()))
  if (byMpn) return byMpn
  if (lower.includes("u5") || lower.includes("tps62130")) return bomLines.find((l) => l.mpn === "TPS62130RGTR")!
  return bomLines.find((l) => l.alternatives.length > 0) ?? bomLines[0]
}

function classifyPrompt(prompt: string): RichKind {
  const lower = prompt.toLowerCase()
  const line = findLine(prompt)
  if (lower.includes("email") || lower.includes("inquiry") || lower.includes("draft")) {
    return { type: "email", mpn: line.mpn }
  }
  if (lower.includes("export control") || lower.includes("itar") || lower.includes("ear99")) {
    return { type: "export", mpn: line.mpn }
  }
  if (lower.includes("alternative") || lower.includes("compare") || lower.includes("cheaper")) {
    return { type: "diff", mpn: line.mpn }
  }
  return {
    type: "text",
    content:
      "I've cross-referenced that against live channel data. Everything checks out — let me know if you want me to pull parametric comparisons or draft outreach for any specific line.",
  }
}

const emailCopy: Record<string, { subject: string; body: string }> = {
  sv: {
    subject: "Förfrågan om lagerparti — {mpn}",
    body: "Hej,\n\nVi är intresserade av ert deadstock-parti av {mpn} ({qty} st). Kan ni bekräfta tillgängligt antal, ursprungscertifikat och pris vid denna kvantitet?\n\nVänliga hälsningar,\nChipFlow Sourcing Team",
  },
  en: {
    subject: "Inquiry regarding deadstock lot — {mpn}",
    body: "Hello,\n\nWe are interested in your deadstock lot of {mpn} (qty {qty}). Could you confirm available quantity, certificate of origin, and pricing at this volume?\n\nBest regards,\nChipFlow Sourcing Team",
  },
  zh: {
    subject: "关于库存件询价 — {mpn}",
    body: "您好，\n\n我们对您现有的 {mpn}（数量 {qty}）库存件感兴趣。请确认可供数量、原产地证明以及该数量下的价格。\n\n此致\nChipFlow 采购团队",
  },
}

function fillTemplate(template: string, mpn: string, qty: number) {
  return template.replace("{mpn}", mpn).replace("{qty}", qty.toLocaleString())
}

function DiffCard({ mpn }: { mpn: string }) {
  const line = bomLines.find((l) => l.mpn === mpn)
  const alt = line?.alternatives[0]
  if (!line || !alt) {
    return <p className="text-sm text-muted-foreground">No parametric alternatives found for {mpn}.</p>
  }
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-3.5">
      <div className="mb-2.5 flex items-center justify-between">
        <p className="text-xs font-medium">
          {line.mpn} <span className="text-muted-foreground">vs</span> {alt.mpn}
        </p>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
          {alt.matchScore}% match
        </span>
      </div>
      <div className="overflow-hidden rounded-lg border border-border/70">
        <table className="w-full text-left text-[11px]">
          <thead className="bg-card text-muted-foreground">
            <tr>
              <th className="px-2.5 py-1.5 font-medium">Parameter</th>
              <th className="px-2.5 py-1.5 font-medium">Original</th>
              <th className="px-2.5 py-1.5 font-medium">Alternative</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {alt.diffs.map((d) => (
              <tr key={d.param} className="bg-card">
                <td className="px-2.5 py-1.5 text-muted-foreground">{d.param}</td>
                <td className="px-2.5 py-1.5">{d.original}</td>
                <td
                  className={cn(
                    "px-2.5 py-1.5 font-medium",
                    d.match === "review" ? "text-amber-600" : "text-foreground",
                  )}
                >
                  {d.alternative}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{alt.manufacturer}</span>
        <span className={cn("font-medium", alt.priceDelta < 0 ? "text-emerald-600" : "text-foreground")}>
          {alt.priceDelta < 0 ? "-" : "+"}${Math.abs(alt.priceDelta).toFixed(2)}/unit · {alt.leadTimeDays}d lead
        </span>
      </div>
    </div>
  )
}

function EmailCard({ mpn }: { mpn: string }) {
  const line = bomLines.find((l) => l.mpn === mpn)
  const qty = line?.qty ?? 2400
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = (lang: string, text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {})
    setCopied(lang)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-3.5">
      <p className="mb-2.5 text-xs font-medium">Trilingual inquiry email — {mpn}</p>
      <Tabs defaultValue="en">
        <TabsList className="h-8 rounded-lg bg-card p-0.5">
          <TabsTrigger value="sv" className="h-7 rounded-md text-xs">
            Svenska
          </TabsTrigger>
          <TabsTrigger value="en" className="h-7 rounded-md text-xs">
            English
          </TabsTrigger>
          <TabsTrigger value="zh" className="h-7 rounded-md text-xs">
            中文
          </TabsTrigger>
        </TabsList>
        {(["sv", "en", "zh"] as const).map((lang) => {
          const subject = fillTemplate(emailCopy[lang].subject, mpn, qty)
          const body = fillTemplate(emailCopy[lang].body, mpn, qty)
          const full = `Subject: ${subject}\n\n${body}`
          return (
            <TabsContent key={lang} value={lang} className="mt-2.5">
              <div className="rounded-lg border border-border/70 bg-card p-3">
                <p className="text-[11px] font-medium text-muted-foreground">Subject</p>
                <p className="mt-0.5 text-xs">{subject}</p>
                <p className="mt-2.5 text-[11px] font-medium text-muted-foreground">Body</p>
                <p className="mt-0.5 whitespace-pre-line text-xs leading-relaxed">{body}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 h-7 gap-1.5 rounded-md bg-transparent text-[11px]"
                onClick={() => handleCopy(lang, full)}
              >
                {copied === lang ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied === lang ? "Copied" : "Copy email"}
              </Button>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}

function ExportCard({ mpn }: { mpn: string }) {
  const line = bomLines.find((l) => l.mpn === mpn)
  if (!line) return null
  const alt = line.alternatives[0]
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-3.5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium">{mpn}</p>
        <ExportControlBadge control={line.exportControl} />
      </div>
      {line.exportControl === "ITAR" ? (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          This part is subject to ITAR licensing for cross-border shipment. {alt ? (
            <>
              A parametric-equivalent alternative, <span className="font-medium text-foreground">{alt.mpn}</span>,
              is classified <span className="font-medium text-emerald-700">EAR99</span> and removes the license
              requirement.
            </>
          ) : (
            "No EAR99 alternative identified yet."
          )}
        </p>
      ) : (
        <p className="mt-2 flex items-center gap-1.5 text-xs leading-relaxed text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          Classified {line.exportControl === "None" ? "with no export restriction" : line.exportControl}. Clear for
          cross-border shipment.
        </p>
      )}
    </div>
  )
}

function RichContent({ rich }: { rich: RichKind }) {
  if (rich.type === "text") return <p className="text-sm leading-relaxed">{rich.content}</p>
  if (rich.type === "diff") return <DiffCard mpn={rich.mpn} />
  if (rich.type === "email") return <EmailCard mpn={rich.mpn} />
  return <ExportCard mpn={rich.mpn} />
}

export function CopilotDrawer() {
  const { copilotOpen, setCopilotOpen, copilotSeedPrompt, clearCopilotSeed } = useWorkspace()
  const [messages, setMessages] = useState<Message[]>([
    { id: "seed", role: "assistant", timestamp: seedChat[0].timestamp, rich: { type: "text", content: seedChat[0].content } },
  ])
  const [input, setInput] = useState("")
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const sendPrompt = (prompt: string) => {
    if (!prompt.trim()) return
    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", timestamp: now(), rich: { type: "text", content: prompt } }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setThinking(true)
    setTimeout(() => {
      const rich = classifyPrompt(prompt)
      setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: "assistant", timestamp: now(), rich }])
      setThinking(false)
    }, 900)
  }

  useEffect(() => {
    if (copilotSeedPrompt) {
      sendPrompt(copilotSeedPrompt)
      clearCopilotSeed()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copilotSeedPrompt])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, thinking])

  return (
    <Sheet open={copilotOpen} onOpenChange={setCopilotOpen}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="flex items-center gap-2 text-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            BOM Copilot
          </SheetTitle>
        </SheetHeader>

        <div ref={scrollRef} className="h-[calc(100vh-186px)] overflow-y-auto">
          <div className="flex flex-col gap-4 px-5 py-4">
            {messages.map((m) => (
              <div key={m.id} className={cn("flex flex-col gap-1", m.role === "user" && "items-end")}>
                <div
                  className={cn(
                    "max-w-[90%] rounded-2xl px-3.5 py-2.5",
                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border",
                  )}
                >
                  <RichContent rich={m.rich} />
                </div>
                <span className="px-1 text-[10px] text-muted-foreground">{m.timestamp}</span>
              </div>
            ))}
            {thinking && (
              <div className="flex items-center gap-1.5 rounded-2xl border border-border bg-card px-3.5 py-2.5 w-fit">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.2s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0.2s]" />
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border px-4 py-3">
          <div className="mb-2.5 flex flex-wrap gap-1.5">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendPrompt(prompt)}
                className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                {prompt}
              </button>
            ))}
          </div>
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault()
                  sendPrompt(input)
                }
              }}
              placeholder="Ask about a part, alternative, or export status..."
              className="min-h-[40px] flex-1 resize-none rounded-xl text-sm"
              rows={1}
            />
            <Button size="icon" className="h-10 w-10 shrink-0 rounded-xl" onClick={() => sendPrompt(input)}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground">
            <CornerDownLeft className="h-2.5 w-2.5" />
            Enter to send · Shift+Enter for a new line
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
