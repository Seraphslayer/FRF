import { createContext, useContext, useEffect, useState } from "react";
import apiFetch from "../services/api.js";

const AuthContext = createContext(null);
const STORAGE_KEY = "frp_session";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else localStorage.removeItem(STORAGE_KEY);
  }, [session]);

  const login = async (email, password) => {
    const data = await apiFetch("/auth/login", { method: "POST", body: { email, password } });
    const next = { ...data.user, token: data.token };
    setSession(next);
    return next;
  };

  // Public self-registration only ever creates a Requestor account — the
  // other three account levels are provisioned directly in the database
  // (or by a Super User, once that admin flow exists).
  const register = async ({ name, email, password, department }) => {
    const data = await apiFetch("/auth/register", {
      method: "POST",
      body: { name, email, password, department, role: "requestor" },
    });
    const next = { ...data.user, token: data.token };
    setSession(next);
    return next;
  };

  const logout = () => setSession(null);

  return (
    <AuthContext.Provider value={{ session, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
