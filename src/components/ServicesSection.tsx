import { motion } from "framer-motion";
import { Handshake, Globe, Users, Target, Briefcase, Building, Lightbulb, Shield } from "lucide-react";
import { useServiceItems, useSiteSection } from "@/hooks/use-cms-data";

const iconMap: Record<string, any> = { Handshake, Globe, Users, Target, Briefcase, Building, Lightbulb, Shield };

const ServicesSection = () => {
  const { data: services } = useServiceItems();
  const { data: section } = useSiteSection("services");

  return (
    <section id="services" className="py-28 bg-card">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-20">
          <p className="text-crimson font-body text-xs tracking-[0.3em] uppercase mb-4 font-medium">
            {section?.subtitle || "Our Services"}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-normal text-foreground">
            {section?.title || "Technical knowledge built from well-rounded experience"}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-x-16 gap-y-16">
          {services?.map((service, i) => {
            const Icon = iconMap[service.icon_name] || Target;
            return (
              <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }} className="group">
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center border border-border group-hover:border-primary transition-colors duration-300">
                    <Icon className="text-crimson" size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-medium text-foreground mb-3">{service.title}</h3>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
