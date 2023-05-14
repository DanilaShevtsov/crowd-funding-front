import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Routes } from "../enums/routes.enum";
import { UsersDto } from "../interfaces/usersDto";

export function accounts() {
  const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  async function getAllUsers(token: string): Promise<UsersDto> {
    const config: AxiosRequestConfig = {
      method: 'post',
      url: Routes.ALL_ACCOUNTS,
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
    
    const response = await axiosInstance.request(config);
    return response.data;
  }

  async function banUser(token: string, userId: string) {
    const config: AxiosRequestConfig = {
      method: 'patch',
      url: Routes.ALL_ACCOUNTS + `/ban/${userId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
    
    const response = await axiosInstance.request(config);
    return response;
  }

  async function unbanUser(token: string, userId: string) {
    const config: AxiosRequestConfig = {
      method: 'patch',
      url: Routes.ALL_ACCOUNTS + `/unban/${userId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
    
    const response = await axiosInstance.request(config);
    return response;
  }

  return { getAllUsers, banUser, unbanUser }
}