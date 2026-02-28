import { motion } from "framer-motion";
import { Shield, Eye, Zap } from "lucide-react";

const reasons = [
  {
    icon: Eye,
    title: "Hawk-Eye Perspective",
    description:
      "We see the full landscape — market dynamics, competitive positioning, and untapped opportunities — so you never enter a deal blind.",
  },
  {
    icon: Shield,
    title: "Trusted Access",
    description:
      "Our relationships are built on decades of integrity. We don't just open doors — we ensure you walk through the right ones.",
  },
  {
    icon: Zap,
    title: "Accelerated Outcomes",
    description:
      "Forget cold outreach. We compress timelines by connecting you directly with decision-makers ready to engage.",
  },
];

const WhyUsSection = () => {
  return (
    <section id="why-us" className="py-24 bg-navy relative overflow-hidden">
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, hsl(40 55% 50%) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }} />
      </div>

      <div className="relative container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-gold font-body text-sm tracking-[0.3em] uppercase mb-4 font-medium">
            Why Hawk Vision
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-cream">
            Your Strategic Advantage
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full border-2 border-gold/30 flex items-center justify-center mx-auto mb-6">
                <reason.icon className="text-gold" size={28} />
              </div>
              <h3 className="font-display text-xl font-semibold text-cream mb-4">
                {reason.title}
              </h3>
              <p className="font-body text-cream/60 leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
