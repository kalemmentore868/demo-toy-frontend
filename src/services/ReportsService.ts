// src/services/ReportsService.ts
import axios from "axios";
import { API_URL } from "./constants";

export default class ReportsService {
  /**
   * Download the PDF report for a given customer.
   * @param customerId  the UUID of the customer
   * @param token       Bearer token for authorization
   * @returns           a Blob containing the PDF bytes
   * @throws            Error with server message or network failure
   */
  static async downloadCustomerReport(
    customerId: string,
    token: string
  ): Promise<Blob> {
    try {
      const response = await axios.get<Blob>(
        `${API_URL}/reports/customer/${customerId}/pdf`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const serverMsg =
          err.response?.data instanceof Blob
            ? // sometimes error bodies are non-JSON; try to read text
              await err.response.data.text().catch(() => "")
            : err.response?.data?.message;
        throw new Error(`Report download failed: ${serverMsg || err.message}`);
      }
      throw new Error("Report download failed: unable to reach server");
    }
  }
}
