import { useEffect, useCallback } from 'react';
import subscriptionManager from '@/app/lib/supabaseSubscriptionManager';
import Emitter from '@/app/lib/emitter';
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

    Emitter.on(`${table}:INSERT`, insertHandler);
    Emitter.on(`${table}:UPDATE`, updateHandler);
    Emitter.on(`${table}:DELETE`, deleteHandler);

    return () => {
      Emitter.off(`${table}:INSERT`, insertHandler);
      Emitter.off(`${table}:UPDATE`, updateHandler);
      Emitter.off(`${table}:DELETE`, deleteHandler);
    };
  }, [table]);

  return { subscribeToChanges };
}
