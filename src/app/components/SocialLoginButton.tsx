"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

const KAKAO_REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_API_KEY;
const KAKAO_REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
const KAKAO_AUTH_URI = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;

const SocialLoginButton = () => {
  return (
    <>
      <Link href={KAKAO_AUTH_URI} passHref>
        <div style={{ cursor: "pointer" }}>
          <Image src="/kakao_login_medium_narrow.png" width={200} height={50} />
        </div>
      </Link>
    </>
  );
};

export default SocialLoginButton;
