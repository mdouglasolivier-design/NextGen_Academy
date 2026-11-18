"use client";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@/types";
import * as api from "./api";
import { clearTokens, getAccess } from "./storage";

type Status = "loading" | "authed" | "anon";

interface AuthValue {
  user: User | null;
  status: Status;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!getAccess()) {
      setStatus("anon");
      return;
    }
    api
      .fetchMe()
      .then((u) => {
        setUser(u);
        setStatus("authed");
      })
      .catch(() => {
        clearTokens();
        setStatus("anon");
      });
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    await api.login(email, password);
    const me = await api.fetchMe();
    setUser(me);
    setStatus("authed");
  }, []);

  const signOut = useCallback(() => {
    clearTokens();
    setUser(null);
    setStatus("anon");
  }, []);

  const value = useMemo(() => ({ user, status, signIn, signOut }), [user, status, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Redirects signed-out visitors to the login page and remembers where they were going. */
export function useRequireAuth() {
  const auth = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (auth.status === "anon") {
      router.replace(`/login?next=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [auth.status, router]);
  return auth;
}