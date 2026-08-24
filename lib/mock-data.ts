export type ExportControl = "EAR99" | "ITAR" | "None"

export type LineStatus = "sourced" | "needs-sourcing" | "deadstock-arbitrage" | "vector-alternative" | "ready-to-quote"

export type ChannelKey = "lcsc" | "mouser" | "digikey" | "deadstock"

export interface ChannelOffer {
  channel: ChannelKey
  label: string
  unitPrice: number
  stock: number
  leadTimeDays: number
  moq: number
  region: string
}

export interface PriceTier {
  qty: number
  unitPrice: number
}

export interface ParametricDiff {
  param: string
  original: string
  alternative: string
  match: "exact" | "close" | "review"
}

export interface AlternativePart {
  mpn: string
  manufacturer: string
  matchScore: number
  priceDelta: number
  leadTimeDays: number
  diffs: ParametricDiff[]
}

export interface BomLine {
  id: string
  refDes: string
  mpn: string
  manufacturer: string
  description: string
  category: string
  package: string
  qty: number
  targetPrice: number
  status: LineStatus
  exportControl: ExportControl
  riskScore: number
  bestChannel: ChannelKey
  savingsPct: number
  offers: ChannelOffer[]
  tiers: PriceTier[]
  alternatives: AlternativePart[]
  notes?: string
}

export const project = {
  name: "STM32 IoT Gateway — Rev C",
  code: "PRJ-4471",
  totalLines: 18,
  totalUnits: 24500,
  originalCost: 186420,
  optimizedCost: 152310,
  currency: "USD",
}

