import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2 } from "lucide-react";
import { getBackendClient } from "@/lib/backend-client";
import { useToast } from "@/hooks/use-toast";

/**
 * Image block editor with upload support.
 *
 * The preview `<img>` uses the stored public URL. For this to work,
 * the Kong gateway must allow unauthenticated GET requests to
 * /storage/v1/object/public/* (see the kong.yml.template fix).
 */
const ImageBlockEditor = ({
  block,
  onValueChange,
  onMetaChange,
}: {
  block: any;
  onValueChange: (val: string) => void;
  onMetaChange: (key: string, val: string) => void;
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side guard: images only, max 10 MB
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please select an image file.", variant: "destructive" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum upload size is 10 MB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const client = await getBackendClient();
      if (!client) throw new Error("Backend unavailable");

      const ext = file.name.split(".").pop() || "png";
      const path = `pages/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: uploadError } = await client.storage
        .from("cms-uploads")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = client.storage.from("cms-uploads").getPublicUrl(path);

      onValueChange(urlData.publicUrl);
      toast({ title: "Uploaded", description: "Image uploaded successfully." });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Input
          className="flex-1"
          value={block.value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder="Image URL"
        />
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        <Button variant="cleanOutline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </div>
      {block.value && (
        <img
          src={block.value}
          alt={block.meta?.alt || "Preview"}
          className="max-h-40 rounded-sm object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      )}
      <Input value={block.meta?.alt || ""} onChange={(e) => onMetaChange("alt", e.target.value)} placeholder="Alt text" />
      <Input value={block.meta?.caption || ""} onChange={(e) => onMetaChange("caption", e.target.value)} placeholder="Caption (optional)" />
    </>
  );
};

export default ImageBlockEditor;
