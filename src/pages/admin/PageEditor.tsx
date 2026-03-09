import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Save, Eye, EyeOff } from "lucide-react";
import ImageBlockEditor from "./ImageBlockEditor";

const PageEditor = ({
  page,
  setPage,
  onSave,
  onBack,
}: {
  page: any;
  setPage: (p: any) => void;
  onSave: (p: any) => void;
  onBack: () => void;
}) => {
  const blocks: any[] = Array.isArray(page.content) ? page.content : [];

  const updateField = (field: string, value: any) => setPage({ ...page, [field]: value });

  const addBlock = (type: string) => {
    const newBlock = { id: crypto.randomUUID(), type, value: "", meta: {} };
    setPage({ ...page, content: [...blocks, newBlock] });
  };

  const updateBlock = (id: string, field: string, value: string) => {
    setPage({
      ...page,
      content: blocks.map((b) => (b.id === id ? { ...b, [field]: value } : b)),
    });
  };

  const updateBlockMeta = (id: string, key: string, value: string) => {
    setPage({
      ...page,
      content: blocks.map((b) => (b.id === id ? { ...b, meta: { ...b.meta, [key]: value } } : b)),
    });
  };

  const removeBlock = (id: string) => {
    setPage({ ...page, content: blocks.filter((b) => b.id !== id) });
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    const newBlocks = [...blocks];
    const target = index + direction;
    if (target < 0 || target >= newBlocks.length) return;
    [newBlocks[index], newBlocks[target]] = [newBlocks[target], newBlocks[index]];
    setPage({ ...page, content: newBlocks });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Pages
        </button>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => updateField("is_published", !page.is_published)}>
            {page.is_published ? (
              <>
                <Eye size={14} className="text-primary" /> Published
              </>
            ) : (
              <>
                <EyeOff size={14} /> Draft
              </>
            )}
          </Button>
          <Button variant="clean" size="sm" onClick={() => onSave(page)}>
            <Save size={14} /> Save
          </Button>
        </div>
      </div>

      {/* Page meta */}
      <div className="space-y-3 border border-border rounded-sm p-4">
        <label className="block font-body text-xs text-muted-foreground uppercase tracking-wider">Page Title</label>
        <Input value={page.title} onChange={(e) => updateField("title", e.target.value)} />
        <label className="block font-body text-xs text-muted-foreground uppercase tracking-wider">Slug (URL path)</label>
        <div className="flex items-center gap-1">
          <span className="font-body text-xs text-muted-foreground">/</span>
          <Input
            value={page.slug}
            onChange={(e) => updateField("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
          />
        </div>
        <label className="block font-body text-xs text-muted-foreground uppercase tracking-wider">
          Hero Title (optional, defaults to page title)
        </label>
        <Input value={page.hero_title || ""} onChange={(e) => updateField("hero_title", e.target.value)} />
        <label className="block font-body text-xs text-muted-foreground uppercase tracking-wider">Hero Description</label>
        <Textarea value={page.hero_subtitle || ""} onChange={(e) => updateField("hero_subtitle", e.target.value)} rows={2} />
      </div>

      {/* Content blocks */}
      <div className="space-y-4">
        <h3 className="font-display text-base text-foreground">Content Blocks</h3>
        {blocks.map((block, i) => (
          <div key={block.id} className="border border-border rounded-sm p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-body text-xs text-muted-foreground uppercase tracking-wider">{block.type}</span>
              <div className="flex gap-1">
                <button onClick={() => moveBlock(i, -1)} className="text-muted-foreground hover:text-foreground text-xs px-1">
                  ↑
                </button>
                <button onClick={() => moveBlock(i, 1)} className="text-muted-foreground hover:text-foreground text-xs px-1">
                  ↓
                </button>
                <Button variant="ghost" size="icon" onClick={() => removeBlock(block.id)}>
                  <Trash2 size={12} />
                </Button>
              </div>
            </div>
            {block.type === "heading" && (
              <Input value={block.value} onChange={(e) => updateBlock(block.id, "value", e.target.value)} placeholder="Heading text" />
            )}
            {block.type === "text" && (
              <Textarea value={block.value} onChange={(e) => updateBlock(block.id, "value", e.target.value)} placeholder="Paragraph text..." rows={4} />
            )}
            {block.type === "image" && (
              <ImageBlockEditor
                block={block}
                onValueChange={(val) => updateBlock(block.id, "value", val)}
                onMetaChange={(key, val) => updateBlockMeta(block.id, key, val)}
              />
            )}
            {block.type === "cta" && (
              <>
                <Input value={block.value} onChange={(e) => updateBlock(block.id, "value", e.target.value)} placeholder="Button label" />
                <Input value={block.meta?.url || ""} onChange={(e) => updateBlockMeta(block.id, "url", e.target.value)} placeholder="Button URL" />
              </>
            )}
          </div>
        ))}
        <div className="flex gap-2">
          <Button variant="cleanOutline" size="sm" onClick={() => addBlock("heading")}>
            + Heading
          </Button>
          <Button variant="cleanOutline" size="sm" onClick={() => addBlock("text")}>
            + Text
          </Button>
          <Button variant="cleanOutline" size="sm" onClick={() => addBlock("image")}>
            + Image
          </Button>
          <Button variant="cleanOutline" size="sm" onClick={() => addBlock("cta")}>
            + CTA
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PageEditor;
