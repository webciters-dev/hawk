import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import hawkLogo from "@/assets/hawk-logo.png";

const navItems = [
  { label: "Services", href: "#services" },
  { label: "Why Us", href: "#why-us" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-navy-dark/90 backdrop-blur-md border-b border-gold/10"
    >
      <div className="container mx-auto flex items-center justify-between h-20 px-6">
        <a href="#" className="flex items-center gap-3">
          <img src={hawkLogo} alt="Hawk Vision Strategies" className="h-12 w-12 object-contain" />
          <div className="hidden sm:block">
            <span className="font-display text-lg font-bold text-cream tracking-wide">HAWK VISION</span>
            <span className="block text-gold text-xs tracking-[0.3em] uppercase font-body">Strategies</span>
          </div>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-cream/80 hover:text-gold font-body text-sm font-medium tracking-wide transition-colors duration-300 uppercase"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            className="bg-gold text-navy-dark px-6 py-2.5 rounded font-body text-sm font-semibold tracking-wide hover:bg-gold-light transition-all duration-300"
          >
            Book a Consultation
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-cream"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden bg-navy-dark border-t border-gold/10"
        >
          <div className="flex flex-col items-center gap-4 py-6">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-cream/80 hover:text-gold font-body text-sm tracking-wide uppercase"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="bg-gold text-navy-dark px-6 py-2.5 rounded font-body text-sm font-semibold mt-2"
            >
              Book a Consultation
            </a>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
