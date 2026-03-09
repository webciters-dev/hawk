import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Save } from "lucide-react";
import { useStatistics } from "@/hooks/use-cms-data";
import { useToast } from "@/hooks/use-toast";
import { getClientOrToast, requireNonEmpty, firstError } from "./admin-utils";

const StatisticsPanel = () => {
  const { data: stats, refetch } = useStatistics();
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (stats) setItems(stats);
  }, [stats]);

  const save = async () => {
    for (const item of items) {
      const err = firstError([
        requireNonEmpty(item.metric_value, "Metric value"),
        requireNonEmpty(item.metric_label, "Metric label"),
      ]);
      if (err) {
        toast({ title: "Validation error", description: err, variant: "destructive" });
        return;
      }
    }

    const client = await getClientOrToast(toast);
    if (!client) return;

    const payload = items.map((item) => ({
      id: item.id,
      metric_value: item.metric_value,
      metric_label: item.metric_label,
      sort_order: item.sort_order,
    }));
    const { error } = await client.from("statistics").upsert(payload);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }

    await refetch();
    toast({ title: "Saved", description: "Statistics updated." });
  };

  const add = async () => {
    const client = await getClientOrToast(toast);
    if (!client) return;
    const { data } = await client
      .from("statistics")
      .insert({ metric_value: "0", metric_label: "New Metric", sort_order: items.length + 1 })
      .select()
      .single();
    if (data) setItems([...items, data]);
  };

  const remove = async (id: string) => {
    const client = await getClientOrToast(toast);
    if (!client) return;
    await client.from("statistics").delete().eq("id", id);
    setItems(items.filter((i) => i.id !== id));
  };

  const update = (id: string, field: string, value: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-foreground">Statistics</h2>
        <div className="flex gap-2">
          <Button variant="cleanOutline" size="sm" onClick={add}>
            <Plus size={14} /> Add
          </Button>
          <Button variant="clean" size="sm" onClick={save}>
            <Save size={14} /> Save
          </Button>
        </div>
      </div>
      {items.map((s) => (
        <div key={s.id} className="flex items-center gap-3 border border-border rounded-sm p-4">
          <Input className="w-24" value={s.metric_value} onChange={(e) => update(s.id, "metric_value", e.target.value)} placeholder="100+" />
          <Input className="flex-1" value={s.metric_label} onChange={(e) => update(s.id, "metric_label", e.target.value)} placeholder="Label" />
          <Button variant="ghost" size="icon" onClick={() => remove(s.id)}>
            <Trash2 size={14} />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default StatisticsPanel;
