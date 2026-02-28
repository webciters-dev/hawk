import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LogOut, Plus, Trash2, GripVertical, Save } from "lucide-react";
import { useNavigationLinks, useStatistics, useServiceItems, useProcessSteps, useTeamMembers, useSiteSection } from "@/hooks/use-cms-data";
import { useToast } from "@/hooks/use-toast";

type Tab = "navigation" | "hero" | "services" | "about" | "process" | "contact" | "statistics";

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAdminAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("navigation");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [loading, user, isAdmin, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>;
  if (!isAdmin) return null;

  const tabs: { key: Tab; label: string }[] = [
    { key: "navigation", label: "Navigation" },
    { key: "hero", label: "Hero" },
    { key: "services", label: "Services" },
    { key: "statistics", label: "Statistics" },
    { key: "about", label: "About" },
    { key: "process", label: "Process" },
    { key: "contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 flex items-center justify-between h-16">
          <h1 className="font-display text-xl text-foreground">CMS Dashboard</h1>
          <div className="flex items-center gap-4">
            <a href="/" className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors">View Site</a>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut size={16} /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`font-body text-xs tracking-wider uppercase px-4 py-2 transition-colors ${
                activeTab === tab.key
                  ? "text-foreground border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panels */}
        {activeTab === "navigation" && <NavigationPanel />}
        {activeTab === "hero" && <HeroPanel />}
        {activeTab === "services" && <ServicesPanel />}
        {activeTab === "statistics" && <StatisticsPanel />}
        {activeTab === "about" && <AboutPanel />}
        {activeTab === "process" && <ProcessPanel />}
        {activeTab === "contact" && <ContactPanel />}
      </div>
    </div>
  );
};

// ─── NAVIGATION PANEL ───
const NavigationPanel = () => {
  const { data: links, refetch } = useNavigationLinks();
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => { if (links) setItems(links); }, [links]);

  const save = async () => {
    for (const item of items) {
      await supabase.from("navigation_links").upsert({
        id: item.id,
        title: item.title,
        url: item.url,
        parent_id: item.parent_id,
        sort_order: item.sort_order,
        is_cta: item.is_cta,
      });
    }
    await refetch();
    toast({ title: "Saved", description: "Navigation updated." });
  };

  const addLink = async () => {
    const { data } = await supabase.from("navigation_links").insert({
      title: "New Link",
      url: "#",
      sort_order: (items?.length || 0) + 1,
    }).select().single();
    if (data) { setItems([...items, data]); }
  };

  const addSublink = async (parentId: string) => {
    const { data } = await supabase.from("navigation_links").insert({
      title: "New Sublink",
      url: "#",
      parent_id: parentId,
      sort_order: items.filter(i => i.parent_id === parentId).length + 1,
    }).select().single();
    if (data) { setItems([...items, data]); }
  };

  const removeLink = async (id: string) => {
    await supabase.from("navigation_links").delete().eq("id", id);
    setItems(items.filter(i => i.id !== id && i.parent_id !== id));
  };

  const updateItem = (id: string, field: string, value: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const topLevel = items.filter(i => !i.parent_id);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-foreground">Navigation Links</h2>
        <div className="flex gap-2">
          <Button variant="cleanOutline" size="sm" onClick={addLink}><Plus size={14} /> Add Link</Button>
          <Button variant="clean" size="sm" onClick={save}><Save size={14} /> Save</Button>
        </div>
      </div>

      {topLevel.map((link) => (
        <div key={link.id} className="border border-border rounded-sm p-4 space-y-3">
          <div className="flex items-center gap-3">
            <GripVertical size={16} className="text-muted-foreground" />
            <Input className="flex-1" value={link.title} onChange={(e) => updateItem(link.id, "title", e.target.value)} placeholder="Label" />
            <Input className="flex-1" value={link.url} onChange={(e) => updateItem(link.id, "url", e.target.value)} placeholder="URL" />
            <label className="flex items-center gap-1 font-body text-xs text-muted-foreground whitespace-nowrap">
              <input type="checkbox" checked={link.is_cta} onChange={(e) => updateItem(link.id, "is_cta", e.target.checked)} /> CTA
            </label>
            <Button variant="ghost" size="icon" onClick={() => removeLink(link.id)}><Trash2 size={14} /></Button>
          </div>

          {/* Sublinks */}
          {items.filter(i => i.parent_id === link.id).map((sub) => (
            <div key={sub.id} className="ml-8 flex items-center gap-3">
              <GripVertical size={14} className="text-muted-foreground" />
              <Input className="flex-1" value={sub.title} onChange={(e) => updateItem(sub.id, "title", e.target.value)} placeholder="Sublink label" />
              <Input className="flex-1" value={sub.url} onChange={(e) => updateItem(sub.id, "url", e.target.value)} placeholder="URL" />
              <Button variant="ghost" size="icon" onClick={() => removeLink(sub.id)}><Trash2 size={14} /></Button>
            </div>
          ))}
          <button onClick={() => addSublink(link.id)} className="ml-8 font-body text-xs text-primary hover:text-primary/80 transition-colors">
            + Add Sublink
          </button>
        </div>
      ))}
    </div>
  );
};

