"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface AdminContextValue {
  isAdmin: boolean;
  setAdmin: (value: boolean) => void;
}

const AdminContext = createContext<AdminContextValue>({
  isAdmin: false,
  setAdmin: () => {},
});

export const ADMIN_SECRET = "jhered";

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setAdmin] = useState(false);
  return (
    <AdminContext.Provider value={{ isAdmin, setAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
