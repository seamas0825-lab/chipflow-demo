export type ExportControl = "EAR99" | "5A992" | "ITAR" | "None"

export type LineStatus = "sourced" | "shortage" | "matched" | "rfq-pending" | "reserved"

export type ChannelKey = "lcsc" | "mouser" | "digikey" | "deadstock"

export type TrustLevel = 0 | 1 | 2 | 3 | 4

export type MatchLevel = 1 | 2 | 3 // 1: Exact Match, 2: Manufacturer Equivalent, 3: Suggested Alternative

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

export interface ChipFlowScoreBreakdown {
  mpnMatch: number // max 25
  supplierTrust: number // max 20
  priceScore: number // max 15
  traceability: number // max 15
  dateCode: number // max 10
  leadTime: number // max 10
  logistics: number // max 5
  notes: string[]
}

export interface InventoryLot {
  id: string
  lotCode: string
  mpn: string
  normalizedMpn: string
  manufacturer: string
  quantity: number
  unitPrice: number
  currency: string
  dateCode: string
  packaging: "Original Tray" | "Tape & Reel" | "Tube" | "Cut Tape" | "Bulk"
  condition: "Factory Sealed" | "Original Pack" | "Excess Unused"
  country: string
  city: string
  warehouse: string
  isAnonymous: boolean
  supplierDisplay: string
  supplierId: string
  trustLevel: TrustLevel
  cocAvailable: boolean
  originalInvoice: boolean
  photosAvailable: boolean
  inspectionReportAvailable: boolean
  status: "available" | "reserved" | "sold"
  listedAt: string
}

export interface ComplianceEvidence {
  eccn: ExportControl
  source: string
  verifiedDate: string
  sourceType: "Manufacturer Official" | "Distributor Direct" | "Third-Party DB"
  confidence: "Authoritative" | "High" | "Requires Review"
  hasConflict: boolean
  conflictDetails?: string
}

export interface SourcingOpportunity {
  id: string
  bomLineId: string
  refDes: string
  demandMpn: string
  normalizedMpn: string
  manufacturer: string
  description: string
  demandQty: number
  demandTargetPrice: number
  distributorMedianPrice: number
  matchLevel: MatchLevel
  matchLevelLabel: string
  matchedLot: InventoryLot
  chipFlowScore: number // 0 - 100
  scoreBreakdown: ChipFlowScoreBreakdown
  potentialSavings: number
  confirmedSavings: number
  status:
    | "needs-sourcing"
    | "matches-found"
    | "supplier-contacted"
    | "inventory-confirmed"
    | "verification"
    | "negotiation"
    | "reserved"
    | "purchased"
  compliance: ComplianceEvidence
}

export interface RfqMessage {
  id: string
  time: string
  sender: "buyer" | "seller" | "chipflow_system"
  senderName: string
  text: string
}

export interface RfqRecord {
  id: string
  opportunityId: string
  mpn: string
  demandQty: number
  offeredLotId: string
  supplierDisplay: string
  targetUnitPrice: number
  offeredUnitPrice: number
  currency: string
  status: "draft" | "sent" | "confirmed" | "reserved" | "purchased"
  sentDate: string
  validUntil: string
  messages: RfqMessage[]
}

export interface BomLineConfidence {
  mpn: number
  manufacturer: number
  qty: number
  targetPrice: number
  isLowConfidence?: boolean
}

export interface BomLine {
  id: string
  refDes: string
  rawMpn: string
  mpn: string
  normalizedMpn: string
  manufacturer: string
  description: string
  category: string
  package: string
  qty: number
  targetPrice: number
  status: LineStatus
  confidence: BomLineConfidence
  exportControl: ExportControl
  bestChannel: ChannelKey
  savingsPct: number
  offers: ChannelOffer[]
  tiers: PriceTier[]
  opportunityId?: string
  notes?: string
}

export const project = {
  name: "STM32 IoT Gateway — Rev C",
  code: "PRJ-4471",
  totalLines: 18,
  totalUnits: 24500,
  originalBudget: 186420,
  potentialSavings: 34200,
  confirmedSavings: 8420,
  currency: "USD",
}

