/**
 * ChipFlow AI-Native Frontend Application
 * Handles reactive multi-view workspace (AI Board, DataGrid, Analytics),
 * Multimodal BOM Ingestion (Excel, PDF, Image OCR, Clipboard paste),
 * BOM AI Copilot, Ego Agent SSE live logs, Vector radar modal, Trilingual Email Studio, and Excel Export.
 */

let currentBom = {
    id: "automotive_ecu",
    filename: "车规域控标准 Benchmark BOM",
    format: "Excel/Structured",
    items: []
};

let chartChannelMix = null;
let chartLeadTime = null;

document.addEventListener("DOMContentLoaded", () => {
    initCharts();
    loadSampleBom("automotive_ecu");
    bindEvents();
    bindGlobalPaste();
    bindCommandPalette();
});

function bindEvents() {
    // View Switcher Buttons
    document.querySelectorAll(".view-tab-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const view = e.currentTarget.dataset.view;
            switchView(view);
        });
    });

    // Sample BOM Selector
    document.querySelectorAll(".btn-sample-bom").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".btn-sample-bom").forEach(b => {
                b.classList.remove("active", "bg-indigo-600", "text-white", "shadow-xs");
                b.classList.add("bg-slate-100", "text-slate-700");
            });
            const target = e.currentTarget;
            target.classList.add("active", "bg-indigo-600", "text-white", "shadow-xs");
            target.classList.remove("bg-slate-100", "text-slate-700");
            
            const bomId = target.dataset.id;
            loadSampleBom(bomId);
        });
    });

    // AI Chat Drawer Toggle
    const chatDrawer = document.getElementById("ai-chat-drawer");
    document.getElementById("btn-toggle-chat")?.addEventListener("click", () => {
        chatDrawer.classList.toggle("translate-x-full");
    });
    document.getElementById("btn-close-chat")?.addEventListener("click", () => {
        chatDrawer.classList.add("translate-x-full");
    });

    // Chat Form Submit
    document.getElementById("chat-form")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("chat-input");
        const val = input.value.trim();
        if (val) {
            sendChatMessage(val);
            input.value = "";
        }
    });

    // Prompt Chips
    document.querySelectorAll(".prompt-chip").forEach(chip => {
        chip.addEventListener("click", (e) => {
            const query = e.currentTarget.dataset.query;
            sendChatMessage(query);
        });
    });

    // Run All Agents
    document.getElementById("btn-run-all-agents")?.addEventListener("click", () => {
        runAllAgents();
    });

    // Export Excel
    document.getElementById("btn-export-excel")?.addEventListener("click", () => {
        exportExcel();
    });

    // Universal Upload Modal Events
    const uploadModal = document.getElementById("modal-upload");
    document.getElementById("btn-open-universal-upload")?.addEventListener("click", () => {
        uploadModal.classList.remove("hidden");
    });

    document.querySelectorAll(".modal-close").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll("#modal-upload, #modal-vector, #modal-email, #modal-command-palette").forEach(m => m.classList.add("hidden"));
        });
    });

    // Upload Type Tabs
    document.querySelectorAll(".upload-tab-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".upload-tab-btn").forEach(b => {
                b.classList.remove("active", "bg-indigo-50", "text-indigo-700", "border-indigo-200");
                b.classList.add("text-slate-600");
            });
            const target = e.currentTarget;
            target.classList.add("active", "bg-indigo-50", "text-indigo-700", "border", "border-indigo-200");
            target.classList.remove("text-slate-600");

            const tab = target.dataset.tab;
            const dropzone = document.getElementById("universal-dropzone");
            const textContent = document.getElementById("tab-content-text");
            const textMain = document.getElementById("dropzone-text-main");
            const textSub = document.getElementById("dropzone-text-sub");

            if (tab === "text") {
                dropzone.classList.add("hidden");
                textContent.classList.remove("hidden");
            } else {
                dropzone.classList.remove("hidden");
                textContent.classList.add("hidden");
                if (tab === "pdf") {
                    textMain.innerText = "拖拽 PDF 采购清单/工程图纸至此处，或点击浏览";
                    textSub.innerText = "支持解析多页 PDF 文档中的元器件表格与型号标注";
                } else if (tab === "image") {
                    textMain.innerText = "拖拽元器件截图或拍照图片至此处 (支持 Cmd+V 粘贴)";
                    textSub.innerText = "支持 .png, .jpg, .jpeg, .webp 图像 OCR 智能文字识别";
                } else {
                    textMain.innerText = "拖拽 Excel / CSV 文件至此处，或点击浏览";
                    textSub.innerText = "支持 .xlsx, .xls, .csv 等标准及非标表格自动对齐";
                }
            }
        });
    });

    // Dropzone Upload
    const dropZone = document.getElementById("universal-dropzone");
    const fileInput = document.getElementById("universal-file-input");
    dropZone?.addEventListener("click", () => fileInput.click());
    fileInput?.addEventListener("change", (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
        }
    });

    document.getElementById("btn-submit-universal-upload")?.addEventListener("click", () => {
        const textVal = document.getElementById("raw-text-input").value;
        if (textVal.trim()) {
            handleTextUpload(textVal);
        } else if (fileInput.files && fileInput.files[0]) {
            handleFileUpload(fileInput.files[0]);
        }
    });

    // DataGrid Search & Filter
    document.getElementById("datagrid-search")?.addEventListener("input", filterDataGrid);
    document.getElementById("datagrid-filter-status")?.addEventListener("change", filterDataGrid);
}

