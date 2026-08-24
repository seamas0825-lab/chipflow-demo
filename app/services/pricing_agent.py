"""
Ego-Style Browser Pricing Agent for ChipFlow.
Simulates real browser navigation, session reuse, semantic snapshot extraction, and multi-tier pricing normalization.
Provides real-time SSE streaming logs to show the Agent's thought and execution trace.
"""

import asyncio
import json
from typing import AsyncGenerator
from app.data.european_inventory import EUROPEAN_DEADSTOCK_INVENTORY
from app.data.component_vectors import COMPONENT_LIBRARY

# Mock live pricing store for realistic fast lookup
LIVE_PRICE_CACHE = {
    "FS32K144HAT0MLHT": {
        "mpn": "FS32K144HAT0MLHT",
        "brand": "NXP",
        "lcsc": {"stock": 0, "price_1k": 0, "lead_time": "52 周 (原厂缺货)"},
        "mouser": {"stock": 1420, "price_1k": 44.5, "lead_time": "7-10 天 (国际转运)"},
        "digikey": {"stock": 850, "price_1k": 46.2, "lead_time": "5-7 天"},
        "best_spot": {"source": "Mouser", "price_cny": 44.5, "stock": 1420, "lead_time": "7 天"}
    },
    "TPS54302DDCR": {
        "mpn": "TPS54302DDCR",
        "brand": "Texas Instruments",
        "lcsc": {"stock": 38600, "price_1k": 2.35, "price_5k": 2.12, "lead_time": "现货 24h 发货"},
        "mouser": {"stock": 85000, "price_1k": 2.80, "lead_time": "现货 3-5 天"},
        "digikey": {"stock": 120000, "price_1k": 2.75, "lead_time": "现货 3-5 天"},
        "best_spot": {"source": "立创商城 (LCSC)", "price_cny": 2.12, "stock": 38600, "lead_time": "现货 24h"}
    },
    "TJA1042T/3/1J": {
        "mpn": "TJA1042T/3/1J",
        "brand": "NXP",
        "lcsc": {"stock": 1200, "price_1k": 5.85, "lead_time": "现货紧缺"},
        "mouser": {"stock": 3100, "price_1k": 6.20, "lead_time": "5-7 天"},
        "digikey": {"stock": 2500, "price_1k": 6.10, "lead_time": "5-7 天"},
        "best_spot": {"source": "欧洲 EMS 呆滞料 (Nordic Hub)", "price_cny": 3.32, "stock": 12500, "lead_time": "5 天 (DHL直飞深圳)"}
    },
    "ADUM4120BRIZ": {
        "mpn": "ADUM4120BRIZ",
        "brand": "Analog Devices",
        "lcsc": {"stock": 0, "price_1k": 0, "lead_time": "缺货 / 停产预警"},
        "mouser": {"stock": 0, "price_1k": 0, "lead_time": "交期 48 周+"},
        "digikey": {"stock": 0, "price_1k": 0, "lead_time": "交期 52 周"},
        "best_spot": {"source": "建议向量替代 (纳芯微 NSi6602B)", "price_cny": 8.20, "stock": 45000, "lead_time": "现货 24h"}
    },
    "IPB120N04S4-02": {
        "mpn": "IPB120N04S4-02",
        "brand": "Infineon",
        "lcsc": {"stock": 4200, "price_1k": 8.80, "lead_time": "现货 24h"},
        "mouser": {"stock": 15000, "price_1k": 9.15, "lead_time": "3-5 天"},
        "digikey": {"stock": 28000, "price_1k": 8.95, "lead_time": "3-5 天"},
        "best_spot": {"source": "立创商城 (LCSC)", "price_cny": 8.80, "stock": 4200, "lead_time": "现货 24h"}
    },
    "LM2904WDT": {
        "mpn": "LM2904WDT",
        "brand": "STMicroelectronics",
        "lcsc": {"stock": 120000, "price_1k": 0.88, "price_5k": 0.76, "lead_time": "现货 24h"},
        "mouser": {"stock": 65000, "price_1k": 1.15, "lead_time": "3-5 天"},
        "digikey": {"stock": 90000, "price_1k": 1.10, "lead_time": "3-5 天"},
        "best_spot": {"source": "立创商城 (LCSC)", "price_cny": 0.76, "stock": 120000, "lead_time": "现货 24h"}
    },
    "STM32F407VGT6": {
        "mpn": "STM32F407VGT6",
        "brand": "STMicroelectronics",
        "lcsc": {"stock": 210, "price_1k": 43.5, "lead_time": "现货少量"},
        "mouser": {"stock": 580, "price_1k": 46.8, "lead_time": "5-7 天"},
        "digikey": {"stock": 420, "price_1k": 45.2, "lead_time": "5-7 天"},
        "best_spot": {"source": "欧洲 EMS 呆滞料 (Gothenburg Hub)", "price_cny": 31.05, "stock": 4800, "lead_time": "6 天 (空运深圳)"}
    },
    "LAN8720A-CP-TR": {
        "mpn": "LAN8720A-CP-TR",
        "brand": "Microchip",
        "lcsc": {"stock": 18500, "price_1k": 7.45, "lead_time": "现货 24h"},
        "mouser": {"stock": 42000, "price_1k": 8.20, "lead_time": "3-5 天"},
        "digikey": {"stock": 35000, "price_1k": 8.05, "lead_time": "3-5 天"},
        "best_spot": {"source": "立创商城 (LCSC)", "price_cny": 7.45, "stock": 18500, "lead_time": "现货 24h"}
    },
    "ADM2483BRWZ": {
        "mpn": "ADM2483BRWZ",
        "brand": "Analog Devices",
        "lcsc": {"stock": 40, "price_1k": 38.0, "lead_time": "极度紧缺"},
        "mouser": {"stock": 150, "price_1k": 41.5, "lead_time": "7-10 天"},
        "digikey": {"stock": 90, "price_1k": 40.8, "lead_time": "7-10 天"},
        "best_spot": {"source": "建议向量替代 (川土微 CA-IS3082WX)", "price_cny": 11.5, "stock": 30000, "lead_time": "现货 24h"}
    },
    "W25Q128JVSIQ": {
        "mpn": "W25Q128JVSIQ",
        "brand": "Winbond",
        "lcsc": {"stock": 65000, "price_1k": 3.42, "lead_time": "现货 24h"},
        "mouser": {"stock": 110000, "price_1k": 3.85, "lead_time": "3-5 天"},
        "digikey": {"stock": 85000, "price_1k": 3.75, "lead_time": "3-5 天"},
        "best_spot": {"source": "立创商城 (LCSC)", "price_cny": 3.42, "stock": 65000, "lead_time": "现货 24h"}
    },
    "MP2307DN-LF-Z": {
        "mpn": "MP2307DN-LF-Z",
        "brand": "Monolithic Power (MPS)",
        "lcsc": {"stock": 24000, "price_1k": 2.75, "lead_time": "现货 24h"},
        "mouser": {"stock": 48000, "price_1k": 3.30, "lead_time": "3-5 天"},
        "digikey": {"stock": 31000, "price_1k": 3.15, "lead_time": "3-5 天"},
        "best_spot": {"source": "立创商城 (LCSC)", "price_cny": 2.75, "stock": 24000, "lead_time": "现货 24h"}
    }
}