// -------------------------------------------------------------
// Verified Inventory Lots (Europe / DACH / Nordic EMS Network)
// -------------------------------------------------------------
export const inventoryLots: InventoryLot[] = [
  {
    id: "LOT-SE-9912",
    lotCode: "LOT-2024-A29177",
    mpn: "STM32F103C8T6",
    normalizedMpn: "STM32F103C8T6",
    manufacturer: "STMicroelectronics",
    quantity: 8400,
    unitPrice: 1.26,
    currency: "USD",
    dateCode: "2224",
    packaging: "Original Tray",
    condition: "Factory Sealed",
    country: "Sweden",
    city: "Gothenburg",
    warehouse: "NordicEMS Gothenburg Hub",
    isAnonymous: true,
    supplierDisplay: "Verified Tier-1 EMS · Gothenburg, Sweden",
    supplierId: "SUPP-SE-04",
    trustLevel: 3,
    cocAvailable: true,
    originalInvoice: true,
    photosAvailable: true,
    inspectionReportAvailable: true,
    status: "available",
    listedAt: "2026-08-20",
  },
  {
    id: "LOT-DE-4410",
    lotCode: "LOT-2024-M77812",
    mpn: "TPS62130RGTR",
    normalizedMpn: "TPS62130RGTR",
    manufacturer: "Texas Instruments",
    quantity: 6000,
    unitPrice: 0.94,
    currency: "USD",
    dateCode: "2312",
    packaging: "Tape & Reel",
    condition: "Factory Sealed",
    country: "Germany",
    city: "Munich",
    warehouse: "Bavaria Logistics Park",
    isAnonymous: true,
    supplierDisplay: "Verified Automotive EMS · Munich, Germany",
    supplierId: "SUPP-DE-11",
    trustLevel: 4,
    cocAvailable: true,
    originalInvoice: true,
    photosAvailable: true,
    inspectionReportAvailable: true,
    status: "reserved",
    listedAt: "2026-08-18",
  },
  {
    id: "LOT-FI-1092",
    lotCode: "LOT-2023-F33201",
    mpn: "W25Q128JVSIQ",
    normalizedMpn: "W25Q128JVSIQ",
    manufacturer: "Winbond",
    quantity: 12000,
    unitPrice: 0.62,
    currency: "USD",
    dateCode: "2340",
    packaging: "Tape & Reel",
    condition: "Factory Sealed",
    country: "Finland",
    city: "Espoo",
    warehouse: "Otaniemi Tech Supply",
    isAnonymous: true,
    supplierDisplay: "Verified Telecom EMS · Espoo, Finland",
    supplierId: "SUPP-FI-02",
    trustLevel: 3,
    cocAvailable: true,
    originalInvoice: true,
    photosAvailable: true,
    inspectionReportAvailable: false,
    status: "available",
    listedAt: "2026-08-22",
  },
  {
    id: "LOT-SE-8831",
    lotCode: "LOT-2024-N55019",
    mpn: "SP3232EEY-L/TR",
    normalizedMpn: "SP3232EEY-L",
    manufacturer: "MaxLinear",
    quantity: 4500,
    unitPrice: 0.48,
    currency: "USD",
    dateCode: "2250",
    packaging: "Tape & Reel",
    condition: "Original Pack",
    country: "Sweden",
    city: "Stockholm",
    warehouse: "Kista Industrial Center",
    isAnonymous: true,
    supplierDisplay: "Verified Industrial EMS · Stockholm, Sweden",
    supplierId: "SUPP-SE-09",
    trustLevel: 2,
    cocAvailable: true,
    originalInvoice: false,
    photosAvailable: true,
    inspectionReportAvailable: false,
    status: "available",
    listedAt: "2026-08-24",
  },
  {
    id: "LOT-DE-6623",
    lotCode: "LOT-2024-B11044",
    mpn: "LAN8720A-CP",
    normalizedMpn: "LAN8720A-CP",
    manufacturer: "Microchip Technology",
    quantity: 3600,
    unitPrice: 1.08,
    currency: "USD",
    dateCode: "2318",
    packaging: "Original Tray",
    condition: "Factory Sealed",
    country: "Germany",
    city: "Stuttgart",
    warehouse: "Stuttgart West Hub",
    isAnonymous: true,
    supplierDisplay: "Verified EMS Partner · Stuttgart, Germany",
    supplierId: "SUPP-DE-07",
    trustLevel: 3,
    cocAvailable: true,
    originalInvoice: true,
    photosAvailable: true,
    inspectionReportAvailable: true,
    status: "available",
    listedAt: "2026-08-21",
  },
]

