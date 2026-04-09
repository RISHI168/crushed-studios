// Status badge component
interface StatusBadgeProps {
  status: 'draft' | 'in-progress' | 'completed' | 'error'
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <div data-component="StatusBadge" data-status={status}>{/* TODO: Extract from legacy/App.jsx */}</div>
}
