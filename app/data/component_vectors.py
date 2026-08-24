"""
Parametric Vector Database & Datasheet Embedding Store for ChipFlow.
Enables GPU/Vector Nearest-Neighbor Matching for EOL / Shortage Chip Substitution.
"""

import numpy as np

# Component library with electrical parameter vectors, physical pinouts, and descriptions
COMPONENT_LIBRARY = {
    # 1. High Performance Isolation / Gate Drivers
    "ADUM4120BRIZ": {
        "mpn": "ADUM4120BRIZ",
        "manufacturer": "Analog Devices (ADI)",
        "category": "Isolated Gate Driver",
        "package": "SOIC-8-Wide",
        "pin_count": 8,
        "is_eol": False,
        "market_status": "Severe Global Shortage (Lead time 48w+)",
        "datasheet_params": {
            "isolation_voltage_vrms": 5000,
            "peak_output_current_a": 2.0,
            "max_prop_delay_ns": 65,
            "supply_voltage_max_v": 35.0,
            "cmti_kv_us": 100,
            "automotive_grade": True
        },
        # Normalized parameter vector for embedding search
        "param_vector": [5000, 2.0, 65, 35.0, 100, 1.0]
    },
    # Candidates for ADUM4120BRIZ
    "UCC21520DW": {
        "mpn": "UCC21520DW",
        "manufacturer": "Texas Instruments (TI)",
        "category": "Isolated Gate Driver",
        "package": "SOIC-16-Wide (Dual Channel)",
        "pin_count": 16,
        "is_eol": False,
        "market_status": "In Stock",
        "datasheet_params": {
            "isolation_voltage_vrms": 5700,
            "peak_output_current_a": 4.0,
            "max_prop_delay_ns": 40,
            "supply_voltage_max_v": 25.0,
            "cmti_kv_us": 100,
            "automotive_grade": True
        },
        "param_vector": [5700, 4.0, 40, 25.0, 100, 1.0],
        "pin_to_pin_compatible": False,
        "unit_price_cny": 14.5,
        "stock_quantity": 18500,
        "substitution_notes": "TI 经典双路隔离驱动，电气性能更强（4A峰值），但封装为 SOIC-16，需评估 PCB 空间。"
    },
    "NSi6602B-DSW": {
        "mpn": "NSi6602B-DSW",
        "manufacturer": "NOVOSNS (纳芯微)",
        "category": "Isolated Gate Driver",
        "package": "SOIC-8-Wide",
        "pin_count": 8,
        "is_eol": False,
        "market_status": "High Stock (Domestic Direct)",
        "datasheet_params": {
            "isolation_voltage_vrms": 5000,
            "peak_output_current_a": 2.0,
            "max_prop_delay_ns": 60,
            "supply_voltage_max_v": 30.0,
            "cmti_kv_us": 150,
            "automotive_grade": True
        },
        "param_vector": [5000, 2.0, 60, 30.0, 150, 1.0],
        "pin_to_pin_compatible": True,
        "unit_price_cny": 8.2,
        "stock_quantity": 45000,
        "substitution_notes": "🌟 纳芯微高可靠车规隔离驱动，Pin-to-Pin 硬件完全兼容，交期 < 3天，综合降本 62.7%。"
    },
    "Si8233BB-D-IS": {
        "mpn": "Si8233BB-D-IS",
        "manufacturer": "Skyworks / Silicon Labs",
        "category": "Isolated Gate Driver",
        "package": "SOIC-8-Wide",
        "pin_count": 8,
        "is_eol": False,
        "market_status": "Limited Stock",
        "datasheet_params": {
            "isolation_voltage_vrms": 2500,
            "peak_output_current_a": 0.5,
            "max_prop_delay_ns": 60,
            "supply_voltage_max_v": 24.0,
            "cmti_kv_us": 45,
            "automotive_grade": False
        },
        "param_vector": [2500, 0.5, 60, 24.0, 45, 0.0],
        "pin_to_pin_compatible": True,
        "unit_price_cny": 16.8,
        "stock_quantity": 3200,
        "substitution_notes": "引脚兼容但隔离耐压仅 2.5kVrms，不推荐用于 800V 高压母线系统。"
    },

    # 2. High Reliability Isolated RS-485 Transceiver
    "ADM2483BRWZ": {
        "mpn": "ADM2483BRWZ",
        "manufacturer": "Analog Devices (ADI)",
        "category": "Isolated RS-485 Transceiver",
        "package": "SOIC-16-Wide",
        "pin_count": 16,
        "is_eol": False,
        "market_status": "Shortage / High Price",
        "datasheet_params": {
            "isolation_voltage_vrms": 2500,
            "data_rate_kbps": 500,
            "supply_voltage_v": 5.0,
            "quiescent_current_ma": 2.5,
            "nodes_on_bus": 256,
            "esd_protection_kv": 15
        },
        "param_vector": [2500, 500, 5.0, 2.5, 256, 15]
    },
    # Candidates for ADM2483
    "CA-IS3082WX": {
        "mpn": "CA-IS3082WX",
        "manufacturer": "Chipanalog (川土微)",
        "category": "Isolated RS-485 Transceiver",
        "package": "SOIC-16-Wide",
        "pin_count": 16,
        "is_eol": False,
        "market_status": "In Stock",
        "datasheet_params": {
            "isolation_voltage_vrms": 5000,
            "data_rate_kbps": 500,
            "supply_voltage_v": 5.0,
            "quiescent_current_ma": 2.2,
            "nodes_on_bus": 256,
            "esd_protection_kv": 15
        },
        "param_vector": [5000, 500, 5.0, 2.2, 256, 15],
        "pin_to_pin_compatible": True,
        "unit_price_cny": 11.5,
        "stock_quantity": 30000,
        "substitution_notes": "🌟 川土微高压隔离 RS-485，Pin-to-Pin 兼容，隔离耐压升级为 5000Vrms，单价直降 66.2%。"
    },
    "MAX14853GWE+": {
        "mpn": "MAX14853GWE+",
        "manufacturer": "Analog Devices / Maxim",
        "category": "Isolated RS-485 Transceiver",
        "package": "SOIC-16-Wide",
        "pin_count": 16,
        "is_eol": False,
        "market_status": "In Stock",
        "datasheet_params": {
            "isolation_voltage_vrms": 2750,
            "data_rate_kbps": 500,
            "supply_voltage_v": 5.0,
            "quiescent_current_ma": 3.0,
            "nodes_on_bus": 128,
            "esd_protection_kv": 35
        },
        "param_vector": [2750, 500, 5.0, 3.0, 128, 35],
        "pin_to_pin_compatible": True,
        "unit_price_cny": 28.5,
        "stock_quantity": 5400,
        "substitution_notes": "欧美同线原厂备选方案，Pin-to-Pin 兼容，抗 ESD 性能更优，现货充足。"
    },

    # 3. 32-bit MCU Substitution (STM32 / GD32 / NXP)
    "STM32F407VGT6": {
        "mpn": "STM32F407VGT6",
        "manufacturer": "STMicroelectronics",
        "category": "32-bit MCU",
        "package": "LQFP-100",
        "pin_count": 100,
        "is_eol": False,
        "market_status": "High Price / Active Arbitrage",
        "datasheet_params": {
            "core_frequency_mhz": 168,
            "flash_kb": 1024,
            "sram_kb": 192,
            "ethernet_mac": True,
            "usb_otg_hs": True,
            "operating_temp_max_c": 85
        },
        "param_vector": [168, 1024, 192, 1.0, 1.0, 85]
    },
    "GD32F407VGT6": {
        "mpn": "GD32F407VGT6",
        "manufacturer": "GigaDevice (兆易创新)",
        "category": "32-bit MCU",
        "package": "LQFP-100",
        "pin_count": 100,
        "is_eol": False,
        "market_status": "In Stock",
        "datasheet_params": {
            "core_frequency_mhz": 168,
            "flash_kb": 1024,
            "sram_kb": 192,
            "ethernet_mac": True,
            "usb_otg_hs": True,
            "operating_temp_max_c": 85
        },
        "param_vector": [168, 1024, 192, 1.0, 1.0, 85],
        "pin_to_pin_compatible": True,
        "unit_price_cny": 21.0,
        "stock_quantity": 80000,
        "substitution_notes": "🌟 兆易创新工业级替代方案，Pin-to-Pin 硬件全兼容，代码高度复用，成本直降 50%。"
    }
}
