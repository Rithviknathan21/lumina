"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth";
import { AuthModal } from "@/components/auth";
import { ROUTES } from "@/lib/constants";

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace(ROUTES.PROFILE);
  }, [user, router]);

  return (
    <div className="min-h-screen bg-lumina-void flex items-center justify-center">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(168,200,255,0.04) 0%, transparent 70%)" }}
      />
      <AuthModal isOpen defaultView="sign-in" onClose={() => router.push(ROUTES.HOME)} />
    </div>
  );
}
