// src/services/UserService.ts
import axios from "axios";
import type { User } from "@/types/User";
import type { ApiResponse } from "@/types/ApiResponse";
import { API_URL } from "./constants";

export default class UserService {
  /**
   * List all users
   */
  static async list(token: string): Promise<ApiResponse<User[]>> {
    try {
      const res = await axios.get<ApiResponse<User[]>>(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.error?.message) {
        throw new Error(
          `Fetch users failed: ${err.response.data.error.message}`
        );
      }
      throw new Error("Fetch users failed: unable to reach server");
    }
  }

  /**
   * Get a single user by ID
   */
  static async get(id: string, token: string): Promise<ApiResponse<User>> {
    try {
      const res = await axios.get<ApiResponse<User>>(`${API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.error?.message) {
        throw new Error(`Get user failed: ${err.response.data.error.message}`);
      }
      throw new Error("Get user failed: unable to reach server");
    }
  }

  /**
   * Update an existing user
   */
  static async update(
    id: string,
    data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>,
    token: string
  ): Promise<ApiResponse<User>> {
    try {
      const res = await axios.put<ApiResponse<User>>(
        `${API_URL}/users/${id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.error?.message) {
        throw new Error(
          `Update user failed: ${err.response.data.error.message}`
        );
      }
      throw new Error("Update user failed: unable to reach server");
    }
  }

  static async delete(id: string, token: string): Promise<ApiResponse<null>> {
    try {
      const res = await axios.delete<ApiResponse<null>>(
        `${API_URL}/users/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.error?.message) {
        throw new Error(
          `Delete user failed: ${err.response.data.error.message}`
        );
      }
      throw new Error("Delete user failed: unable to reach server");
    }
  }
}
