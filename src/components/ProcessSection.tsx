import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Discovery",
    description: "We deep-dive into your objectives, market landscape, and ideal partnership profile.",
  },
  {
    number: "02",
    title: "Mapping",
    description: "We identify and vet the right decision-makers and partnership opportunities.",
  },
  {
    number: "03",
    title: "Connection",
    description: "We facilitate warm introductions and structure conversations for maximum impact.",
  },
  {
    number: "04",
    title: "Growth",
    description: "We support deal structuring and ongoing relationship management for lasting results.",
  },
];

const ProcessSection = () => {
  return (
    <section id="process" className="py-28 bg-card">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <p className="text-crimson font-body text-xs tracking-[0.3em] uppercase mb-4 font-medium">
            Our Process
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-normal text-foreground">
            How we work
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <p className="font-display text-5xl font-normal text-border mb-4">
                {step.number}
              </p>
              <div className="section-line w-8 mb-4" />
              <h3 className="font-display text-lg font-medium text-foreground mb-3">
                {step.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
