import { motion } from "framer-motion";
import { useProcessSteps, useSiteSection } from "@/hooks/use-cms-data";

const ProcessSection = ({ showHeader = true }: { showHeader?: boolean }) => {
  const { data: steps } = useProcessSteps();
  const { data: section } = useSiteSection("process");

  return (
    <section id="process" className="py-28 bg-card">
      <div className="container mx-auto px-6 lg:px-12">
        {showHeader && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-20">
            <p className="text-crimson font-body text-xs tracking-[0.3em] uppercase mb-4 font-medium">
              {section?.subtitle || "Our Process"}
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-normal text-foreground">
              {section?.title || "How we work"}
            </h2>
          </motion.div>
        )}

        <div className="grid md:grid-cols-4 gap-12">
          {steps?.map((step, i) => (
            <motion.div key={step.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }}>
              <p className="font-display text-5xl font-normal text-border mb-4">{step.step_number}</p>
              <div className="section-line w-8 mb-4" />
              <h3 className="font-display text-lg font-medium text-foreground mb-3">{step.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
