import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { useSiteSection } from "@/hooks/use-cms-data";
import { useToast } from "@/hooks/use-toast";
import { getClientOrToast } from "./admin-utils";

const HeroPanel = () => {
  const { data: section, refetch } = useSiteSection("hero");
  const { toast } = useToast();
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    cta_primary_text: "",
    cta_primary_url: "",
    cta_secondary_text: "",
    cta_secondary_url: "",
  });

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

    const client = await getClientOrToast(toast);
    if (!client) return;

    const { error } = await client
      .from("site_sections")
      .update({
        title: form.title,
        subtitle: form.subtitle,
        content: {
          description: form.description,
          cta_primary_text: form.cta_primary_text,
          cta_primary_url: form.cta_primary_url,
          cta_secondary_text: form.cta_secondary_text,
          cta_secondary_url: form.cta_secondary_url,
        },
      })
      .eq("id", section.id);

    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }

    await refetch();
    toast({ title: "Saved", description: "Hero section updated." });
  };

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-foreground">Hero Section</h2>
        <Button variant="clean" size="sm" onClick={save}>
          <Save size={14} /> Save
        </Button>
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

export default HeroPanel;
