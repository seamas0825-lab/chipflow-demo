"use client"

import { useState } from "react"
import {
  CheckCircle2,
  Clock3,
  Download,
  FileCheck,
  FileText,
  Lock,
  Mail,
  MessageSquare,
  Package,
  Send,
  ShieldCheck,
  UserCheck,
} from "lucide-react"
import { useWorkspace } from "@/lib/workspace-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { RfqRecord } from "@/lib/mock-data"

export function RfqsView() {
  const { rfqs, reserveLot, opportunities } = useWorkspace()
  const [selectedRfqId, setSelectedRfqId] = useState<string>(rfqs[0]?.id || "")
  const [replyText, setReplyText] = useState("")

  const activeRfq = rfqs.find((r) => r.id === selectedRfqId) || rfqs[0]

  const handleSendReply = () => {
    if (!replyText.trim() || !activeRfq) return
    activeRfq.messages.push({
      id: `M-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sender: "buyer",
      senderName: "Eliot (ChipFlow)",
      text: replyText.trim(),
    })
    setReplyText("")
  }

  return (
    <div className="flex h-full flex-col overflow-hidden p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground">RFQs & Deal Collaboration</h3>
          <p className="text-xs text-muted-foreground">
            Active negotiations, seller stock confirmations, and escrow lock pipeline.
          </p>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden lg:grid-cols-12">
        {/* Left Column: RFQ List */}
        <div className="flex flex-col gap-2 overflow-y-auto rounded-2xl border border-border bg-card p-3 lg:col-span-5">
          {rfqs.map((rfq) => {
            const isSelected = rfq.id === selectedRfqId
            return (
              <div
                key={rfq.id}
                onClick={() => setSelectedRfqId(rfq.id)}
                className={cn(
                  "cursor-pointer rounded-xl border p-3.5 transition-all text-xs",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border/80 bg-secondary/20 hover:border-border hover:bg-secondary/40"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-foreground">{rfq.id}</span>
                  {rfq.status === "reserved" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      <Lock className="h-2.5 w-2.5" />
                      Reserved in Escrow
                    </span>
                  )}
                  {rfq.status === "confirmed" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      Seller Confirmed
                    </span>
                  )}
                  {rfq.status === "sent" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      <Clock3 className="h-2.5 w-2.5" />
                      Awaiting Response
                    </span>
                  )}
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-foreground">{rfq.mpn}</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
                    ${rfq.offeredUnitPrice.toFixed(2)} / pc
                  </span>
                </div>

                <p className="mt-1 text-[11px] text-muted-foreground truncate">{rfq.supplierDisplay}</p>

                <div className="mt-2 flex items-center justify-between border-t border-border/50 pt-2 text-[10px] text-muted-foreground">
                  <span>Qty: {rfq.demandQty.toLocaleString()} pcs</span>
                  <span>Sent: {rfq.sentDate}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Right Column: RFQ Message Thread & Actions */}
        {activeRfq ? (
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 lg:col-span-7">
            {/* Header info */}
            <div>
              <div className="flex items-start justify-between border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-foreground">{activeRfq.mpn}</span>
                    <span className="rounded bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground">
                      {activeRfq.id}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Seller: <span className="font-medium text-foreground">{activeRfq.supplierDisplay}</span>
                  </p>
                </div>

                <div className="text-right text-xs">
                  <p className="text-muted-foreground">Total Quoted Amount</p>
                  <p className="font-mono text-lg font-bold text-emerald-700 dark:text-emerald-400">
                    ${(activeRfq.demandQty * activeRfq.offeredUnitPrice).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Deal Status Bar */}
              <div className="mt-3 flex flex-wrap items-center gap-4 rounded-xl bg-secondary/40 p-3 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Package className="h-3.5 w-3.5 text-primary" />
                  <span>Qty: <strong className="text-foreground">{activeRfq.demandQty.toLocaleString()}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>CoC: <strong className="text-foreground">Attached & Verified</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock3 className="h-3.5 w-3.5 text-amber-600" />
                  <span>Valid Until: <strong className="text-foreground">{activeRfq.validUntil}</strong></span>
                </div>
              </div>
            </div>

            {/* Conversation Log */}
            <div className="my-4 flex-1 space-y-3 overflow-y-auto rounded-xl border border-border/60 bg-secondary/10 p-3.5">
              {activeRfq.messages.map((msg) => {
                const isBuyer = msg.sender === "buyer"
                const isSystem = msg.sender === "chipflow_system"
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex flex-col rounded-xl p-3 text-xs leading-relaxed max-w-[85%]",
                      isSystem
                        ? "mx-auto bg-primary/10 border border-primary/20 text-center"
                        : isBuyer
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "mr-auto bg-card border border-border text-foreground shadow-sm"
                    )}
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] opacity-80 mb-1">
                      <span className="font-semibold">{msg.senderName}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p>{msg.text}</p>
                  </div>
                )
              })}
            </div>

            {/* Footer: Reply Box + Action Buttons */}
            <div className="space-y-3 border-t border-border pt-3">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Type negotiation reply or terms clarification..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
                  className="h-9 text-xs"
                />
                <Button size="sm" onClick={handleSendReply} className="gap-1 rounded-lg">
                  <Send className="h-3.5 w-3.5" />
                  Send
                </Button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs bg-transparent">
                  <Download className="h-3.5 w-3.5" />
                  Export RFQ PDF
                </Button>

                {activeRfq.status !== "reserved" ? (
                  <Button
                    size="sm"
                    className="gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => reserveLot(activeRfq.opportunityId, activeRfq.offeredLotId)}
                  >
                    <Lock className="h-3.5 w-3.5" />
                    Confirm Deal & Reserve Escrow
                  </Button>
                ) : (
                  <Button size="sm" variant="secondary" className="gap-1.5 text-xs text-blue-700" disabled>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Deal Locked in ChipFlow Escrow
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-8 text-center text-xs text-muted-foreground lg:col-span-7">
            Select an RFQ on the left to view negotiation details.
          </div>
        )}
      </div>
    </div>
  )
}
