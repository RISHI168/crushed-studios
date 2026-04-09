// use-auth hook
import { useState } from 'react'

export function useauth() {
  const [state, setState] = useState(null)

  // TODO: Implement hook logic

  return { state, setState }
}
