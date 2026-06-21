"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Error Boundary
// Catches render/effect errors in a React subtree and shows a fallback UI
// instead of crashing the whole page. Logs to console in dev mode.
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  children: ReactNode;
  /** Optional override fallback — defaults to the dark glass card below */
  fallback?: ReactNode;
  /** Optional label shown in the default fallback card */
  label?: string;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[LUMINA ErrorBoundary]", error, info.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          role="alert"
          className="flex items-center justify-center py-24 px-8"
          style={{ minHeight: "30vh" }}
        >
          <div
            className="max-w-sm w-full rounded-2xl p-8 text-center"
            style={{
              background: "rgba(3,6,16,0.7)",
              border: "1px solid rgba(168,200,255,0.08)",
              backdropFilter: "blur(24px)",
            }}
          >
            <div
              className="mx-auto mb-4 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(168,200,255,0.06)" }}
              aria-hidden
            >
              <span style={{ fontSize: "1.25rem" }}>⚠</span>
            </div>
            <p
              className="font-mono uppercase tracking-widest mb-2"
              style={{ fontSize: "0.65rem", color: "rgba(168,200,255,0.4)" }}
            >
              {this.props.label ?? "Section unavailable"}
            </p>
            <p style={{ fontSize: "0.8rem", color: "rgba(168,200,255,0.25)" }}>
              This module failed to render. Reload the page to try again.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
