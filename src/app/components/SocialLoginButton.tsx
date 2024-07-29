"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

const KAKAO_CLIENT_KEY = process.env.NEXT_PUBLIC_KAKAO_CLIENT_KEY;
const KAKAO_REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
const KAKAO_AUTH_URI = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;

const NAVER_CLIENT_KEY = process.env.NEXT_PUBLIC_NAVER_CLIENT_KEY;
const NAVER_REDIRECT_URI = process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI;
const NAVER_AUTH_URI = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_KEY}&state=STATE_STRING&redirect_uri=${NAVER_REDIRECT_URI}
`;

const GOOGLE_CLIENT_KEY = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_KEY;
const GOOGLE_REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
const GOOGLE_AUTH_URI = `https://accounts.google.com/o/oauth2/v2/auth?
response_type=code&
scope=email profile&
client_id=${GOOGLE_CLIENT_KEY}&
redirect_uri=${GOOGLE_REDIRECT_URI}`;
const SocialLoginButton = () => {
  return (
    <>
      <div>
        <Link href={KAKAO_AUTH_URI} passHref>
          <div style={{ cursor: "pointer" }}>
            <Image
              src="/kakao_login_medium_narrow.png"
              width={200}
              height={50}
            />
          </div>
        </Link>
      </div>
      <div>
        <Link href={NAVER_AUTH_URI} passHref>
          <div style={{ cursor: "pointer" }}>
            <Image src="/naver_login_btn.png" width={200} height={50} />
          </div>
        </Link>
      </div>
      <div>
        <Link href={GOOGLE_AUTH_URI} passHref>
          <div style={{ cursor: "pointer" }}>
            <Image src="/google_login_btn.png" width={200} height={50} />
          </div>
        </Link>
      </div>
    </>
  );
};

export default SocialLoginButton;
