import axios from "axios";
import { getSession } from "next-auth/react";

const SPRING_URL =
  process.env.NODE_ENV === "production" ? "배포 url" : "http://localhost:8080";

export const backend_api = () => {
  const defaultOptions = {
    baseURL: SPRING_URL,
  };
  const instance = axios.create(defaultOptions);

  instance.interceptors.request.use(async (request) => {
    // const session = await getSession();
    // if (session) {
    //   // @ts-ignore
    //   request.headers.Authorization = session?.user?.data;
    // }
    return request;
  });

  instance.interceptors.response.use(
    (response) => {
      console.log(response.data, response.status);
      return response;
    },
    (error) => {
      console.log(`error log`, error.response.data, error.response.status);
      return Promise.reject(error);
    },
  );

  return instance;
};
