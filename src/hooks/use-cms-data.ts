import { useQuery } from "@tanstack/react-query";
import { getBackendClient } from "@/lib/backend-client";
import type { Tables } from "@/integrations/supabase/types";

export type NavigationLink = Tables<"navigation_links">;
export type SiteSection = Tables<"site_sections">;
export type Statistic = Tables<"statistics">;
export type TeamMember = Tables<"team_members">;
export type ServiceItem = Tables<"service_items">;
export type ProcessStep = Tables<"process_steps">;

export const useNavigationLinks = () =>
  useQuery({
    queryKey: ["navigation_links"],
    queryFn: async () => {
      const client = await getBackendClient();
      if (!client) return [] as NavigationLink[];
      const { data, error } = await client
        .from("navigation_links")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as NavigationLink[];
    },
  });

export const useSiteSection = (key: string) =>
  useQuery({
    queryKey: ["site_sections", key],
    queryFn: async () => {
      const client = await getBackendClient();
      if (!client) return null;
      const { data, error } = await client
        .from("site_sections")
        .select("*")
        .eq("section_key", key)
        .maybeSingle();
      if (error) throw error;
      return (data as SiteSection | null);
    },
  });

export const useStatistics = () =>
  useQuery({
    queryKey: ["statistics"],
    queryFn: async () => {
      const client = await getBackendClient();
      if (!client) return [] as Statistic[];
      const { data, error } = await client
        .from("statistics")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as Statistic[];
    },
  });

export const useTeamMembers = () =>
  useQuery({
    queryKey: ["team_members"],
    queryFn: async () => {
      const client = await getBackendClient();
      if (!client) return [] as TeamMember[];
      const { data, error } = await client
        .from("team_members")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as TeamMember[];
    },
  });

export const useServiceItems = () =>
  useQuery({
    queryKey: ["service_items"],
    queryFn: async () => {
      const client = await getBackendClient();
      if (!client) return [] as ServiceItem[];
      const { data, error } = await client
        .from("service_items")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as ServiceItem[];
    },
  });

export const useProcessSteps = () =>
  useQuery({
    queryKey: ["process_steps"],
    queryFn: async () => {
      const client = await getBackendClient();
      if (!client) return [] as ProcessStep[];
      const { data, error } = await client
        .from("process_steps")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as ProcessStep[];
    },
  });
