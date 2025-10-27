"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { auth } from "@/lib/api";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await auth.me();
      setUser(res.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const login    = async (email, password)       => { const r = await auth.login({ email, password }); setUser(r.user); };
  const register = async (email, password, name) => { const r = await auth.register({ email, password, name }); setUser(r.user); };
  const logout   = async () => { await auth.logout(); setUser(null); };

  return (
    <AuthCtx.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthCtx.Provider>
  );
}