// -------------------------------------------------------------
// Sourcing Opportunities (Demand × Excess Inventory Matches)
// -------------------------------------------------------------
export const sourcingOpportunities: SourcingOpportunity[] = [
  {
    id: "OPP-001",
    bomLineId: "L001",
    refDes: "U1",
    demandMpn: "STM32F103C8T6",
    normalizedMpn: "STM32F103C8T6",
    manufacturer: "STMicroelectronics",
    description: "ARM Cortex-M3 MCU, 64KB Flash, LQFP48",
    demandQty: 2400,
    demandTargetPrice: 1.92,
    distributorMedianPrice: 2.39,
    matchLevel: 1,
    matchLevelLabel: "Exact Match",
    matchedLot: inventoryLots[0],
    chipFlowScore: 94,
    scoreBreakdown: {
      mpnMatch: 25,
      supplierTrust: 19,
      priceScore: 15,
      traceability: 14,
      dateCode: 9,
      leadTime: 8,
      logistics: 4,
      notes: [
        "Exact MPN match (100% pin & package parity)",
        "Quantity sufficient: Demand 2,400 pcs vs Lot 8,400 pcs",
        "Original CoC & Factory Sealed Tray verified",
        "EMS Verified in Gothenburg, Sweden (3 days express)",
        "Unit price $1.26 vs Market $2.39 (34% savings below target)",
      ],
    },
    potentialSavings: 1584,
    confirmedSavings: 0,
    status: "inventory-confirmed",
    compliance: {
      eccn: "EAR99",
      source: "STMicroelectronics Official Master Catalog",
      verifiedDate: "2026-08-25",
      sourceType: "Manufacturer Official",
      confidence: "Authoritative",
      hasConflict: false,
    },
  },
  {
    id: "OPP-002",
    bomLineId: "L002",
    refDes: "U5",
    demandMpn: "TPS62130RGTR",
    normalizedMpn: "TPS62130RGTR",
    manufacturer: "Texas Instruments",
    description: "3A Step-Down DC-DC Converter, 16-VQFN",
    demandQty: 2400,
    demandTargetPrice: 1.45,
    distributorMedianPrice: 1.78,
    matchLevel: 1,
    matchLevelLabel: "Exact Match",
    matchedLot: inventoryLots[1],
    chipFlowScore: 96,
    scoreBreakdown: {
      mpnMatch: 25,
      supplierTrust: 20,
      priceScore: 15,
      traceability: 15,
      dateCode: 9,
      leadTime: 8,
      logistics: 4,
      notes: [
        "Exact MPN match",
        "Level 4 ChipFlow Inspected + Automotive EMS in Munich",
        "Original Invoice & CoC available",
        "Date code 2312 (< 24 months)",
        "Unit price $0.94 vs Market $1.78",
      ],
    },
    potentialSavings: 1224,
    confirmedSavings: 1224,
    status: "reserved",
    compliance: {
      eccn: "EAR99",
      source: "Texas Instruments Official Export Database",
      verifiedDate: "2026-08-25",
      sourceType: "Manufacturer Official",
      confidence: "Authoritative",
      hasConflict: false,
    },
  },
  {
    id: "OPP-003",
    bomLineId: "L004",
    refDes: "U11",
    demandMpn: "W25Q128JVSIQ",
    normalizedMpn: "W25Q128JVSIQ",
    manufacturer: "Winbond",
    description: "128Mb SPI NOR Flash, 133MHz, SOIC-8",
    demandQty: 2400,
    demandTargetPrice: 0.88,
    distributorMedianPrice: 1.05,
    matchLevel: 1,
    matchLevelLabel: "Exact Match",
    matchedLot: inventoryLots[2],
    chipFlowScore: 91,
    scoreBreakdown: {
      mpnMatch: 25,
      supplierTrust: 18,
      priceScore: 15,
      traceability: 13,
      dateCode: 9,
      leadTime: 7,
      logistics: 4,
      notes: [
        "Exact MPN match",
        "Lot size 12,000 pcs in Espoo, Finland",
        "CoC available, Tape & Reel package",
        "Unit price $0.62 vs Target $0.88",
      ],
    },
    potentialSavings: 624,
    confirmedSavings: 0,
    status: "matches-found",
    compliance: {
      eccn: "5A992",
      source: "Winbond Electronics Product Notification",
      verifiedDate: "2026-08-24",
      sourceType: "Manufacturer Official",
      confidence: "Authoritative",
      hasConflict: false,
    },
  },
  {
    id: "OPP-004",
    bomLineId: "L006",
    refDes: "U8",
    demandMpn: "LAN8720A-CP",
    normalizedMpn: "LAN8720A-CP",
    manufacturer: "Microchip Technology",
    description: "Small Footprint RMII 10/100 Ethernet Transceiver, QFN-24",
    demandQty: 2400,
    demandTargetPrice: 1.62,
    distributorMedianPrice: 1.95,
    matchLevel: 1,
    matchLevelLabel: "Exact Match",
    matchedLot: inventoryLots[4],
    chipFlowScore: 89,
    scoreBreakdown: {
      mpnMatch: 25,
      supplierTrust: 18,
      priceScore: 14,
      traceability: 13,
      dateCode: 8,
      leadTime: 7,
      logistics: 4,
      notes: [
        "Exact MPN match",
        "3,600 pcs in Stuttgart, Germany",
        "Full CoC and third-party AOI inspection passed",
      ],
    },
    potentialSavings: 1296,
    confirmedSavings: 0,
    status: "supplier-contacted",
    compliance: {
      eccn: "EAR99",
      source: "Microchip Technology ECCN Directory",
      verifiedDate: "2026-08-24",
      sourceType: "Manufacturer Official",
      confidence: "Authoritative",
      hasConflict: false,
    },
  },
  {
    id: "OPP-005",
    bomLineId: "L003",
    refDes: "U3",
    demandMpn: "MAX3232ESE+T",
    normalizedMpn: "MAX3232ESE+",
    manufacturer: "Analog Devices / Maxim",
    description: "3.0V to 5.5V RS-232 Transceiver, SOIC-16",
    demandQty: 2400,
    demandTargetPrice: 0.95,
    distributorMedianPrice: 1.34,
    matchLevel: 2,
    matchLevelLabel: "MFR Equivalent (Review Req.)",
    matchedLot: inventoryLots[3], // SP3232EEY-L
    chipFlowScore: 84,
    scoreBreakdown: {
      mpnMatch: 20,
      supplierTrust: 16,
      priceScore: 15,
      traceability: 12,
      dateCode: 9,
      leadTime: 8,
      logistics: 4,
      notes: [
        "Manufacturer Equivalent: SP3232EEY (MaxLinear)",
        "Pin-to-pin compatible RS-232 transceiver",
        "Engineering Review Recommended for ESD threshold",
        "Stockholm EMS stock at $0.48 (49% cost reduction)",
      ],
    },
    potentialSavings: 1128,
    confirmedSavings: 0,
    status: "matches-found",
    compliance: {
      eccn: "EAR99",
      source: "MaxLinear Compliance Department",
      verifiedDate: "2026-08-25",
      sourceType: "Manufacturer Official",
      confidence: "High",
      hasConflict: false,
    },
  },
]

