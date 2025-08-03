import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import UserService from "@/services/UserService";
import type { User } from "@/types/User";

export function useUsers() {
  const { user } = useAuth();

  return useQuery<User[], Error>({
    queryKey: ["users"],
    enabled: !!user,
    queryFn: async () => {
      const res = await UserService.list(user!.token);
      return res.data;
    },
  });
}
