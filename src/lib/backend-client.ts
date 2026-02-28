import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type BackendClient = SupabaseClient<Database>;

let backendClientPromise: Promise<BackendClient> | null = null;

// Publishable fallback config for this Lovable Cloud project (safe to expose client-side).
const FALLBACK_BACKEND_URL = "https://ddundocjeacxkkepbnvb.supabase.co";
const FALLBACK_BACKEND_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkdW5kb2NqZWFjeGtrZXBibnZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNzM1NTQsImV4cCI6MjA4Nzg0OTU1NH0.yfTIt1xTwcDhhqig9MQazpsfDCrVxqRew9KTj0QSHqg";

const getRuntimeConfig = () => {
  const url = import.meta.env.VITE_SUPABASE_URL || FALLBACK_BACKEND_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || FALLBACK_BACKEND_PUBLISHABLE_KEY;

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
