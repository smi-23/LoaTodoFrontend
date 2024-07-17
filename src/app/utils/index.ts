import axios from "axios";
import { getSession, signIn, signOut } from "next-auth/react";
import jwt from "jsonwebtoken";

const SPRING_URL =
  process.env.NODE_ENV === "production" ? "배포 url" : "http://localhost:8080";

export const backend_api = () => {
  const defaultOptions = {
    baseURL: SPRING_URL,
  };

  const instance = axios.create(defaultOptions);

  instance.interceptors.request.use(async (request) => {
    const session = await getSession();
    if (session) {
      request.headers.Authorization = session?.user?.Authorization;
      request.headers.RefreshToken = session?.user?.RefreshToken;
    }
    return request;
  });

  instance.interceptors.response.use(
    (response) => {
      console.log(response.data, response.status);
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (error.response.status === 401) {
        const session = await getSession();

        if (session) {
          const token = session.user?.Authorization?.replace("Bearer ", "");

          if (token) {
            const decodedToken = jwt.decode(token);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp < currentTime) {
              try {
                const response = await axios.post(
                  `${SPRING_URL}/api/user/refresh-tokens`,
                  {},
                  {
                    headers: {
                      RefreshToken: session.user?.RefreshToken,
                      Authorization: session.user?.Authorization,
                    },
                  },
                );
                // 새로 발급받은 토큰 정보 업데이트
                const newAccessToken = response.headers["authorization"];
                const newRefreshToken = response.headers["refreshtoken"];
                console.log("바뀌기 전 세션 전체", session.user);
                console.log("바뀌기 전", session.user.Authorization);
                console.log("바뀌기 전", session.user.RefreshToken);

                // session.user.Authorization = newAccessToken;
                // session.user.RefreshToken = newRefreshToken;

                sessionStorage.setItem("Authorization", newAccessToken);
                sessionStorage.setItem("RefreshToken", newRefreshToken);

                console.log("바뀐 후 세션 전체", session.user);
                console.log("바뀐거", session.user.Authorization);
                console.log("바뀐거", session.user.RefreshToken);

                originalRequest.headers.Authorization = newAccessToken;
                originalRequest.headers.RefreshToken = newRefreshToken;

                return axios(originalRequest);
              } catch (err) {
                // 새 토큰 발급에 실패한 경우
                // signOut();
                return Promise.reject(err);
              }
            } else {
              console.log("토큰의 유효기간이 남아 있는데 인증 오류인 경우");

              // 토큰의 유효 기간이 남아 있는데 인증 오류인 경우
              // signOut();
            }
          } else {
            console.log("토큰이 없는 경우", token);
            // 토큰이 없는 경우
            // signOut();
          }
        } else {
          console.log("seesion 없는 경우", session);
          // 세션이 없는 경우
          // signOut();
        }
      }
      console.log(`Error log`, error.response.data, error.response.status);
      return Promise.reject(error);
    },
  );

  return instance;
};