// ─── HERO PANEL ───
const HeroPanel = () => {
  const { data: section, refetch } = useSiteSection("hero");
  const { toast } = useToast();
  const [form, setForm] = useState({ title: "", subtitle: "", description: "", cta_primary_text: "", cta_primary_url: "", cta_secondary_text: "", cta_secondary_url: "" });

  useEffect(() => {
    if (section) {
      const c = section.content as any;
      setForm({
        title: section.title || "",
        subtitle: section.subtitle || "",
        description: c?.description || "",
        cta_primary_text: c?.cta_primary_text || "",
        cta_primary_url: c?.cta_primary_url || "",
        cta_secondary_text: c?.cta_secondary_text || "",
        cta_secondary_url: c?.cta_secondary_url || "",
      });
    }
  }, [section]);

  const save = async () => {
    if (!section) return;
    await supabase.from("site_sections").update({
      title: form.title,
      subtitle: form.subtitle,
      content: { description: form.description, cta_primary_text: form.cta_primary_text, cta_primary_url: form.cta_primary_url, cta_secondary_text: form.cta_secondary_text, cta_secondary_url: form.cta_secondary_url },
    }).eq("id", section.id);
    await refetch();
    toast({ title: "Saved", description: "Hero section updated." });
  };

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-foreground">Hero Section</h2>
        <Button variant="clean" size="sm" onClick={save}><Save size={14} /> Save</Button>
      </div>
      <div className="space-y-3">
        <label className="block font-body text-xs text-muted-foreground uppercase tracking-wider">Tagline</label>
        <Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
        <label className="block font-body text-xs text-muted-foreground uppercase tracking-wider">Headline</label>
        <Textarea value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <label className="block font-body text-xs text-muted-foreground uppercase tracking-wider">Description</label>
        <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">CTA 1 Label</label>
            <Input value={form.cta_primary_text} onChange={(e) => setForm({ ...form, cta_primary_text: e.target.value })} />
          </div>
          <div>
            <label className="block font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">CTA 1 URL</label>
            <Input value={form.cta_primary_url} onChange={(e) => setForm({ ...form, cta_primary_url: e.target.value })} />
          </div>
          <div>
            <label className="block font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">CTA 2 Label</label>
            <Input value={form.cta_secondary_text} onChange={(e) => setForm({ ...form, cta_secondary_text: e.target.value })} />
          </div>
          <div>
            <label className="block font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">CTA 2 URL</label>
            <Input value={form.cta_secondary_url} onChange={(e) => setForm({ ...form, cta_secondary_url: e.target.value })} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── SERVICES PANEL ───
const ServicesPanel = () => {
  const { data: services, refetch } = useServiceItems();
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => { if (services) setItems(services); }, [services]);

  const save = async () => {
    for (const item of items) {
      await supabase.from("service_items").upsert({ id: item.id, title: item.title, description: item.description, icon_name: item.icon_name, sort_order: item.sort_order });
    }
    await refetch();
    toast({ title: "Saved", description: "Services updated." });
  };

  const add = async () => {
    const { data } = await supabase.from("service_items").insert({ title: "New Service", description: "Description here", icon_name: "Target", sort_order: items.length + 1 }).select().single();
    if (data) setItems([...items, data]);
  };

  const remove = async (id: string) => {
    await supabase.from("service_items").delete().eq("id", id);
    setItems(items.filter(i => i.id !== id));
  };

  const update = (id: string, field: string, value: string) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-foreground">Services</h2>
        <div className="flex gap-2">
          <Button variant="cleanOutline" size="sm" onClick={add}><Plus size={14} /> Add</Button>
          <Button variant="clean" size="sm" onClick={save}><Save size={14} /> Save</Button>
        </div>
      </div>
      {items.map((s) => (
        <div key={s.id} className="border border-border rounded-sm p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Input className="flex-1" value={s.title} onChange={(e) => update(s.id, "title", e.target.value)} placeholder="Title" />
            <Input className="w-32" value={s.icon_name} onChange={(e) => update(s.id, "icon_name", e.target.value)} placeholder="Icon name" />
            <Button variant="ghost" size="icon" onClick={() => remove(s.id)}><Trash2 size={14} /></Button>
          </div>
          <Textarea value={s.description} onChange={(e) => update(s.id, "description", e.target.value)} placeholder="Description" />
        </div>
      ))}
    </div>
  );
};

