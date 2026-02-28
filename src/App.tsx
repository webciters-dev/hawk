import { Suspense, lazy, type ComponentType } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const lazyWithRetry = <T extends ComponentType<any>>(
  importer: () => Promise<{ default: T }>,
  retryKey: string,
) =>
  lazy(async () => {
    try {
      const module = await importer();
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(retryKey);
      }
      return module;
    } catch (error) {
      console.error(`Failed to load route chunk (${retryKey}):`, error);

      if (typeof window !== "undefined") {
        const alreadyRetried = window.sessionStorage.getItem(retryKey) === "1";
        if (!alreadyRetried) {
          window.sessionStorage.setItem(retryKey, "1");
          window.location.reload();
        }
      }

      throw error;
    }
  });

const Index = lazyWithRetry(() => import("./pages/Index"), "retry-route-index");
const ServicesPage = lazyWithRetry(() => import("./pages/ServicesPage"), "retry-route-services");
const AboutPage = lazyWithRetry(() => import("./pages/AboutPage"), "retry-route-about");
const ProcessPage = lazyWithRetry(() => import("./pages/ProcessPage"), "retry-route-process");
const ContactPage = lazyWithRetry(() => import("./pages/ContactPage"), "retry-route-contact");
const NotFound = lazyWithRetry(() => import("./pages/NotFound"), "retry-route-not-found");
const AdminLogin = lazyWithRetry(() => import("./pages/AdminLogin"), "retry-route-admin-login");
const Admin = lazyWithRetry(() => import("./pages/Admin"), "retry-route-admin");

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <p className="text-foreground">Loading...</p>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/process" element={<ProcessPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
