import { Link } from "react-router-dom";
import { Linkedin } from "lucide-react";
import { useNavigationLinks, useSiteSection } from "@/hooks/use-cms-data";
import hawkLogo from "@/assets/logo.png";

const isInternalLink = (url: string) => url.startsWith("/") && !url.startsWith("//");

const Footer = () => {
  const { data: links } = useNavigationLinks();
  const { data: section } = useSiteSection("footer");
  const content = section?.content as any;

  const navLinks = links?.filter((l) => !l.parent_id && !l.is_cta) || [];

  return (
    <footer className="border-t border-border py-6 bg-card">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          {/* Logo */}
          <img src={hawkLogo} alt="Hawk Vision Strategies" className="h-10 object-contain" />

          {/* Nav Links */}
          <nav className="flex items-center gap-6">
            {navLinks.map((item) =>
              isInternalLink(item.url) ? (
                <Link key={item.id} to={item.url} className="font-body text-[11px] text-muted-foreground hover:text-foreground tracking-[0.15em] uppercase transition-colors">
                  {item.title}
                </Link>
              ) : (
                <a key={item.id} href={item.url} className="font-body text-[11px] text-muted-foreground hover:text-foreground tracking-[0.15em] uppercase transition-colors">
                  {item.title}
                </a>
              )
            )}
          </nav>

          {/* Right side: social + copyright */}
          <div className="flex items-center gap-4">
            {content?.linkedin_url && (
              <a href={content.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Follow us on LinkedIn">
                <Linkedin size={18} strokeWidth={1.5} />
              </a>
            )}
            <span className="font-body text-muted-foreground text-xs">
              © {new Date().getFullYear()} Hawk Vision Strategies
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