export const bomLines: BomLine[] = [
  {
    id: "L001",
    refDes: "U1",
    mpn: "STM32F103C8T6",
    manufacturer: "STMicroelectronics",
    description: "ARM Cortex-M3 MCU, 64KB Flash, LQFP48",
    category: "Microcontroller",
    package: "LQFP-48",
    qty: 2400,
    targetPrice: 1.92,
    status: "deadstock-arbitrage",
    exportControl: "EAR99",
    riskScore: 22,
    bestChannel: "deadstock",
    savingsPct: 34,
    offers: [
      { channel: "lcsc", label: "LCSC", unitPrice: 1.88, stock: 12400, leadTimeDays: 12, moq: 1, region: "CN" },
      { channel: "mouser", label: "Mouser", unitPrice: 2.41, stock: 3200, leadTimeDays: 5, moq: 1, region: "US" },
      { channel: "digikey", label: "DigiKey", unitPrice: 2.38, stock: 5100, leadTimeDays: 4, moq: 1, region: "US" },
      { channel: "deadstock", label: "EU Deadstock — NordChip AB", unitPrice: 1.26, stock: 4800, leadTimeDays: 2, moq: 500, region: "SE" },
    ],
    tiers: [
      { qty: 500, unitPrice: 1.52 },
      { qty: 1000, unitPrice: 1.38 },
      { qty: 2500, unitPrice: 1.26 },
      { qty: 5000, unitPrice: 1.14 },
    ],
    alternatives: [
      {
        mpn: "GD32F103C8T6",
        manufacturer: "GigaDevice",
        matchScore: 96,
        priceDelta: -0.61,
        leadTimeDays: 3,
        diffs: [
          { param: "Core", original: "Cortex-M3 @ 72MHz", alternative: "Cortex-M3 @ 108MHz", match: "close" },
          { param: "Flash", original: "64KB", alternative: "64KB", match: "exact" },
          { param: "Package", original: "LQFP-48", alternative: "LQFP-48", match: "exact" },
          { param: "Operating Temp", original: "-40 to 85°C", alternative: "-40 to 85°C", match: "exact" },
        ],
      },
    ],
    notes: "Deadstock lot verified via 3rd-party AOI report. Traceability docs attached.",
  },
  {
    id: "L002",
    refDes: "U2",
    mpn: "ESP32-WROOM-32E",
    manufacturer: "Espressif",
    description: "Wi-Fi + BLE SoC Module, 4MB Flash",
    category: "RF Module",
    package: "Module-38",
    qty: 2400,
    targetPrice: 2.85,
    status: "sourced",
    exportControl: "EAR99",
    riskScore: 8,
    bestChannel: "lcsc",
    savingsPct: 6,
    offers: [
      { channel: "lcsc", label: "LCSC", unitPrice: 2.68, stock: 41000, leadTimeDays: 9, moq: 1, region: "CN" },
      { channel: "mouser", label: "Mouser", unitPrice: 3.05, stock: 8800, leadTimeDays: 3, moq: 1, region: "US" },
      { channel: "digikey", label: "DigiKey", unitPrice: 3.02, stock: 6200, leadTimeDays: 3, moq: 1, region: "US" },
    ],
    tiers: [
      { qty: 500, unitPrice: 2.9 },
      { qty: 1000, unitPrice: 2.79 },
      { qty: 2500, unitPrice: 2.68 },
    ],
    alternatives: [],
  },
  {
    id: "L003",
    refDes: "U5",
    mpn: "TPS62130RGTR",
    manufacturer: "Texas Instruments",
    description: "3A Step-Down Converter, VQFN-16",
    category: "Power Management",
    package: "VQFN-16",
    qty: 2400,
    targetPrice: 1.15,
    status: "needs-sourcing",
    exportControl: "EAR99",
    riskScore: 61,
    bestChannel: "mouser",
    savingsPct: 0,
    offers: [
      { channel: "mouser", label: "Mouser", unitPrice: 1.34, stock: 640, leadTimeDays: 22, moq: 1, region: "US" },
      { channel: "digikey", label: "DigiKey", unitPrice: 1.31, stock: 220, leadTimeDays: 26, moq: 1, region: "US" },
      { channel: "lcsc", label: "LCSC", unitPrice: 1.29, stock: 0, leadTimeDays: 0, moq: 1, region: "CN" },
    ],
    tiers: [
      { qty: 500, unitPrice: 1.42 },
      { qty: 1000, unitPrice: 1.36 },
      { qty: 2500, unitPrice: 1.31 },
    ],
    alternatives: [
      {
        mpn: "TPS62130ARGTR",
        manufacturer: "Texas Instruments",
        matchScore: 99,
        priceDelta: 0.02,
        leadTimeDays: 18,
        diffs: [
          { param: "Vin Range", original: "3.0–17V", alternative: "3.0–17V", match: "exact" },
          { param: "Efficiency", original: "95%", alternative: "96%", match: "exact" },
        ],
      },
      {
        mpn: "MP2315GJ-Z",
        manufacturer: "Monolithic Power",
        matchScore: 88,
        priceDelta: -0.34,
        leadTimeDays: 11,
        diffs: [
          { param: "Iout Max", original: "3A", alternative: "3A", match: "exact" },
          { param: "Switching Freq", original: "500kHz", alternative: "1.4MHz", match: "review" },
          { param: "Package", original: "VQFN-16", alternative: "QFN-12", match: "review" },
        ],
      },
    ],
    notes: "Global shortage — allocation status active at 2 of 3 franchised distributors.",
  },
  {
    id: "L004",
    refDes: "Y1",
    mpn: "ABM8-25.000MHZ-B2-T",
    manufacturer: "Abracon",
    description: "25MHz Crystal, ±20ppm, SMD 3.2x2.5mm",
    category: "Timing",
    package: "SMD-3225",
    qty: 2400,
    targetPrice: 0.21,
    status: "sourced",
    exportControl: "EAR99",
    riskScore: 5,
    bestChannel: "lcsc",
    savingsPct: 12,
    offers: [
      { channel: "lcsc", label: "LCSC", unitPrice: 0.18, stock: 88000, leadTimeDays: 10, moq: 1, region: "CN" },
      { channel: "digikey", label: "DigiKey", unitPrice: 0.24, stock: 15000, leadTimeDays: 2, moq: 1, region: "US" },
    ],
    tiers: [
      { qty: 1000, unitPrice: 0.19 },
      { qty: 2500, unitPrice: 0.18 },
    ],
    alternatives: [],
  },
  {
    id: "L005",
    refDes: "U8",
    mpn: "MAX3232EIPWR",
    manufacturer: "Texas Instruments",
    description: "RS-232 Transceiver, 3–5.5V, TSSOP-16",
    category: "Interface",
    package: "TSSOP-16",
    qty: 2400,
    targetPrice: 1.68,
    status: "vector-alternative",
    exportControl: "ITAR",
    riskScore: 78,
    bestChannel: "mouser",
    savingsPct: 0,
    offers: [
      { channel: "mouser", label: "Mouser", unitPrice: 1.82, stock: 110, leadTimeDays: 34, moq: 1, region: "US" },
      { channel: "digikey", label: "DigiKey", unitPrice: 1.79, stock: 60, leadTimeDays: 38, moq: 1, region: "US" },
    ],
    tiers: [
      { qty: 500, unitPrice: 1.95 },
      { qty: 1000, unitPrice: 1.88 },
      { qty: 2500, unitPrice: 1.79 },
    ],
    alternatives: [
      {
        mpn: "SP3232EEY-L/TR",
        manufacturer: "MaxLinear",
        matchScore: 94,
        priceDelta: -0.29,
        leadTimeDays: 14,
        diffs: [
          { param: "ESD Protection", original: "±15kV", alternative: "±15kV", match: "exact" },
          { param: "Export Class", original: "ITAR", alternative: "EAR99", match: "review" },
          { param: "Package", original: "TSSOP-16", alternative: "TSSOP-16", match: "exact" },
        ],
      },
    ],
    notes: "Flagged for export-control substitution — vector alternative removes ITAR license requirement.",
  },
  {
    id: "L006",
    refDes: "J3",
    mpn: "USB4105-GF-A",
    manufacturer: "GCT",
    description: "USB Type-C Receptacle, 24-pin, SMT",
    category: "Connector",
    package: "SMT-24",
    qty: 2400,
    targetPrice: 0.62,
    status: "ready-to-quote",
    exportControl: "None",
    riskScore: 14,
    bestChannel: "lcsc",
    savingsPct: 18,
    offers: [
      { channel: "lcsc", label: "LCSC", unitPrice: 0.54, stock: 22000, leadTimeDays: 11, moq: 1, region: "CN" },
      { channel: "mouser", label: "Mouser", unitPrice: 0.68, stock: 4100, leadTimeDays: 7, moq: 1, region: "US" },
    ],
    tiers: [
      { qty: 1000, unitPrice: 0.58 },
      { qty: 2500, unitPrice: 0.54 },
    ],
    alternatives: [],
  },
  {
    id: "L007",
    refDes: "U11",
    mpn: "W25Q128JVSIQ",
    manufacturer: "Winbond",
    description: "128Mb SPI NOR Flash, SOIC-8",
    category: "Memory",
    package: "SOIC-8",
    qty: 2400,
    targetPrice: 0.94,
    status: "deadstock-arbitrage",
    exportControl: "EAR99",
    riskScore: 31,
    bestChannel: "deadstock",
    savingsPct: 27,
    offers: [
      { channel: "lcsc", label: "LCSC", unitPrice: 0.88, stock: 9600, leadTimeDays: 13, moq: 1, region: "CN" },
      { channel: "digikey", label: "DigiKey", unitPrice: 1.12, stock: 2100, leadTimeDays: 6, moq: 1, region: "US" },
      { channel: "deadstock", label: "EU Deadstock — Baltic Semi", unitPrice: 0.69, stock: 3600, leadTimeDays: 3, moq: 250, region: "LT" },
    ],
    tiers: [
      { qty: 1000, unitPrice: 0.79 },
      { qty: 2500, unitPrice: 0.69 },
    ],
    alternatives: [],
  },
  {
    id: "L008",
    refDes: "U14",
    mpn: "BQ24075RGTR",
    manufacturer: "Texas Instruments",
    description: "Li-Ion Charger + Power Path, VQFN-16",
    category: "Power Management",
    package: "VQFN-16",
    qty: 2400,
    targetPrice: 1.48,
    status: "needs-sourcing",
    exportControl: "EAR99",
    riskScore: 54,
    bestChannel: "digikey",
    savingsPct: 0,
    offers: [
      { channel: "digikey", label: "DigiKey", unitPrice: 1.61, stock: 340, leadTimeDays: 19, moq: 1, region: "US" },
      { channel: "mouser", label: "Mouser", unitPrice: 1.64, stock: 290, leadTimeDays: 21, moq: 1, region: "US" },
    ],
    tiers: [
      { qty: 500, unitPrice: 1.7 },
      { qty: 1000, unitPrice: 1.66 },
      { qty: 2500, unitPrice: 1.61 },
    ],
    alternatives: [
      {
        mpn: "BQ24075RGTT",
        manufacturer: "Texas Instruments",
        matchScore: 97,
        priceDelta: -0.05,
        leadTimeDays: 16,
        diffs: [{ param: "Tape/Reel Qty", original: "2500", alternative: "250", match: "review" }],
      },
    ],
  },
  {
    id: "L009",
    refDes: "D2–D9",
    mpn: "SS14-E3/61T",
    manufacturer: "Vishay",
    description: "Schottky Diode, 1A 40V, SMA",
    category: "Discrete",
    package: "SMA",
    qty: 4800,
    targetPrice: 0.06,
    status: "sourced",
    exportControl: "None",
    riskScore: 4,
    bestChannel: "lcsc",
    savingsPct: 9,
    offers: [
      { channel: "lcsc", label: "LCSC", unitPrice: 0.05, stock: 210000, leadTimeDays: 8, moq: 1, region: "CN" },
      { channel: "digikey", label: "DigiKey", unitPrice: 0.07, stock: 40000, leadTimeDays: 2, moq: 1, region: "US" },
    ],
    tiers: [
      { qty: 2500, unitPrice: 0.052 },
      { qty: 5000, unitPrice: 0.048 },
    ],
    alternatives: [],
  },
  {
    id: "L010",
    refDes: "C12,C13",
    mpn: "GRM188R71H104KA93D",
    manufacturer: "Murata",
    description: "0.1uF Ceramic Capacitor, X7R, 0603",
    category: "Passive",
    package: "0603",
    qty: 4800,
    targetPrice: 0.014,
    status: "sourced",
    exportControl: "None",
    riskScore: 2,
    bestChannel: "lcsc",
    savingsPct: 15,
    offers: [
      { channel: "lcsc", label: "LCSC", unitPrice: 0.012, stock: 980000, leadTimeDays: 7, moq: 1, region: "CN" },
      { channel: "digikey", label: "DigiKey", unitPrice: 0.016, stock: 320000, leadTimeDays: 2, moq: 1, region: "US" },
    ],
    tiers: [
      { qty: 5000, unitPrice: 0.0125 },
      { qty: 10000, unitPrice: 0.0118 },
    ],
    alternatives: [],
  },
  {
    id: "L011",
    refDes: "U18",
    mpn: "ATECC608B-SSHDA-T",
    manufacturer: "Microchip",
    description: "Secure Element, I2C, SOIC-8",
    category: "Security",
    package: "SOIC-8",
    qty: 2400,
    targetPrice: 1.05,
    status: "needs-sourcing",
    exportControl: "EAR99",
    riskScore: 66,
    bestChannel: "mouser",
    savingsPct: 0,
    offers: [
      { channel: "mouser", label: "Mouser", unitPrice: 1.18, stock: 180, leadTimeDays: 28, moq: 1, region: "US" },
      { channel: "digikey", label: "DigiKey", unitPrice: 1.21, stock: 95, leadTimeDays: 30, moq: 1, region: "US" },
    ],
    tiers: [
      { qty: 500, unitPrice: 1.28 },
      { qty: 1000, unitPrice: 1.22 },
    ],
    alternatives: [
      {
        mpn: "ATECC608A-SSHDA-T",
        manufacturer: "Microchip",
        matchScore: 91,
        priceDelta: -0.11,
        leadTimeDays: 20,
        diffs: [{ param: "Silicon Rev", original: "Rev B", alternative: "Rev A", match: "review" }],
      },
    ],
  },
  {
    id: "L012",
    refDes: "L2",
    mpn: "XFL4020-102MEC",
    manufacturer: "Coilcraft",
    description: "1uH Shielded Power Inductor, 4x4mm",
    category: "Magnetics",
    package: "4020",
    qty: 2400,
    targetPrice: 0.38,
    status: "vector-alternative",
    exportControl: "EAR99",
    riskScore: 41,
    bestChannel: "mouser",
    savingsPct: 0,
    offers: [
      { channel: "mouser", label: "Mouser", unitPrice: 0.44, stock: 1900, leadTimeDays: 15, moq: 1, region: "US" },
      { channel: "digikey", label: "DigiKey", unitPrice: 0.43, stock: 2200, leadTimeDays: 14, moq: 1, region: "US" },
    ],
    tiers: [
      { qty: 1000, unitPrice: 0.4 },
      { qty: 2500, unitPrice: 0.37 },
    ],
    alternatives: [
      {
        mpn: "SRP4020TA-1R0M",
        manufacturer: "Bourns",
        matchScore: 93,
        priceDelta: -0.09,
        leadTimeDays: 9,
        diffs: [
          { param: "Isat", original: "5.2A", alternative: "4.8A", match: "close" },
          { param: "DCR", original: "28mΩ", alternative: "31mΩ", match: "close" },
        ],
      },
    ],
  },
]

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  kind?: "text" | "diff" | "email" | "badge-summary"
}

