import { createClient } from "@supabase/supabase-js";
import Emitter from "./emitter";

class SupabaseSubscriptionManager {
  private supabase: ReturnType<typeof createClient>;
  private subscriptions: Map<string, any> = new Map();

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  subscribeToTable(table: string) {
    if (this.subscriptions.has(table)) {
      return;
    }

    const channel = this.supabase
      .channel(`${table}-changes`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: table },
        (payload) => {
          Emitter.emit(`${table}:${payload.eventType}`, payload);
        }
      )
      .subscribe();

    this.subscriptions.set(table, channel);
  }

  unsubscribeFromTable(table: string) {
    const channel = this.subscriptions.get(table);
    if (channel) {
      this.supabase.removeChannel(channel);
      this.subscriptions.delete(table);
    }
  }
}

const subscriptionManager = new SupabaseSubscriptionManager(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default subscriptionManager;