// -------------------------------------------------------------
// Active RFQs & Transactions
// -------------------------------------------------------------
export const rfqRecords: RfqRecord[] = [
  {
    id: "RFQ-2026-881",
    opportunityId: "OPP-001",
    mpn: "STM32F103C8T6",
    demandQty: 2400,
    offeredLotId: "LOT-SE-9912",
    supplierDisplay: "Verified Tier-1 EMS · Gothenburg, Sweden",
    targetUnitPrice: 1.26,
    offeredUnitPrice: 1.26,
    currency: "USD",
    status: "confirmed",
    sentDate: "2026-08-25 04:12",
    validUntil: "2026-08-28",
    messages: [
      {
        id: "M1",
        time: "04:12",
        sender: "buyer",
        senderName: "Eliot (ChipFlow Procurement)",
        text: "Hej! We request formal quote and reservation for 2,400 pcs of STM32F103C8T6 (Lot A29177) at $1.26/pc. Please confirm factory sealed tray and CoC availability for dispatch to Shenzhen EMS.",
      },
      {
        id: "M2",
        time: "05:40",
        sender: "seller",
        senderName: "Nordic Supply Desk (Verified EMS)",
        text: "Quote accepted. 2,400 pcs reserved from Tray Lot A29177. Date code 2224 confirmed. Factory CoC and high-res packaging photos uploaded to ChipFlow Trust Vault. Ready for escrow.",
      },
    ],
  },
  {
    id: "RFQ-2026-879",
    opportunityId: "OPP-002",
    mpn: "TPS62130RGTR",
    demandQty: 2400,
    offeredLotId: "LOT-DE-4410",
    supplierDisplay: "Verified Automotive EMS · Munich, Germany",
    targetUnitPrice: 0.94,
    offeredUnitPrice: 0.94,
    currency: "USD",
    status: "reserved",
    sentDate: "2026-08-24 18:30",
    validUntil: "2026-08-27",
    messages: [
      {
        id: "M1",
        time: "18:30",
        sender: "buyer",
        senderName: "Eliot (ChipFlow)",
        text: "Inquiry for 2,400 pcs TPS62130RGTR Tape & Reel. Delivery required to Frankfurt hub.",
      },
      {
        id: "M2",
        time: "19:15",
        sender: "seller",
        senderName: "Bavaria EMS Sourcing",
        text: "Confirmed. 2,400 pcs reserved under ChipFlow Escrow #DE-99321. Date code 2312, original reels intact.",
      },
      {
        id: "M3",
        time: "20:00",
        sender: "chipflow_system",
        senderName: "ChipFlow Trust Engine",
        text: "Inspection verified. $1,224.00 confirmed savings locked into project PRJ-4471.",
      },
    ],
  },
  {
    id: "RFQ-2026-882",
    opportunityId: "OPP-004",
    mpn: "LAN8720A-CP",
    demandQty: 2400,
    offeredLotId: "LOT-DE-6623",
    supplierDisplay: "Verified EMS Partner · Stuttgart, Germany",
    targetUnitPrice: 1.08,
    offeredUnitPrice: 1.12,
    currency: "USD",
    status: "sent",
    sentDate: "2026-08-25 06:10",
    validUntil: "2026-08-29",
    messages: [
      {
        id: "M1",
        time: "06:10",
        sender: "buyer",
        senderName: "Eliot (ChipFlow)",
        text: "RFQ sent for 2,400 pcs LAN8720A-CP. Target unit price $1.08 with standard EU export documentation.",
      },
    ],
  },
]

