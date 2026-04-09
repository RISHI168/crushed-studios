// Act structure component showing three-act structure
interface ActStructureProps {
  projectId: string
}

export function ActStructure({ projectId }: ActStructureProps) {
  return <div data-component="ActStructure" data-project-id={projectId}>{/* TODO: Extract from legacy/App.jsx */}</div>
}
