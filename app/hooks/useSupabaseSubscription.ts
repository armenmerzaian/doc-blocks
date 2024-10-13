import { useCallback } from 'react';
import { createSupabaseClientCsr } from "@/app/lib/database/createSupabaseClientCsr";
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
  const supabaseClient = createSupabaseClientCsr();

  const subscribeToChanges = useCallback((handlers: EventHandlers) => {
    const channel = supabaseClient
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: table },
        (payload) => handlers.onInsert && handlers.onInsert(payload)
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: table },
        (payload) => handlers.onUpdate && handlers.onUpdate(payload)
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: table },
        (payload) => handlers.onDelete && handlers.onDelete(payload)
      )
      .subscribe((status) => {
        console.log(`Subscription status for ${table}:`, status);
      });

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [table, supabaseClient]);

  return { subscribeToChanges };
}
