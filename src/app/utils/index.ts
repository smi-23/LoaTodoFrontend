import axios from "axios";
import { getSession } from "next-auth/react";

const BACKEND_SPRING_URL =
  process.env.NODE_ENV === "production" ? "배포 url" : "http://localhost:8080";

export const backend_api = () => {
  const defaultOptions = {
    baseURL: BACKEND_SPRING_URL,
  };

  const instance = axios.create(defaultOptions);

  instance.interceptors.request.use(
    (config) => {
      const session = getSession();
      if (session) {
        config.headers.Authorization = session?.user?.Authorization;
        config.headers.RefreshToken = session?.user?.RefreshToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    (response) => {
      console.log(response.data, response.status);
      return response;
    },
    (error) => {
      console.log(`Error log`, error.response.data, error.response.status);
      return Promise.reject(error);
    },
  );

  return instance;
};
