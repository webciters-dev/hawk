import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Save } from "lucide-react";
import { useProcessSteps, useSiteSection } from "@/hooks/use-cms-data";
import { useToast } from "@/hooks/use-toast";
import { getClientOrToast, requireNonEmpty, firstError } from "./admin-utils";

const ProcessPanel = () => {
  const { data: steps, refetch: refetchItems } = useProcessSteps();
  const { data: section, refetch: refetchSection } = useSiteSection("process");
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [pageDesc, setPageDesc] = useState("");

  useEffect(() => {
    if (steps) setItems(steps);
  }, [steps]);
  useEffect(() => {
    if (section) setPageDesc((section.content as any)?.page_description || "");
  }, [section]);

  const save = async () => {
    for (const item of items) {
      const err = firstError([
        requireNonEmpty(item.title, "Step title"),
        requireNonEmpty(item.description, "Step description"),
      ]);
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
      step_number: item.step_number,
      title: item.title,
      description: item.description,
      sort_order: item.sort_order,
    }));
    const { error } = await client.from("process_steps").upsert(payload);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }

    await refetchItems();
    await refetchSection();
    toast({ title: "Saved", description: "Process steps updated." });
  };

  const add = async () => {
    const client = await getClientOrToast(toast);
    if (!client) return;
    const num = String(items.length + 1).padStart(2, "0");
    const { data } = await client
      .from("process_steps")
      .insert({ step_number: num, title: "New Step", description: "Description here", sort_order: items.length + 1 })
      .select()
      .single();
    if (data) setItems([...items, data]);
  };

  const remove = async (id: string) => {
    const client = await getClientOrToast(toast);
    if (!client) return;
    await client.from("process_steps").delete().eq("id", id);
    setItems(items.filter((i) => i.id !== id));
  };

  const update = (id: string, field: string, value: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-foreground">Process Steps</h2>
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
          Page Description (shown on /process page hero)
        </label>
        <Textarea value={pageDesc} onChange={(e) => setPageDesc(e.target.value)} rows={3} placeholder="Introductory paragraph for the process page..." />
      </div>
      {items.map((s) => (
        <div key={s.id} className="border border-border rounded-sm p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Input className="w-20" value={s.step_number} onChange={(e) => update(s.id, "step_number", e.target.value)} placeholder="01" />
            <Input className="flex-1" value={s.title} onChange={(e) => update(s.id, "title", e.target.value)} placeholder="Title" />
            <Button variant="ghost" size="icon" onClick={() => remove(s.id)}>
              <Trash2 size={14} />
            </Button>
          </div>
          <Textarea value={s.description} onChange={(e) => update(s.id, "description", e.target.value)} placeholder="Description" />
        </div>
      ))}
    </div>
  );
};

export default ProcessPanel;
