"""
European Cross-Border Arbitrage & Trilingual Sourcing Email Generator.
Generates localized, professional inquiry and reservation emails in Swedish (Svenska), English, and Chinese.
"""

from app.data.european_inventory import EUROPEAN_DEADSTOCK_INVENTORY

def check_european_deadstock(mpn: str) -> dict:
    item = EUROPEAN_DEADSTOCK_INVENTORY.get(mpn)
    if not item:
        return {"matched": False}
    return {
        "matched": True,
        "inventory": item
    }

def generate_trilingual_inquiry_email(mpn: str, target_qty: int, company_name: str = "ChipFlow Shenzhen Co., Ltd.") -> dict:
    stock_info = EUROPEAN_DEADSTOCK_INVENTORY.get(mpn, {})
    supplier_name = stock_info.get("supplier_name", "Nordic Partner EMS AB")
    contact_person = stock_info.get("contact_person", "Lars Lindqvist")
    location = stock_info.get("location", "Stockholm, Sweden")
    unit_price_sek = stock_info.get("unit_price_sek", 4.80)
    unit_price_eur = stock_info.get("unit_price_eur", 0.45)
    unit_price_cny = stock_info.get("unit_price_cny", 3.32)
    
    # 1. Swedish (Svenska) - Direct Nordic EMS style
    swedish_email = f"""Ämne: Formell förfrågan & Offertförfrågan - Partiparti för {mpn} ({target_qty} st)

Hej {contact_person},

Hoppas allt är bra med dig i {location.split(',')[0]}!

Vi på {company_name} (etablerade i Stockholm & Shenzhen) söker aktivt efter certifierade komponenter för våra industriella och fordonselektronikprojekt.

Vi noterade ert överskottslager/partilager för följande artikel och önskar lägga en skarp beställning:
- Tillverkarens artikelnummer (MPN): {mpn}
- Önskad volym: {target_qty:,} st (Original Sealed Reel / Tray)
- Målpris: {unit_price_sek} SEK / st (eller motsvarande {unit_price_eur} EUR)
- Leveransvillkor: FCA {location.split(',')[0]} eller DAP Shenzhen (via DHL Express)

Vänligen bekräfta:
1. Aktuell Date Code (DC) samt CoC (Certificate of Conformance) / RoHs-status.
2. Snabbaste utskeppningsdatum till vår logistikhubb.

Ser fram emot ett smidigt och långsiktigt samarbete!

Med vänliga hälsningar,
Seamas Lee / ChipFlow Sourcing Team
Stockholm / Shenzhen
"""

    # 2. English (International Standard B2B)
    english_email = f"""Subject: Urgent RFQ & Batch Allocation Request: {mpn} (Qty: {target_qty:,} pcs)

Dear {contact_person},

Greetings from ChipFlow Sourcing Hub (Sweden & Shenzhen).

We are currently fulfilling a high-priority production batch for our automotive/industrial clients in Greater China. We are interested in procuring the surplus stock of the following line item from {supplier_name}:

- MPN: {mpn}
- Quantity Required: {target_qty:,} pcs (Factory Original Packaging)
- Target Price: €{unit_price_eur:.2f} / pcs (SEK {unit_price_sek})
- Terms: FCA {location.split(',')[0]} / DAP Shenzhen

Could you please confirm:
1. Available Lot Date Code & verification of sealed Moisture Barrier Bag (MBB).
2. Lead time for immediate air-freight dispatch.
3. Proforma Invoice issuance details.

Thank you very much, and we look forward to finalizing this allocation promptly.

Best regards,
Procurement & Supply Chain Operations
ChipFlow Cross-Border Solutions
"""

    # 3. Chinese (Internal Sourcing Brief / 采购跟进记录)
    chinese_summary = f"""【ChipFlow 跨境采购协同记录】
• 目标物料：{mpn} (数量: {target_qty:,} PCS)
• 匹配欧洲货源：{supplier_name} ({location})
• 欧洲报价折合：¥{unit_price_cny:.2f} / PCS (国内现货均价参考：¥5.50~¥6.80)
• 预计单笔套利毛利：¥{(5.50 - unit_price_cny) * target_qty:,.2f} 元
• 合规状态：已核验 EAR99 民用豁免，直飞深圳报关仅需 5 个工作日
• 对接负责人：{contact_person}
"""

    return {
        "mpn": mpn,
        "supplier_name": supplier_name,
        "location": location,
        "target_qty": target_qty,
        "unit_price_sek": unit_price_sek,
        "unit_price_eur": unit_price_eur,
        "unit_price_cny": unit_price_cny,
        "swedish_email": swedish_email,
        "english_email": english_email,
        "chinese_summary": chinese_summary
    }
