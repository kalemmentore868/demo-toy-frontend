// src/services/AnalyticsService.ts
import axios from "axios";
import type { DashboardData } from "@/types/Analytics";
import type { ApiResponse } from "@/types/ApiResponse";
import { API_URL } from "./constants";

export default class AnalyticsService {
  /**
   * Fetch all dashboard analytics data.
   * @returns ApiResponse<DashboardData> (includes totalCustomers, ordersByDay, locationData, typeDistribution)
   * @throws Error with message on failure
   */
  static async fetchDashboard(
    token: string
  ): Promise<ApiResponse<DashboardData>> {
    try {
      const response = await axios.get<ApiResponse<DashboardData>>(
        `${API_URL}/analytics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        // server sent back a message
        throw new Error(`Analytics fetch failed: ${err.response.data.message}`);
      }
      throw new Error("Analytics fetch failed: unable to reach server");
    }
  }
}
