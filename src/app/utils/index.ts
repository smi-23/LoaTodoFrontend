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
    async (config) => {
      const session = await getSession();
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

export const lostark_api = () => {
  const defaultOptions = {
    baseURL: "https://developer-lostark.game.onstove.com",
    headers: {
      Authorization: `bearer ${process.env.NEXT_PUBLIC_LOSTARK_CLIENT_KEY}`,
      "Content-Type": "application/json",
    },
  };

  const instance = axios.create(defaultOptions);

  instance.interceptors.response.use(
    (response) => {
      // 응답 데이터를 콘솔에 출력합니다.
      console.log(response.data, response.status);
      return response;
    },
    (error) => {
      // 오류 로그를 콘솔에 출력합니다.
      console.log(`Error log`, error.response.data, error.response?.status);
      return Promise.reject(error);
    },
  );

  return instance;
};
