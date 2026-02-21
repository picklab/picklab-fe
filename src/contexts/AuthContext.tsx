/** @format */

// src/contexts/AuthClientContext.tsx
"use client"; // This context and its provider MUST be a client component

import React, { createContext, useContext, useState, ReactNode } from "react";

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