function switchView(viewName) {
    document.querySelectorAll(".view-tab-btn").forEach(btn => {
        if (btn.dataset.view === viewName) {
            btn.classList.add("active", "bg-white", "text-slate-900", "font-semibold", "shadow-2xs");
            btn.classList.remove("text-slate-600", "font-medium");
        } else {
            btn.classList.remove("active", "bg-white", "text-slate-900", "font-semibold", "shadow-2xs");
            btn.classList.add("text-slate-600", "font-medium");
        }
    });

    document.querySelectorAll(".workspace-view").forEach(view => view.classList.add("hidden"));
    document.getElementById(`view-${viewName}`)?.classList.remove("hidden");

    if (viewName === "analytics" && chartChannelMix && chartLeadTime) {
        chartChannelMix.resize();
        chartLeadTime.resize();
    }
}

function bindGlobalPaste() {
    window.addEventListener("paste", (e) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
                const blob = items[i].getAsFile();
                appendLog(`<div class="text-sky-300 font-bold">📋 [Clipboard] 检测到截图粘贴，正在启动 Vision OCR 多模态识别...</div>`);
                handleFileUpload(blob);
                break;
            }
        }
    });
}

function bindCommandPalette() {
    const palette = document.getElementById("modal-command-palette");
    const cmdInput = document.getElementById("cmd-input");

    document.getElementById("btn-cmd-palette")?.addEventListener("click", () => {
        palette.classList.remove("hidden");
        cmdInput.focus();
    });

    window.addEventListener("keydown", (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
            e.preventDefault();
            palette.classList.toggle("hidden");
            if (!palette.classList.contains("hidden")) {
                cmdInput.focus();
            }
        } else if (e.key === "Escape") {
            closeCmdPalette();
        }
    });
}

function closeCmdPalette() {
    document.getElementById("modal-command-palette")?.classList.add("hidden");
}

