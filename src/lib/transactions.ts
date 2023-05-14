import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Routes } from "../enums/routes.enum";

export function transactions() {
  const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  async function sendTransaction(token: string, companyId: string, txId: string) {
    const config: AxiosRequestConfig = {
      method: 'post',
      url: Routes.TRANSACTIONS,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        companyId: companyId,
        txId: txId
      }
    }

    
    const response = await axiosInstance.request(config);
    return response.data;
  }

  return { sendTransaction }
}