"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, Chrome, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "./AuthContext";
import type { AuthView } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Auth Modal (Glassmorphism)
// ─────────────────────────────────────────────────────────────────────────────

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: AuthView;
}

function CornerMark({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const cls = {
    tl: "top-3 left-3 border-t border-l",
    tr: "top-3 right-3 border-t border-r",
    bl: "bottom-3 left-3 border-b border-l",
    br: "bottom-3 right-3 border-b border-r",
  };
  return <span className={`absolute w-3 h-3 border-lumina-star/30 ${cls[pos]}`} />;
}

interface FieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

function Field({ label, type, value, onChange, placeholder, autoComplete, icon, disabled }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">{label}</label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className={cn(
            "w-full pl-10 pr-4 py-3 rounded-xl",
            "bg-white/[0.04] border border-white/[0.08]",
            "text-sm text-white placeholder:text-white/20",
            "focus:outline-none focus:border-lumina-star/40 focus:bg-white/[0.07]",
            "transition-all duration-200",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
        />
      </div>
    </div>
  );
}

export function AuthModal({ isOpen, onClose, defaultView = "sign-in" }: AuthModalProps) {
  const [view, setView] = useState<AuthView>(defaultView);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword, isConfigured } = useAuth();

  useEffect(() => {
    if (isOpen) setView(defaultView);
  }, [isOpen, defaultView]);

  useEffect(() => {
    setError(null);
    setSuccess(null);
    setEmail("");
    setPassword("");
    setConfirm("");
  }, [view]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleSubmit = useCallback(async () => {
    setError(null);
    setLoading(true);

    if (!isConfigured) {
      setError("Authentication not configured. Please add Supabase credentials to .env.local");
      setLoading(false);
      return;
    }

    try {
      if (view === "sign-in") {
        const { error } = await signInWithEmail(email, password);
        if (error) { setError(error); } else { onClose(); }
      } else if (view === "sign-up") {
        if (password !== confirm) { setError("Passwords do not match"); setLoading(false); return; }
        const { error } = await signUpWithEmail(email, password);
        if (error) { setError(error); } else { setSuccess("Check your email to confirm your account."); }
      } else {
        const { error } = await resetPassword(email);
        if (error) { setError(error); } else { setSuccess("Reset link sent — check your inbox."); }
      }
    } finally {
      setLoading(false);
    }
  }, [view, email, password, confirm, signInWithEmail, signUpWithEmail, resetPassword, onClose, isConfigured]);

  const handleGoogle = useCallback(async () => {
    if (!isConfigured) { setError("Authentication not configured."); return; }
    setLoading(true);
    const { error } = await signInWithGoogle();
    if (error) { setError(error); setLoading(false); }
  }, [signInWithGoogle, isConfigured]);

  const titles = {
    "sign-in": "Welcome Back",
    "sign-up": "Join LUMINA",
    "forgot-password": "Reset Password",
  };

  const labels = {
    "sign-in": "// SECURE ACCESS",
    "sign-up": "// INITIALIZE ACCOUNT",
    "forgot-password": "// RECOVERY PROTOCOL",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[90] bg-lumina-void/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[91] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="relative w-full max-w-md pointer-events-auto"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }}
            >
              <div className={cn(
                "relative p-8 rounded-2xl overflow-hidden",
                "bg-lumina-deep/90 border border-white/[0.08] backdrop-blur-2xl",
                "shadow-[0_32px_64px_rgba(0,0,0,0.7)]"
              )}>
                {/* Corner marks */}
                <CornerMark pos="tl" /><CornerMark pos="tr" />
                <CornerMark pos="bl" /><CornerMark pos="br" />

                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lumina-star/40 to-transparent" />

                {/* Close */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-white/30 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                >
                  <X size={14} />
                </button>

                {/* Header */}
                <div className="mb-6">
                  <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-lumina-star/40 mb-2">{labels[view]}</p>
                  <h2 className="font-display text-2xl font-bold text-white">{titles[view]}</h2>
                </div>

                <div className="h-px bg-white/[0.06] mb-6" />

                {/* Error / Success */}
                {error && (
                  <div className="mb-4 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/[0.08] border border-red-500/20 text-red-400 text-sm">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="mb-4 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-400 text-sm">
                    <CheckCircle size={14} className="mt-0.5 shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                {/* Form */}
                <div className="space-y-4">
                  <Field label="Email Address" type="email" value={email} onChange={setEmail}
                    placeholder="you@lumina.space" autoComplete="email"
                    icon={<Mail size={13} />} disabled={loading} />

                  {view !== "forgot-password" && (
                    <Field label="Password" type="password" value={password} onChange={setPassword}
                      placeholder="••••••••••••" autoComplete={view === "sign-in" ? "current-password" : "new-password"}
                      icon={<Lock size={13} />} disabled={loading} />
                  )}

                  {view === "sign-up" && (
                    <Field label="Confirm Password" type="password" value={confirm} onChange={setConfirm}
                      placeholder="••••••••••••" autoComplete="new-password"
                      icon={<Lock size={13} />} disabled={loading} />
                  )}

                  {view === "sign-in" && (
                    <div className="text-right">
                      <button onClick={() => setView("forgot-password")}
                        className="font-mono text-[10px] text-lumina-star/40 hover:text-lumina-star transition-colors">
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={cn(
                      "w-full py-3.5 rounded-xl mt-2",
                      "font-mono text-[11px] uppercase tracking-[0.2em] font-semibold",
                      "text-lumina-void bg-lumina-star",
                      "hover:bg-lumina-star-bright transition-all duration-300",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      "shadow-[0_0_20px_rgba(168,200,255,0.2)]"
                    )}
                  >
                    {loading ? "Processing..." : view === "sign-in" ? "Access LUMINA" : view === "sign-up" ? "Create Account" : "Send Reset Link"}
                  </button>

                  {/* Divider */}
                  {view !== "forgot-password" && (
                    <>
                      <div className="relative flex items-center gap-3 py-1">
                        <div className="flex-1 h-px bg-white/[0.06]" />
                        <span className="font-mono text-[9px] text-white/20 uppercase tracking-[0.15em]">or</span>
                        <div className="flex-1 h-px bg-white/[0.06]" />
                      </div>

                      <button
                        onClick={handleGoogle}
                        disabled={loading}
                        className={cn(
                          "w-full py-3.5 rounded-xl flex items-center justify-center gap-2.5",
                          "font-mono text-[11px] uppercase tracking-[0.15em]",
                          "bg-white/[0.04] border border-white/[0.08] text-white/60",
                          "hover:bg-white/[0.08] hover:text-white hover:border-white/[0.15]",
                          "transition-all duration-300",
                          "disabled:opacity-50"
                        )}
                      >
                        <Chrome size={13} />
                        Continue with Google
                      </button>
                    </>
                  )}

                  {/* Toggle */}
                  <p className="text-center font-mono text-[10px] text-white/30 pt-1">
                    {view === "sign-in" ? (
                      <>No account?{" "}
                        <button onClick={() => setView("sign-up")} className="text-lumina-star/70 hover:text-lumina-star transition-colors">Create one</button>
                      </>
                    ) : view === "sign-up" ? (
                      <>Have an account?{" "}
                        <button onClick={() => setView("sign-in")} className="text-lumina-star/70 hover:text-lumina-star transition-colors">Sign in</button>
                      </>
                    ) : (
                      <button onClick={() => setView("sign-in")} className="text-lumina-star/70 hover:text-lumina-star transition-colors">Back to sign in</button>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
