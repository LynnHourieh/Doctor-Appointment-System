import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { AdminContextType, BaseUser } from "../models/user.types";

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const baseUrl = import.meta.env.VITE_BASE_URL;

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pendingUsers, setPendingUsers] = useState<BaseUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  const fetchPendingUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/admin/users/pending`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch pending users");
      }

      const data = await response.json();
      setPendingUsers(data);
   
    } catch (err: any) {
      setError(err.message || "Error occurred");
    } finally {
      setLoading(false);
    };}

  return (
    <AdminContext.Provider value={{ pendingUsers, loading, error, fetchPendingUsers,setLoading,setPendingUsers }}>
      {children}
    </AdminContext.Provider>
  );
};


export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
