import hawkLogo from "@/assets/hawk-logo-official.png";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12 bg-card">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={hawkLogo} alt="Hawk Vision Strategies" className="h-8 w-8 object-contain" />
            <span className="font-display text-sm font-medium text-foreground tracking-wide">
              Hawk Vision Strategies
            </span>
          </div>
          <div className="flex items-center gap-8">
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
          <p className="font-body text-muted-foreground text-xs">
            © {new Date().getFullYear()} Hawk Vision Strategies
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
