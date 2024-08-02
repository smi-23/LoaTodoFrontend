"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";

const KakaoCallback = () => {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlCode = new URL(window.location.href).searchParams.get("code");
      setCode(urlCode);
    }
  }, []);

  useEffect(() => {
    const kakaoLogin = async () => {
      if (!code) return;

      try {
        const response = await axios.get(
          `http://localhost:8080/login/kakao?code=${code}`,
        );
        if (response) {
          console.log(response.data);
          const accessToken = response.headers.authorization;
          const refreshToken = response.headers.refreshtoken;
          const username = response.data.data.username;

          // NextAuth를 통해 로그인 => 세션 생성을 위함
          const result = await signIn("social-login", {
            accessToken,
            refreshToken,
            username,
            redirect: false,
          });
          if (result?.ok) {
            router.push(`/`);
          } else {
            console.error("로그인 실패:", result?.error);
          }
        }
      } catch (error) {
        console.error("카카오 로그인 요청 중 오류 발생:", error);
      }
    };

    if (code) {
      kakaoLogin();
    }
  }, [code, router]);

  return (
    <>
      <h1>Kakao login</h1>
    </>
  );
};

export default KakaoCallback;
