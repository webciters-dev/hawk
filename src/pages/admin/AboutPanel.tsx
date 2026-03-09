import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Save } from "lucide-react";
import { useTeamMembers, useSiteSection } from "@/hooks/use-cms-data";
import { useToast } from "@/hooks/use-toast";
import { getClientOrToast, requireNonEmpty } from "./admin-utils";

const AboutPanel = () => {
  const { data: members, refetch: refetchMembers } = useTeamMembers();
  const { data: section, refetch: refetchSection } = useSiteSection("about");
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [pageDesc, setPageDesc] = useState("");

  useEffect(() => {
    if (members) setItems(members);
  }, [members]);
  useEffect(() => {
    if (section) setPageDesc((section.content as any)?.page_description || "");
  }, [section]);

  const save = async () => {
    for (const item of items) {
      const err = requireNonEmpty(item.name, "Member name");
      if (err) {
        toast({ title: "Validation error", description: err, variant: "destructive" });
        return;
      }
    }

    const client = await getClientOrToast(toast);
    if (!client) return;

    if (section) {
      const existing = (section.content as any) || {};
      await client
        .from("site_sections")
        .update({ content: { ...existing, page_description: pageDesc } })
        .eq("id", section.id);
    }

    const payload = items.map((item) => ({
      id: item.id,
      name: item.name,
      role: item.role,
      bio: item.bio,
      bio_extended: item.bio_extended,
      image_url: item.image_url,
      linkedin_url: item.linkedin_url,
      sort_order: item.sort_order,
    }));
    const { error } = await client.from("team_members").upsert(payload);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }

    await refetchMembers();
    await refetchSection();
    toast({ title: "Saved", description: "About section updated." });
  };

  const add = async () => {
    const client = await getClientOrToast(toast);
    if (!client) return;
    const { data } = await client
      .from("team_members")
      .insert({ name: "New Member", role: "Role", sort_order: items.length + 1 })
      .select()
      .single();
    if (data) setItems([...items, data]);
  };

  const remove = async (id: string) => {
    const client = await getClientOrToast(toast);
    if (!client) return;
    await client.from("team_members").delete().eq("id", id);
    setItems(items.filter((i) => i.id !== id));
  };

  const update = (id: string, field: string, value: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-foreground">About / Team</h2>
        <div className="flex gap-2">
          <Button variant="cleanOutline" size="sm" onClick={add}>
            <Plus size={14} /> Add
          </Button>
          <Button variant="clean" size="sm" onClick={save}>
            <Save size={14} /> Save
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <label className="block font-body text-xs text-muted-foreground uppercase tracking-wider">
          Page Description (shown on /about page hero)
        </label>
        <Textarea value={pageDesc} onChange={(e) => setPageDesc(e.target.value)} rows={3} placeholder="Introductory paragraph for the about page..." />
      </div>
      {items.map((m) => (
        <div key={m.id} className="border border-border rounded-sm p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Input className="flex-1" value={m.name} onChange={(e) => update(m.id, "name", e.target.value)} placeholder="Name" />
            <Input className="flex-1" value={m.role || ""} onChange={(e) => update(m.id, "role", e.target.value)} placeholder="Role" />
            <Button variant="ghost" size="icon" onClick={() => remove(m.id)}>
              <Trash2 size={14} />
            </Button>
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

export default AboutPanel;
