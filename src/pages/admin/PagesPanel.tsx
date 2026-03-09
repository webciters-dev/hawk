import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { getBackendClient } from "@/lib/backend-client";
import { useToast } from "@/hooks/use-toast";
import { getClientOrToast, requireNonEmpty, validateSlug, firstError } from "./admin-utils";
import PageEditor from "./PageEditor";

const PagesPanel = () => {
  const { toast } = useToast();
  const [pages, setPages] = useState<any[]>([]);
  const [editingPage, setEditingPage] = useState<any | null>(null);

  const fetchPages = async () => {
    const client = await getBackendClient();
    if (!client) return;
    const { data } = await client.from("pages").select("*").order("created_at", { ascending: false });
    if (data) setPages(data);
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const createPage = async () => {
    const client = await getClientOrToast(toast);
    if (!client) return;
    const slug = `new-page-${Date.now()}`;
    const { data } = await client
      .from("pages")
      .insert({ slug, title: "New Page", content: [], is_published: false })
      .select()
      .single();
    if (data) {
      setPages([data, ...pages]);
      setEditingPage(data);
    }
  };

  const savePage = async (page: any) => {
    // Validate title and slug before saving
    const err = firstError([
      requireNonEmpty(page.title, "Page title"),
      validateSlug(page.slug),
    ]);
    if (err) {
      toast({ title: "Validation error", description: err, variant: "destructive" });
      return;
    }

    // Check for duplicate slugs (excluding this page)
    const duplicate = pages.find((p) => p.slug === page.slug && p.id !== page.id);
    if (duplicate) {
      toast({
        title: "Duplicate slug",
        description: `The slug "/${page.slug}" is already used by "${duplicate.title}".`,
        variant: "destructive",
      });
      return;
    }

    const client = await getClientOrToast(toast);
    if (!client) return;

    const { error } = await client
      .from("pages")
      .update({
        slug: page.slug,
        title: page.title,
        subtitle: page.subtitle,
        hero_title: page.hero_title,
        hero_subtitle: page.hero_subtitle,
        content: page.content,
        is_published: page.is_published,
      })
      .eq("id", page.id);

    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }

    await fetchPages();
    toast({ title: "Saved", description: `Page "${page.title}" updated.` });
  };

  const deletePage = async (id: string) => {
    const client = await getClientOrToast(toast);
    if (!client) return;
    await client.from("pages").delete().eq("id", id);
    setPages(pages.filter((p) => p.id !== id));
    if (editingPage?.id === id) setEditingPage(null);
  };

  const togglePublish = async (page: any) => {
    const updated = { ...page, is_published: !page.is_published };
    await savePage(updated);
    if (editingPage?.id === page.id) setEditingPage(updated);
  };

  if (editingPage) {
    return (
      <PageEditor
        page={editingPage}
        setPage={setEditingPage}
        onSave={savePage}
        onBack={() => {
          setEditingPage(null);
          fetchPages();
        }}
      />
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-foreground">Dynamic Pages</h2>
        <Button variant="cleanOutline" size="sm" onClick={createPage}>
          <Plus size={14} /> New Page
        </Button>
      </div>
      {pages.length === 0 && <p className="font-body text-sm text-muted-foreground">No pages yet. Create one to get started.</p>}
      {pages.map((page) => (
        <div key={page.id} className="border border-border rounded-sm p-4 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-body text-sm font-medium text-foreground truncate">{page.title}</p>
            <p className="font-body text-xs text-muted-foreground">/{page.slug}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => togglePublish(page)} title={page.is_published ? "Unpublish" : "Publish"}>
              {page.is_published ? <Eye size={14} className="text-primary" /> : <EyeOff size={14} />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setEditingPage(page)}>
              Edit
            </Button>
            <Button variant="ghost" size="icon" onClick={() => deletePage(page.id)}>
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PagesPanel;
