import { Linkedin } from "lucide-react";
import hawkLogo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border py-16 bg-card">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Large centered logo */}
        <div className="flex justify-center mb-10">
          <img src={hawkLogo} alt="Hawk Vision Strategies" className="h-16 object-contain" />
        </div>

        {/* Nav links */}
        <div className="flex items-center justify-center gap-8 mb-10">
          {["Services", "About", "Process"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="font-body text-[11px] text-muted-foreground hover:text-foreground tracking-[0.15em] uppercase transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        {/* LinkedIn */}
        <div className="flex justify-center mb-10">
          <a
            href="https://www.linkedin.com/company/hawkvisionstrategies"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors duration-300"
            aria-label="Follow us on LinkedIn"
          >
            <Linkedin size={28} strokeWidth={1.5} />
            <span className="font-body text-sm font-medium">LinkedIn</span>
          </a>
        </div>

        {/* Divider */}
        <div className="section-line max-w-xs mx-auto mb-8" />

        <p className="font-body text-muted-foreground text-xs text-center">
          © {new Date().getFullYear()} Hawk Vision Strategies. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
