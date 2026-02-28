import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useNavigationLinks, type NavigationLink } from "@/hooks/use-cms-data";
import hawkLogo from "@/assets/logo.png";

type NavRenderableLink = Pick<NavigationLink, "id" | "title" | "url" | "parent_id" | "is_cta">;

const FALLBACK_NAV_LINKS: NavRenderableLink[] = [
  { id: "fallback-services", title: "Services", url: "#services", parent_id: null, is_cta: false },
  { id: "fallback-about", title: "About", url: "#about", parent_id: null, is_cta: false },
  { id: "fallback-process", title: "Process", url: "#process", parent_id: null, is_cta: false },
  { id: "fallback-contact", title: "Contact Us", url: "#contact", parent_id: null, is_cta: true },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: links } = useNavigationLinks();

  const navLinks: NavRenderableLink[] = links && links.length > 0 ? links : FALLBACK_NAV_LINKS;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-card/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
        <a href="#" className="flex-shrink-0">
          <img src={hawkLogo} alt="Hawk Vision Strategies" className="h-12 object-contain" />
        </a>

        <div className="hidden md:flex items-center gap-10">
          {topLinks.map((item) => {
            const children = getChildren(item.id);
            return children.length > 0 ? (
              <div key={item.id} className="relative group">
                <a
                  href={item.url}
                  className="text-muted-foreground hover:text-foreground font-body text-[11px] font-medium tracking-[0.2em] transition-colors duration-300 uppercase inline-flex items-center gap-1"
                >
                  {item.title} <ChevronDown size={12} />
                </a>
                <div className="absolute top-full left-0 mt-2 bg-card border border-border shadow-lg rounded-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[180px]">
                  {children.map((child) => (
                    <a
                      key={child.id}
                      href={child.url}
                      className="block px-4 py-2 font-body text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      {child.title}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <a
                key={item.id}
                href={item.url}
                className="text-muted-foreground hover:text-foreground font-body text-[11px] font-medium tracking-[0.2em] transition-colors duration-300 uppercase"
              >
                {item.title}
              </a>
            );
          })}
          {ctaLink && (
            <a
              href={ctaLink.url}
              className="bg-primary text-primary-foreground px-5 py-1.5 font-body text-[11px] font-medium tracking-[0.15em] uppercase hover:bg-primary/85 transition-all duration-300"
            >
              {ctaLink.title}
            </a>
          )}
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground" aria-label="Toggle menu">
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="flex flex-col items-center gap-5 py-8">
            {topLinks.map((item) => (
              <a key={item.id} href={item.url} onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground font-body text-xs tracking-[0.15em] uppercase">
                {item.title}
              </a>
            ))}
            {ctaLink && (
              <a href={ctaLink.url} onClick={() => setIsOpen(false)} className="bg-primary text-primary-foreground px-5 py-2 font-body text-xs font-medium tracking-[0.15em] uppercase mt-2">
                {ctaLink.title}
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
