import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { useSiteSection } from "@/hooks/use-cms-data";
import { useToast } from "@/hooks/use-toast";
import { getClientOrToast } from "./admin-utils";

const ContactPanel = () => {
  const { data: section, refetch } = useSiteSection("contact");
  const { toast } = useToast();
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    email: "",
    cta_text: "",
    page_description: "",
  });

  useEffect(() => {
    if (section) {
      const c = section.content as any;
      setForm({
        title: section.title || "",
        subtitle: section.subtitle || "",
        description: c?.description || "",
        email: c?.email || "",
        cta_text: c?.cta_text || "",
        page_description: c?.page_description || "",
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
          email: form.email,
          cta_text: form.cta_text,
          page_description: form.page_description,
        },
      })
      .eq("id", section.id);

    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }

    await refetch();
    toast({ title: "Saved", description: "Contact section updated." });
  };

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-foreground">Contact Section</h2>
        <Button variant="clean" size="sm" onClick={save}>
          <Save size={14} /> Save
        </Button>
      </div>
      <label className="block font-body text-xs text-muted-foreground uppercase tracking-wider">
        Page Description (shown on /contact page hero)
      </label>
      <Textarea value={form.page_description} onChange={(e) => setForm({ ...form, page_description: e.target.value })} rows={3} placeholder="Introductory paragraph for the contact page..." />
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

export default ContactPanel;
