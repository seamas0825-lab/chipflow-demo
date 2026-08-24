"use client"

import { useWorkspace } from "@/lib/workspace-context"
import { OpportunitiesView } from "@/components/workspace/opportunities-view"
import { DataGridView } from "@/components/workspace/data-grid-view"
import { ExcessInventoryView } from "@/components/workspace/excess-inventory-view"
import { RfqsView } from "@/components/workspace/rfqs-view"
import { AnalyticsView } from "@/components/workspace/analytics-view"

export function WorkspaceView() {
  const { view } = useWorkspace()

  switch (view) {
    case "opportunities":
      return <OpportunitiesView />
    case "grid":
      return <DataGridView />
    case "inventory":
      return <ExcessInventoryView />
    case "rfqs":
      return <RfqsView />
    case "analytics":
      return <AnalyticsView />
    default:
      return <OpportunitiesView />
  }
}
