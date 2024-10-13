import { create } from "zustand";

interface ItemStoreState {
  items: string[]; // Assuming items are strings. Replace with the appropriate type.
  addItem: (item: string) => void;
}

export const useItemStore = create<ItemStoreState>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
}));




