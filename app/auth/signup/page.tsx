"use client";
import { useRouter } from "next/navigation";
import { AuthModal } from "@/components/auth";
import { ROUTES } from "@/lib/constants";

export default function SignupPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-lumina-void flex items-center justify-center">
      <AuthModal isOpen defaultView="sign-up" onClose={() => router.push(ROUTES.HOME)} />
    </div>
  );
}
