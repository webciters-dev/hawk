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
    <footer className="border-t border-border py-16 bg-card">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex justify-center mb-10">
          <img src={hawkLogo} alt="Hawk Vision Strategies" className="h-16 object-contain" />
        </div>

        <div className="flex items-center justify-center gap-8 mb-10">
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
        </div>

        {content?.linkedin_url && (
          <div className="flex justify-center mb-10">
            <a href={content.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors duration-300" aria-label="Follow us on LinkedIn">
              <Linkedin size={28} strokeWidth={1.5} />
              <span className="font-body text-sm font-medium">LinkedIn</span>
            </a>
          </div>
        )}

        <div className="section-line max-w-xs mx-auto mb-8" />
        <p className="font-body text-muted-foreground text-xs text-center">
          © {new Date().getFullYear()} Hawk Vision Strategies. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
