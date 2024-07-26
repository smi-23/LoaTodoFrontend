"use client";

import Header from "../components/Header";
import React, { useState } from "react";
import InputBox from "../components/InputBox";
import { signIn } from "next-auth/react";
import Link from "next/link";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [error, setError] = useState("");

  // 메시지 리셋
  // function messageReset() {
  //   setUsernameMessage("");
  //   setPasswordMessage("");
  //   setError("");
  // }

  const checkUsername = () => {
    if (username === "") {
      setUsernameMessage("유저네임을 입력해주세요.");
    } else {
      setUsernameMessage("");
    }
  };

  const checkPassword = () => {
    if (password === "") {
      setPasswordMessage("비밀번호를 입력해주세요.");
    } else {
      setPasswordMessage("");
    }
  };

  const login = async () => {
    try {
      const response = await signIn("credentials", {
        username: username,
        password: password,
        redirect: true, // 기본 리다이렉트 비활성화
        callbackUrl: "/", // 성공적인 로그인 후의 콜백 URL 지정
      });
      console.log(response);
    } catch (error) {
      console.error("로그인 요청 중 오류 발생:", error);
      setError("로그인 요청 중 오류가 발생하였습니다.");
    }
  };

  // debounce function to limit the API calls
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  return (
    <>
      <h1>Login</h1>
      <div>
        <div>
          <label>Username</label>
          <InputBox
            className={"login"}
            type={"text"}
            id={"username-input-box"}
            placeholder={"유저네임을 입력해주세요"}
            value={username}
            setValue={setUsername}
            onBlur={debounce(checkUsername, 500)}
            message={usernameMessage}
          />
        </div>
        <div>
          <label>Password</label>
          <InputBox
            className={"login"}
            type={"password"}
            id={"password-input-box"}
            placeholder={"비밀번호를 입력해주세요"}
            value={password}
            setValue={setPassword}
            onBlur={debounce(checkPassword, 500)}
            message={passwordMessage}
          />
        </div>
        <button type="button" className="signup--btn" onClick={login}>
          로그인
        </button>
        <div>
          <Link
            href={"/signup"}
            style={{ textDecoration: "none", color: "#5A6A85", marginTop: 25 }}
          >
            아직 회원이 아니신가요? <strong>회원가입</strong>
          </Link>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </>
  );
};

export default LoginPage;
