// Notification component
interface NotificationProps {
  type: 'info' | 'success' | 'warning' | 'error'
  message: string
}

export function Notification({ type, message }: NotificationProps) {
  return <div data-component="Notification" data-type={type}>{/* TODO: Extract from legacy/App.jsx */}</div>
}
