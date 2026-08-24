"""
Intelligent BOM Parsing & Normalization Engine for ChipFlow.
Handles unstructured, multi-language (CN/EN), and messy BOM spreadsheets & plain text pastes.
"""

import io
import re
import csv
from typing import List, Dict, Any
import openpyxl

def normalize_mpn(raw_mpn: str) -> str:
    """Clean up part numbers, remove redundant spaces, standard prefix/suffix."""
    if not raw_mpn:
        return ""
    cleaned = str(raw_mpn).strip().upper()
    # Remove surrounding quotes, brackets
    cleaned = re.sub(r'^[\[\(\{"\']+|[\]\)\}"\']+$', '', cleaned)
    return cleaned

def parse_excel_bom(file_bytes: bytes) -> List[Dict[str, Any]]:
    """Parses .xlsx binary content into structured BOM list."""
    wb = openpyxl.load_workbook(io.BytesIO(file_bytes), data_only=True)
    sheet = wb.active
    
    rows = list(sheet.iter_rows(values_only=True))
    if not rows:
        return []
    
    # Locate header row with intelligent fuzzy matching
    header_idx = 0
    col_mapping = {}
    
    for idx, row in enumerate(rows[:10]):
        row_str = [str(c).lower() if c is not None else "" for c in row]
        if any(kw in "".join(row_str) for kw in ["mpn", "型号", "part", "器件", "物料"]):
            header_idx = idx
            for col_i, val in enumerate(row_str):
                if any(k in val for k in ["mpn", "型号", "part number", "part_no", "物料编码", "物料型号"]):
                    col_mapping["mpn"] = col_i
                elif any(k in val for k in ["brand", "manufacturer", "品牌", "厂家", "原厂"]):
                    col_mapping["manufacturer"] = col_i
                elif any(k in val for k in ["qty", "quantity", "数量", "用量", "pcs"]):
                    col_mapping["quantity"] = col_i
                elif any(k in val for k in ["package", "footprint", "封装"]):
                    col_mapping["package"] = col_i
                elif any(k in val for k in ["desc", "description", "描述", "品名", "规格"]):
                    col_mapping["description"] = col_i
                elif any(k in val for k in ["price", "target", "目标价", "单价", "预算"]):
                    col_mapping["target_price"] = col_i
            break
            
    # Default fallback mapping if not found
    if "mpn" not in col_mapping:
        col_mapping["mpn"] = 0
        col_mapping["quantity"] = 1
        
    items = []
    line_no = 1
    for row in rows[header_idx + 1:]:
        if not row or row[col_mapping["mpn"]] is None:
            continue
        raw_mpn = str(row[col_mapping["mpn"]]).strip()
        if not raw_mpn or raw_mpn.lower() in ["none", "n/a", ""]:
            continue
            
        qty = 1000
        if "quantity" in col_mapping and row[col_mapping["quantity"]]:
            try:
                qty = int(float(str(row[col_mapping["quantity"]]).replace(",", "")))
            except:
                qty = 1000
                
        target_price = 0.0
        if "target_price" in col_mapping and row[col_mapping["target_price"]]:
            try:
                target_price = float(re.findall(r"[-+]?(?:\d*\.\d+|\d+)", str(row[col_mapping["target_price"]]))[0])
            except:
                target_price = 0.0
                
        items.append({
            "line_no": line_no,
            "mpn": normalize_mpn(raw_mpn),
            "manufacturer": str(row[col_mapping["manufacturer"]]).strip() if "manufacturer" in col_mapping and row[col_mapping["manufacturer"]] else "通用/待识别",
            "category": "电子元器件",
            "package": str(row[col_mapping["package"]]).strip() if "package" in col_mapping and row[col_mapping["package"]] else "Standard",
            "quantity": qty,
            "target_price_cny": target_price,
            "description": str(row[col_mapping["description"]]).strip() if "description" in col_mapping and row[col_mapping["description"]] else "",
            "status": "pending"
        })
        line_no += 1
        
    return items

def parse_text_bom(raw_text: str) -> List[Dict[str, Any]]:
    """Parses raw copy-pasted tabular text or CSV lines."""
    lines = [l.strip() for l in raw_text.strip().split("\n") if l.strip()]
    items = []
    line_no = 1
    
    for line in lines:
        parts = re.split(r'[\t,;|]+', line)
        if not parts:
            continue
        mpn = normalize_mpn(parts[0])
        qty = 1000
        if len(parts) > 1:
            try:
                qty = int(re.findall(r'\d+', parts[1])[0])
            except:
                qty = 1000
        mfg = parts[2].strip() if len(parts) > 2 else "通用/待识别"
        
        items.append({
            "line_no": line_no,
            "mpn": mpn,
            "manufacturer": mfg,
            "category": "通用器件",
            "package": "Standard",
            "quantity": qty,
            "target_price_cny": 0.0,
            "description": "",
            "status": "pending"
        })
        line_no += 1
        
    return items
