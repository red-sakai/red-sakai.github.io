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

export const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET;

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
