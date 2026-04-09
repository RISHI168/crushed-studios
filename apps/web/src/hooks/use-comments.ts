// use-comments hook
import { useState } from 'react'

export function usecomments() {
  const [state, setState] = useState(null)

  // TODO: Implement hook logic

  return { state, setState }
}
