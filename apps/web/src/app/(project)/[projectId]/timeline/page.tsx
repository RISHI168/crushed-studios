// Video timeline assembly page
import { TimelinePanel } from '@/components/timeline/TimelinePanel'

export default function TimelinePage({
  params,
}: {
  params: { projectId: string }
}) {
  return (
    <div>
      <TimelinePanel projectId={params.projectId} />
    </div>
  )
}
