/**
* @file sideNav-store.ts
* @description This file implements a Zustand store for managing the state of a side navigation component.
* @module SideNavStore
*/


import { create } from 'zustand';

interface SideNavStore {
    isNavOpen: boolean;
    toggleNav(): void;
}

/**
* Creates and exports a Zustand store for managing the side navigation state.
* This store follows the principle of single source of truth for the side navigation's
* open/closed state. It provides a simple API to toggle the navigation state.
* @function useSideNavStore
* @returns {Object} An object containing the side navigation state and methods.
* @property {boolean} isNavOpen - The current open/closed state of the side navigation.
* @property {Function} toggleNav - A function to toggle the navigation state.
* @example
* const { isNavOpen, toggleNav } = useSideNavStore();
* // Check if nav is open
* console.log('Is nav open?', isNavOpen);
* // Toggle nav state
* toggleNav(); 
*/
export const useSideNavStore = create<SideNavStore>((set) => ({
  isNavOpen: false,
  toggleNav: (): void => set((state) => ({ isNavOpen: !state.isNavOpen })),
}));
