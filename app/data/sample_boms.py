"""
Sample BOM datasets for ChipFlow Demo.
Simulates real-world procurement scenarios: messy formats, mix of normal, shortage, and EOL components.
"""

SAMPLE_BOMS = {
    "automotive_ecu": {
        "id": "automotive_ecu",
        "name": "🚗 车规级车身域控制器 BOM (Automotive BCM/Zonal Controller)",
        "description": "典型车规控制板，包含车规 MCU、电源芯片、隔离驱动与 CAN 收发器。包含 2 处欧洲呆滞料可捡漏料号及 1 处高溢价停产替代点。",
        "items": [
            {
                "line_no": 1,
                "mpn": "FS32K144HAT0MLHT",
                "manufacturer": "NXP",
                "category": "车规级 32位 MCU",
                "package": "LQFP-64",
                "quantity": 2000,
                "target_price_cny": 38.5,
                "description": "Arm Cortex-M4F, 512KB Flash, CAN-FD, AEC-Q100 Grade 1",
                "status": "in_stock",
                "source_recommendation": "mouser"
            },
            {
                "line_no": 2,
                "mpn": "TPS54302DDCR",
                "manufacturer": "Texas Instruments",
                "category": "DC-DC 降压转换器",
                "package": "SOT-23-6",
                "quantity": 5000,
                "target_price_cny": 2.8,
                "description": "4.5V-28V Input, 3A Step-Down Converter 400kHz",
                "status": "in_stock",
                "source_recommendation": "lcsc"
            },
            {
                "line_no": 3,
                "mpn": "TJA1042T/3/1J",
                "manufacturer": "NXP",
                "category": "高速 CAN FD 收发器",
                "package": "SOIC-8",
                "quantity": 3000,
                "target_price_cny": 5.2,
                "description": "High-speed CAN transceiver with Standby Mode, AEC-Q100",
                "status": "eu_deadstock",
                "source_recommendation": "nordic_ems"
            },
            {
                "line_no": 4,
                "mpn": "ADUM4120BRIZ",
                "manufacturer": "Analog Devices (ADI)",
                "category": "隔离式栅极驱动器",
                "package": "SOIC-8-Wide",
                "quantity": 1500,
                "target_price_cny": 22.0,
                "description": "2A Isolated Precision Gate Driver, 5kVrms Isolation",
                "status": "shortage",
                "source_recommendation": "vector_substitute"
            },
            {
                "line_no": 5,
                "mpn": "IPB120N04S4-02",
                "manufacturer": "Infineon",
                "category": "汽车级 N沟道 MOSFET",
                "package": "TO-263-7",
                "quantity": 4000,
                "target_price_cny": 9.8,
                "description": "40V, 120A, 2.0 mOhm, AEC-Q101 OptiMOS-T2",
                "status": "in_stock",
                "source_recommendation": "digikey"
            },
            {
                "line_no": 6,
                "mpn": "LM2904WDT",
                "manufacturer": "STMicroelectronics",
                "category": "双路通用运算放大器",
                "package": "SOIC-8",
                "quantity": 6000,
                "target_price_cny": 1.1,
                "description": "Automotive Dual Operational Amplifier, -40°C to 125°C",
                "status": "in_stock",
                "source_recommendation": "lcsc"
            }
        ]
    },
    "industrial_gateway": {
        "id": "industrial_gateway",
        "name": "🏭 工业物联网智能网关 BOM (Industrial Edge Gateway)",
        "description": "工控边缘设备，包含经典 STM32 主控、以太网 PHY、隔离 RS485 及 Flash 存储。含停产 (EOL) 型号与欧洲现货套利机会。",
        "items": [
            {
                "line_no": 1,
                "mpn": "STM32F407VGT6",
                "manufacturer": "STMicroelectronics",
                "category": "32位高性能 MCU",
                "package": "LQFP-100",
                "quantity": 1000,
                "target_price_cny": 42.0,
                "description": "Arm Cortex-M4, 168MHz, 1MB Flash, 192KB SRAM, Ethernet MAC",
                "status": "eu_deadstock",
                "source_recommendation": "nordic_ems"
            },
            {
                "line_no": 2,
                "mpn": "LAN8720A-CP-TR",
                "manufacturer": "Microchip",
                "category": "以太网物理层收发器 PHY",
                "package": "QFN-24",
                "quantity": 1000,
                "target_price_cny": 8.5,
                "description": "10/100 Ethernet PHY with RMII Interface, Compact Footprint",
                "status": "in_stock",
                "source_recommendation": "lcsc"
            },
            {
                "line_no": 3,
                "mpn": "ADM2483BRWZ",
                "manufacturer": "Analog Devices (ADI)",
                "category": "隔离型 RS-485 收发器",
                "package": "SOIC-16-Wide",
                "quantity": 2000,
                "target_price_cny": 34.0,
                "description": "2.5kV Isolated, 500kbps, Half-Duplex RS-485 Transceiver",
                "status": "shortage",
                "source_recommendation": "vector_substitute"
            },
            {
                "line_no": 4,
                "mpn": "W25Q128JVSIQ",
                "manufacturer": "Winbond",
                "category": "SPI NOR Flash 128Mb",
                "package": "SOIC-8 (208mil)",
                "quantity": 1000,
                "target_price_cny": 3.9,
                "description": "128M-bit Serial Flash Memory with Dual/Quad SPI, 133MHz",
                "status": "in_stock",
                "source_recommendation": "lcsc"
            },
            {
                "line_no": 5,
                "mpn": "MP2307DN-LF-Z",
                "manufacturer": "Monolithic Power (MPS)",
                "category": "3A 同步降压稳压器",
                "package": "SOIC-8E",
                "quantity": 2000,
                "target_price_cny": 3.2,
                "description": "4.75V-23V Input, 3A, 340kHz Step-Down Converter",
                "status": "in_stock",
                "source_recommendation": "lcsc"
            }
        ]
    }
}
