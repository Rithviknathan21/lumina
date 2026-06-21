"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

export default function ResetPage() {
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setError(error.message); } else { setDone(true); setTimeout(() => router.push(ROUTES.HOME), 2000); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-lumina-void flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl font-bold text-white mb-6">Set New Password</h1>
        {done ? (
          <p className="text-emerald-400 font-mono text-sm">Password updated! Redirecting...</p>
        ) : (
          <div className="space-y-4">
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="New password" className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-lumina-star/40 transition-all" />
            <button onClick={handleSubmit} disabled={loading}
              className={cn("w-full py-3.5 rounded-xl font-mono text-[11px] uppercase tracking-[0.2em] text-lumina-void bg-lumina-star disabled:opacity-50")}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
