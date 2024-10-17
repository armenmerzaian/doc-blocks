/**
 * @file useSupabaseSubscription.ts
 * @description This file contains the useSupabaseSubscription hook, which is used to subscribe to Supabase real-time changes for a specific table.
 * It utilizes the event store and subscription manager to handle database changes.
 * @module useSupabaseSubscription
 */

import { useEffect, useCallback } from 'react';
import subscriptionManager from '@/lib/supabaseSubscriptionManager';
import { useEventStore } from '@/stores/event-store';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type PostgresChanges = {
  [key: string]: any;
};

type EventHandler = (payload: RealtimePostgresChangesPayload<PostgresChanges>) => void;

interface EventHandlers {
  onInsert?: EventHandler;
  onUpdate?: EventHandler;
  onDelete?: EventHandler;
}

/**
 * A custom React hook for subscribing to Supabase real-time changes for a specific table.
 * This hook follows the principle of separation of concerns by delegating the subscription
 * management to a separate manager and using an event store for communication.
 * @function useSupabaseSubscription
 * @param {string} table - The name of the table to subscribe to.
 * @returns {Object} An object containing the subscribeToChanges function.
 * @example
 * const { subscribeToChanges } = useSupabaseSubscription('users');
 * useEffect(() => {
 * const unsubscribe = subscribeToChanges({
 * onInsert: (payload) => console.log('Insert:', payload),
 * onUpdate: (payload) => console.log('Update:', payload),
 * onDelete: (payload) => console.log('Delete:', payload),
 * });
 * return unsubscribe;
 * }, []);
 */
export function useSupabaseSubscription(table: string) {
  const { on, off } = useEventStore();

  useEffect(() => {
    subscriptionManager.subscribeToTable(table);
    return () => {
      subscriptionManager.unsubscribeFromTable(table);
    };
  }, [table]);

  const subscribeToChanges = useCallback((handlers: EventHandlers) => {
    const insertHandler = (payload: RealtimePostgresChangesPayload<PostgresChanges>) => handlers.onInsert && handlers.onInsert(payload);
    const updateHandler = (payload: RealtimePostgresChangesPayload<PostgresChanges>) => handlers.onUpdate && handlers.onUpdate(payload);
    const deleteHandler = (payload: RealtimePostgresChangesPayload<PostgresChanges>) => handlers.onDelete && handlers.onDelete(payload);

    on(`${table}:INSERT`, insertHandler);
    on(`${table}:UPDATE`, updateHandler);
    on(`${table}:DELETE`, deleteHandler);

    return () => {
      off(`${table}:INSERT`, insertHandler);
      off(`${table}:UPDATE`, updateHandler);
      off(`${table}:DELETE`, deleteHandler);
    };
  }, [table, on, off]);

  return { subscribeToChanges };
}
