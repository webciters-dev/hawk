import { createRoot } from "react-dom/client";
import { useEffect, useState, Component, type ErrorInfo, type ReactNode } from "react";
import App from "./App.tsx";
import "./index.css";

const RuntimeFallback = ({ message }: { message: string }) => (
  <div className="min-h-screen bg-background flex items-center justify-center px-6">
    <div className="max-w-md text-center">
      <h1 className="text-2xl font-display text-foreground mb-3">Something went wrong</h1>
      <p className="text-muted-foreground mb-6">{message}</p>
      <a href="/admin/login" className="text-sm text-foreground underline underline-offset-4">
        Go to admin login
      </a>
    </div>
  </div>
);

class RootErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; message: string }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = {
      hasError: false,
      message: "The page hit an unexpected error. Please reload and try again.",
    };
  }

  static getDerivedStateFromError(error: unknown) {
    return {
      hasError: true,
      message:
        error instanceof Error
          ? `A runtime error occurred: ${error.message}`
          : "The page hit an unexpected error. Please reload and try again.",
    };
  }

  componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
    console.error("Root error boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <RuntimeFallback message={this.state.message} />;
    }

    return this.props.children;
  }
}

const AppRuntimeGuard = () => {
  const [runtimeError, setRuntimeError] = useState<string | null>(null);

  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      console.error("Global runtime error:", event.error || event.message);
      setRuntimeError("The page hit an unexpected error. Please reload and try again.");
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason);
      setRuntimeError("A background auth step failed. Please reload and try signing in again.");
      event.preventDefault();
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  if (runtimeError) {
    return <RuntimeFallback message={runtimeError} />;
  }

  return <App />;
};

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <RootErrorBoundary>
      <AppRuntimeGuard />
    </RootErrorBoundary>,
  );
}
