import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { NextAuthOptions } from "next-auth";
import { backend_api } from "@/app/utils";

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
            console.error("Error during login:");
            return null;
          }
        } catch (error) {
          console.error("Error during login:", error);
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
      }
      return token;
    },

    async session({ session, token }) {
      // 세션에 저장할 필드 선택
      session.user.Authorization = token.Authorization;
      session.user.RefreshToken = token.RefreshToken;
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
