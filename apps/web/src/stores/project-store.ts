// Zustand store for project state management
import { create } from 'zustand'

interface ProjectStore {
  activeProjectId: string | null
  projectData: any
  setActiveProject: (projectId: string) => void
  updateProjectData: (data: any) => void
}

export const useProjectStore = create<ProjectStore>((set) => ({
  activeProjectId: null,
  projectData: null,

  setActiveProject: (projectId: string) =>
    set(() => ({
      activeProjectId: projectId,
    })),

  updateProjectData: (data: any) =>
    set(() => ({
      projectData: data,
    })),
}))
