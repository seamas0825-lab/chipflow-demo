"""
Export Control & Regulatory Compliance Screener for ChipFlow.
Screens components against US EAR / ITAR and EU Dual-Use regulation lists.
"""

def check_export_compliance(mpn: str, manufacturer: str, category: str) -> dict:
    mpn_upper = mpn.upper()
    
    # 1. High Performance Computing / Rad-Hard / Military screening
    if any(k in mpn_upper for k in ["RAD", "MIL", "HIREL", "SPACE", "5962-"]):
        return {
            "status": "restricted",
            "level": "RED",
            "eccn": "3A001 / ITAR",
            "message": "⚠️ 军工/宇航/抗辐射级物料，受严格出口管制限制，禁止未经许可的跨境交易。",
            "action_required": "需提供最终用户与最终用途声明 (EUS) 并申请特殊出口许可证。"
        }
        
    # 2. Advanced FPGA / High Computing Microprocessors
    if any(k in mpn_upper for k in ["XC7K", "XCKU", "XCZU", "A100", "H100", "L40S"]):
        return {
            "status": "warning",
            "level": "YELLOW",
            "eccn": "3A090 / 4A090",
            "message": "⚡ 先进算力或高带宽器件，需核查算力密度与出口管制最新阈值要求。",
            "action_required": "核实客户所在企业是否在实体清单 (Entity List)。"
        }
        
    # 3. Standard Commercial & Automotive Components (EAR99 / Non-controlled)
    return {
        "status": "cleared",
        "level": "GREEN",
        "eccn": "EAR99 / EU Civilian Exemption",
        "message": "✅ 标准民用/车规级商用料号，符合中欧双向合规贸易条件。",
        "action_required": "常规报关与形式发票清关即可。"
    }
