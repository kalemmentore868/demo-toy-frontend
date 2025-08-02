// src/services/AuthService.ts
import axios from "axios";
import type { User } from "../types/User";
import type { ApiResponse } from "@/types/ApiResponse";
import { API_URL } from "./constants";

class AuthService {
  /**
   * Login with email and password
   * @returns AuthData (includes user info and token)
   * @throws Error with message and status code on failure
   */
  static async login(
    email: string,
    password: string
  ): Promise<ApiResponse<User>> {
    try {
      const response = await axios.post<ApiResponse<User>>(
        `${API_URL}/auth/login`,
        { email, password }
      );
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        const { message } = err.response.data.error;

        throw new Error(`Login failed : ${message}`);
      }
      throw new Error("Login failed: unable to reach server");
    }
  }
}

export default AuthService;
