// Confirmation modal component
interface ConfirmModalProps {
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({ title, message, onConfirm, onCancel }: ConfirmModalProps) {
  return <div data-component="ConfirmModal">{/* TODO: Extract from legacy/App.jsx */}</div>
}
