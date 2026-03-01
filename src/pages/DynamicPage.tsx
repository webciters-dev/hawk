import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { usePage, type ContentBlock } from "@/hooks/use-pages";

const BlockRenderer = ({ block }: { block: ContentBlock }) => {
  switch (block.type) {
    case "heading":
      return (
        <h2 className="font-display text-2xl md:text-3xl font-normal text-foreground mt-12 mb-4">
          {block.value}
        </h2>
      );
    case "text":
      return (
        <p className="font-body text-base text-muted-foreground leading-relaxed mb-6 whitespace-pre-line">
          {block.value}
        </p>
      );
    case "image":
      return (
        <div className="my-8">
          <img
            src={block.value}
            alt={block.meta?.alt || ""}
            className="w-full max-w-3xl rounded-sm"
          />
          {block.meta?.caption && (
            <p className="font-body text-xs text-muted-foreground mt-2">{block.meta.caption}</p>
          )}
        </div>
      );
    case "cta":
      return (
        <div className="my-8">
          <a
            href={block.meta?.url || "#"}
            className="inline-block bg-primary text-primary-foreground px-6 py-3 font-body text-xs font-medium tracking-[0.15em] uppercase hover:bg-primary/85 transition-all"
          >
            {block.value}
          </a>
        </div>
      );
    default:
      return null;
  }
};

const DynamicPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: page, isLoading, error } = usePage(slug || "");

  useEffect(() => {
    if (!isLoading && !page && !error) {
      navigate("/404", { replace: true });
    }
  }, [isLoading, page, error, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!page) return null;

  const blocks = Array.isArray(page.content) ? page.content : [];

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero
        title={page.hero_title || page.title}
        description={page.hero_subtitle || page.subtitle || undefined}
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {blocks.map((block) => (
              <BlockRenderer key={block.id} block={block} />
            ))}
            {blocks.length === 0 && (
              <p className="font-body text-muted-foreground text-center py-12">
                This page has no content yet.
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DynamicPage;
