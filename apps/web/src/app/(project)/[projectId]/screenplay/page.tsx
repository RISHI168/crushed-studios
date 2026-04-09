// Screenplay editing page
import { SceneEditor } from '@/components/screenplay/SceneEditor'
import { ActStructure } from '@/components/screenplay/ActStructure'
import { SceneTimeline } from '@/components/screenplay/SceneTimeline'

export default function ScreenplayPage({
  params,
}: {
  params: { projectId: string }
}) {
  return (
    <div className="grid grid-cols-3 gap-6 h-screen">
      <div className="col-span-2">
        <SceneEditor projectId={params.projectId} />
      </div>
      <div className="space-y-4">
        <ActStructure projectId={params.projectId} />
        <SceneTimeline projectId={params.projectId} />
      </div>
    </div>
  )
}