// ─── STATISTICS PANEL ───
const StatisticsPanel = () => {
  const { data: stats, refetch } = useStatistics();
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => { if (stats) setItems(stats); }, [stats]);

  const save = async () => {
    for (const item of items) {
      await supabase.from("statistics").upsert({ id: item.id, metric_value: item.metric_value, metric_label: item.metric_label, sort_order: item.sort_order });
    }
    await refetch();
    toast({ title: "Saved", description: "Statistics updated." });
  };

  const add = async () => {
    const { data } = await supabase.from("statistics").insert({ metric_value: "0", metric_label: "New Metric", sort_order: items.length + 1 }).select().single();
    if (data) setItems([...items, data]);
  };

  const remove = async (id: string) => {
    await supabase.from("statistics").delete().eq("id", id);
    setItems(items.filter(i => i.id !== id));
  };

  const update = (id: string, field: string, value: string) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-foreground">Statistics</h2>
        <div className="flex gap-2">
          <Button variant="cleanOutline" size="sm" onClick={add}><Plus size={14} /> Add</Button>
          <Button variant="clean" size="sm" onClick={save}><Save size={14} /> Save</Button>
        </div>
      </div>
      {items.map((s) => (
        <div key={s.id} className="flex items-center gap-3 border border-border rounded-sm p-4">
          <Input className="w-24" value={s.metric_value} onChange={(e) => update(s.id, "metric_value", e.target.value)} placeholder="100+" />
          <Input className="flex-1" value={s.metric_label} onChange={(e) => update(s.id, "metric_label", e.target.value)} placeholder="Label" />
          <Button variant="ghost" size="icon" onClick={() => remove(s.id)}><Trash2 size={14} /></Button>
        </div>
      ))}
    </div>
  );
};

// ─── ABOUT PANEL ───
const AboutPanel = () => {
  const { data: members, refetch } = useTeamMembers();
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => { if (members) setItems(members); }, [members]);

  const save = async () => {
    for (const item of items) {
      await supabase.from("team_members").upsert({ id: item.id, name: item.name, role: item.role, bio: item.bio, bio_extended: item.bio_extended, image_url: item.image_url, linkedin_url: item.linkedin_url, sort_order: item.sort_order });
    }
    await refetch();
    toast({ title: "Saved", description: "About section updated." });
  };

  const update = (id: string, field: string, value: string) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-foreground">About / Team</h2>
        <Button variant="clean" size="sm" onClick={save}><Save size={14} /> Save</Button>
      </div>
      {items.map((m) => (
        <div key={m.id} className="border border-border rounded-sm p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input value={m.name} onChange={(e) => update(m.id, "name", e.target.value)} placeholder="Name" />
            <Input value={m.role || ""} onChange={(e) => update(m.id, "role", e.target.value)} placeholder="Role" />
          </div>
          <Input value={m.linkedin_url || ""} onChange={(e) => update(m.id, "linkedin_url", e.target.value)} placeholder="LinkedIn URL" />
          <Input value={m.image_url || ""} onChange={(e) => update(m.id, "image_url", e.target.value)} placeholder="Image URL" />
          <label className="block font-body text-xs text-muted-foreground uppercase tracking-wider">Bio (paragraph 1)</label>
          <Textarea value={m.bio || ""} onChange={(e) => update(m.id, "bio", e.target.value)} rows={4} />
          <label className="block font-body text-xs text-muted-foreground uppercase tracking-wider">Bio (paragraph 2)</label>
          <Textarea value={m.bio_extended || ""} onChange={(e) => update(m.id, "bio_extended", e.target.value)} rows={4} />
        </div>
      ))}
    </div>
  );
};

