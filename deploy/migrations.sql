-- =============================================================
-- Combined migrations for Hawk Vision Strategies
-- Run this AFTER docker compose is up and healthy:
--
--   docker compose exec db psql -U postgres -f /migrations/migrations.sql
--
-- Or from the host:
--   psql -h localhost -U postgres -d postgres -f deploy/migrations.sql
-- =============================================================

-- ══════════════════════════════════════════════════════════════
-- Migration 1: Core CMS schema
-- ══════════════════════════════════════════════════════════════

-- Role enum and user_roles table
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS on user_roles
DO $$ BEGIN
CREATE POLICY "Admins can view roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============ NAVIGATION LINKS ============
CREATE TABLE IF NOT EXISTS public.navigation_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL DEFAULT '#',
  parent_id UUID REFERENCES public.navigation_links(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  is_cta BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.navigation_links ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
CREATE POLICY "Public can read nav links" ON public.navigation_links
  FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
CREATE POLICY "Admins can manage nav links" ON public.navigation_links
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============ SITE SECTIONS ============
CREATE TABLE IF NOT EXISTS public.site_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE,
  title TEXT,
  subtitle TEXT,
  content JSONB NOT NULL DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
CREATE POLICY "Public can read sections" ON public.site_sections
  FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
CREATE POLICY "Admins can manage sections" ON public.site_sections
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============ STATISTICS ============
CREATE TABLE IF NOT EXISTS public.statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_value TEXT NOT NULL,
  metric_label TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.statistics ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
CREATE POLICY "Public can read statistics" ON public.statistics
  FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
CREATE POLICY "Admins can manage statistics" ON public.statistics
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============ TEAM MEMBERS ============
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  bio TEXT,
  bio_extended TEXT,
  image_url TEXT,
  linkedin_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
CREATE POLICY "Public can read team members" ON public.team_members
  FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
CREATE POLICY "Admins can manage team members" ON public.team_members
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============ SERVICE ITEMS ============
CREATE TABLE IF NOT EXISTS public.service_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Target',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.service_items ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
CREATE POLICY "Public can read service items" ON public.service_items
  FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
CREATE POLICY "Admins can manage service items" ON public.service_items
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============ PROCESS STEPS ============
CREATE TABLE IF NOT EXISTS public.process_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.process_steps ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
CREATE POLICY "Public can read process steps" ON public.process_steps
  FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
CREATE POLICY "Admins can manage process steps" ON public.process_steps
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============ UPDATED_AT TRIGGER ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS update_navigation_links_updated_at ON public.navigation_links;
CREATE TRIGGER update_navigation_links_updated_at BEFORE UPDATE ON public.navigation_links FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_sections_updated_at ON public.site_sections;
CREATE TRIGGER update_site_sections_updated_at BEFORE UPDATE ON public.site_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_statistics_updated_at ON public.statistics;
CREATE TRIGGER update_statistics_updated_at BEFORE UPDATE ON public.statistics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_team_members_updated_at ON public.team_members;
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_service_items_updated_at ON public.service_items;
CREATE TRIGGER update_service_items_updated_at BEFORE UPDATE ON public.service_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_process_steps_updated_at ON public.process_steps;
CREATE TRIGGER update_process_steps_updated_at BEFORE UPDATE ON public.process_steps FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ══════════════════════════════════════════════════════════════
-- Migration 2: Dynamic Pages
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  content JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
CREATE POLICY "Public can read published pages" ON public.pages
  FOR SELECT USING (is_published = true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
CREATE POLICY "Admins can manage pages" ON public.pages
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DROP TRIGGER IF EXISTS update_pages_updated_at ON public.pages;
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ══════════════════════════════════════════════════════════════
-- Migration 3: Storage bucket for CMS uploads
-- ══════════════════════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public)
VALUES ('cms-uploads', 'cms-uploads', true)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
CREATE POLICY "Public can read cms uploads" ON storage.objects
  FOR SELECT USING (bucket_id = 'cms-uploads');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
CREATE POLICY "Admins can upload cms files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'cms-uploads' AND public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
CREATE POLICY "Admins can update cms files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'cms-uploads' AND public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
CREATE POLICY "Admins can delete cms files" ON storage.objects
  FOR DELETE USING (bucket_id = 'cms-uploads' AND public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ══════════════════════════════════════════════════════════════
-- Grant PostgREST access to the has_role function
-- ══════════════════════════════════════════════════════════════
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role TO anon, authenticated;
