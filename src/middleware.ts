import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 로그인한 유저가 로그인 페이지나 회원가입 페이지에 접근하려 할 때 리디렉션
  if (token) {
    if (
      request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/signup")
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    // 로그인하지 않은 유저가 보호된 페이지에 접근하려 할 때 리디렉션
    if (
      request.nextUrl.pathname.startsWith("/mypage") ||
      request.nextUrl.pathname.startsWith("/dashboard")
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 이 외의 경우, 요청을 그대로 진행
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/mypage",
    // "/about/:path*",
    // "/dashboard/:path*",
  ],
};
