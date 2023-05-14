import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Routes } from "../enums/routes.enum";
import { Companies } from "../interfaces/companies";
import { CompanyData } from "../interfaces/companyData";

export function companiesLib() {
  const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  async function getAllCompanies(token: string): Promise<Companies> {
    const config: AxiosRequestConfig = {
      method: 'post',
      url: Routes.GET_COMPANIES,
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }

    const response = await axiosInstance.request(config);
    return response.data;
  }

  async function getPaginatedCompanies(token: string, page: number, size: number = 3): Promise<Companies> {
    const config: AxiosRequestConfig = {
      method: 'post',
      url: Routes.GET_COMPANIES + `?page=${page}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        limit: size,
        page: page,
      }
    }

    const response = await axiosInstance.request(config);
    return response.data;
  }

  async function companyById(token: string, id: string): Promise<CompanyData> {
    const config: AxiosRequestConfig = {
      method: 'get',
      url: Routes.GET_COMPANIES + `/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await axiosInstance.request(config);
    return response.data;
  }
  async function createNewCompany(token: string, dto: any): Promise<any> {
    const config: AxiosRequestConfig = {
      method: 'put',
      url: Routes.GET_COMPANIES,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: dto
    }

    const response = await axiosInstance.request(config);
    return response;
  }
  
  return { getAllCompanies, getPaginatedCompanies, createNewCompany, companyById }
}

