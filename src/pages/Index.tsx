import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import { useStatistics, useServiceItems } from "@/hooks/use-cms-data";

const Index = () => {
  const { data: stats } = useStatistics();
  const { data: services } = useServiceItems();

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />

      {/* Stats Strip */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid sm:grid-cols-3 gap-8">
            {stats?.map((stat) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="border-l-2 border-primary pl-5"
              >
                <p className="font-display text-3xl font-normal text-crimson mb-1">{stat.metric_value}</p>
                <p className="font-body text-xs text-muted-foreground tracking-wide">{stat.metric_label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-16">
            <p className="text-crimson font-body text-xs tracking-[0.3em] uppercase mb-4 font-medium">What We Do</p>
            <h2 className="font-display text-3xl md:text-4xl font-normal text-foreground">Our Services</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {services?.slice(0, 4).map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group"
              >
                <h3 className="font-display text-lg font-medium text-foreground mb-2">{service.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-3">{service.description}</p>
              </motion.div>
            ))}
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-2 font-body text-xs font-medium tracking-[0.2em] uppercase text-crimson border-b border-crimson pb-1 hover:opacity-70 transition-opacity"
          >
            View All Services <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
