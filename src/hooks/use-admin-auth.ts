import { useState, useEffect } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getBackendClient, type BackendClient } from "@/lib/backend-client";

const AUTH_UNAVAILABLE_ERROR = {
  message: "Authentication is temporarily unavailable. Please refresh and try again.",
};

export const useAdminAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let unsubscribe: (() => void) | null = null;

    const checkAdminRole = async (client: BackendClient, userId: string) => {
      try {
        const { data, error } = await client.rpc("has_role", {
          _user_id: userId,
          _role: "admin",
        });

        if (error) {
          console.error("Admin role check failed:", error.message);
          return false;
        }

        return !!data;
      } catch (error) {
        console.error("Unexpected admin role error:", error);
        return false;
      }
    };

    const hydrateAuthState = async (client: BackendClient, session: Session | null) => {
      if (!mounted) return;

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (!currentUser) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const hasAdminRole = await checkAdminRole(client, currentUser.id);
      if (!mounted) return;

      setIsAdmin(hasAdminRole);
      setLoading(false);
    };

    void (async () => {
      try {
        const client = await getBackendClient();
        if (!mounted) return;

        if (!client) {
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const { data } = client.auth.onAuthStateChange((_event, session) => {
          void hydrateAuthState(client, session);
        });
        unsubscribe = () => data.subscription.unsubscribe();

        const {
          data: { session },
        } = await client.auth.getSession();

        await hydrateAuthState(client, session);
      } catch (error) {
        console.error("Failed to initialize admin auth:", error);
        if (mounted) {
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
        }
      }
    })();

    const fallbackTimer = window.setTimeout(() => {
      if (mounted) setLoading(false);
    }, 5000);

    return () => {
      mounted = false;
      window.clearTimeout(fallbackTimer);
      unsubscribe?.();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const client = await getBackendClient();
    if (!client) {
      return { error: AUTH_UNAVAILABLE_ERROR };
    }

    const { error } = await client.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    const client = await getBackendClient();
    if (!client) return;
    await client.auth.signOut();
  };

  return { user, isAdmin, loading, signIn, signOut };
};
