import { motion } from "framer-motion";

interface PageHeroProps {
  tagline?: string;
  title: string;
  description?: string;
}

const PageHero = ({ tagline, title, description }: PageHeroProps) => (
  <section className="pt-32 pb-20 bg-background border-b border-border">
    <div className="container mx-auto px-6 lg:px-12">
      {tagline && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-crimson font-body text-xs tracking-[0.3em] uppercase mb-4 font-medium"
        >
          {tagline}
        </motion.p>
      )}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-display text-4xl md:text-5xl lg:text-6xl font-normal text-foreground leading-[1.1] mb-6"
      >
        {title}
      </motion.h1>
      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-body text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl"
        >
          {description}
        </motion.p>
      )}
    </div>
  </section>
);

export default PageHero;