export const seedChat: ChatMessage[] = [
  {
    id: "m1",
    role: "assistant",
    content:
      "I've finished scanning STM32 IoT Gateway — Rev C. 3 lines flagged for deadstock arbitrage, 2 for vector alternatives, and one ITAR-controlled part (U8, MAX3232EIPWR) has an EAR99 substitute available. Want me to draft outreach or run the parametric comparison first?",
    timestamp: "09:14",
  },
]

export const quickPrompts = [
  "Find a cheaper alternative for U5",
  "Draft inquiry email for the STM32F103C8T6 deadstock lot",
  "Check export control status for this BOM",
  "Compare TPS62130RGTR vs vector alternatives",
]

export interface AgentLogEntry {
  id: string
  site: "lcsc" | "mouser" | "digikey"
  message: string
  timestamp: string
  status: "running" | "done" | "found"
}

export const seedAgentLog: AgentLogEntry[] = [
  { id: "a1", site: "lcsc", message: "Opened search for STM32F103C8T6", timestamp: "09:12:01", status: "done" },
  { id: "a2", site: "lcsc", message: "Found 12,400 units in stock @ $1.88", timestamp: "09:12:04", status: "found" },
  { id: "a3", site: "mouser", message: "Querying TPS62130RGTR availability", timestamp: "09:12:11", status: "done" },
  { id: "a4", site: "mouser", message: "Allocation notice detected — 640 units, 22 day lead time", timestamp: "09:12:14", status: "found" },
  { id: "a5", site: "digikey", message: "Checking BQ24075RGTR tiered pricing", timestamp: "09:12:20", status: "running" },
]

