import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import NavigationPanel from "./admin/NavigationPanel";
import HeroPanel from "./admin/HeroPanel";
import ServicesPanel from "./admin/ServicesPanel";
import StatisticsPanel from "./admin/StatisticsPanel";
import AboutPanel from "./admin/AboutPanel";
import ProcessPanel from "./admin/ProcessPanel";
import ContactPanel from "./admin/ContactPanel";
import PagesPanel from "./admin/PagesPanel";

type Tab = "navigation" | "hero" | "services" | "about" | "process" | "contact" | "statistics" | "pages";

const tabs: { key: Tab; label: string }[] = [
  { key: "navigation", label: "Navigation" },
  { key: "hero", label: "Hero" },
  { key: "services", label: "Services" },
  { key: "statistics", label: "Statistics" },
  { key: "about", label: "About" },
  { key: "process", label: "Process" },
  { key: "contact", label: "Contact" },
  { key: "pages", label: "Pages" },
];

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAdminAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("navigation");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin/login", { replace: true });
    }
  }, [loading, user, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6 text-center">
        <div>
          <p className="text-foreground font-body mb-2">Checking admin access...</p>
          <a href="/admin/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Return to admin login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 flex items-center justify-between h-16">
          <h1 className="font-display text-xl text-foreground">CMS Dashboard</h1>
          <div className="flex items-center gap-4">
            <a href="/" className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors">
              View Site
            </a>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut size={16} /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`font-body text-xs tracking-wider uppercase px-4 py-2 transition-colors ${
                activeTab === tab.key
                  ? "text-foreground border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panels */}
        {activeTab === "navigation" && <NavigationPanel />}
        {activeTab === "hero" && <HeroPanel />}
        {activeTab === "services" && <ServicesPanel />}
        {activeTab === "statistics" && <StatisticsPanel />}
        {activeTab === "about" && <AboutPanel />}
        {activeTab === "process" && <ProcessPanel />}
        {activeTab === "contact" && <ContactPanel />}
        {activeTab === "pages" && <PagesPanel />}
      </div>
    </div>
  );
};

export default Admin;
