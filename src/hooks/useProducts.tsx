// src/hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import ProductService from "@/services/ProductService";
import type { Product } from "@/types/Products";

export function useProducts() {
  const { user } = useAuth();

  return useQuery<Product[], Error>({
    queryKey: ["products"],
    enabled: !!user,
    queryFn: async () => {
      const res = await ProductService.list(user!.token);
      return res.data;
    },
  });
}
