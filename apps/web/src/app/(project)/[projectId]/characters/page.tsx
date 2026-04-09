// Character management page
import { CharacterBible } from '@/components/characters/CharacterBible'

export default function CharactersPage({
  params,
}: {
  params: { projectId: string }
}) {
  return (
    <div>
      <CharacterBible projectId={params.projectId} />
    </div>
  )
}
