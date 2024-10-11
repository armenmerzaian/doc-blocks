import { create } from 'zustand';

interface SideNavStore {
    isNavOpen: boolean;
    toggleNav(): void;
}

export const useSideNavStore = create<SideNavStore>((set) => ({
  isNavOpen: false,
  toggleNav: () => set((state) => ({ isNavOpen: !state.isNavOpen })),
}));
