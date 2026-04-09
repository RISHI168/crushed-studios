// Carry-Forward Query
// Load character state and constraints from previous scenes

MATCH (c:Character {id: $characterId})
OPTIONAL MATCH (c)-[:CARRY_FORWARD]->(prev:CharacterState)
WHERE prev.sceneId = $previousSceneId

OPTIONAL MATCH (c)-[rel:EMOTIONAL_ARC]->(current:CharacterState)
WHERE current.sceneId = $currentSceneId

OPTIONAL MATCH (c)-[interaction:INTERACTS_WITH]->(other:Character)
WHERE interaction.sceneId = $previousSceneId

RETURN {
  characterId: c.id,
  characterName: c.name,
  previousState: {
    emotion: prev.emotionalState,
    intensity: prev.emotionalIntensity,
    wardrobe: prev.wardrobe,
    physicalChanges: prev.physicalChanges,
    objectives: prev.objectives
  },
  carryForwardConstraints: {
    emotionalContinuity: rel.change,
    wardrobeContinuity: prev.wardrobe,
    relationshipStates: collect({
      otherCharacter: other.name,
      type: interaction.type,
      intensity: interaction.intensity
    })
  },
  identityAnchors: {
    nameVariations: c.nicknames,
    loraReference: c.loraReference,
    physicalConstants: c.physicalAttributes
  }
} as carryForwardData
