"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  CheckCircle2,
  Clipboard,
  FileSpreadsheet,
  FileText,
  ImageIcon,
  Loader2,
  ScanLine,
  Sparkles,
  UploadCloud,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useWorkspace } from "@/lib/workspace-context"
import { cn } from "@/lib/utils"

type Stage = "idle" | "uploading" | "parsing" | "structuring" | "done"

const stageLabels: Record<Stage, string> = {
  idle: "Waiting for a file",
  uploading: "Uploading document",
  parsing: "Running OCR & layout parsing",
  structuring: "Structuring BOM rows",
  done: "Ready to import",
}

const previewRows = [
  { ref: "U1", mpn: "STM32F103C8T6", qty: "2,400", desc: "ARM Cortex-M3 MCU, LQFP48" },
  { ref: "U5", mpn: "TPS62130RGTR", qty: "2,400", desc: "3A Step-Down Converter" },
  { ref: "Y1", mpn: "ABM8-25.000MHZ-B2-T", qty: "2,400", desc: "25MHz Crystal, SMD" },
  { ref: "U11", mpn: "W25Q128JVSIQ", qty: "2,400", desc: "128Mb SPI NOR Flash" },
]

const fileKinds = [
  { icon: FileSpreadsheet, label: "Excel / CSV", hint: ".xlsx, .csv" },
  { icon: FileText, label: "PDF Quotation", hint: ".pdf drawings & quotes" },
  { icon: ImageIcon, label: "Image / Screenshot", hint: ".png, .jpg, paste" },
]

export function DropzoneModal() {
  const { dropzoneOpen, setDropzoneOpen } = useWorkspace()
  const [stage, setStage] = useState<Stage>("idle")
  const [progress, setProgress] = useState(0)
  const [fileName, setFileName] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const reset = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setStage("idle")
    setProgress(0)
    setFileName(null)
  }, [])

  useEffect(() => {
    if (!dropzoneOpen) reset()
  }, [dropzoneOpen, reset])

  const runSimulation = (name: string) => {
    setFileName(name)
    setStage("uploading")
    setProgress(8)

    const schedule = (fn: () => void, delay: number) => {
      const t = setTimeout(fn, delay)
      timers.current.push(t)
      return t
    }

    schedule(() => {
      setStage("parsing")
      setProgress(40)
    }, 700)
    schedule(() => {
      setStage("structuring")
      setProgress(74)
    }, 1900)
    schedule(() => {
      setStage("done")
      setProgress(100)
    }, 3000)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    runSimulation(file?.name ?? "BOM_RevC_supplier_quote.pdf")
  }

  const handlePick = () => {
    runSimulation("STM32_Gateway_BOM.xlsx")
  }

  const handlePaste = () => {
    runSimulation("Clipboard screenshot — supplier_quote.png")
  }

  return (
    <Dialog
      open={dropzoneOpen}
      onOpenChange={(open) => {
        setDropzoneOpen(open)
        if (!open) reset()
      }}
    >
      <DialogContent className="max-w-2xl gap-0 overflow-hidden rounded-2xl p-0">
        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle className="text-base">Ingest a new BOM</DialogTitle>
        </DialogHeader>

        <div className="p-6">
          {stage === "idle" && (
            <>
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={handlePick}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors",
                  isDragging ? "border-primary bg-accent/50" : "border-border hover:border-primary/50 hover:bg-secondary/40",
                )}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <p className="mt-4 text-sm font-medium">Drop a file, or click to browse</p>
                <p className="mt-1 text-xs text-muted-foreground">Excel, CSV, PDF quotations, or screenshots</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 gap-2 rounded-lg bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePaste()
                  }}
                >
                  <Clipboard className="h-3.5 w-3.5" />
                  Paste from clipboard
                </Button>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {fileKinds.map((kind) => (
                  <div
                    key={kind.label}
                    className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-secondary/40 px-3 py-3 text-center"
                  >
                    <kind.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium">{kind.label}</span>
                    <span className="text-[11px] text-muted-foreground">{kind.hint}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {stage !== "idle" && stage !== "done" && (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                {stage === "parsing" ? (
                  <ScanLine className="h-7 w-7 animate-pulse" />
                ) : (
                  <Loader2 className="h-7 w-7 animate-spin" />
                )}
              </div>
              <p className="mt-4 text-sm font-medium">{fileName}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stageLabels[stage]}</p>
              <Progress value={progress} className="mt-4 h-1.5 w-64" />

              {stage === "parsing" && (
                <div className="mt-6 w-full max-w-sm rounded-xl border border-border bg-secondary/50 p-3">
                  <p className="mb-2 text-left text-[11px] font-medium text-muted-foreground">
                    Detecting table structure &amp; bounding boxes
                  </p>
                  <div className="space-y-1.5">
                    {[92, 78, 65, 88].map((w, i) => (
                      <div key={i} className="h-2.5 rounded bg-border/80" style={{ width: `${w}%` }}>
                        <div className="h-full w-full animate-pulse rounded bg-primary/25" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {stage === "done" && (
            <div>
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <CheckCircle2 className="h-4 w-4" />
                Extracted 18 lines from <span className="font-medium">{fileName}</span> with 97% confidence
              </div>

              <div className="mt-4 overflow-hidden rounded-xl border border-border">
                <table className="w-full text-left text-xs">
                  <thead className="bg-secondary text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 font-medium">Ref</th>
                      <th className="px-3 py-2 font-medium">MPN</th>
                      <th className="px-3 py-2 font-medium">Qty</th>
                      <th className="px-3 py-2 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {previewRows.map((row) => (
                      <tr key={row.ref}>
                        <td className="px-3 py-2 font-mono">{row.ref}</td>
                        <td className="px-3 py-2 font-mono">{row.mpn}</td>
                        <td className="px-3 py-2 tabular-nums">{row.qty}</td>
                        <td className="px-3 py-2 text-muted-foreground">{row.desc}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={4} className="px-3 py-2 text-center text-muted-foreground">
                        + 14 more rows
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Copilot will pre-score sourcing risk on import
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="rounded-lg bg-transparent" onClick={reset}>
                    Discard
                  </Button>
                  <Button className="rounded-lg" onClick={() => setDropzoneOpen(false)}>
                    Import into workspace
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
