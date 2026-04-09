// Continuity tracking page
import { ContinuityTracker } from '@/components/continuity/ContinuityTracker'

export default function ContinuityPage({
  params,
}: {
  params: { projectId: string }
}) {
  return (
    <div>
      <ContinuityTracker projectId={params.projectId} />
    </div>
  )
}
