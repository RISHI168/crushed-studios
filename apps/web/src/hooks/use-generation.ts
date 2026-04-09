// Hook for managing generation state
import { useState } from 'react'

export function useGeneration() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)

  const startGeneration = async (promptText: string) => {
    setIsGenerating(true)
    try {
      // TODO: Call generation API
    } finally {
      setIsGenerating(false)
    }
  }

  return {
    isGenerating,
    progress,
    startGeneration,
  }
}
