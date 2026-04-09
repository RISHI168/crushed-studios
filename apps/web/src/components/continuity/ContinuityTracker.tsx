// Continuity tracker component
interface ContinuityTrackerProps {
  projectId: string
}

export function ContinuityTracker({ projectId }: ContinuityTrackerProps) {
  return <div data-component="ContinuityTracker" data-project-id={projectId}>{/* TODO: Extract from legacy/App.jsx */}</div>
}