async def stream_price_lookup(mpn: str, qty: int = 1000) -> AsyncGenerator[str, None]:
    """
    Streams the step-by-step execution log of the Ego Browser Agent as it checks prices across multiple sources.
    """
    yield f"data: {json.dumps({'event': 'thought', 'step': 1, 'text': f'🚀 [Agent Init] 启动 Ego 独立查价任务空间，加载采购员登录态与 VIP 折扣矩阵: {mpn}'}, ensure_ascii=False)}\n\n"
    await asyncio.sleep(0.3)
    
    yield f"data: {json.dumps({'event': 'browser_action', 'step': 2, 'tool': 'openOrReuseTab', 'url': f'https://so.szlcsc.com/global.html?k={mpn}', 'text': f'🌐 正在后台无头浏览器打开立创商城搜索页，定位型号 {mpn}...' }, ensure_ascii=False)}\n\n"
    await asyncio.sleep(0.4)
    
    yield f"data: {json.dumps({'event': 'browser_action', 'step': 3, 'tool': 'snapshotText', 'text': f'🔍 执行页面语义快照 snapshotText()，提取产品列表 DOM、现货库存与多阶梯定价表...' }, ensure_ascii=False)}\n\n"
    await asyncio.sleep(0.4)
    
    yield f"data: {json.dumps({'event': 'browser_action', 'step': 4, 'tool': 'openOrReuseTab', 'url': f'https://www.mouser.cn/c/?q={mpn}', 'text': f'🌐 并发跨标签页切换至 Mouser CN，提取国际大宗现货库存与美元/人民币汇率折算价...' }, ensure_ascii=False)}\n\n"
    await asyncio.sleep(0.4)
    
    # Check European Deadstock
    eu_match = EUROPEAN_DEADSTOCK_INVENTORY.get(mpn)
    if eu_match:
        supp_name = eu_match.get("supplier_name", "")
        supp_loc = eu_match.get("location", "")
        avail_qty = eu_match.get("quantity_available", 0)
        cny_p = eu_match.get("unit_price_cny", 0)
        msg = f"💡 [Cross-Border Arbitrage] 发现北欧 EMS 呆滞料货源！{supp_name} ({supp_loc})，原装封存库存 {avail_qty:,} PCS，折合仅需 ¥{cny_p} / PCS！"
        yield f"data: {json.dumps({'event': 'thought', 'step': 5, 'text': msg}, ensure_ascii=False)}\n\n"
        await asyncio.sleep(0.4)
        
    # Check Vector Substitutes if shortage
    if mpn in ["ADUM4120BRIZ", "ADM2483BRWZ"]:
        yield f"data: {json.dumps({'event': 'thought', 'step': 6, 'text': '⚠️ [Shortage Detected] 该原厂型号全球缺货/交期超 48 周，正在触发 GPU 参数级向量检索替代算法...'}, ensure_ascii=False)}\n\n"
        await asyncio.sleep(0.4)
        yield f"data: {json.dumps({'event': 'vector_match', 'step': 7, 'text': '⚡ [Vector Engine] 检索完成！基于 6 维电气特征向量空间，匹配度 98.4% 的高性价比 Pin-to-Pin 替代方案已锁定！'}, ensure_ascii=False)}\n\n"
        await asyncio.sleep(0.3)
        
    price_info = LIVE_PRICE_CACHE.get(mpn, {
        "mpn": mpn,
        "brand": "Standard",
        "best_spot": {"source": "分销综合行情", "price_cny": 5.0, "stock": 1000, "lead_time": "3-5 天"}
    })
    
    best_src = price_info["best_spot"]["source"]
    best_p = price_info["best_spot"]["price_cny"]
    result_text = f"✅ [{mpn}] 报价闭环完成！最佳推荐来源：{best_src}，参考单价：¥{best_p}，预计大幅节约采购成本。"
    
    yield f"data: {json.dumps({'event': 'result', 'step': 8, 'mpn': mpn, 'data': price_info, 'text': result_text}, ensure_ascii=False)}\n\n"

def get_cached_price(mpn: str) -> dict:
    return LIVE_PRICE_CACHE.get(mpn, {
        "mpn": mpn,
        "brand": "Standard",
        "best_spot": {"source": "分销综合行情", "price_cny": 5.0, "stock": 1000, "lead_time": "3-5 天"}
    })
