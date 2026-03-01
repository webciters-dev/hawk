import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type BackendClient = SupabaseClient<Database>;

let backendClientPromise: Promise<BackendClient> | null = null;

const getRuntimeConfig = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return null;
  }

  return { url, key };
};

const createRuntimeClient = (): BackendClient => {
  const config = getRuntimeConfig();
  if (!config) {
    throw new Error("Backend runtime config is missing.");
  }

  return createClient<Database>(config.url, config.key, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
};

export const getBackendClient = async (): Promise<BackendClient | null> => {
  if (!backendClientPromise) {
    backendClientPromise = Promise.resolve(createRuntimeClient());
  }

  try {
    return await backendClientPromise;
  } catch (error) {
    console.error("Failed to initialize backend client:", error);
    backendClientPromise = null;
    return null;
  }
};
