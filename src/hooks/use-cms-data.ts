import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
      const { data, error } = await supabase
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
      const { data, error } = await supabase
        .from("site_sections")
        .select("*")
        .eq("section_key", key)
        .single();
      if (error) throw error;
      return data as SiteSection;
    },
  });

export const useStatistics = () =>
  useQuery({
    queryKey: ["statistics"],
    queryFn: async () => {
      const { data, error } = await supabase
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
      const { data, error } = await supabase
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
      const { data, error } = await supabase
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
      const { data, error } = await supabase
        .from("process_steps")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as ProcessStep[];
    },
  });