export const agentMessagePool: { site: AgentLogEntry["site"]; message: string; status: AgentLogEntry["status"] }[] = [
  { site: "lcsc", message: "Searching LCSC catalog for W25Q128JVSIQ", status: "running" },
  { site: "lcsc", message: "Extracted 3-tier pricing table for W25Q128JVSIQ", status: "done" },
  { site: "mouser", message: "Requesting real-time stock for ATECC608B-SSHDA-T", status: "running" },
  { site: "mouser", message: "Found 180 units @ $1.18, lead time 28 days", status: "found" },
  { site: "digikey", message: "Comparing datasheet parameters for XFL4020-102MEC", status: "running" },
  { site: "digikey", message: "Confirmed footprint match for SRP4020TA-1R0M", status: "done" },
  { site: "lcsc", message: "Cross-checking deadstock lot traceability for U1", status: "running" },
  { site: "lcsc", message: "AOI report verified — lot accepted for arbitrage queue", status: "found" },
  { site: "mouser", message: "Polling backorder ETA for BQ24075RGTR", status: "running" },
  { site: "digikey", message: "Updated lead-time forecast: 19 days → 16 days", status: "done" },
]

export const channelMixData = [
  { channel: "LCSC", value: 42, fill: "var(--color-lcsc)" },
  { channel: "DigiKey", value: 24, fill: "var(--color-digikey)" },
  { channel: "Mouser", value: 19, fill: "var(--color-mouser)" },
  { channel: "EU Deadstock", value: 12, fill: "var(--color-deadstock)" },
  { channel: "Other", value: 3, fill: "var(--color-other)" },
]

