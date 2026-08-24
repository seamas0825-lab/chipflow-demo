/**
 * ChipFlow Prototype Demo Application JS
 * Handles reactive state, SSE stream logs, vector modal, trilingual email generation, and Excel export.
 */

let currentBom = {
    id: "automotive_ecu",
    items: []
};

document.addEventListener("DOMContentLoaded", () => {
    loadSampleBom("automotive_ecu");
    bindEvents();
});

function bindEvents() {
    // Sample BOM selector buttons
    document.querySelectorAll(".btn-sample-bom").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".btn-sample-bom").forEach(b => {
                b.classList.remove("active", "bg-emerald-500/20", "text-emerald-300", "border-emerald-500/40");
                b.classList.add("bg-dark-700", "text-slate-300", "border-dark-600");
            });
            const target = e.currentTarget;
            target.classList.add("active", "bg-emerald-500/20", "text-emerald-300", "border-emerald-500/40");
            target.classList.remove("bg-dark-700", "text-slate-300", "border-dark-600");
            
            const bomId = target.dataset.id;
            loadSampleBom(bomId);
        });
    });

    // Run All Agents button
    document.getElementById("btn-run-all-agents")?.addEventListener("click", () => {
        runAllAgents();
    });

    // Export Excel button
    document.getElementById("btn-export-excel")?.addEventListener("click", () => {
        exportExcel();
    });

    // Upload Modal events
    const uploadModal = document.getElementById("modal-upload");
    document.getElementById("btn-open-upload")?.addEventListener("click", () => {
        uploadModal.classList.remove("hidden");
    });

    document.querySelectorAll(".modal-close").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll("#modal-upload, #modal-vector, #modal-email").forEach(m => m.classList.add("hidden"));
        });
    });

    // Dropzone upload
    const dropZone = document.getElementById("drop-zone");
    const fileInput = document.getElementById("file-input");
    dropZone?.addEventListener("click", () => fileInput.click());
    fileInput?.addEventListener("change", (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
        }
    });

    document.getElementById("btn-submit-upload")?.addEventListener("click", () => {
        const textVal = document.getElementById("raw-text-input").value;
        if (textVal.trim()) {
            handleTextUpload(textVal);
        } else if (fileInput.files && fileInput.files[0]) {
            handleFileUpload(fileInput.files[0]);
        }
    });
}

