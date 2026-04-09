// AI Console page for production monitoring and generation
import { ConsolePanel } from '@/components/console/ConsolePanel'

export default function ConsolePage({
  params,
}: {
  params: { projectId: string }
}) {
  return (
    <div className="h-screen">
      <ConsolePanel projectId={params.projectId} />
    </div>
  )
}
