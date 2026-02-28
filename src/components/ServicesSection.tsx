import { motion } from "framer-motion";
import { Handshake, Globe, Users, Target } from "lucide-react";

const services = [
  {
    icon: Handshake,
    title: "Strategic Partnerships",
    description:
      "Identifying and brokering high-value partnerships that accelerate growth and open new revenue channels.",
  },
  {
    icon: Globe,
    title: "Market Entry Strategy",
    description:
      "Designing your route-to-market with precision — from regulatory landscape to go-to-market execution.",
  },
  {
    icon: Users,
    title: "Ecosystem Engagement",
    description:
      "Building and activating networks of stakeholders, alliances, and communities around your strategic objectives.",
  },
  {
    icon: Target,
    title: "Decision-Maker Access",
    description:
      "Leveraging trusted relationships to connect you directly with the people who matter most to your growth.",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15 },
  }),
};

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-gold font-body text-sm tracking-[0.3em] uppercase mb-4 font-medium">
            What We Do
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Our Services
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="group p-8 rounded-lg border border-border bg-card hover:border-gold/30 transition-all duration-500 hover:shadow-lg"
            >
              <div className="w-14 h-14 rounded-lg bg-navy flex items-center justify-center mb-6 group-hover:bg-gold transition-colors duration-500">
                <service.icon className="text-gold group-hover:text-navy-dark transition-colors duration-500" size={26} />
              </div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
