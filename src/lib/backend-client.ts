import type { supabase as SupabaseClientInstance } from "@/integrations/supabase/client";

export type BackendClient = typeof SupabaseClientInstance;

let backendClientPromise: Promise<BackendClient | null> | null = null;

const hasBackendConfig = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  return Boolean(url && key);
};

export const getBackendClient = async (): Promise<BackendClient | null> => {
  if (!hasBackendConfig()) {
    console.error("Backend config is missing. Check environment setup.");
    return null;
  }

  if (!backendClientPromise) {
    backendClientPromise = import("@/integrations/supabase/client")
      .then(({ supabase }) => supabase)
      .catch((error) => {
        console.error("Failed to initialize backend client:", error);
        return null;
      });
  }

  return backendClientPromise;
};
