import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { NextAuthOptions } from "next-auth";
import { backend_api } from "@/app/utils";
import jwt from "jsonwebtoken";
import { signOut } from "next-auth/react";
import axios from "axios";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const response = await backend_api().post("/api/user/login", {
            username: credentials.username,
            password: credentials.password,
          });
          const user = response.data;
          if (user) {
            user.Authorization = response.headers.authorization;
            user.RefreshToken = response.headers.refreshtoken;
            return user;
          } else {
            console.error("로그인 중 오류 발생:");
            return null;
          }
        } catch (error) {
          console.error("로그인 중 오류 발생:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.Authorization = user.Authorization;
        token.RefreshToken = user.RefreshToken;
        console.log("토큰 콜백 =", token);
      }

      // 토큰 만료 확인
      const accessToken = token.Authorization?.replace("Bearer ", "");
      const decodedToken = jwt.decode(accessToken);
      if (decodedToken && decodedToken.exp <= Date.now() / 1000) {
        try {
          const response = await axios.post(
            "http://localhost:8080/api/user/refresh-tokens",
            {},
            {
              headers: {
                Authorization: token.Authorization,
                RefreshToken: token.RefreshToken,
              },
            },
          );
          console.log("refresh_tokens response =", response.data);
          const newAccessToken = response.headers["authorization"];
          const newRefreshToken = response.headers["refreshtoken"];

          token.Authorization = newAccessToken;
          token.RefreshToken = newRefreshToken;
          return token;
        } catch (error) {
          console.error("토큰 갱신 실패:", error);
          await signOut();
          // 토큰 갱신 실패 시, 유효하지 않은 토큰을 반환하지 않도록 처리
          return {
            ...token,
            Authorization: null,
            RefreshToken: null,
          };
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session) {
        // session.user = session.user || {}; // session.user가 undefined인 경우 빈 객체로 초기화
        session.user.Authorization = token.Authorization;
        session.user.RefreshToken = token.RefreshToken;
        console.log("세션 콜백 =", session);
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
