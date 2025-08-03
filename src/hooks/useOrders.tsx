import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import OrderService from "@/services/OrderService";
import type { Order } from "@/types/Orders";

export function useOrders() {
  const { user } = useAuth();

  return useQuery<Order[], Error>({
    queryKey: ["orders"],
    enabled: !!user,
    queryFn: async () => {
      const res = await OrderService.getAllOrders(user!.token);
      return res.data;
    },
  });
}
