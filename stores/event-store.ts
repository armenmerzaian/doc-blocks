/**
 * @file event-store.ts
 * @description This file implements a custom event system using Zustand for state management.
 * It provides a centralized way to emit and listen to events across the application.
 * @module event-store
 */

import { create } from 'zustand';

type EventHandler = (payload: any) => void;

interface EventStore {
  events: Record<string, EventHandler[]>;
  emit: (event: string, payload: any) => void;
  on: (event: string, handler: EventHandler) => void;
  off: (event: string, handler: EventHandler) => void;
}

/**
 * Creates and exports a Zustand store for managing application-wide events.
 * This store follows the publish-subscribe pattern, allowing components to emit
 * events and subscribe to them. It's particularly useful for decoupling components
 * and managing cross-component communication.
 * @function useEventStore
 * @returns {Object} An object containing the events, emit, on, and off functions.
 * @property {Object} events - A record of events and their handlers.
 * @property {Function} emit - A function to emit an event with a payload.
 * @property {Function} on - A function to subscribe a handler to an event.
 * @property {Function} off - A function to unsubscribe a handler from an event.
 * @example
 * const { emit, on, off } = useEventStore();
 * // Emit an event
 * emit('userLoggedIn', { id: 1, name: 'John' });
 * // Subscribe to an event
 * on('userLoggedIn', (user) => console.log('User logged in:', user));
 * // Unsubscribe from an event
 * off('userLoggedIn', handlerFunction);
 * 
 * Note: The handlerFunction to unsubscribe from an event is the function that was passed to the on function.
 * If you pass the same function to the on function, it will be the same function and you will be able to unsubscribe from it.
 * If you pass a different function to the on function, it will be a different function and you will not be able to unsubscribe from it.
 * If you leave it empty, it will unsubscribe from all handlers for that event.
*/

export const useEventStore = create<EventStore>((set, get) => ({
  events: {},
  emit: (event, payload): void => {
    const { events } = get();
    if (events[event]) {
      events[event].forEach(handler => handler(payload));
    }
  },
  on: (event, handler): void => set(state => ({
    events: {
      ...state.events,
      [event]: [...(state.events[event] || []), handler],
    },
  })),
  off: (event, handler): void => set(state => ({
    events: {
      ...state.events,
      [event]: state.events[event]?.filter(h => h !== handler) || [],
    },
  })),
}));