// -------------------------------------------------------------
// Standardized BOM Lines
// -------------------------------------------------------------
export const bomLines: BomLine[] = [
  {
    id: "L001",
    refDes: "U1",
    rawMpn: "STM32F103C8T6-TR",
    mpn: "STM32F103C8T6",
    normalizedMpn: "STM32F103C8T6",
    manufacturer: "STMicroelectronics",
    description: "ARM Cortex-M3 MCU, 64KB Flash, LQFP48",
    category: "Microcontroller",
    package: "LQFP-48",
    qty: 2400,
    targetPrice: 1.92,
    status: "matched",
    confidence: { mpn: 99, manufacturer: 98, qty: 100, targetPrice: 95 },
    exportControl: "EAR99",
    bestChannel: "deadstock",
    savingsPct: 34,
    opportunityId: "OPP-001",
    offers: [
      { channel: "deadstock", label: "EU EMS Excess (Sweden)", unitPrice: 1.26, stock: 8400, leadTimeDays: 3, moq: 500, region: "SE" },
      { channel: "lcsc", label: "LCSC", unitPrice: 1.88, stock: 12400, leadTimeDays: 12, moq: 1, region: "CN" },
      { channel: "mouser", label: "Mouser", unitPrice: 2.41, stock: 3200, leadTimeDays: 5, moq: 1, region: "US" },
      { channel: "digikey", label: "DigiKey", unitPrice: 2.38, stock: 5100, leadTimeDays: 4, moq: 1, region: "US" },
    ],
    tiers: [
      { qty: 500, unitPrice: 1.45 },
      { qty: 1000, unitPrice: 1.34 },
      { qty: 2400, unitPrice: 1.26 },
    ],
    notes: "Matched with Gothenburg EMS private excess (Lot A29177). Factory CoC verified.",
  },
  {
    id: "L002",
    refDes: "U5",
    rawMpn: "TPS62130RGTR (TI)",
    mpn: "TPS62130RGTR",
    normalizedMpn: "TPS62130RGTR",
    manufacturer: "Texas Instruments",
    description: "3A Step-Down DC-DC Converter, 16-VQFN",
    category: "Power IC",
    package: "VQFN-16",
    qty: 2400,
    targetPrice: 1.45,
    status: "reserved",
    confidence: { mpn: 99, manufacturer: 99, qty: 100, targetPrice: 96 },
    exportControl: "EAR99",
    bestChannel: "deadstock",
    savingsPct: 35,
    opportunityId: "OPP-002",
    offers: [
      { channel: "deadstock", label: "Munich Automotive EMS", unitPrice: 0.94, stock: 6000, leadTimeDays: 2, moq: 1000, region: "DE" },
      { channel: "lcsc", label: "LCSC", unitPrice: 1.39, stock: 4500, leadTimeDays: 8, moq: 1, region: "CN" },
      { channel: "mouser", label: "Mouser", unitPrice: 1.78, stock: 12000, leadTimeDays: 4, moq: 1, region: "US" },
    ],
    tiers: [
      { qty: 1000, unitPrice: 1.05 },
      { qty: 2400, unitPrice: 0.94 },
    ],
    notes: "Lot reserved under Escrow #DE-99321. Date code 2312.",
  },
  {
    id: "L003",
    refDes: "U3",
    rawMpn: "MAX3232ESE+",
    mpn: "MAX3232ESE+T",
    normalizedMpn: "MAX3232ESE+",
    manufacturer: "Analog Devices / Maxim",
    description: "3.0V to 5.5V RS-232 Transceiver, SOIC-16",
    category: "Interface",
    package: "SOIC-16",
    qty: 2400,
    targetPrice: 0.95,
    status: "matched",
    confidence: { mpn: 96, manufacturer: 95, qty: 100, targetPrice: 90 },
    exportControl: "EAR99",
    bestChannel: "deadstock",
    savingsPct: 49,
    opportunityId: "OPP-005",
    offers: [
      { channel: "deadstock", label: "Stockholm EMS (SP3232E Equivalent)", unitPrice: 0.48, stock: 4500, leadTimeDays: 3, moq: 500, region: "SE" },
      { channel: "lcsc", label: "LCSC", unitPrice: 0.88, stock: 8000, leadTimeDays: 10, moq: 1, region: "CN" },
      { channel: "mouser", label: "Mouser", unitPrice: 1.34, stock: 2200, leadTimeDays: 4, moq: 1, region: "US" },
    ],
    tiers: [
      { qty: 500, unitPrice: 0.58 },
      { qty: 2400, unitPrice: 0.48 },
    ],
    notes: "Suggested Equivalent: SP3232EEY-L from Stockholm EMS. Engineering review required.",
  },
  {
    id: "L004",
    refDes: "U11",
    rawMpn: "W25Q128JVSIQ-ND",
    mpn: "W25Q128JVSIQ",
    normalizedMpn: "W25Q128JVSIQ",
    manufacturer: "Winbond",
    description: "128Mb SPI NOR Flash, 133MHz, SOIC-8",
    category: "Memory",
    package: "SOIC-8",
    qty: 2400,
    targetPrice: 0.88,
    status: "matched",
    confidence: { mpn: 98, manufacturer: 98, qty: 100, targetPrice: 95 },
    exportControl: "5A992",
    bestChannel: "deadstock",
    savingsPct: 30,
    opportunityId: "OPP-003",
    offers: [
      { channel: "deadstock", label: "Espoo Telecom EMS (Finland)", unitPrice: 0.62, stock: 12000, leadTimeDays: 3, moq: 1000, region: "FI" },
      { channel: "lcsc", label: "LCSC", unitPrice: 0.82, stock: 25000, leadTimeDays: 7, moq: 1, region: "CN" },
      { channel: "digikey", label: "DigiKey", unitPrice: 1.05, stock: 18000, leadTimeDays: 4, moq: 1, region: "US" },
    ],
    tiers: [
      { qty: 1000, unitPrice: 0.72 },
      { qty: 2400, unitPrice: 0.62 },
    ],
    notes: "Tape & Reel factory stock. Full CoC available.",
  },
  {
    id: "L005",
    refDes: "Y1",
    rawMpn: "ABM8-25.000MHZ",
    mpn: "ABM8-25.000MHZ-B2-T",
    normalizedMpn: "ABM8-25.000MHZ",
    manufacturer: "Abracon LLC",
    description: "25MHz Crystal ±20ppm 18pF SMD 3.2x2.5mm",
    category: "Timing",
    package: "SMD-3225",
    qty: 2400,
    targetPrice: 0.42,
    status: "sourced",
    confidence: { mpn: 95, manufacturer: 96, qty: 100, targetPrice: 90 },
    exportControl: "None",
    bestChannel: "lcsc",
    savingsPct: 17,
    offers: [
      { channel: "lcsc", label: "LCSC", unitPrice: 0.35, stock: 45000, leadTimeDays: 5, moq: 100, region: "CN" },
      { channel: "mouser", label: "Mouser", unitPrice: 0.54, stock: 8900, leadTimeDays: 3, moq: 1, region: "US" },
    ],
    tiers: [
      { qty: 500, unitPrice: 0.38 },
      { qty: 2400, unitPrice: 0.35 },
    ],
    notes: "Direct franchised distributor stock sufficient.",
  },
  {
    id: "L006",
    refDes: "U8",
    rawMpn: "LAN8720A-CP-TR",
    mpn: "LAN8720A-CP",
    normalizedMpn: "LAN8720A-CP",
    manufacturer: "Microchip Technology",
    description: "Small Footprint RMII 10/100 Ethernet Transceiver, QFN-24",
    category: "Interface",
    package: "QFN-24",
    qty: 2400,
    targetPrice: 1.62,
    status: "rfq-pending",
    confidence: { mpn: 99, manufacturer: 99, qty: 100, targetPrice: 95 },
    exportControl: "EAR99",
    bestChannel: "deadstock",
    savingsPct: 33,
    opportunityId: "OPP-004",
    offers: [
      { channel: "deadstock", label: "Stuttgart EMS Partner", unitPrice: 1.08, stock: 3600, leadTimeDays: 4, moq: 500, region: "DE" },
      { channel: "mouser", label: "Mouser", unitPrice: 1.95, stock: 1500, leadTimeDays: 5, moq: 1, region: "US" },
    ],
    tiers: [
      { qty: 500, unitPrice: 1.22 },
      { qty: 2400, unitPrice: 1.08 },
    ],
    notes: "Active RFQ-2026-882 sent. Awaiting final seller confirmation.",
  },
]

