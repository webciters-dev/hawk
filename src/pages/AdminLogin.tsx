import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [forceReady, setForceReady] = useState(false);
  const { signIn, isAdmin, loading, user } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate("/admin", { replace: true });
    }
  }, [loading, user, isAdmin, navigate]);

  useEffect(() => {
    const timer = window.setTimeout(() => setForceReady(true), 2500);

    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const hasAuthCallbackParams =
      searchParams.get("type") === "signup" ||
      hashParams.get("type") === "signup" ||
      Boolean(searchParams.get("token_hash")) ||
      Boolean(searchParams.get("code")) ||
      Boolean(searchParams.get("error")) ||
      Boolean(hashParams.get("access_token"));

    if (searchParams.get("error") || hashParams.get("error_description")) {
      const message = searchParams.get("error_description") || hashParams.get("error_description") || "Email callback was invalid. Please sign in manually.";
      setError(message);
    } else if (hasAuthCallbackParams) {
      setError("Email confirmed. Please sign in with your password.");
    }

    return () => window.clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const { error: err } = await signIn(email, password);
      if (err) {
        setError(err.message);
      }
    } catch {
      setError("Unable to sign in right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !forceReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">Preparing admin login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm p-8">
        <h1 className="font-display text-2xl text-foreground mb-2">Admin Login</h1>
        <p className="font-body text-sm text-muted-foreground mb-8">Sign in to manage your website content.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" variant="clean" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <a href="/" className="block mt-6 text-center font-body text-xs text-muted-foreground hover:text-foreground transition-colors">
          ← Back to website
        </a>
      </div>
    </div>
  );
};

export default AdminLogin;
