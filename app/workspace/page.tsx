import { WorkspaceProvider } from "@/lib/workspace-context"
import { WorkspaceSidebar } from "@/components/workspace/sidebar"
import { WorkspaceTopBar } from "@/components/workspace/top-bar"
import { WorkspaceView } from "@/components/workspace/workspace-view"
import { AgentFeedPanel } from "@/components/workspace/agent-feed-panel"
import { CopilotDrawer } from "@/components/workspace/copilot-drawer"
import { LineDetailSheet } from "@/components/workspace/line-detail-sheet"
import { DropzoneModal } from "@/components/workspace/dropzone-modal"

export default function WorkspacePage() {
  return (
    <WorkspaceProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <WorkspaceSidebar />
        <div className="flex h-full flex-1 flex-col overflow-hidden">
          <WorkspaceTopBar />
          <div className="flex flex-1 overflow-hidden">
            <main className="flex-1 overflow-hidden">
              <WorkspaceView />
            </main>
            <AgentFeedPanel />
          </div>
        </div>
      </div>
      <CopilotDrawer />
      <LineDetailSheet />
      <DropzoneModal />
    </WorkspaceProvider>
  )
}
