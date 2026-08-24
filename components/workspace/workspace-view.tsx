"use client"

import { useWorkspace } from "@/lib/workspace-context"
import { BoardView } from "@/components/workspace/board-view"
import { DataGridView } from "@/components/workspace/data-grid-view"
import { AnalyticsView } from "@/components/workspace/analytics-view"

export function WorkspaceView() {
  const { view } = useWorkspace()

  if (view === "grid") return <DataGridView />
  if (view === "analytics") return <AnalyticsView />
  return <BoardView />
}