// ─── PROCESS PANEL ───
const ProcessPanel = () => {
  const { data: steps, refetch } = useProcessSteps();
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => { if (steps) setItems(steps); }, [steps]);

  const save = async () => {
    for (const item of items) {
      await supabase.from("process_steps").upsert({ id: item.id, step_number: item.step_number, title: item.title, description: item.description, sort_order: item.sort_order });
    }
    await refetch();
    toast({ title: "Saved", description: "Process steps updated." });
  };

  const add = async () => {
    const num = String(items.length + 1).padStart(2, "0");
    const { data } = await supabase.from("process_steps").insert({ step_number: num, title: "New Step", description: "Description here", sort_order: items.length + 1 }).select().single();
    if (data) setItems([...items, data]);
  };

  const remove = async (id: string) => {
    await supabase.from("process_steps").delete().eq("id", id);
    setItems(items.filter(i => i.id !== id));
  };

  const update = (id: string, field: string, value: string) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-foreground">Process Steps</h2>
        <div className="flex gap-2">
          <Button variant="cleanOutline" size="sm" onClick={add}><Plus size={14} /> Add</Button>
          <Button variant="clean" size="sm" onClick={save}><Save size={14} /> Save</Button>
        </div>
      </div>
      {items.map((s) => (
        <div key={s.id} className="border border-border rounded-sm p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Input className="w-20" value={s.step_number} onChange={(e) => update(s.id, "step_number", e.target.value)} placeholder="01" />
            <Input className="flex-1" value={s.title} onChange={(e) => update(s.id, "title", e.target.value)} placeholder="Title" />
            <Button variant="ghost" size="icon" onClick={() => remove(s.id)}><Trash2 size={14} /></Button>
          </div>
          <Textarea value={s.description} onChange={(e) => update(s.id, "description", e.target.value)} placeholder="Description" />
        </div>
      ))}
    </div>
  );
};

// ─── CONTACT PANEL ───
const ContactPanel = () => {
  const { data: section, refetch } = useSiteSection("contact");
  const { toast } = useToast();
  const [form, setForm] = useState({ title: "", subtitle: "", description: "", email: "", cta_text: "" });

  useEffect(() => {
    if (section) {
      const c = section.content as any;
      setForm({ title: section.title || "", subtitle: section.subtitle || "", description: c?.description || "", email: c?.email || "", cta_text: c?.cta_text || "" });
    }
  }, [section]);

  const save = async () => {
    if (!section) return;
    await supabase.from("site_sections").update({
      title: form.title,
      subtitle: form.subtitle,
      content: { description: form.description, email: form.email, cta_text: form.cta_text },
    }).eq("id", section.id);
    await refetch();
    toast({ title: "Saved", description: "Contact section updated." });
  };

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-foreground">Contact Section</h2>
        <Button variant="clean" size="sm" onClick={save}><Save size={14} /> Save</Button>
      </div>
      <label className="block font-body text-xs text-muted-foreground uppercase tracking-wider">Tagline</label>
      <Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
      <label className="block font-body text-xs text-muted-foreground uppercase tracking-wider">Headline</label>
      <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <label className="block font-body text-xs text-muted-foreground uppercase tracking-wider">Description</label>
      <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <label className="block font-body text-xs text-muted-foreground uppercase tracking-wider">Email</label>
      <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <label className="block font-body text-xs text-muted-foreground uppercase tracking-wider">CTA Text</label>
      <Input value={form.cta_text} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} />
    </div>
  );
};

export default Admin;
