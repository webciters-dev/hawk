import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import hawkLogo from "@/assets/hawk-logo-final.png";

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
    const handleScroll = () => setScrolled(window.scrollY > 120);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Logo bar — visible at top, collapses on scroll */}
      <div
        className={`bg-card/95 backdrop-blur-sm transition-all duration-500 overflow-hidden ${
          scrolled ? "max-h-0 opacity-0" : "max-h-24 opacity-100"
        }`}
      >
        <div className="container mx-auto px-6 lg:px-12 flex justify-center py-5">
          <a href="#">
            <img src={hawkLogo} alt="Hawk Vision Strategies" className="h-14 object-contain" />
          </a>
        </div>
      </div>

      {/* Navigation bar */}
      <nav
        className={`transition-all duration-300 ${
          scrolled
            ? "bg-card/95 backdrop-blur-sm shadow-sm"
            : "bg-card/80 backdrop-blur-sm"
        } border-b border-border`}
      >
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between h-12">
          {/* Small logo for scrolled state */}
          <a
            href="#"
            className={`transition-all duration-300 ${
              scrolled ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
            }`}
          >
            <img src={hawkLogo} alt="Hawk Vision Strategies" className="h-8 object-contain" />
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10 mx-auto">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-muted-foreground hover:text-foreground font-body text-[11px] font-medium tracking-[0.2em] transition-colors duration-300 uppercase"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              className="bg-primary text-primary-foreground px-5 py-1.5 font-body text-[11px] font-medium tracking-[0.15em] uppercase hover:bg-primary/85 transition-all duration-300"
            >
              Contact Us
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground ml-auto"
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
    </header>
  );
};

export default Navbar;
