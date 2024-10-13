import { createClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";

let clientInstance: ReturnType<typeof createClient> | null = null;

export function useCreateSupabaseClientCsr() {
  // The `useSession()` hook will be used to get the Clerk session object
  const { session } = useSession();

  console.log("Session: ", session);

  if (!clientInstance) {
    clientInstance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          // Get the custom Supabase token from Clerk
          fetch: async (url, options = {}) => {
            const clerkToken = await session?.getToken({
              template: "supabase",
            });

            // Insert the Clerk Supabase token into the headers
            const headers = new Headers(options?.headers);
            headers.set("Authorization", `Bearer ${clerkToken}`);
            console.log("Headers: ", headers);
            // Now call the default fetch
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
