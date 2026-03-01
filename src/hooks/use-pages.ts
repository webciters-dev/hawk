import { useQuery } from "@tanstack/react-query";
import { getBackendClient } from "@/lib/backend-client";

export interface Page {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  content: ContentBlock[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentBlock {
  id: string;
  type: "text" | "heading" | "image" | "cta";
  value: string;
  meta?: Record<string, string>;
}

export const usePages = () =>
  useQuery({
    queryKey: ["pages"],
    queryFn: async () => {
      const client = await getBackendClient();
      if (!client) return [] as Page[];
      const { data, error } = await client
        .from("pages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Page[];
    },
  });

export const usePage = (slug: string) =>
  useQuery({
    queryKey: ["pages", slug],
    queryFn: async () => {
      const client = await getBackendClient();
      if (!client) return null;
      const { data, error } = await client
        .from("pages")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as Page | null;
    },
    enabled: !!slug,
  });
