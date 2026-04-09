// Video review and QA page
import { ReviewPanel } from '@/components/review/ReviewPanel'

export default function ReviewPage({
  params,
}: {
  params: { projectId: string }
}) {
  return (
    <div>
      <ReviewPanel projectId={params.projectId} />
    </div>
  )
}
