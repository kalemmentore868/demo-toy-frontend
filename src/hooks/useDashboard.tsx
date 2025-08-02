import { useQuery } from "@tanstack/react-query";
import AnalyticsService from "@/services/AnalyticsService";

import { useAuth } from "@/context/AuthContext";
import type { DashboardData } from "@/types/Analytics";

export function useDashboard() {
  const { user } = useAuth();

  return useQuery<DashboardData, Error>({
    queryKey: ["dashboard"],
    enabled: !!user,
    queryFn: async () => {
      // fetchDashboard returns ApiResponse<DashboardData>
      const res = await AnalyticsService.fetchDashboard(user!.token);
      console.log("Fetched dashboard data:", res.data);
      return res.data;
    },
  });
}
