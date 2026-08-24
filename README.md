# ⚡ ChipFlow (eliotchipflow)

> **跨境电子元器件智能采购与决策引擎前端平台 (Next.js 16 + Tailwind CSS v4 + shadcn/ui)**  
> **Production Deployment**: [https://eliotchipflow.vercel.app](https://eliotchipflow.vercel.app)

---

## 🌟 核心功能与界面架构

1. **Universal BOM Ingestion (多模态 BOM 智能清洗与导入)**：
   - 支持拖拽上传 Excel、CSV、供应商报价单 PDF 或截图。
   - 内置智能 OCR 与字段解析流程（MPN、封装、需求量、目标价识别）。

2. **Cross-border Deadstock Arbitrage (欧洲呆滞料跨境流转套利)**：
   - 实时比对北欧（瑞典/德国）EMS 呆滞料库存与现货市场渠道（LCSC、Mouser、DigiKey 等）。
   - 智能计算降本百分比与现货可用性。

3. **Parametric Vector Alternative (GPU 高维向量替代推荐)**：
   - 电气参数级高维相似度匹配（Pin-to-Pin / 功能兼容），自动给出等效替代推荐。
   - EAR99 / ITAR 出口管制与合规分级筛查。

4. **Persistent AI Copilot (三语智能采购助理与工作台)**：
   - 智能生成中、英、瑞典语（Svenska）供应商询价与锁货邮件。
   - 侧边栏 Agent 实时动态流式输出、询价日志与阶梯价格监控。

5. **Multi-View Workspace (多维视图与报价矩阵)**：
   - **Data Grid 视图**：支持行级编辑、状态筛选、替代料比对。
   - **Kanban Board 视图**：采购流程看板管理（待解析、查价中、待询价、已锁货）。
   - **Analytics 视图**：采购降本率分析、渠道分布与风险敞口测算。

---

## 🛠️ 技术栈

- **框架**：[Next.js 16 (App Router)](https://nextjs.org/)
- **UI 库**：[React 19](https://react.dev/), [shadcn/ui](https://ui.shadcn.com/), [Base UI](https://base-ui.com/)
- **样式**：[Tailwind CSS v4](https://tailwindcss.com/), [Lucide React Icons](https://lucide.dev/)
- **图表**：[Recharts](https://recharts.org/)
- **部署平台**：[Vercel](https://vercel.com/global-growth/eliotchipflow)

---

## 🚀 本地开发与构建

### 1. 安装依赖

```bash
pnpm install
# 或者使用 npm / yarn
npm install
```

### 2. 启动本地开发服务

```bash
pnpm dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)。

### 3. 构建生产包

```bash
pnpm build
pnpm start
```

---

## 📁 目录结构

```
eliotchipflow/
├── app/
│   ├── layout.tsx         # 根布局与元数据
│   ├── globals.css        # 全局样式与 Tailwind 主题配置
│   ├── page.tsx           # ChipFlow 品牌 Landing Page
│   └── workspace/
│       └── page.tsx       # 采购工作台主界面入口
├── components/
│   ├── landing/           # Landing 页面专属组件 (看板预览等)
│   ├── ui/                # 基础 UI 组件库 (Button, Sheet, Dialog, Popover 等)
│   └── workspace/         # 采购工作台业务组件
│       ├── agent-feed-panel.tsx
│       ├── analytics-view.tsx
│       ├── board-view.tsx
│       ├── copilot-drawer.tsx
│       ├── data-grid-view.tsx
│       ├── dropzone-modal.tsx
│       ├── line-detail-sheet.tsx
│       ├── sidebar.tsx
│       ├── status-badges.tsx
│       ├── top-bar.tsx
│       └── workspace-view.tsx
├── lib/
│   ├── mock-data.ts       # BOM 物料、渠道、询价全量 Mock 数据
│   ├── utils.ts           # 工具函数 (cn)
│   └── workspace-context.tsx # 采购工作台全局状态 Context
└── public/                # 静态图片与图标资源
```

