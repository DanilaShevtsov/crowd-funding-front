import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Routes } from "../enums/routes.enum";
import { AuthJWT } from "../interfaces/auth";
import { User } from "../interfaces/user";

export function auth() {
  const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  async function getWelcomeToken(address: string): Promise<any> {
    console.log('get welcome token');
    const config: AxiosRequestConfig = {
      method: 'get',
      url: Routes.WELCOME_PRASE,
      params: {
        pubKey: address,
      }
    }
    try {
      const welcomeToken = await axiosInstance.request(config);
      return welcomeToken
    } catch(e: any) {
      return e.response as any
    }
    
  }

  async function login(token: string, address: string, signature: string): Promise<AuthJWT> {
    const config: AxiosRequestConfig = {
      method: 'post',
      url: Routes.LOGIN,
      data: {
        phrase: token,
        pubKey: address,
        signature: signature,
      }
    }

    const jwt = await axiosInstance.request(config);
    return jwt.data;
  }

  async function verifyLogin(jwt: AuthJWT): Promise<boolean> {
    const config: AxiosRequestConfig = {
      method: 'get',
      url: Routes.CHECK_JWT,
      headers: {
        Authorization: `Bearer ${jwt.token}`,
      }
    }

    const response = await axiosInstance.request(config);
    return response.data;
  }

  async function getUserInfo(jwt: AuthJWT): Promise<User> {
    const config: AxiosRequestConfig = {
      method: 'get',
      url: Routes.USER_INFO,
      headers: {
        Authorization: `Bearer ${jwt.token}`,
      }
    }

    const response = await axiosInstance.request(config);
    return response.data;
  }

  return { getWelcomeToken, login, verifyLogin, getUserInfo };
}