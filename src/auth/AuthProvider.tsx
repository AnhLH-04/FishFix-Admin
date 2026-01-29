import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  fullName?: string;
  email?: string;
  phone?: string;
  role: "user" | "technician" | "admin";
}

interface AuthContextType {
  token: string | null;
  me: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [me, setMe] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for token
    const savedToken = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("auth_user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setMe(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (token: string, user: User) => {
    setToken(token);
    setMe(user);
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(user));
  };

  const logout = () => {
    setToken(null);
    setMe(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  };

  const value: AuthContextType = {
    token,
    me,
    loading,
    isAdmin: me?.role === "admin",
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
