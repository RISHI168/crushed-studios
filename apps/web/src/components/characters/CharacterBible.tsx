// Character bible component for managing character details
interface CharacterBibleProps {
  projectId: string
}

export function CharacterBible({ projectId }: CharacterBibleProps) {
  return <div data-component="CharacterBible" data-project-id={projectId}>{/* TODO: Extract from legacy/App.jsx */}</div>
}
