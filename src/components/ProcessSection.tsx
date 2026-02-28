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
    description: "We facilitate warm introductions and structure conversations for impact.",
  },
  {
    number: "04",
    title: "Growth",
    description: "We support deal structuring and ongoing relationship management for lasting results.",
  },
];

const ProcessSection = () => {
  return (
    <section id="process" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-gold font-body text-sm tracking-[0.3em] uppercase mb-4 font-medium">
            How We Work
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Our Process
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className={`relative flex items-start gap-8 mb-12 last:mb-0 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Number circle */}
              <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-full bg-navy border-2 border-gold flex items-center justify-center md:absolute md:left-1/2 md:-translate-x-1/2">
                <span className="font-display text-lg font-bold text-gold">{step.number}</span>
              </div>

              {/* Content */}
              <div className={`flex-1 pt-2 pl-4 md:pl-0 ${
                i % 2 === 0 ? "md:pr-20 md:text-right" : "md:pl-20 md:text-left"
              }`}>
                <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Spacer for the other side */}
              <div className="hidden md:block flex-1" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
