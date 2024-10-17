import { createClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";

let clientInstance: ReturnType<typeof createClient> | null = null;

export function useCreateSupabaseClientCsr() {
  const { session } = useSession();

  if (!clientInstance) {
    clientInstance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          fetch: async (url, options = {}) => {
            const clerkToken = await session?.getToken({
              template: "supabase",
            });

            const headers = new Headers(options?.headers);
            headers.set("Authorization", `Bearer ${clerkToken}`);
            console.log("Headers: ", headers);
            return fetch(url, {
              ...options,
              headers,
            });
          },
        },
      }
    );
  }

  return clientInstance;
}
