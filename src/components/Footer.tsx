import hawkLogo from "@/assets/hawk-logo.png";

const Footer = () => {
  return (
    <footer className="bg-navy-dark border-t border-gold/10 py-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={hawkLogo} alt="Hawk Vision Strategies" className="h-8 w-8 object-contain" />
            <span className="font-display text-sm font-bold text-cream tracking-wide">
              HAWK VISION STRATEGIES
            </span>
          </div>
          <p className="font-body text-cream/40 text-sm">
            © {new Date().getFullYear()} Hawk Vision Strategies. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
