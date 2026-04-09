// Cascade Check Query
// Validate Identity Anchor Chain across all scenes

MATCH (c:Character {id: $characterId})
MATCH (c)-[:IDENTITY_ANCHOR]->(anchors:IdentityAnchor)

WITH c, collect(DISTINCT {
  sceneId: anchors.sceneId,
  attributes: anchors.attributes,
  timestamp: anchors.timestamp
}) as anchorStates

UNWIND anchorStates as current
UNWIND anchorStates as previous
WHERE previous.timestamp < current.timestamp

RETURN {
  characterId: c.id,
  characterName: c.name,
  validationResults: {
    totalAnchors: size(anchorStates),
    consistentAnchors: size([x IN anchorStates WHERE x.attributes = anchorStates[0].attributes]),
    contradictions: [
      x IN anchorStates WHERE NOT (x.attributes = anchorStates[0].attributes)
    ]
  },
  chainStatus: CASE
    WHEN size([x IN anchorStates WHERE NOT (x.attributes = anchorStates[0].attributes)]) = 0 THEN "VALID"
    ELSE "INVALID"
  END
} as cascadeCheckResult
