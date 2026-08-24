"use client"

import { useState } from "react"
import {
  Boxes,
  Building2,
  CheckCircle2,
  FileCheck,
  FileText,
  Filter,
  Globe2,
  Lock,
  MapPin,
  Package,
  Plus,
  Search,
  ShieldCheck,
  Tag,
  Upload,
} from "lucide-react"
import { useWorkspace } from "@/lib/workspace-context"
import { TrustLevelBadge } from "@/components/workspace/status-badges"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { TrustLevel } from "@/lib/mock-data"

export function ExcessInventoryView() {
  const { inventoryLots, addInventoryLot, listExcessOpen, setListExcessOpen } = useWorkspace()
  const [searchTerm, setSearchTerm] = useState("")
  const [countryFilter, setCountryFilter] = useState("all")

  // Form states for listing new excess lot
  const [newMpn, setNewMpn] = useState("")
  const [newMfr, setNewMfr] = useState("")
  const [newQty, setNewQty] = useState<number>(5000)
  const [newPrice, setNewPrice] = useState<number>(1.20)
  const [newDateCode, setNewDateCode] = useState("2345")
  const [newLotCode, setNewLotCode] = useState(`LOT-2026-N${Math.floor(1000 + Math.random() * 9000)}`)
  const [newCountry, setNewCountry] = useState("Sweden")
  const [newCity, setNewCity] = useState("Stockholm")
  const [newWarehouse, setNewWarehouse] = useState("Kista Tech Logistics")
  const [newPackaging, setNewPackaging] = useState<"Original Tray" | "Tape & Reel" | "Tube">("Tape & Reel")
  const [newCondition, setNewCondition] = useState<"Factory Sealed" | "Excess Unused">("Factory Sealed")
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [cocAvailable, setCocAvailable] = useState(true)
  const [originalInvoice, setOriginalInvoice] = useState(true)

  const filteredLots = inventoryLots.filter((lot) => {
    const matchesSearch =
      lot.mpn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lot.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lot.lotCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCountry = countryFilter === "all" || lot.country.toLowerCase() === countryFilter.toLowerCase()
    return matchesSearch && matchesCountry
  })

  const totalExcessUnits = inventoryLots.reduce((acc, l) => acc + l.quantity, 0)
  const totalExcessValue = inventoryLots.reduce((acc, l) => acc + l.quantity * l.unitPrice, 0)

  const handleCreateLot = () => {
    if (!newMpn) return
    addInventoryLot({
      lotCode: newLotCode,
      mpn: newMpn.trim().toUpperCase(),
      normalizedMpn: newMpn.trim().toUpperCase().replace(/[-_ ]?(TR|REEL|ND|CUT)$/i, ""),
      manufacturer: newMfr.trim() || "Generic / Top MFR",
      quantity: Number(newQty),
      unitPrice: Number(newPrice),
      currency: "USD",
      dateCode: newDateCode,
      packaging: newPackaging,
      condition: newCondition,
      country: newCountry,
      city: newCity,
      warehouse: newWarehouse,
      isAnonymous: isAnonymous,
      supplierDisplay: isAnonymous ? `Verified EMS · ${newCity}, ${newCountry}` : `${newCity} EMS Partner`,
      supplierId: `SUPP-${newCountry.substring(0, 2).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
      trustLevel: 3 as TrustLevel,
      cocAvailable,
      originalInvoice,
      photosAvailable: true,
      inspectionReportAvailable: false,
    })
    setListExcessOpen(false)
    setNewMpn("")
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4 md:p-6">
      {/* Top Banner: Excess Network Metrics */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Verified Excess Pool</span>
            <Boxes className="h-3.5 w-3.5 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums">
            {totalExcessUnits.toLocaleString()} pcs
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">{inventoryLots.length} verified active lots</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Inventory Value in Network</span>
            <Tag className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400 tabular-nums">
            ${totalExcessValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Average 35% discount vs. spot distributors</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>EMS Geographic Nodes</span>
            <Globe2 className="h-3.5 w-3.5 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums">Sweden · Germany · Finland</p>
          <p className="mt-1 text-[11px] text-muted-foreground">100% factory sealed / original traceability</p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search MPN, MFR, Lot Code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 rounded-xl pl-8 text-xs"
            />
          </div>

          <div className="flex items-center rounded-xl bg-secondary p-1 text-xs">
            {["all", "sweden", "germany", "finland"].map((c) => (
              <button
                key={c}
                onClick={() => setCountryFilter(c)}
                className={cn(
                  "rounded-lg px-2.5 py-1 font-medium capitalize transition-colors",
                  countryFilter === c ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={() => setListExcessOpen(true)} className="gap-1.5 rounded-xl text-xs">
          <Plus className="h-3.5 w-3.5" />
          List Excess Lot
        </Button>
      </div>

      {/* Lots Table */}
      <div className="flex-1 overflow-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[1000px] border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-secondary/95 backdrop-blur-sm">
            <tr className="text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3">Lot Code</th>
              <th className="px-4 py-3">MPN / Manufacturer</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Lot Unit Price</th>
              <th className="px-4 py-3">Date Code & Pack</th>
              <th className="px-4 py-3">Supplier & Location</th>
              <th className="px-4 py-3">Trust Level</th>
              <th className="px-4 py-3">Verification</th>
              <th className="px-4 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs">
            {filteredLots.map((lot, idx) => (
              <tr key={lot.id} className={cn("transition-colors hover:bg-accent/40", idx % 2 === 1 && "bg-secondary/20")}>
                <td className="px-4 py-3 font-mono font-medium text-foreground">{lot.lotCode}</td>
                <td className="px-4 py-3">
                  <p className="font-mono text-xs font-bold text-foreground">{lot.mpn}</p>
                  <p className="text-[11px] text-muted-foreground">{lot.manufacturer}</p>
                </td>
                <td className="px-4 py-3 tabular-nums font-semibold text-foreground">
                  {lot.quantity.toLocaleString()} pcs
                </td>
                <td className="px-4 py-3 tabular-nums font-bold text-emerald-700 dark:text-emerald-400">
                  ${lot.unitPrice.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  DC {lot.dateCode} · {lot.packaging}
                  <p className="text-[10px] text-muted-foreground">{lot.condition}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
                    <span>{lot.supplierDisplay}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{lot.warehouse}</p>
                </td>
                <td className="px-4 py-3">
                  <TrustLevelBadge level={lot.trustLevel} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {lot.cocAvailable && (
                      <span className="inline-flex items-center gap-0.5 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                        <FileCheck className="h-2.5 w-2.5" />
                        CoC
                      </span>
                    )}
                    {lot.originalInvoice && (
                      <span className="inline-flex items-center gap-0.5 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                        <FileText className="h-2.5 w-2.5" />
                        Invoice
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  {lot.status === "reserved" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      <Lock className="h-2.5 w-2.5" />
                      Reserved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      Available
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* List Excess Modal */}
      {listExcessOpen && (
        <Dialog open={listExcessOpen} onOpenChange={setListExcessOpen}>
          <DialogContent className="sm:max-w-lg rounded-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-bold">
                <Boxes className="h-4 w-4 text-primary" />
                List Excess Inventory Lot (EMS Seller Portal)
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                Broadcast idle factory inventory to matched global BOM demands anonymously.
              </p>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-muted-foreground">Part Number (MPN) *</label>
                  <Input
                    placeholder="e.g. STM32F407VGT6"
                    value={newMpn}
                    onChange={(e) => setNewMpn(e.target.value)}
                    className="mt-1 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="font-medium text-muted-foreground">Manufacturer</label>
                  <Input
                    placeholder="e.g. STMicroelectronics"
                    value={newMfr}
                    onChange={(e) => setNewMfr(e.target.value)}
                    className="mt-1 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-muted-foreground">Quantity (pcs)</label>
                  <Input
                    type="number"
                    value={newQty}
                    onChange={(e) => setNewQty(Number(e.target.value))}
                    className="mt-1 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="font-medium text-muted-foreground">Unit Price ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="mt-1 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="font-medium text-muted-foreground">Date Code</label>
                  <Input
                    value={newDateCode}
                    onChange={(e) => setNewDateCode(e.target.value)}
                    className="mt-1 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-muted-foreground">Country & City</label>
                  <Input
                    value={`${newCity}, ${newCountry}`}
                    onChange={(e) => {
                      const parts = e.target.value.split(",")
                      setNewCity(parts[0]?.trim() || "Stockholm")
                      setNewCountry(parts[1]?.trim() || "Sweden")
                    }}
                    className="mt-1 text-xs"
                  />
                </div>
                <div>
                  <label className="font-medium text-muted-foreground">Packaging Type</label>
                  <select
                    value={newPackaging}
                    onChange={(e) => setNewPackaging(e.target.value as any)}
                    className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-xs"
                  >
                    <option value="Tape & Reel">Tape & Reel</option>
                    <option value="Original Tray">Original Tray</option>
                    <option value="Tube">Tube</option>
                  </select>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-secondary/30 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">Anonymous Listing</p>
                    <p className="text-[11px] text-muted-foreground">
                      Display only "Verified EMS · {newCity}, {newCountry}" to protect client relations.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="h-4 w-4 rounded accent-primary"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-border/60 pt-2">
                  <div>
                    <p className="font-semibold text-foreground">Original CoC & Invoice Available</p>
                    <p className="text-[11px] text-muted-foreground">
                      Increases ChipFlow Trust Level to Level 3.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={cocAvailable}
                    onChange={(e) => setCocAvailable(e.target.checked)}
                    className="h-4 w-4 rounded accent-primary"
                  />
                </div>
              </div>

              <DialogFooter className="mt-4 gap-2">
                <Button variant="outline" size="sm" onClick={() => setListExcessOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleCreateLot} disabled={!newMpn}>
                  List Lot on ChipFlow
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