// -------------------------------------------------------------
// Live Agent Activity Feed Log
// -------------------------------------------------------------
export interface AgentLogEntry {
  id: string
  site: "lcsc" | "mouser" | "digikey" | "deadstock"
  message: string
  status: "done" | "running" | "matched"
  timestamp: string
}

export const seedAgentLog: AgentLogEntry[] = [
  {
    id: "a-1",
    site: "deadstock",
    message: "NordicEMS Gothenburg: Verified 8,400 pcs STM32F103C8T6 (Lot A29177) with factory CoC at $1.26/pc.",
    status: "matched",
    timestamp: "07:28:10",
  },
  {
    id: "a-2",
    site: "deadstock",
    message: "Bavaria Automotive Logistics: 2,400 pcs TPS62130RGTR reserved under Escrow #DE-99321.",
    status: "done",
    timestamp: "07:29:40",
  },
  {
    id: "a-3",
    site: "mouser",
    message: "Mouser API: Pulled real-time tier pricing for LAN8720A-CP ($1.95/pc @ 1,000 pcs).",
    status: "done",
    timestamp: "07:31:15",
  },
  {
    id: "a-4",
    site: "deadstock",
    message: "Espoo Telecom EMS: Winbond W25Q128JVSIQ 12,000 pcs Tape & Reel verified at $0.62.",
    status: "matched",
    timestamp: "07:32:02",
  },
]

export const agentMessagePool = [
  {
    site: "deadstock" as const,
    message: "Stockholm EMS: SP3232EEY-L 4,500 pcs matched as MFR equivalent for MAX3232ESE+ at $0.48.",
    status: "matched" as const,
  },
  {
    site: "lcsc" as const,
    message: "LCSC Direct: Verified 45,000 pcs ABM8-25.000MHZ-B2-T in stock at $0.35/pc.",
    status: "done" as const,
  },
  {
    site: "deadstock" as const,
    message: "Stuttgart EMS: Acknowledged RFQ-2026-882 for LAN8720A-CP (3,600 pcs available).",
    status: "running" as const,
  },
  {
    site: "digikey" as const,
    message: "DigiKey: Checked dual-use ECCN export rating for 18 BOM lines (EAR99 confirmed).",
    status: "done" as const,
  },
]
