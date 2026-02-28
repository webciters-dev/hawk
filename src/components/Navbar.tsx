import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import hawkLogo from "@/assets/hawk-logo-light.png";

const navItems = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-card/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-20 px-6 lg:px-12">
        <a href="#" className="flex items-center gap-3">
          <img src={hawkLogo} alt="Hawk Vision Strategies" className="h-14 w-14 object-contain" />
          <div>
            <span className="font-display text-base font-semibold text-foreground tracking-wide">
              Hawk Vision
            </span>
            <span className="block text-[10px] tracking-[0.25em] uppercase font-body text-muted-foreground">
              Strategies
            </span>
          </div>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-muted-foreground hover:text-foreground font-body text-xs font-medium tracking-[0.15em] transition-colors duration-300 uppercase"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            className="bg-primary text-primary-foreground px-5 py-2 font-body text-xs font-medium tracking-[0.15em] uppercase hover:bg-primary/85 transition-all duration-300"
          >
            Contact Us
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-foreground"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="flex flex-col items-center gap-5 py-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground font-body text-xs tracking-[0.15em] uppercase"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="bg-primary text-primary-foreground px-5 py-2 font-body text-xs font-medium tracking-[0.15em] uppercase mt-2"
            >
              Contact Us
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