function initCharts() {
    const ctxChannel = document.getElementById("chart-channel-mix")?.getContext("2d");
    if (ctxChannel) {
        chartChannelMix = new Chart(ctxChannel, {
            type: "doughnut",
            data: {
                labels: ["国内现货 (立创/华强北)", "欧洲 EMS 呆滞料", "国产向量替代料", "国际现货 (Mouser)"],
                datasets: [{
                    data: [42, 38, 15, 5],
                    backgroundColor: ["#6366F1", "#FBBF24", "#A855F7", "#38BDF8"],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                cutout: "70%"
            }
        });
    }

    const ctxLead = document.getElementById("chart-lead-time")?.getContext("2d");
    if (ctxLead) {
        chartLeadTime = new Chart(ctxLead, {
            type: "bar",
            data: {
                labels: ["现货 24h", "欧洲直飞 5天", "国际 7-10天", "原厂 48周+ (缺料)"],
                datasets: [{
                    label: "物料款数",
                    data: [3, 2, 0, 1],
                    backgroundColor: ["#10B981", "#F59E0B", "#6366F1", "#EF4444"],
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: "#F1F5F9" }, ticks: { stepSize: 1, font: { size: 10 } } },
                    x: { grid: { display: false }, ticks: { font: { size: 10 } } }
                }
            }
        });
    }
}

function updateVisualCharts(items) {
    if (!chartChannelMix || !chartLeadTime) return;

    let euCount = 0;
    let lcscCount = 0;
    let subCount = 0;
    let mouserCount = 0;

    let lead24h = 0;
    let leadEu = 0;
    let leadIntl = 0;
    let leadShortage = 0;

    items.forEach(it => {
        if (it.has_european_stock) {
            euCount++;
            leadEu++;
        } else if (it.status === "shortage" || it.source_recommendation === "vector_substitute") {
            subCount++;
            leadShortage++;
        } else {
            lcscCount++;
            lead24h++;
        }
    });

    chartChannelMix.data.datasets[0].data = [lcscCount, euCount, subCount, mouserCount];
    chartChannelMix.update();

    chartLeadTime.data.datasets[0].data = [lead24h, leadEu, leadIntl, leadShortage];
    chartLeadTime.update();
}

async function loadSampleBom(bomId) {
    try {
        appendLog(`[System] 正在加载预置 BOM 场景数据集: ${bomId}...`);
        const res = await fetch(`/api/sample-boms/${bomId}`);
        const data = await res.json();
        if (data.success) {
            currentBom = data;
            updateFileMetaPill(data.name || "车规域控 Benchmark BOM", "Excel/Structured", false, 0.99);
            renderAllViews(data.items);
            updateSummaryMetrics(data.items);
            updateVisualCharts(data.items);
            appendLog(`[System] BOM 加载成功: 共 ${data.items.length} 行型号，已完成多模态字段对齐与合规初筛。`);
        }
    } catch (err) {
        console.error(err);
        appendLog(`[Error] 加载 BOM 失败: ${err.message}`);
    }
}

function updateFileMetaPill(filename, format, ocrUsed, confidence) {
    document.getElementById("meta-filename").innerText = filename;
    document.getElementById("meta-format-badge").innerText = format;
    const ocrBadge = document.getElementById("meta-ocr-badge");
    if (ocrUsed) {
        ocrBadge.classList.remove("hidden");
        ocrBadge.innerText = `OCR ${(confidence * 100).toFixed(1)}%`;
    } else {
        ocrBadge.classList.add("hidden");
    }
}

function renderAllViews(items) {
    renderDecisionBoard(items);
    renderBomTable(items);
}

function renderDecisionBoard(items) {
    const colStock = document.getElementById("board-col-stock");
    const colEu = document.getElementById("board-col-eu");
    const colSub = document.getElementById("board-col-sub");

    colStock.innerHTML = "";
    colEu.innerHTML = "";
    colSub.innerHTML = "";

    let countStock = 0;
    let countEu = 0;
    let countSub = 0;

    items.forEach(it => {
        const quote = it.quote?.best_spot;

        if (it.has_european_stock) {
            countEu++;
            const card = document.createElement("div");
            card.className = "bg-white border border-amber-200/90 rounded-xl p-3.5 shadow-2xs hover:border-amber-400 transition space-y-2.5";
            card.innerHTML = `
                <div class="flex items-center justify-between">
                    <span class="font-bold text-slate-900 font-mono text-xs">${it.mpn}</span>
                    <span class="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full font-mono">🇸🇪 斯德哥尔摩</span>
                </div>
                <div class="text-[11px] text-slate-500 truncate">${it.manufacturer} · ${it.package} · 用量 ${(it.quantity || 1000).toLocaleString()} PCS</div>
                <div class="flex items-center justify-between pt-1 border-t border-amber-100 text-xs">
                    <div>
                        <span class="text-slate-400 text-[10px]">欧洲议定单价</span>
                        <div class="text-amber-700 font-bold font-mono">¥${it.european_stock_info.unit_price_cny} <span class="text-[10px] text-slate-400 font-normal">(${it.european_stock_info.unit_price_sek} SEK)</span></div>
                    </div>
                    <button class="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-semibold px-2.5 py-1 rounded-lg text-[11px] transition flex items-center space-x-1 shadow-2xs" onclick="openEmailModal('${it.mpn}', ${it.quantity || 1000})">
                        <i data-lucide="mail" class="w-3 h-3 text-amber-700"></i>
                        <span>生成三语询价</span>
                    </button>
                </div>
            `;
            colEu.appendChild(card);
        } else if (it.status === "shortage" || it.source_recommendation === "vector_substitute") {
            countSub++;
            const card = document.createElement("div");
            card.className = "bg-white border border-purple-200/90 rounded-xl p-3.5 shadow-2xs hover:border-purple-400 transition space-y-2.5";
            card.innerHTML = `
                <div class="flex items-center justify-between">
                    <span class="font-bold text-slate-900 font-mono text-xs">${it.mpn}</span>
                    <span class="text-[10px] bg-rose-50 text-rose-700 font-semibold px-2 py-0.5 rounded-full">原厂缺料 48周+</span>
                </div>
                <div class="text-[11px] text-slate-500 truncate">${it.manufacturer} · ${it.package} · 用量 ${(it.quantity || 1000).toLocaleString()} PCS</div>
                <div class="p-2 bg-purple-50/50 rounded-lg border border-purple-100 text-[11px] space-y-1">
                    <div class="flex items-center justify-between">
                        <span class="font-bold text-purple-900 font-mono">纳芯微 NSi6602B</span>
                        <span class="text-purple-700 font-mono font-bold">99.5% 相似</span>
                    </div>
                    <div class="text-slate-600 flex justify-between">
                        <span>Pin-to-Pin 完全兼容</span>
                        <span class="text-emerald-700 font-bold">单价直降 62%</span>
                    </div>
                </div>
                <div class="flex items-center justify-between pt-1 border-t border-purple-100 text-xs">
                    <div>
                        <span class="text-slate-400 text-[10px]">替代参考单价</span>
                        <div class="text-purple-700 font-bold font-mono">¥8.20 <span class="text-[10px] text-slate-400 line-through">¥22.0</span></div>
                    </div>
                    <button class="bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-300 font-semibold px-2.5 py-1 rounded-lg text-[11px] transition flex items-center space-x-1 shadow-2xs" onclick="openVectorModal('${it.mpn}')">
                        <i data-lucide="cpu" class="w-3 h-3 text-purple-700"></i>
                        <span>向量雷达比对</span>
                    </button>
                </div>
            `;
            colSub.appendChild(card);
        } else {
            countStock++;
            const card = document.createElement("div");
            card.className = "bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs hover:border-indigo-300 transition space-y-2.5";
            card.innerHTML = `
                <div class="flex items-center justify-between">
                    <span class="font-bold text-slate-900 font-mono text-xs">${it.mpn}</span>
                    <span class="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full font-mono">现货充足</span>
                </div>
                <div class="text-[11px] text-slate-500 truncate">${it.manufacturer} · ${it.package} · 用量 ${(it.quantity || 1000).toLocaleString()} PCS</div>
                <div class="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                    <div>
                        <span class="text-slate-400 text-[10px]">立创最优单价</span>
                        <div class="text-emerald-600 font-bold font-mono">¥${quote?.price_cny || it.target_price_cny}</div>
                    </div>
                    <button class="bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200 font-medium px-2.5 py-1 rounded-lg text-[11px] transition flex items-center space-x-1" onclick="runSingleAgent('${it.mpn}', ${it.quantity || 1000})">
                        <i data-lucide="search" class="w-3 h-3 text-indigo-500"></i>
                        <span>Ego 查价</span>
                    </button>
                </div>
            `;
            colStock.appendChild(card);
        }
    });

    document.getElementById("board-count-stock").innerText = `${countStock} 款`;
    document.getElementById("board-count-eu").innerText = `${countEu} 款`;
    document.getElementById("board-count-sub").innerText = `${countSub} 款`;

    lucide.createIcons();
}

function renderBomTable(items) {
    const tbody = document.getElementById("bom-table-body");
    tbody.innerHTML = "";

    items.forEach((item, idx) => {
        const tr = document.createElement("tr");
        tr.className = "hover:bg-slate-50/80 transition border-b border-slate-100";
        tr.id = `row-${item.mpn}`;
        tr.dataset.mpn = item.mpn.toLowerCase();
        tr.dataset.mfg = (item.manufacturer || "").toLowerCase();
        tr.dataset.desc = (item.description || "").toLowerCase();
        tr.dataset.status = item.has_european_stock ? "eu" : ((item.status === "shortage" || item.source_recommendation === "vector_substitute") ? "sub" : "stock");

        let decisionHtml = "";
        let priceTag = "";
        const quote = item.quote?.best_spot;

        if (item.has_european_stock) {
            decisionHtml = `
                <div class="flex items-center space-x-1.5 cursor-pointer hover:opacity-80" onclick="openEmailModal('${item.mpn}', ${item.quantity})">
                    <span class="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold flex items-center">
                        <i data-lucide="globe-2" class="w-3 h-3 mr-1 text-amber-600"></i> 🇸🇪 欧洲现货匹配
                    </span>
                    <span class="text-[11px] text-slate-500 font-mono">¥${item.european_stock_info.unit_price_cny}/PCS</span>
                </div>
            `;
            priceTag = `<span class="text-amber-700 font-bold font-mono">¥ ${item.european_stock_info.unit_price_cny}</span>`;
        } else if (item.status === "shortage" || item.source_recommendation === "vector_substitute") {
            decisionHtml = `
                <div class="flex items-center space-x-1.5 cursor-pointer hover:opacity-80" onclick="openVectorModal('${item.mpn}')">
                    <span class="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-semibold flex items-center">
                        <i data-lucide="cpu" class="w-3 h-3 mr-1 text-purple-600"></i> ⚡ 建议向量替代
                    </span>
                    <span class="text-[11px] text-purple-600 font-mono">¥8.20/PCS (降62%)</span>
                </div>
            `;
            priceTag = `<span class="text-purple-700 font-bold font-mono">¥ ${quote?.price_cny || 8.2}</span>`;
        } else {
            decisionHtml = `
                <span class="text-slate-700 font-medium text-[11px] flex items-center">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                    ${quote?.source || "立创商城 (LCSC)"} (现货 ${quote?.stock || "充足"})
                </span>
            `;
            priceTag = `<span class="text-emerald-600 font-bold font-mono">¥ ${quote?.price_cny || item.target_price_cny}</span>`;
        }

        tr.innerHTML = `
            <td class="py-3 px-3.5 text-center text-slate-400 font-mono">${item.line_no || idx + 1}</td>
            <td class="py-3 px-3.5">
                <div class="font-bold text-slate-900 font-mono text-xs flex items-center space-x-1.5">
                    <span>${item.mpn}</span>
                    ${item.compliance?.level === 'GREEN' ? '<span class="text-[9px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1 py-0.2 rounded font-mono">EAR99</span>' : ''}
                </div>
                <div class="text-[11px] text-slate-500 truncate max-w-[200px]">${item.description || item.category || ''}</div>
            </td>
            <td class="py-3 px-3.5">
                <div class="text-slate-800 font-medium">${item.manufacturer}</div>
                <div class="text-[10px] text-slate-400 font-mono">${item.package}</div>
            </td>
            <td class="py-3 px-3.5 text-right font-mono font-medium text-slate-800">${(item.quantity || 1000).toLocaleString()}</td>
            <td class="py-3 px-3.5 text-right font-mono text-slate-400">¥${item.target_price_cny || '-'}</td>
            <td class="py-3 px-3.5 text-right" id="price-cell-${item.mpn}">${priceTag}</td>
            <td class="py-3 px-3.5">${decisionHtml}</td>
            <td class="py-3 px-3.5 text-center">
                <div class="flex items-center justify-center space-x-1.5">
                    <button class="bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 px-2 py-1 rounded-lg text-[11px] transition flex items-center space-x-1" onclick="runSingleAgent('${item.mpn}', ${item.quantity || 1000})">
                        <i data-lucide="search" class="w-3 h-3 text-indigo-500"></i>
                        <span>查价</span>
                    </button>
                    ${item.has_european_stock ? `
                        <button class="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-2 py-1 rounded-lg text-[11px] transition" title="生成三语邮件" onclick="openEmailModal('${item.mpn}', ${item.quantity || 1000})">
                            <i data-lucide="mail" class="w-3 h-3"></i>
                        </button>
                    ` : ''}
                    ${(item.status === 'shortage' || item.source_recommendation === 'vector_substitute') ? `
                        <button class="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-2 py-1 rounded-lg text-[11px] transition" title="GPU向量替代" onclick="openVectorModal('${item.mpn}')">
                            <i data-lucide="git-branch" class="w-3 h-3"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    lucide.createIcons();
}

function filterDataGrid() {
    const q = document.getElementById("datagrid-search").value.toLowerCase().trim();
    const st = document.getElementById("datagrid-filter-status").value;
    const rows = document.querySelectorAll("#bom-table-body tr");
    let visibleCount = 0;

    rows.forEach(r => {
        const matchesQuery = !q || r.dataset.mpn.includes(q) || r.dataset.mfg.includes(q) || r.dataset.desc.includes(q);
        const matchesStatus = st === "all" || r.dataset.status === st;

        if (matchesQuery && matchesStatus) {
            r.classList.remove("hidden");
            visibleCount++;
        } else {
            r.classList.add("hidden");
        }
    });

    document.getElementById("datagrid-count-badge").innerText = `Showing ${visibleCount} of ${rows.length} Items`;
}

function updateSummaryMetrics(items) {
    document.getElementById("stat-total-lines").innerText = `${items.length} 行`;
    
    const euCount = items.filter(i => i.has_european_stock).length;
    document.getElementById("stat-eu-matched").innerText = `${euCount} 款`;

    const subCount = items.filter(i => i.status === "shortage" || i.source_recommendation === "vector_substitute").length;
    document.getElementById("stat-substitutes").innerText = `${subCount} 款`;

    let totalBudget = 0;
    items.forEach(it => {
        const p = it.quote?.best_spot?.price_cny || it.target_price_cny || 5.0;
        totalBudget += p * (it.quantity || 1000);
    });
    document.getElementById("stat-total-savings").innerText = `¥ ${totalBudget.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}`;
}

function appendLog(html) {
    const logs = document.getElementById("agent-terminal-logs");
    const div = document.createElement("div");
    div.innerHTML = html;
    logs.appendChild(div);
    const container = document.getElementById("terminal-collapsible");
    if (container) container.scrollTop = container.scrollHeight;
}

function runSingleAgent(mpn, qty) {
    const badge = document.getElementById("agent-status-badge");
    badge.innerText = `RUNNING: ${mpn}`;
    badge.className = "text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold animate-pulse";

    appendLog(`<div class="text-sky-300 font-bold mt-2">---------------- 启动查价 Agent: ${mpn} (需求量: ${qty} PCS) ----------------</div>`);

    const eventSource = new EventSource(`/api/stream-quote/${mpn}?qty=${qty}`);

    eventSource.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.event === "thought") {
                appendLog(`<div class="text-slate-300">${data.text}</div>`);
            } else if (data.event === "browser_action") {
                appendLog(`<div class="text-emerald-400 font-medium">⚡ [Ego Browser] ${data.tool}: ${data.text}</div>`);
            } else if (data.event === "vector_match") {
                appendLog(`<div class="text-purple-300 font-bold">${data.text}</div>`);
            } else if (data.event === "result") {
                appendLog(`<div class="text-emerald-300 font-bold bg-slate-800 p-2 rounded-lg border border-emerald-500/30 my-1">${data.text}</div>`);
                badge.innerText = "IDLE";
                badge.className = "text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold";
                eventSource.close();
            }
        } catch (e) {
            console.error(e);
        }
    };

    eventSource.onerror = () => {
        eventSource.close();
        badge.innerText = "IDLE";
        badge.className = "text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold";
    };
}

