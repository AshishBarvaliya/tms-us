"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import {
  type MockRole,
  getStoredMockRole,
  setStoredMockRole,
} from "@/lib/mock-auth";

type MockAuthContextValue = {
  role: MockRole;
  setRole: (role: MockRole) => void;
  isAdmin: boolean;
};

const MockAuthContext = createContext<MockAuthContextValue | null>(null);

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<MockRole>("employee");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setRoleState(getStoredMockRole());
    setMounted(true);
  }, []);

  const setRole = useCallback((newRole: MockRole) => {
    setStoredMockRole(newRole);
    setRoleState(newRole);
  }, []);

  const value = useMemo<MockAuthContextValue>(
    () => ({
      role,
      setRole,
      isAdmin: role === "admin",
    }),
    [role, setRole]
  );

  if (!mounted) {
    return (
      <MockAuthContext.Provider value={{ role: "employee", setRole, isAdmin: false }}>
        {children}
      </MockAuthContext.Provider>
    );
  }

  return (
    <MockAuthContext.Provider value={value}>{children}</MockAuthContext.Provider>
  );
}

export function useMockAuth(): MockAuthContextValue {
  const ctx = useContext(MockAuthContext);
  if (!ctx) {
    throw new Error("useMockAuth must be used within MockAuthProvider");
  }
  return ctx;
}
