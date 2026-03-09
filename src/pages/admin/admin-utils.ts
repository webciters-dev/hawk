import { getBackendClient, type BackendClient } from "@/lib/backend-client";
import { useToast } from "@/hooks/use-toast";

/**
 * Get the Supabase client or show a toast if unavailable.
 * Shared across all admin panels.
 */
export const getClientOrToast = async (
  toast: ReturnType<typeof useToast>["toast"],
): Promise<BackendClient | null> => {
  const client = await getBackendClient();
  if (!client) {
    toast({
      title: "Backend unavailable",
      description: "Please refresh and try again.",
      variant: "destructive",
    });
    return null;
  }
  return client;
};

// ─── Validation helpers ─────────────────────────────────────

/** Returns an error message if the string is empty/whitespace, otherwise null. */
export const requireNonEmpty = (value: string, fieldLabel: string): string | null => {
  if (!value.trim()) return `${fieldLabel} cannot be empty.`;
  return null;
};

/** Validate a slug: non-empty, lowercase a-z 0-9 hyphens only, no leading/trailing hyphens. */
export const validateSlug = (slug: string): string | null => {
  if (!slug.trim()) return "Slug cannot be empty.";
  if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(slug)) {
    return "Slug must be lowercase letters, numbers, and hyphens only (no leading/trailing hyphens).";
  }
  return null;
};

/**
 * Run a batch of validations. Returns the first error message encountered, or null if all pass.
 */
export const firstError = (checks: Array<string | null>): string | null =>
  checks.find((c) => c !== null) ?? null;
