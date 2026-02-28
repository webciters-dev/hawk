import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";
import shireenPhoto from "@/assets/shireen-raza.jpg";

const WhyUsSection = () => {
  return (
    <section id="about" className="py-28 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <p className="text-crimson font-body text-xs tracking-[0.3em] uppercase mb-4 font-medium">
            About
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-normal text-foreground">
            Meet Shireen Raza
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-16 items-start">
          {/* Left — Photo + LinkedIn */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={shireenPhoto}
              alt="Shireen Raza — Founder of Hawk Vision Strategies"
              className="w-full aspect-[4/5] object-cover object-top rounded-sm mb-4"
            />
            <a
              href="https://www.linkedin.com/in/shireen-raza"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors duration-300"
            >
              <Linkedin size={20} strokeWidth={1.5} />
              <span className="font-body text-sm font-medium">Connect on LinkedIn</span>
            </a>
          </motion.div>

          {/* Right — Bio */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="font-body text-sm text-muted-foreground leading-[1.9] mb-6">
              14 years ago I started my career as a corporate tax attorney at Norton Rose Fulbright 
              in Amsterdam. A couple of years later I switched to a criminal law practice as I 
              wasn't getting the experience and exposure to courtroom practice that I wanted to. 
              After having experienced both I realized I was passionate about the commercial side 
              of the corporate legal practice and I decided to work in the Marketing and Business 
              Development department at DLA Piper in Amsterdam.
            </p>
            <p className="font-body text-sm text-muted-foreground leading-[1.9] mb-10">
              This was a hugely educational and transformative experience for me as it is here 
              that I developed my unique brand of concrete business development or rather practice 
              development. I realized that if I wanted to dedicate myself to practice development 
              fully, doing this independently would be the perfect way to go forward.
            </p>

            {/* Stats */}
            <div className="grid sm:grid-cols-3 gap-8">
              {[
                { number: "100+", label: "Strategic partnerships brokered" },
                { number: "30+", label: "Industries served globally" },
                { number: "95%", label: "Client retention rate" },
              ].map((stat) => (
                <div key={stat.label} className="border-l-2 border-primary pl-5">
                  <p className="font-display text-3xl font-normal text-crimson mb-1">
                    {stat.number}
                  </p>
                  <p className="font-body text-xs text-muted-foreground tracking-wide">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
