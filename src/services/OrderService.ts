// src/services/OrderService.ts
import axios from "axios";
import type { ApiResponse } from "@/types/ApiResponse";
import type { Order } from "@/types/Orders";
import { API_URL } from "./constants";

export default class OrderService {
  /**
   * Fetch all orders for a given customer.
   */
  static async list(
    customerId: string,
    token: string
  ): Promise<ApiResponse<Order[]>> {
    try {
      const res = await axios.get<ApiResponse<Order[]>>(
        `${API_URL}/customers/${customerId}/orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        throw new Error(`Fetch orders failed: ${err.response.data.message}`);
      }
      throw new Error("Fetch orders failed: unable to reach server");
    }
  }

  /**
   * Get a single order by ID for a given customer.
   */
  static async get(
    customerId: string,
    orderId: string,
    token: string
  ): Promise<ApiResponse<Order>> {
    try {
      const res = await axios.get<ApiResponse<Order>>(
        `${API_URL}/customers/${customerId}/orders/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        throw new Error(`Get order failed: ${err.response.data.message}`);
      }
      throw new Error("Get order failed: unable to reach server");
    }
  }

  /**
   * Create a new order for a given customer.
   */
  static async create(
    customerId: string,
    data: Omit<Order, "id" | "createdAt" | "updatedAt">,
    token: string
  ): Promise<ApiResponse<Order>> {
    try {
      const res = await axios.post<ApiResponse<Order>>(
        `${API_URL}/customers/${customerId}/orders`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        throw new Error(`Create order failed: ${err.response.data.message}`);
      }
      throw new Error("Create order failed: unable to reach server");
    }
  }

  /**
   * Update an existing order for a given customer.
   */
  static async update(
    customerId: string,
    orderId: string,
    data: Partial<Omit<Order, "id" | "customerId" | "createdAt" | "updatedAt">>,
    token: string
  ): Promise<ApiResponse<Order>> {
    try {
      const res = await axios.put<ApiResponse<Order>>(
        `${API_URL}/customers/${customerId}/orders/${orderId}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        throw new Error(`Update order failed: ${err.response.data.message}`);
      }
      throw new Error("Update order failed: unable to reach server");
    }
  }

  /**
   * Delete an order for a given customer.
   */
  static async delete(
    customerId: string,
    orderId: string,
    token: string
  ): Promise<ApiResponse<null>> {
    try {
      const res = await axios.delete<ApiResponse<null>>(
        `${API_URL}/customers/${customerId}/orders/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        throw new Error(`Delete order failed: ${err.response.data.message}`);
      }
      throw new Error("Delete order failed: unable to reach server");
    }
  }
}
