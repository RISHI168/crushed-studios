// use-persistence hook
import { useState } from 'react'

export function usepersistence() {
  const [state, setState] = useState(null)

  // TODO: Implement hook logic

  return { state, setState }
}
