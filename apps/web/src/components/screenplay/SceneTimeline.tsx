// Scene timeline component
interface SceneTimelineProps {
  projectId: string
}

export function SceneTimeline({ projectId }: SceneTimelineProps) {
  return <div data-component="SceneTimeline" data-project-id={projectId}>{/* TODO: Extract from legacy/App.jsx */}</div>
}
