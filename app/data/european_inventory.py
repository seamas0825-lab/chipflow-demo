"""
European EMS Dead-Stock & Distributor Surplus Inventory Ledger for ChipFlow.
Simulates verified Nordic & DACH region inventory pipelines with direct cross-border arbitrage opportunities.
"""

EUROPEAN_DEADSTOCK_INVENTORY = {
    "TJA1042T/3/1J": {
        "mpn": "TJA1042T/3/1J",
        "manufacturer": "NXP",
        "description": "High-Speed CAN FD Transceiver with Standby Mode, AEC-Q100",
        "supplier_name": "Nordic EMS Solutions AB",
        "location": "Stockholm, Sweden (Kista Science City)",
        "quantity_available": 12500,
        "lot_date_code": "2238+",
        "package_condition": "Original Sealed Reel (MBB intact, Factory Dry Pack, MSL 3)",
        "currency": "SEK",
        "unit_price_sek": 4.80,   # ~3.33 CNY / 0.46 USD (Arbitrage: Domestic market price ~5.5-6.8 CNY)
        "unit_price_cny": 3.32,
        "unit_price_usd": 0.46,
        "min_order_quantity": 2500,
        "lead_time_days": 5,     # Air DHL Express to Shenzhen
        "contact_person": "Lars Lindqvist (Procurement & Asset Recovery Director)",
        "contact_email": "lars.lindqvist@nordic-ems.se",
        "export_compliance": "EAR99 (Non-controlled / Dual-use clearance passed)",
        "arbitrage_analysis": "欧洲某汽车 Tier-1 产线切换遗留尾料，原装卷带未拆封，相比国内现货分销商（5.5元）具有 39.6% 价格优势，且无假货/翻新风险。"
    },
    "STM32F407VGT6": {
        "mpn": "STM32F407VGT6",
        "manufacturer": "STMicroelectronics",
        "description": "Arm Cortex-M4 168MHz MCU with 1MB Flash, LQFP-100",
        "supplier_name": "Baltic Industrial Electronics OÜ / Göteborg Hub",
        "location": "Gothenburg, Sweden / Tallinn Hub",
        "quantity_available": 4800,
        "lot_date_code": "2312+",
        "package_condition": "Original Sealed Tray with ESD protection",
        "currency": "EUR",
        "unit_price_eur": 3.95,   # ~31.0 CNY / 4.30 USD (Domestic spot price: 42-48 CNY)
        "unit_price_cny": 31.05,
        "unit_price_usd": 4.30,
        "min_order_quantity": 900,
        "lead_time_days": 6,
        "contact_person": "Astrid Bergström (Component Sourcing Lead)",
        "contact_email": "astrid.b@baltic-components.se",
        "export_compliance": "EU Dual-Use Annex I Exemption Verified (Civilian Industrial Use)",
        "arbitrage_analysis": "瑞典工控设备厂商项目缩减释放的呆滞料，正品托盘装，相比国内现货商每颗净省 11 元，千颗订单直接降本 1.1 万元。"
    },
    "FS32K144HAT0MLHT": {
        "mpn": "FS32K144HAT0MLHT",
        "manufacturer": "NXP",
        "description": "32-bit Automotive MCU, Cortex-M4F, AEC-Q100 Grade 1",
        "supplier_name": "Scania Electronics Logistics Hub",
        "location": "Södertälje, Sweden",
        "quantity_available": 3200,
        "lot_date_code": "2340+",
        "package_condition": "Sealed Moisture Bag, Factory Certified",
        "currency": "EUR",
        "unit_price_eur": 4.20,
        "unit_price_cny": 33.0,
        "unit_price_usd": 4.56,
        "min_order_quantity": 1000,
        "lead_time_days": 5,
        "contact_person": "Henrik Wallin",
        "contact_email": "henrik.w@scania-components.se",
        "export_compliance": "EAR99 Automotive Grade (Cleared)",
        "arbitrage_analysis": "北欧重卡电控供应链储备富余物料，欧洲原厂直供批次，现货直发。"
    }
}
