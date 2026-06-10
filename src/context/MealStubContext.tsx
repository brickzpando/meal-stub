"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Employee } from "@/types/employee";
import { Transaction } from "@/types/transaction";
import { Pins } from "@/types/pins";
import { storage } from "@/lib/storage";
import { DEFAULT_PINS } from "@/lib/constants";

interface ContextType {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;

  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;

  pins: Pins;
  setPins: React.Dispatch<React.SetStateAction<Pins>>;
}

const MealStubContext = createContext<ContextType | undefined>(undefined);

export function MealStubProvider({ children }: { children: React.ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    if (typeof window === "undefined") return [];

    return storage.get<Employee[]>("mst-emp") || [];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window === "undefined") return [];

    return storage.get<Transaction[]>("mst-tx") || [];
  });

  const [pins, setPins] = useState<Pins>(() => {
    if (typeof window === "undefined") return DEFAULT_PINS;

    return storage.get<Pins>("mst-pins") || DEFAULT_PINS;
  });

  useEffect(() => {
    storage.set("mst-emp", employees);
  }, [employees]);

  useEffect(() => {
    storage.set("mst-tx", transactions);
  }, [transactions]);

  useEffect(() => {
    storage.set("mst-pins", pins);
  }, [pins]);

  return (
    <MealStubContext.Provider
      value={{
        employees,
        setEmployees,
        transactions,
        setTransactions,
        pins,
        setPins,
      }}
    >
      {children}
    </MealStubContext.Provider>
  );
}

export function useMealStub() {
  const context = useContext(MealStubContext);

  if (!context) {
    throw new Error("useMealStub must be used inside MealStubProvider");
  }

  return context;
}
