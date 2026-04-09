// Zustand store for UI state management
import { create } from 'zustand'

interface UIStore {
  activeView: string
  expandedPanels: Set<string>
  modals: {
    [key: string]: boolean
  }
  setActiveView: (view: string) => void
  togglePanel: (panelId: string) => void
  openModal: (modalId: string) => void
  closeModal: (modalId: string) => void
}

export const useUIStore = create<UIStore>((set) => ({
  activeView: 'screenplay',
  expandedPanels: new Set(),
  modals: {},

  setActiveView: (view: string) =>
    set(() => ({
      activeView: view,
    })),

  togglePanel: (panelId: string) =>
    set((state) => {
      const newPanels = new Set(state.expandedPanels)
      if (newPanels.has(panelId)) {
        newPanels.delete(panelId)
      } else {
        newPanels.add(panelId)
      }
      return { expandedPanels: newPanels }
    }),

  openModal: (modalId: string) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [modalId]: true,
      },
    })),

  closeModal: (modalId: string) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [modalId]: false,
      },
    })),
}))
