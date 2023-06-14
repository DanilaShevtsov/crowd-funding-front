import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Routes } from "../enums/routes.enum";
import { Companies } from "../interfaces/companies";

export class ComplaintStoreDto {
    companyId: string;
    complaint: string;
    constructor(companyId: string, complaint: string) {
        this.companyId = companyId;
        this.complaint = complaint;
    }
}

export function complaintsLib() {
  const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  async function getAllComplaints(token: string) {
    const config: AxiosRequestConfig = {
      method: 'get',
      url: Routes.COMPLAINT,
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }

    const response = await axiosInstance.request(config);
    return response.data;
  }

  async function storeComplaint(token: string, dto: ComplaintStoreDto) {
    const config: AxiosRequestConfig = {
      method: 'put',
      url: Routes.COMPLAINT,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: dto
    }

    const response = await axiosInstance.request(config);
    return response.data;
  }

  async function removeComplaint(token: string, id: string) {
    const config: AxiosRequestConfig = {
      method: 'delete',
      url: Routes.COMPLAINT,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        id: id
      }
    }

    const response = await axiosInstance.request(config);
    return response.data;
  }
  
  return { getAllComplaints, storeComplaint, removeComplaint }
}

