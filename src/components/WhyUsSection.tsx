import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";

const WhyUsSection = () => {
  return (
    <section id="about" className="py-28 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — About text with photo placeholder */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-crimson font-body text-xs tracking-[0.3em] uppercase mb-4 font-medium">
              About Shireen
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-normal text-foreground mb-8">
              A consultancy experience that goes beyond results
            </h2>

            {/* Photo placeholder */}
            <div className="w-48 h-48 bg-muted rounded-sm mb-4 flex items-center justify-center">
              <span className="font-body text-xs text-muted-foreground">Photo</span>
            </div>

            {/* LinkedIn under photo */}
            <a
              href="https://www.linkedin.com/in/shireen"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors duration-300 mb-8"
            >
              <Linkedin size={20} strokeWidth={1.5} />
              <span className="font-body text-sm font-medium">Connect on LinkedIn</span>
            </a>

            <p className="font-body text-sm text-muted-foreground leading-[1.8] mb-6">
              At Hawk Vision Strategies, we don't just open doors — we ensure you walk through 
              the right ones. Our approach is built on decades of trusted relationships, deep 
              market intelligence, and a commitment to outcomes that endure.
            </p>
            <p className="font-body text-sm text-muted-foreground leading-[1.8]">
              We see the full landscape — market dynamics, competitive positioning, and untapped 
              opportunities — so our clients never enter a partnership blind.
            </p>
          </motion.div>

          {/* Right — Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-10"
          >
            {[
              { number: "100+", label: "Strategic partnerships brokered" },
              { number: "30+", label: "Industries served globally" },
              { number: "95%", label: "Client retention rate" },
            ].map((stat) => (
              <div key={stat.label} className="border-l-2 border-primary pl-6">
                <p className="font-display text-4xl font-normal text-crimson mb-1">
                  {stat.number}
                </p>
                <p className="font-body text-sm text-muted-foreground tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
