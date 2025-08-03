// src/services/CustomerService.ts
import axios from "axios";
import type { Customer } from "@/types/Customer";
import type { ApiResponse } from "@/types/ApiResponse";
import { API_URL } from "./constants";

export default class CustomerService {
  /**
   * Fetch all customers.
   */
  static async list(token: string): Promise<ApiResponse<Customer[]>> {
    try {
      const res = await axios.get<ApiResponse<Customer[]>>(
        `${API_URL}/customers`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.error?.message) {
        throw new Error(
          `Fetch customers failed: ${err.response.data.error?.message}`
        );
      }
      throw new Error("Fetch customers failed: unable to reach server");
    }
  }

  /**
   * Get a single customer by ID.
   */
  static async get(id: string, token: string): Promise<ApiResponse<Customer>> {
    try {
      const res = await axios.get<ApiResponse<Customer>>(
        `${API_URL}/customers/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.error?.message) {
        throw new Error(
          `Fetch customers failed: ${err.response.data.error?.message}`
        );
      }
      throw new Error("Get customer failed: unable to reach server");
    }
  }

  /**
   * Create a new customer.
   */
  static async create(
    data: Omit<Customer, "id" | "updatedAt" | "createdAt">,
    token: string
  ): Promise<ApiResponse<Customer>> {
    try {
      const res = await axios.post<ApiResponse<Customer>>(
        `${API_URL}/customers`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.error?.message) {
        throw new Error(
          `Create Customer failed: ${err.response.data.error?.message}`
        );
      }
      throw new Error("Create customer failed: unable to reach server");
    }
  }

  /**
   * Update an existing customer.
   */
  static async update(
    id: string,
    data: Partial<Omit<Customer, "id">>,
    token: string
  ): Promise<ApiResponse<Customer>> {
    try {
      const res = await axios.put<ApiResponse<Customer>>(
        `${API_URL}/customers/${id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.error?.message) {
        throw new Error(
          `Update Customer failed: ${err.response.data.error?.message}`
        );
      }
      throw new Error("Update customer failed: unable to reach server");
    }
  }

  /**
   * Delete a customer.
   */
  static async delete(id: string, token: string): Promise<ApiResponse<null>> {
    try {
      const res = await axios.delete<ApiResponse<null>>(
        `${API_URL}/customers/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.error?.message) {
        throw new Error(
          `Delete Customer failed: ${err.response.data.error?.message}`
        );
      }
      throw new Error("Delete customer failed: unable to reach server");
    }
  }
}
