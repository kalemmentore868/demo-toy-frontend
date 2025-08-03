// src/services/ProductService.ts
import axios from "axios";
import type { Product } from "@/types/Products";
import type { ApiResponse } from "@/types/ApiResponse";
import { API_URL } from "./constants";

export default class ProductService {
  /**
   * Fetch all products.
   */
  static async list(token: string): Promise<ApiResponse<Product[]>> {
    try {
      const res = await axios.get<ApiResponse<Product[]>>(
        `${API_URL}/products`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.error?.message) {
        throw new Error(
          `Fetch products failed: ${err.response?.data?.error?.message}`
        );
      }
      throw new Error("Fetch products failed: unable to reach server");
    }
  }

  /**
   * Get a single product by ID.
   */
  static async get(id: string, token: string): Promise<ApiResponse<Product>> {
    try {
      const res = await axios.get<ApiResponse<Product>>(
        `${API_URL}/products/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.error?.message) {
        throw new Error(
          `Get product failed: ${err.response?.data?.error?.message}`
        );
      }
      throw new Error("Get product failed: unable to reach server");
    }
  }

  /**
   * Create a new product.
   */
  static async create(
    data: Omit<Product, "id" | "createdAt" | "updatedAt">,
    token: string
  ): Promise<ApiResponse<Product>> {
    try {
      const res = await axios.post<ApiResponse<Product>>(
        `${API_URL}/products`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.error?.message) {
        throw new Error(
          `Create product failed: ${err.response?.data?.error?.message}`
        );
      }
      throw new Error("Create product failed: unable to reach server");
    }
  }

  /**
   * Update an existing product.
   */
  static async update(
    id: string,
    data: Partial<Omit<Product, "id">>,
    token: string
  ): Promise<ApiResponse<Product>> {
    try {
      const res = await axios.put<ApiResponse<Product>>(
        `${API_URL}/products/${id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.error?.message) {
        throw new Error(
          `Update product failed: ${err.response?.data?.error?.message}`
        );
      }
      throw new Error("Update product failed: unable to reach server");
    }
  }

  /**
   * Delete a product.
   */
  static async delete(id: string, token: string): Promise<ApiResponse<null>> {
    try {
      const res = await axios.delete<ApiResponse<null>>(
        `${API_URL}/products/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.error?.message) {
        throw new Error(
          `Delete product failed: ${err.response?.data?.error?.message}`
        );
      }
      throw new Error("Delete product failed: unable to reach server");
    }
  }
}
