"use client";
import { createContext, useContext, useState } from "react";
import { AuthUser } from "@/types/auth";

interface AuthContextType {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const saved = localStorage.getItem("mst-auth");

    return saved ? JSON.parse(saved) : null;
  });

  const login = (authUser: AuthUser) => {
    localStorage.setItem("mst-auth", JSON.stringify(authUser));

    setUser(authUser);
  };

  const logout = () => {
    localStorage.removeItem("mst-auth");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("AuthProvider missing");
  }

  return ctx;
}
