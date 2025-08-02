// src/hooks/useCustomers.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import CustomerService from "@/services/CustomerService";
import type { Customer } from "@/types/Customer";

export function useCustomers() {
  const { user } = useAuth();

  return useQuery<Customer[], Error>({
    queryKey: ["customers"],
    enabled: !!user,
    queryFn: async () => {
      const res = await CustomerService.list(user!.token);
      return res.data;
    },
  });
}