export const leadTimeData = [
  { category: "MCU/SoC", lcsc: 12, mouser: 5, digikey: 4 },
  { category: "Power Mgmt", lcsc: 9, mouser: 22, digikey: 26 },
  { category: "Memory", lcsc: 13, mouser: 18, digikey: 6 },
  { category: "Interface", lcsc: 10, mouser: 34, digikey: 38 },
  { category: "Passive", lcsc: 7, mouser: 4, digikey: 2 },
  { category: "Connector", lcsc: 11, mouser: 7, digikey: 6 },
]

export const savingsTrendData = [
  { month: "Apr", baseline: 168200, optimized: 168200 },
  { month: "May", baseline: 172400, optimized: 161800 },
  { month: "Jun", baseline: 179100, optimized: 158200 },
  { month: "Jul", baseline: 183600, optimized: 154900 },
  { month: "Aug", baseline: 186420, optimized: 152310 },
]

export const kpis = [
  { label: "Total BOM Value", value: "$152,310", delta: "-18.3%", positive: true },
  { label: "Lines Needing Action", value: "5", delta: "-2 this week", positive: true },
  { label: "Avg. Lead Time", value: "14.2 days", delta: "-6.1 days", positive: true },
  { label: "Export-Control Flags", value: "1 ITAR", delta: "1 EAR99 alt found", positive: true },
]
