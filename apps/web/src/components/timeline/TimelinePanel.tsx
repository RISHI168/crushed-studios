// TimelinePanel component
interface TimelinePanelProps {
  projectId: string
}

export function TimelinePanel({ projectId }: TimelinePanelProps) {
  return <div data-component="TimelinePanel" data-project-id={projectId}>{/* TODO: Extract from legacy/App.jsx */}</div>
}
