/**
* @file itemList-store.ts
* @description This file implements a Zustand store for managing a list of items.
* @module itemListStore
*/

import { create } from "zustand";

interface ItemStoreState {
  items: string[]; // Assuming items are strings. Replace with the appropriate type.
  addItem: (item: string) => void;
}

/**
* Creates and exports a Zustand store for managing a list of items.
* This store follows the principle of immutability when updating the state.
* It provides a simple API to add items to the list.
* @function useItemStore
* @returns {Object} An object containing the item list state and methods.
* @property {string[]} items - The current list of items.
* @property {Function} addItem - A function to add a new item to the list.
* @example
* const { items, addItem } = useItemStore();
* // Add a new item
* addItem('New Item');
* // Log current items
* console.log('Current items:', items);
*/

export const useItemStore = create<ItemStoreState>((set) => ({
  items: [],
  addItem: (item): void => set((state) => ({ items: [...state.items, item] })),
}));




