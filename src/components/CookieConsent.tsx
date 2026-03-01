import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const COOKIE_CONSENT_KEY = "hawk_cookie_consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 text-white px-6 py-5 shadow-lg border-t border-white/10">
      <div className="container mx-auto max-w-3xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="font-body text-sm leading-relaxed">
            This website uses cookies to ensure you get the best experience on our website.{" "}
            <Link
              to="/cookie-policy"
              className="underline underline-offset-2 hover:text-primary transition-colors"
            >
              Learn more
            </Link>
          </p>
        </div>
        <button
          onClick={handleAccept}
          className="shrink-0 bg-[#f5c518] hover:bg-[#e0b400] text-black font-body text-sm font-bold tracking-wide px-8 py-2.5 transition-colors duration-200"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
