import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { NextAuthOptions } from "next-auth";
import { backend_api } from "@/app/utils";
import jwt from "jsonwebtoken";
import { signOut } from "next-auth/react";
import axios from "axios";

// 기존 아이디 비밀번호 입력 로그인
const defaultLoginProvider = CredentialsProvider({
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
      console.log("response.data유저정보를 확인합니다.", user);
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
});

// 소셜 로그인
const socialLoginProvider = CredentialsProvider({
  id: "social-login",
  name: "Social-login",
  credentials: {
    accessToken: { label: "Access Token", type: "text" },
    refreshToken: { label: "Refresh Token", type: "text" },
  },
  authorize: async (credentials) => {
    // 서버에서 토큰을 검증하거나, 필요한 처리를 추가할 수 있습니다.
    const user = {
      id: "exampleUserId",
      Authorization: credentials.accessToken,
      RefreshToken: credentials.refreshToken,
      data: {
        username: credentials.username,
      },
    };
    if (user) {
      console.log("소셜로그인 유저정보를 확인해봅시다.", user);
      return user;
    } else {
      console.error("소셜 로그인 중 오류 발생:");
      return null;
    }
  },
});

const authOptions: NextAuthOptions = {
  providers: [defaultLoginProvider, socialLoginProvider],
  callbacks: {
    async jwt({ token, user, session, trigger }) {
      if (user) {
        token.username = user.data.username;
        token.Authorization = user.Authorization;
        token.RefreshToken = user.RefreshToken;
        console.log("토큰 콜백 =", token);
      }

      if (trigger === "update") {
        console.log("업데이트 토큰 콜백 =", token);
        return token;
      }

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
          console.log("토큰 재발급 응답 =", response.data);
          const newAccessToken = response.headers["authorization"];
          const newRefreshToken = response.headers["refreshtoken"];

          token.Authorization = newAccessToken;
          token.RefreshToken = newRefreshToken;
          return token;
        } catch (error) {
          console.error("토큰 갱신 실패:", error);
          await signOut();
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
        session.user.username = token.username;
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
