/** @format */

// src/app/providers.tsx (A client component to wrap your context providers)
"use client";

import { ReactNode } from "react";
import { AuthClientProvider } from "@/contexts/AuthContext"; // Import your client-side context

interface ProvidersProps {
  children: ReactNode;
  isLogin: boolean; // Receive initial login status from Server Component
}

export function Providers({ children, isLogin }: ProvidersProps) {
  return <AuthClientProvider initialAuthStatus={isLogin}>{children}</AuthClientProvider>;
}
