import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useSiteSection } from "@/hooks/use-cms-data";

const ContactSection = () => {
  const { data: section } = useSiteSection("contact");
  const content = section?.content as any;

  return (
    <section id="contact" className="py-28 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <p className="text-crimson font-body text-xs tracking-[0.3em] uppercase mb-4 font-medium">
              {section?.subtitle || "Contact Us"}
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-normal text-foreground mb-6">
              {section?.title || "Let's start a conversation"}
            </h2>
            <p className="font-body text-sm text-muted-foreground leading-[1.8] mb-10">
              {content?.description || ""}
            </p>

            <a
              href={`mailto:${content?.email || "info@hawkvisionstrategies.com"}`}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 font-body text-xs font-medium tracking-[0.2em] uppercase hover:bg-primary/85 transition-all duration-300"
            >
              {content?.cta_text || "Get in Touch"} <ArrowRight size={14} />
            </a>

            <p className="mt-10 font-body text-xs text-muted-foreground tracking-wide">
              {content?.email || "info@hawkvisionstrategies.com"}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
