// Swim-Lane Query
// Build a character's emotional and state journey across all scenes

MATCH (c:Character {id: $characterId})
MATCH (c)-[:IN_SCENE]->(state:CharacterState)-[:IN_SCENE]->(scene:Scene)

OPTIONAL MATCH (state)-[arc:EMOTIONAL_ARC]->(nextState:CharacterState)
WHERE nextState.sceneNumber > state.sceneNumber

OPTIONAL MATCH (state)-[interaction:INTERACTS_WITH]->(other:Character)

RETURN {
  sceneNumber: scene.sceneNumber,
  sceneId: scene.id,
  emotionalState: state.emotionalState,
  emotionalIntensity: state.emotionalIntensity,
  wardrobe: state.wardrobe,
  objectives: state.objectives,
  emotionalArc: CASE WHEN arc IS NOT NULL THEN {
    change: arc.change,
    trigger: arc.trigger,
    nextEmotion: nextState.emotionalState
  } ELSE null END,
  interactions: collect(DISTINCT {
    character: other.name,
    type: interaction.type,
    intensity: interaction.intensity
  })
} as swimLaneEntry

ORDER BY scene.sceneNumber ASC