async function runAllAgents() {
    if (!currentBom.items || currentBom.items.length === 0) return;
    appendLog(`<div class="text-amber-300 font-bold mt-3">🚀 [Batch Orchestrator] 启动全量多智能体并发查价流水线...</div>`);
    for (const item of currentBom.items) {
        runSingleAgent(item.mpn, item.quantity || 1000);
        await new Promise(r => setTimeout(r, 1800));
    }
}

async function sendChatMessage(query) {
    const chatContainer = document.getElementById("chat-messages");
    const drawer = document.getElementById("ai-chat-drawer");
    drawer.classList.remove("translate-x-full");

    const userMsg = document.createElement("div");
    userMsg.className = "chat-bubble flex items-start justify-end space-x-2.5";
    userMsg.innerHTML = `
        <div class="bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-none shadow-xs max-w-[85%] text-xs leading-relaxed">
            ${query}
        </div>
        <div class="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 font-bold text-xs">
            我
        </div>
    `;
    chatContainer.appendChild(userMsg);

    const loadingMsg = document.createElement("div");
    loadingMsg.className = "chat-bubble flex items-start space-x-2.5";
    loadingMsg.id = "ai-loading-bubble";
    loadingMsg.innerHTML = `
        <div class="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <i data-lucide="bot" class="w-3.5 h-3.5"></i>
        </div>
        <div class="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-xs max-w-[88%] text-slate-500 flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin"></div>
            <span>AI 正在分析 BOM 上下文与跨国现货...</span>
        </div>
    `;
    chatContainer.appendChild(loadingMsg);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    lucide.createIcons();

    try {
        const res = await fetch("/api/chat-bom", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: query, items: currentBom.items })
        });
        const json = await res.json();
        loadingMsg.remove();

        const aiMsg = document.createElement("div");
        aiMsg.className = "chat-bubble flex items-start space-x-2.5";
        const replyHtml = marked.parse(json.reply || "已完成分析。");
        aiMsg.innerHTML = `
            <div class="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <i data-lucide="bot" class="w-3.5 h-3.5"></i>
            </div>
            <div class="bg-white border border-slate-200 p-3.5 rounded-2xl rounded-tl-none shadow-xs max-w-[90%] text-slate-700 leading-relaxed space-y-2">
                ${replyHtml}
            </div>
        `;
        chatContainer.appendChild(aiMsg);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        lucide.createIcons();
    } catch (err) {
        loadingMsg.remove();
        console.error(err);
    }
}

