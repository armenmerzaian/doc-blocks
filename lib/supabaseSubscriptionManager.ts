/**
* @file supabaseSubscriptionManager.ts
* @description This file implements a manager for Supabase real-time subscriptions.
* It provides a centralized way to subscribe to and unsubscribe from table changes.
* @module supabaseSubscriptionManager
*/

import { createClient } from "@supabase/supabase-js";
import { useEventStore } from '@/stores/event-store';

/**
* A class that manages Supabase real-time subscriptions.
* This class follows the Singleton pattern to ensure only one instance of the
* subscription manager exists. It uses the Supabase client to create and manage
* subscriptions to database tables.
* @class SupabaseSubscriptionManager
*/
class SupabaseSubscriptionManager {
  private supabase: ReturnType<typeof createClient>;
  private subscriptions: Map<string, any> = new Map();

  /**
   * Constructs a new SupabaseSubscriptionManager instance.
   * @constructor
   * @param {string} supabaseUrl - The URL of the Supabase project.
   * @param {string} supabaseKey - The public anon key of your Supabase project.
   */
  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Subscribes to changes on a specific table.
   * @method subscribeToTable
   * @param {string} table - The name of the table to subscribe to.
   */
  subscribeToTable(table: string): void {
    if (this.subscriptions.has(table)) {
      return;
    }

    const { emit } = useEventStore.getState();

    const channel = this.supabase
      .channel(`${table}-changes`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: table },
        (payload) => {
          emit(`${table}:${payload.eventType}`, payload);
        }
      )
      .subscribe();

    this.subscriptions.set(table, channel);
  }

  /**
  * Unsubscribes from changes on a specific table.
  * @method unsubscribeFromTable
  * @param {string} table - The name of the table to unsubscribe from.
  */
  unsubscribeFromTable(table: string): void {
    const channel = this.subscriptions.get(table);
    if (channel) {
      this.supabase.removeChannel(channel);
      this.subscriptions.delete(table);
    }
  }
}

/**
* The singleton instance of the SupabaseSubscriptionManager.
* @const subscriptionManager
* @type {SupabaseSubscriptionManager}
* @example
* // Subscribe to a table
* subscriptionManager.subscribeToTable('users');
* // Unsubscribe from a table
* subscriptionManager.unsubscribeFromTable('users');
*/
const subscriptionManager: SupabaseSubscriptionManager = new SupabaseSubscriptionManager(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default subscriptionManager;