async function loadSampleBom(bomId) {
    try {
        appendLog(`[System] 正在加载预置 BOM 场景数据集: ${bomId}...`);
        const res = await fetch(`/api/sample-boms/${bomId}`);
        const data = await res.json();
        if (data.success) {
            currentBom = data;
            document.getElementById("bom-desc-text").innerText = data.description;
            renderBomTable(data.items);
            updateSummaryMetrics(data.items);
            appendLog(`[System] BOM 加载成功: 共 ${data.items.length} 行型号，已完成多模态字段对齐与合规初筛。`);
        }
    } catch (err) {
        console.error(err);
        appendLog(`[Error] 加载 BOM 失败: ${err.message}`);
    }
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

function renderBomTable(items) {
    const tbody = document.getElementById("bom-table-body");
    tbody.innerHTML = "";

    items.forEach((item, idx) => {
        const tr = document.createElement("tr");
        tr.className = "hover:bg-dark-700/40 transition border-b border-dark-700/40";
        tr.id = `row-${item.mpn}`;

        // Decision and Recommendation tag
        let decisionHtml = "";
        let priceTag = "";
        const quote = item.quote?.best_spot;

        if (item.has_european_stock) {
            decisionHtml = `
                <div class="flex items-center space-x-1.5 cursor-pointer hover:underline text-amber-300" onclick="openEmailModal('${item.mpn}', ${item.quantity})">
                    <span class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-semibold flex items-center">
                        <i data-lucide="globe-2" class="w-3 h-3 mr-1"></i> 🇸🇪 欧洲现货匹配
                    </span>
                    <span class="text-[10px] text-slate-400">¥${item.european_stock_info.unit_price_cny}/PCS</span>
                </div>
            `;
            priceTag = `<span class="text-amber-300 font-bold font-mono">¥ ${item.european_stock_info.unit_price_cny}</span>`;
        } else if (item.status === "shortage" || item.source_recommendation === "vector_substitute") {
            decisionHtml = `
                <div class="flex items-center space-x-1.5 cursor-pointer hover:underline text-purple-300" onclick="openVectorModal('${item.mpn}')">
                    <span class="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-semibold flex items-center">
                        <i data-lucide="cpu" class="w-3 h-3 mr-1"></i> ⚡ 建议向量替代
                    </span>
                    <span class="text-[10px] text-purple-400">¥8.20/PCS (降62%)</span>
                </div>
            `;
            priceTag = `<span class="text-purple-300 font-bold font-mono">¥ ${quote?.price_cny || 8.2}</span>`;
        } else {
            decisionHtml = `
                <span class="text-slate-300 font-medium text-[11px] flex items-center">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>
                    ${quote?.source || "立创商城 (LCSC)"} (现货 ${quote?.stock || "充足"})
                </span>
            `;
            priceTag = `<span class="text-emerald-400 font-bold font-mono">¥ ${quote?.price_cny || item.target_price_cny}</span>`;
        }

        tr.innerHTML = `
            <td class="py-3 px-3 text-center text-slate-500 font-mono">${item.line_no || idx + 1}</td>
            <td class="py-3 px-3">
                <div class="font-bold text-slate-100 font-mono text-xs flex items-center space-x-1">
                    <span>${item.mpn}</span>
                    ${item.compliance?.level === 'GREEN' ? '<span class="text-[9px] text-emerald-400 bg-emerald-900/40 px-1 py-0.2 rounded">EAR99</span>' : ''}
                </div>
                <div class="text-[11px] text-slate-400 truncate max-w-[180px]">${item.description || item.category || ''}</div>
            </td>
            <td class="py-3 px-3">
                <div class="text-slate-200 font-medium">${item.manufacturer}</div>
                <div class="text-[10px] text-slate-500 font-mono">${item.package}</div>
            </td>
            <td class="py-3 px-3 text-right font-mono font-medium text-slate-200">${(item.quantity || 1000).toLocaleString()}</td>
            <td class="py-3 px-3 text-right font-mono text-slate-400">¥${item.target_price_cny || '-'}</td>
            <td class="py-3 px-3 text-right" id="price-cell-${item.mpn}">${priceTag}</td>
            <td class="py-3 px-3">${decisionHtml}</td>
            <td class="py-3 px-3 text-center">
                <div class="flex items-center justify-center space-x-1">
                    <button class="bg-dark-700 hover:bg-emerald-600/30 text-emerald-400 border border-dark-600 hover:border-emerald-500/40 px-2 py-1 rounded text-[11px] transition flex items-center space-x-1" onclick="runSingleAgent('${item.mpn}', ${item.quantity || 1000})">
                        <i data-lucide="search" class="w-3 h-3"></i>
                        <span>Ego查价</span>
                    </button>
                    ${item.has_european_stock ? `
                        <button class="bg-dark-700 hover:bg-amber-600/30 text-amber-300 border border-dark-600 hover:border-amber-500/40 px-2 py-1 rounded text-[11px] transition" title="生成三语邮件" onclick="openEmailModal('${item.mpn}', ${item.quantity || 1000})">
                            <i data-lucide="mail" class="w-3 h-3"></i>
                        </button>
                    ` : ''}
                    ${(item.status === 'shortage' || item.source_recommendation === 'vector_substitute') ? `
                        <button class="bg-dark-700 hover:bg-purple-600/30 text-purple-300 border border-dark-600 hover:border-purple-500/40 px-2 py-1 rounded text-[11px] transition" title="GPU向量替代" onclick="openVectorModal('${item.mpn}')">
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

function appendLog(html) {
    const logs = document.getElementById("agent-terminal-logs");
    const div = document.createElement("div");
    div.innerHTML = html;
    logs.appendChild(div);
    logs.scrollTop = logs.scrollHeight;
}

function runSingleAgent(mpn, qty) {
    const badge = document.getElementById("agent-status-badge");
    badge.innerText = `AGENT RUNNING: ${mpn}`;
    badge.className = "text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse";

    appendLog(`<div class="text-cyan-400 font-bold mt-2">---------------- 启动查价 Agent: ${mpn} (需求量: ${qty} PCS) ----------------</div>`);

    const eventSource = new EventSource(`/api/stream-quote/${mpn}?qty=${qty}`);

    eventSource.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.event === "thought") {
                appendLog(`<div class="text-slate-300">${data.text}</div>`);
            } else if (data.event === "browser_action") {
                appendLog(`<div class="text-emerald-400 font-medium">⚡ [Ego Browser] ${data.tool}: ${data.text}</div>`);
            } else if (data.event === "vector_match") {
                appendLog(`<div class="text-purple-400 font-bold">${data.text}</div>`);
            } else if (data.event === "result") {
                appendLog(`<div class="text-emerald-300 font-bold bg-emerald-950/40 p-2 rounded border border-emerald-500/30 my-1">${data.text}</div>`);
                badge.innerText = "IDLE";
                badge.className = "text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30";
                eventSource.close();
            }
        } catch (e) {
            console.error(e);
        }
    };

    eventSource.onerror = () => {
        eventSource.close();
        badge.innerText = "IDLE";
        badge.className = "text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30";
    };
}

async function runAllAgents() {
    if (!currentBom.items || currentBom.items.length === 0) return;
    appendLog(`<div class="text-amber-400 font-bold mt-3">🚀 [Batch Orchestrator] 启动全量多智能体并发查价流水线...</div>`);
    for (const item of currentBom.items) {
        runSingleAgent(item.mpn, item.quantity || 1000);
        await new Promise(r => setTimeout(r, 1800));
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
            container.innerHTML = `<div class="text-center py-8 text-slate-400">该料号现货充足或暂无高相似度替代品。</div>`;
            return;
        }

        const target = data.target_details;
        let subsHtml = "";

        data.substitutes.forEach((sub, i) => {
            subsHtml += `
                <div class="bg-dark-900 border ${i === 0 ? 'border-emerald-500/60 bg-emerald-950/10' : 'border-dark-700'} rounded-xl p-4 space-y-3">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                            <span class="font-bold text-sm text-slate-100 font-mono">${sub.substitute_mpn}</span>
                            <span class="text-xs text-slate-400 font-medium">(${sub.manufacturer})</span>
                            ${sub.pin_to_pin ? '<span class="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">Pin-to-Pin 完全兼容</span>' : '<span class="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">功能等效 (需核验封装)</span>'}
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="text-right">
                                <div class="text-xs text-slate-400">高维相似度</div>
                                <div class="text-sm font-bold text-purple-400 font-mono">${sub.similarity_score}%</div>
                            </div>
                        </div>
                    </div>

                    <p class="text-xs text-slate-300 leading-relaxed">${sub.notes}</p>

                    <div class="grid grid-cols-3 gap-2 bg-dark-800/80 p-2.5 rounded-lg text-xs font-mono">
                        <div><span class="text-slate-500">封装:</span> <span class="text-slate-200">${sub.package}</span></div>
                        <div><span class="text-slate-500">参考单价:</span> <span class="text-emerald-400 font-bold">¥${sub.unit_price_cny}</span></div>
                        <div><span class="text-slate-500">现货库存:</span> <span class="text-cyan-400 font-bold">${sub.stock_quantity.toLocaleString()} PCS</span></div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = `
            <div class="bg-purple-950/30 border border-purple-500/30 p-4 rounded-xl space-y-2">
                <div class="flex items-center justify-between">
                    <span class="text-xs text-purple-300 font-semibold">原厂待替代料号 (Target MPN)</span>
                    <span class="text-[10px] text-slate-400 font-mono">GPU 算力耗时: ${data.computation_time_ms} ms</span>
                </div>
                <div class="flex items-center space-x-3">
                    <span class="text-base font-bold text-white font-mono">${target.mpn}</span>
                    <span class="text-xs text-slate-400">(${target.manufacturer} / ${target.package})</span>
                    <span class="text-xs text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">${target.market_status}</span>
                </div>
            </div>

            <div class="space-y-3">
                <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider">Top 最近邻向量替代料推荐：</h4>
                ${subsHtml}
            </div>
        `;
    } catch (err) {
        container.innerHTML = `<div class="text-rose-400 text-center py-6">检索替代料失败: ${err.message}</div>`;
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
            <div class="bg-amber-950/20 border border-amber-500/30 p-4 rounded-xl flex items-center justify-between">
                <div>
                    <div class="text-xs text-amber-300 font-bold">匹配欧洲现货货源 (Nordic Dead-Stock Hub)</div>
                    <div class="text-sm font-bold text-white mt-1">${data.supplier_name}</div>
                    <div class="text-xs text-slate-400">${data.location} | 原装封存防潮包装 (MBB Intact)</div>
                </div>
                <div class="text-right">
                    <div class="text-xs text-slate-400">欧洲议定单价折合</div>
                    <div class="text-base font-bold text-amber-400 font-mono">¥${data.unit_price_cny} <span class="text-xs text-slate-400">(${data.unit_price_sek} SEK)</span></div>
                    <div class="text-[10px] text-emerald-400">国内现货套利空间: ~39.6%</div>
                </div>
            </div>

            <!-- Tabs for Email languages -->
            <div>
                <div class="flex border-b border-dark-700 space-x-4 mb-3">
                    <button class="email-tab-btn active pb-2 border-b-2 border-amber-400 text-amber-300 text-xs font-bold" onclick="switchEmailTab('se')">
                        🇸🇪 瑞典语询价邮件 (Svenska)
                    </button>
                    <button class="email-tab-btn pb-2 border-b-2 border-transparent text-slate-400 hover:text-slate-200 text-xs font-medium" onclick="switchEmailTab('en')">
                        🇬🇧 国际商务英语 (English)
                    </button>
                    <button class="email-tab-btn pb-2 border-b-2 border-transparent text-slate-400 hover:text-slate-200 text-xs font-medium" onclick="switchEmailTab('zh')">
                        🇨🇳 采购内部备忘 (中文记录)
                    </button>
                </div>

                <div id="email-tab-se" class="email-tab-pane">
                    <textarea readonly class="w-full bg-dark-900 border border-dark-700 rounded-xl p-4 text-xs text-slate-200 font-mono leading-relaxed h-60 focus:outline-none custom-scrollbar">${data.swedish_email}</textarea>
                </div>
                <div id="email-tab-en" class="email-tab-pane hidden">
                    <textarea readonly class="w-full bg-dark-900 border border-dark-700 rounded-xl p-4 text-xs text-slate-200 font-mono leading-relaxed h-60 focus:outline-none custom-scrollbar">${data.english_email}</textarea>
                </div>
                <div id="email-tab-zh" class="email-tab-pane hidden">
                    <textarea readonly class="w-full bg-dark-900 border border-dark-700 rounded-xl p-4 text-xs text-slate-200 font-mono leading-relaxed h-60 focus:outline-none custom-scrollbar">${data.chinese_summary}</textarea>
                </div>
            </div>

            <div class="flex justify-end space-x-2">
                <button class="bg-amber-500 hover:bg-amber-600 text-dark-900 font-bold px-4 py-2 rounded-lg text-xs transition" onclick="navigator.clipboard.writeText(document.querySelector('.email-tab-pane:not(.hidden) textarea').value); alert('已复制邮件内容到剪贴板！');">
                    一键复制邮件草稿
                </button>
            </div>
        `;
    } catch (err) {
        container.innerHTML = `<div class="text-rose-400 text-center py-6">生成邮件失败: ${err.message}</div>`;
    }
}

function switchEmailTab(lang) {
    document.querySelectorAll(".email-tab-btn").forEach(b => {
        b.classList.remove("active", "border-amber-400", "text-amber-300");
        b.classList.add("border-transparent", "text-slate-400");
    });
    event.currentTarget.classList.add("active", "border-amber-400", "text-amber-300");
    event.currentTarget.classList.remove("border-transparent", "text-slate-400");

    document.querySelectorAll(".email-tab-pane").forEach(p => p.classList.add("hidden"));
    document.getElementById(`email-tab-${lang}`).classList.remove("hidden");
}

async function handleFileUpload(file) {
    const formData = new FormData();
    formData.append("file", file);
    appendLog(`[Upload] 正在上传并解析 Excel BOM: ${file.name}...`);
    document.getElementById("modal-upload").classList.add("hidden");

    try {
        const res = await fetch("/api/upload-bom", { method: "POST", body: formData });
        const json = await res.json();
        if (json.success) {
            currentBom = { id: "custom_upload", items: json.items };
            renderBomTable(json.items);
            updateSummaryMetrics(json.items);
            appendLog(`[Upload] 自定义 BOM 解析成功！共 ${json.items.length} 行型号。`);
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
            currentBom = { id: "custom_text", items: json.items };
            renderBomTable(json.items);
            updateSummaryMetrics(json.items);
            appendLog(`[Upload] 文本 BOM 解析成功！共 ${json.items.length} 行型号。`);
        }
    } catch (err) {
        appendLog(`[Error] 解析文本失败: ${err.message}`);
    }
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
