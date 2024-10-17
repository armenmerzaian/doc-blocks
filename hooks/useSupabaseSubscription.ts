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