async function handleFileUpload(file) {
    const formData = new FormData();
    formData.append("file", file);
    appendLog(`[Upload] 正在上传并多模态解析 BOM 文件: ${file.name}...`);
    document.getElementById("modal-upload").classList.add("hidden");

    try {
        const res = await fetch("/api/upload-bom", { method: "POST", body: formData });
        const json = await res.json();
        if (json.success) {
            currentBom = { id: "custom_upload", filename: json.filename, format: json.format, items: json.items };
            updateFileMetaPill(json.filename, json.format, json.ocr_used, json.confidence);
            renderAllViews(json.items);
            updateSummaryMetrics(json.items);
            updateVisualCharts(json.items);
            appendLog(`[Upload] 解析成功！格式: ${json.format}，共提取 ${json.items.length} 行型号。`);
        }
    } catch (err) {
        appendLog(`[Error] 解析文件失败: ${err.message}`);
    }
}

async function handleTextUpload(text) {
    const formData = new FormData();
    formData.append("raw_text", text);
    appendLog(`[Upload] 正在解析粘贴的 BOM 文本...`);
    document.getElementById("modal-upload").classList.add("hidden");

    try {
        const res = await fetch("/api/upload-bom", { method: "POST", body: formData });
        const json = await res.json();
        if (json.success) {
            currentBom = { id: "custom_text", filename: "剪贴板文本导入", format: "Text Stream", items: json.items };
            updateFileMetaPill("剪贴板文本导入", "Text Stream", false, 0.99);
            renderAllViews(json.items);
            updateSummaryMetrics(json.items);
            updateVisualCharts(json.items);
            appendLog(`[Upload] 文本 BOM 解析成功！共 ${json.items.length} 行型号。`);
        }
    } catch (err) {
        appendLog(`[Error] 解析文本失败: ${err.message}`);
    }
}

