// Footer component
interface FooterProps {
  children: React.ReactNode
}

export function Footer({ children }: FooterProps) {
  return <div data-component="Footer">{children}</div>
}
