import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, GripVertical, Save } from "lucide-react";
import { useNavigationLinks } from "@/hooks/use-cms-data";
import { useToast } from "@/hooks/use-toast";
import { getClientOrToast, requireNonEmpty, firstError } from "./admin-utils";

const NavigationPanel = () => {
  const { data: links, refetch } = useNavigationLinks();
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (links) setItems(links);
  }, [links]);

  const save = async () => {
    // Validate: every link needs a title
    for (const item of items) {
      const err = firstError([requireNonEmpty(item.title, "Link title")]);
      if (err) {
        toast({ title: "Validation error", description: err, variant: "destructive" });
        return;
      }
    }

    const client = await getClientOrToast(toast);
    if (!client) return;

    const payload = items.map((item) => ({
      id: item.id,
      title: item.title,
      url: item.url,
      parent_id: item.parent_id,
      sort_order: item.sort_order,
      is_cta: item.is_cta,
    }));

    const { error } = await client.from("navigation_links").upsert(payload);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }

    await refetch();
    toast({ title: "Saved", description: "Navigation updated." });
  };

  const addLink = async () => {
    const client = await getClientOrToast(toast);
    if (!client) return;

    const { data } = await client
      .from("navigation_links")
      .insert({ title: "New Link", url: "#", sort_order: (items?.length || 0) + 1 })
      .select()
      .single();
    if (data) setItems([...items, data]);
  };

  const addSublink = async (parentId: string) => {
    const client = await getClientOrToast(toast);
    if (!client) return;

    const { data } = await client
      .from("navigation_links")
      .insert({
        title: "New Sublink",
        url: "#",
        parent_id: parentId,
        sort_order: items.filter((i) => i.parent_id === parentId).length + 1,
      })
      .select()
      .single();
    if (data) setItems([...items, data]);
  };

  const removeLink = async (id: string) => {
    const client = await getClientOrToast(toast);
    if (!client) return;

    await client.from("navigation_links").delete().eq("id", id);
    setItems(items.filter((i) => i.id !== id && i.parent_id !== id));
  };

  const updateItem = (id: string, field: string, value: any) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const topLevel = items.filter((i) => !i.parent_id);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-foreground">Navigation Links</h2>
        <div className="flex gap-2">
          <Button variant="cleanOutline" size="sm" onClick={addLink}>
            <Plus size={14} /> Add Link
          </Button>
          <Button variant="clean" size="sm" onClick={save}>
            <Save size={14} /> Save
          </Button>
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
            <Button variant="ghost" size="icon" onClick={() => removeLink(link.id)}>
              <Trash2 size={14} />
            </Button>
          </div>

          {items
            .filter((i) => i.parent_id === link.id)
            .map((sub) => (
              <div key={sub.id} className="ml-8 flex items-center gap-3">
                <GripVertical size={14} className="text-muted-foreground" />
                <Input className="flex-1" value={sub.title} onChange={(e) => updateItem(sub.id, "title", e.target.value)} placeholder="Sublink label" />
                <Input className="flex-1" value={sub.url} onChange={(e) => updateItem(sub.id, "url", e.target.value)} placeholder="URL" />
                <Button variant="ghost" size="icon" onClick={() => removeLink(sub.id)}>
                  <Trash2 size={14} />
                </Button>
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

export default NavigationPanel;
