/** @format */

// src/contexts/AuthClientContext.tsx
"use client"; // This context and its provider MUST be a client component

import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AuthClientContextType {
  isAuthenticated: boolean;
  clientLogin: () => void; // For client-side state updates, not HTTP-only cookies
  clientLogout: () => void; // For client-side state updates, not HTTP-only cookies
  // You could also store user profile data fetched client-side here
  // userProfile: { name: string; email: string } | null;
}

const AuthClientContext = createContext<AuthClientContextType | undefined>(undefined);

export function AuthClientProvider({
  children,
  initialAuthStatus,
}: {
  children: ReactNode;
  initialAuthStatus: boolean;
}) {
  // Use the initialAuthStatus from server-side rendering for the initial state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAuthStatus);
  const router = useRouter();

  // 서버는 쿠키가 있는지만 보고 로그인 헤더를 그린다. 쿠키 속 토큰이 이미 만료됐을 수 있어
  // 첫 진입 때 한 번 확인하고, 401이면(프록시가 쿠키도 지움) 비로그인으로 되돌린다.
  // 네트워크 오류·5xx는 토큰 문제로 단정할 수 없어 그대로 둔다.
  useEffect(() => {
    if (!initialAuthStatus) return;
    let cancelled = false;
    fetch("/api/members/me", { credentials: "include" })
      .then((res) => {
        if (cancelled || res.status !== 401) return;
        setIsAuthenticated(false);
        router.refresh();
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clientLogin = () => {
    // This would be for updating client-side state, NOT for setting HTTP-only cookies.
    // For actual login that sets HTTP-only cookies, you'd still use your /api/auth/login endpoint.
    setIsAuthenticated(true);
  };

  const clientLogout = () => {
    // This would be for updating client-side state after a server-side logout.
    // The actual clearing of HTTP-only cookies happens via your /api/auth/logout.
    setIsAuthenticated(false);
  };

  return (
    <AuthClientContext.Provider value={{ isAuthenticated, clientLogin, clientLogout }}>
      {children}
    </AuthClientContext.Provider>
  );
}

export function useAuthClient() {
  const context = useContext(AuthClientContext);
  if (context === undefined) {
    throw new Error("useAuthClient must be used within an AuthClientProvider");
  }
  return context;
}
