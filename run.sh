#!/usr/bin/env bash
cd "$(dirname "$0")"

echo "=========================================================="
echo "🚀 启动 ChipFlow 跨境元器件智能采购与决策引擎 Demo"
echo "=========================================================="

if [ -d "venv" ]; then
    source venv/bin/activate
fi

python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8090 --reload
