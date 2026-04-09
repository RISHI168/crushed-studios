// Scene editor component for screenplay editing
interface SceneEditorProps {
  projectId: string
}

export function SceneEditor({ projectId }: SceneEditorProps) {
  return <div data-component="SceneEditor" data-project-id={projectId}>{/* TODO: Extract from legacy/App.jsx Region 5 */}</div>
}
