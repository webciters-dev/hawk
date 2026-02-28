import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, MapPin } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 bg-navy-dark relative overflow-hidden">
      {/* Gold accent line */}
      <div className="section-divider absolute top-0 left-0 right-0" />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-gold font-body text-sm tracking-[0.3em] uppercase mb-4 font-medium">
            Get in Touch
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-cream mb-6">
            Ready to See Further?
          </h2>
          <p className="font-body text-cream/60 text-lg leading-relaxed mb-10">
            Every strategic partnership starts with a conversation. Let's discuss how 
            Hawk Vision Strategies can unlock your next phase of growth.
          </p>

          <Button variant="hero" size="lg" className="text-base px-10 py-6 mb-12" asChild>
            <a href="mailto:info@hawkvisionstrategies.com">
              Start a Conversation <ArrowRight className="ml-2" size={18} />
            </a>
          </Button>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-cream/50 font-body text-sm">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-gold" />
              <span>info@hawkvisionstrategies.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-gold" />
              <span>Global Reach, Personal Touch</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
