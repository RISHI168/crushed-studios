// AppShell component
interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return <div data-component="AppShell">{children}</div>
}