async function openVectorModal(mpn) {
    const modal = document.getElementById("modal-vector");
    const container = document.getElementById("modal-vector-content");
    container.innerHTML = `<div class="text-center py-8 text-slate-400 font-mono">⚡ 正在执行 GPU 向量最近邻相似度计算...</div>`;
    modal.classList.remove("hidden");

    try {
        const res = await fetch(`/api/vector-substitutes/${mpn}`);
        const json = await res.json();
        const data = json.data;

        if (!data.has_substitutes) {
            container.innerHTML = `<div class="text-center py-8 text-slate-500">该料号现货充足或暂无高相似度替代品。</div>`;
            return;
        }

        const target = data.target_details;
        let subsHtml = "";

        data.substitutes.forEach((sub, i) => {
            subsHtml += `
                <div class="bg-slate-50 border ${i === 0 ? 'border-purple-300 bg-purple-50/30' : 'border-slate-200'} rounded-2xl p-4 space-y-3 shadow-2xs">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                            <span class="font-bold text-sm text-slate-900 font-mono">${sub.substitute_mpn}</span>
                            <span class="text-xs text-slate-500 font-medium">(${sub.manufacturer})</span>
                            ${sub.pin_to_pin ? '<span class="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">Pin-to-Pin 完全兼容</span>' : '<span class="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">功能等效</span>'}
                        </div>
                        <div class="text-right">
                            <div class="text-[10px] text-slate-400">高维相似度</div>
                            <div class="text-sm font-bold text-purple-600 font-mono">${sub.similarity_score}%</div>
                        </div>
                    </div>

                    <p class="text-xs text-slate-600 leading-relaxed">${sub.notes}</p>

                    <div class="grid grid-cols-3 gap-2 bg-white p-2.5 rounded-xl border border-slate-100 text-xs font-mono">
                        <div><span class="text-slate-400">封装:</span> <span class="text-slate-800 font-medium">${sub.package}</span></div>
                        <div><span class="text-slate-400">参考单价:</span> <span class="text-emerald-600 font-bold">¥${sub.unit_price_cny}</span></div>
                        <div><span class="text-slate-400">现货库存:</span> <span class="text-indigo-600 font-bold">${sub.stock_quantity.toLocaleString()} PCS</span></div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = `
            <div class="bg-purple-50 border border-purple-200 p-4 rounded-2xl space-y-1.5">
                <div class="flex items-center justify-between">
                    <span class="text-xs text-purple-700 font-semibold">原厂待替代料号 (Target MPN)</span>
                    <span class="text-[10px] text-slate-500 font-mono">GPU 算力耗时: ${data.computation_time_ms} ms</span>
                </div>
                <div class="flex items-center space-x-3">
                    <span class="text-base font-bold text-slate-900 font-mono">${target.mpn}</span>
                    <span class="text-xs text-slate-500">(${target.manufacturer} / ${target.package})</span>
                    <span class="text-xs text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 font-medium">${target.market_status}</span>
                </div>
            </div>

            <div class="space-y-3">
                <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider">Top 最近邻向量替代方案：</h4>
                ${subsHtml}
            </div>
        `;
    } catch (err) {
        container.innerHTML = `<div class="text-rose-600 text-center py-6">检索替代料失败: ${err.message}</div>`;
    }
}

async function openEmailModal(mpn, qty) {
    const modal = document.getElementById("modal-email");
    const container = document.getElementById("modal-email-content");
    container.innerHTML = `<div class="text-center py-8 text-slate-400 font-mono">🇸🇪 正在调取北欧 EMS 现货库存账本并生成三语邮件...</div>`;
    modal.classList.remove("hidden");

    try {
        const res = await fetch("/api/generate-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mpn: mpn, quantity: qty, company_name: "ChipFlow Sourcing Hub" })
        });
        const json = await res.json();
        const data = json.data;

        container.innerHTML = `
            <div class="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between">
                <div>
                    <div class="text-xs text-amber-800 font-bold">匹配欧洲现货货源 (Nordic Dead-Stock Hub)</div>
                    <div class="text-sm font-bold text-slate-900 mt-0.5">${data.supplier_name}</div>
                    <div class="text-xs text-slate-500">${data.location} | 原装封存防潮包装 (MBB Intact)</div>
                </div>
                <div class="text-right">
                    <div class="text-xs text-slate-500">欧洲议定单价折合</div>
                    <div class="text-base font-bold text-amber-700 font-mono">¥${data.unit_price_cny} <span class="text-xs text-slate-400 font-normal">(${data.unit_price_sek} SEK)</span></div>
                    <div class="text-[11px] text-emerald-600 font-medium">国内现货套利差价: ~39.6%</div>
                </div>
            </div>

            <div>
                <div class="flex border-b border-slate-200 space-x-4 mb-3">
                    <button class="email-tab-btn active pb-2 border-b-2 border-amber-600 text-amber-800 text-xs font-bold" onclick="switchEmailTab('se')">
                        🇸🇪 瑞典语商务询价函 (Svenska)
                    </button>
                    <button class="email-tab-btn pb-2 border-b-2 border-transparent text-slate-500 hover:text-slate-800 text-xs font-medium" onclick="switchEmailTab('en')">
                        🇬🇧 国际商务英语 (English)
                    </button>
                    <button class="email-tab-btn pb-2 border-b-2 border-transparent text-slate-500 hover:text-slate-800 text-xs font-medium" onclick="switchEmailTab('zh')">
                        🇨🇳 采购内部备忘 (中文记录)
                    </button>
                </div>

                <div id="email-tab-se" class="email-tab-pane">
                    <textarea readonly class="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 font-mono leading-relaxed h-56 focus:outline-none custom-scrollbar">${data.swedish_email}</textarea>
                </div>
                <div id="email-tab-en" class="email-tab-pane hidden">
                    <textarea readonly class="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 font-mono leading-relaxed h-56 focus:outline-none custom-scrollbar">${data.english_email}</textarea>
                </div>
                <div id="email-tab-zh" class="email-tab-pane hidden">
                    <textarea readonly class="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 font-mono leading-relaxed h-56 focus:outline-none custom-scrollbar">${data.chinese_summary}</textarea>
                </div>
            </div>

            <div class="flex justify-end space-x-2">
                <button class="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-4 py-2 rounded-xl text-xs transition shadow-xs" onclick="navigator.clipboard.writeText(document.querySelector('.email-tab-pane:not(.hidden) textarea').value); alert('已复制邮件内容到剪贴板！');">
                    一键复制邮件草稿
                </button>
            </div>
        `;
    } catch (err) {
        container.innerHTML = `<div class="text-rose-600 text-center py-6">生成邮件失败: ${err.message}</div>`;
    }
}

function switchEmailTab(lang) {
    document.querySelectorAll(".email-tab-btn").forEach(b => {
        b.classList.remove("active", "border-amber-600", "text-amber-800");
        b.classList.add("border-transparent", "text-slate-500");
    });
    event.currentTarget.classList.add("active", "border-amber-600", "text-amber-800");
    event.currentTarget.classList.remove("border-transparent", "text-slate-500");

    document.querySelectorAll(".email-tab-pane").forEach(p => p.classList.add("hidden"));
    document.getElementById(`email-tab-${lang}`).classList.remove("hidden");
}

async function exportExcel() {
    if (!currentBom.items || currentBom.items.length === 0) {
        alert("当前没有可导出的 BOM 数据");
        return;
    }
    appendLog(`[Export] 正在生成标准核价 Excel 报表...`);
    try {
        const res = await fetch("/api/export-quote-excel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: currentBom.items })
        });
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "ChipFlow_Quotation_Matrix.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();
        appendLog(`[Export] 导出完成：ChipFlow_Quotation_Matrix.xlsx 已下载。`);
    } catch (err) {
        appendLog(`[Error] 导出失败: ${err.message}`);
    }
}
