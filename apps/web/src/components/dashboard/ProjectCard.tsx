// ProjectCard component
interface ProjectCardProps {
  title?: string
  status?: string
}

export function ProjectCard(props: ProjectCardProps = {}) {
  return <div data-component="ProjectCard">{/* TODO: Extract from legacy/App.jsx */}</div>
}
