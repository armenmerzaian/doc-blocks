import { create } from 'zustand';

type EventHandler = (payload: any) => void;

interface EventStore {
  events: Record<string, EventHandler[]>;
  emit: (event: string, payload: any) => void;
  on: (event: string, handler: EventHandler) => void;
  off: (event: string, handler: EventHandler) => void;
}

export const useEventStore = create<EventStore>((set, get) => ({
  events: {},
  emit: (event, payload) => {
    const { events } = get();
    if (events[event]) {
      events[event].forEach(handler => handler(payload));
    }
  },
  on: (event, handler) => set(state => ({
    events: {
      ...state.events,
      [event]: [...(state.events[event] || []), handler],
    },
  })),
  off: (event, handler) => set(state => ({
    events: {
      ...state.events,
      [event]: state.events[event]?.filter(h => h !== handler) || [],
    },
  })),
}));
