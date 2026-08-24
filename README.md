# ChipFlow (跨境电子元器件智能采购与决策引擎) - Prototype Demo

> **赛道方向**：新一代电子信息 / 智能制造 / 供应链出海与循环经济  
> **核心优势**：AI Agent 驱动的真实浏览器自动化查价（Ego-Style） + GPU 参数级高维向量检索替代推荐 + 欧洲 EMS 呆滞料跨境流转套利

---

## 🌟 核心功能特性

1. **BOM 智能清洗与多模态标准化 (`bom_parser.py`)**：
   - 自动识别并解析混乱格式的 Excel、CSV、非标文本。
   - 智能对齐 MPN、品牌、封装、需求数量、位号与目标价。
   - 预置车规级控制器（Automotive ECU）与工业物联网网关（Industrial IoT Gateway）测试集。

2. **Ego 范式真实浏览器查价 Agent (`pricing_agent.py`)**：
   - 复用本地采购员已登录的真实浏览器会话（Session Inheritance），免验证码与反爬封锁。
   - 实时流式传输（SSE）Agent 的思考、浏览器操作与阶梯定价提取日志。
   - 聚合立创商城（LCSC）、Mouser、DigiKey 等多源平台。

3. **GPU 参数级向量检索与 EOL 缺料替代推荐 (`vector_matcher.py`) —— 创始人核心技术亮点**：
   - 基于芯片 Datasheet 提取电气参数高维特征空间向量。
   - 毫秒级计算欧氏距离与余弦相似度，自动给出 **Pin-to-Pin 完全兼容** 与 **功能等效** 的替代方案及降本测算。

4. **中欧跨国现货流转与三语询价邮件工作台 (`crossborder_sourcing.py`)**：
   - 直连北欧（斯德哥尔摩/哥德堡）及德国（慕尼黑）EMS 呆滞料库存。
   - 一键生成专业合规的 **瑞典语 (Svenska)**、**英语 (English)**、**中文** 询价与锁货邮件。
   - 自动换算汇率（SEK/EUR/USD/CNY）与出口管制（EAR99/民用豁免）合规筛查。

5. **全流程报价矩阵一键导出 (`export-quote-excel`)**：
   - 一键生成带采购决策、货源渠道、替代料建议与总预算的 Excel 报价单。

---

## 🚀 快速启动指南

### 1. 本地运行

```bash
cd /Users/seamaslee/.gemini/antigravity/scratch/chipflow-demo
./run.sh
```

打开浏览器访问：**[http://127.0.0.1:8090](http://127.0.0.1:8090)**

---

## 🛠️ 技术栈与云端规划 (Google Cloud $300 额度)

- **前端**：HTML5, TailwindCSS (Dark/Light 科技风), Lucide Icons, Vanilla JS (SSE 流式连接)
- **后端**：Python 3.14, FastAPI, Uvicorn, NumPy, OpenPyXL, Pydantic
- **云端基座 (GCP Project: `project-bef14d05-0d8e-49b9-9d5`)**：
  - **Vertex AI (Gemini 2.0 Flash)**: BOM 杂乱文档 OCR / 三语邮件合成 / 规格书解析
  - **Cloud Run**: 后端 Serverless 部署（无请求缩容至 0，几乎零成本）
  - **Cloud SQL with pgvector**: 芯片高维参数向量存储与快速检索
  - **Cloud Storage (GCS)**: 原始 BOM 与 Datasheet PDF 存储
