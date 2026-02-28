import hawkLogo from "@/assets/hawk-logo-final.png";

const Footer = () => {
  return (
    <footer className="border-t border-border py-16 bg-card">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Large centered logo */}
        <div className="flex justify-center mb-10">
          <img src={hawkLogo} alt="Hawk Vision Strategies" className="h-20 object-contain" />
        </div>

        {/* Nav links */}
        <div className="flex items-center justify-center gap-8 mb-10">
          {["Services", "About", "Process", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="font-body text-[11px] text-muted-foreground hover:text-foreground tracking-[0.15em] uppercase transition-colors"
            >
              {item}
            </a>
          ))}
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
