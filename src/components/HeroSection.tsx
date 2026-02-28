import { motion } from "framer-motion";
import { useSiteSection } from "@/hooks/use-cms-data";
import heroLight from "@/assets/hero-light.jpg";

const HeroSection = () => {
  const { data: section } = useSiteSection("hero");
  const content = section?.content as any;

  return (
    <section className="relative min-h-screen flex items-center">
      <div className="absolute inset-0">
        <img src={heroLight} alt="" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-background/60" />
      </div>

      <div className="relative container mx-auto px-6 lg:px-12 pt-32 pb-20">
        <div className="max-w-full">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-crimson font-body text-xs tracking-[0.3em] uppercase mb-8 font-medium"
          >
            {section?.subtitle || "Strategic Partnerships & Market Development"}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-normal text-foreground leading-[1.1] mb-8"
          >
            {section?.title || "Connecting you to the right people at the right time"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-muted-foreground font-body text-base md:text-lg leading-relaxed mb-12 max-w-4xl"
          >
            {content?.description || ""}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            {content?.cta_primary_text && (
              <a href={content.cta_primary_url || "#services"} className="font-body text-xs font-medium tracking-[0.2em] uppercase text-crimson border-b border-crimson pb-1 hover:opacity-70 transition-opacity">
                {content.cta_primary_text}
              </a>
            )}
            {content?.cta_secondary_text && (
              <>
                <span className="text-border mx-4">|</span>
                <a href={content.cta_secondary_url || "#contact"} className="font-body text-xs font-medium tracking-[0.2em] uppercase text-foreground border-b border-foreground pb-1 hover:opacity-70 transition-opacity">
                  {content.cta_secondary_text}
                </a>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
