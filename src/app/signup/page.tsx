"use client";

import Header from "../components/Header";
import React, { useState } from "react";
import InputBox from "../components/InputBox";
import { backend_api } from "@/app/utils";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const [usernameMessage, setUsernameMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordCheckMessage, setPasswordCheckMessage] = useState("");
  const [nameMessage, setNameMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  const [isUsernameChecked, setIsUsernameChecked] = useState(false);

  const [error, setError] = useState("");

  // 메시지 리셋
  function messageReset() {
    setUsernameMessage("");
    setPasswordMessage("");
    setPasswordCheckMessage("");
    setNameMessage("");
    setEmailMessage("");
    setError("");
  }

  const checkUsername = async () => {
    if (username === "") {
      setUsernameMessage("유저네임을 입력해주세요.");
      setIsUsernameChecked(false);
      return;
    }
    try {
      const response = await backend_api().post("api/user/check-username", {
        username,
      });
      if (response.status === 200) {
        setUsernameMessage("");
        setIsUsernameChecked(true);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          setUsernameMessage("이미 사용 중인 유저네임입니다.");
        } else {
          setUsernameMessage("유저네임 확인 중 오류가 발생했습니다.");
        }
        setIsUsernameChecked(false);
      }
    }
  };

  const checkPassword = () => {
    if (password === "") {
      setPasswordMessage("비밀번호를 입력해주세요.");
    } else {
      setPasswordMessage("");
    }
  };

  const checkPasswordCheck = () => {
    if (passwordCheck === "") {
      setPasswordCheckMessage("비밀번호 확인을 입력해주세요.");
    } else {
      setPasswordCheckMessage("");
    }
  };

  const checkName = () => {
    if (name === "") {
      setNameMessage("이름을 입력해주세요.");
    } else {
      setNameMessage("");
    }
  };

  const checkEmail = () => {
    if (email === "") {
      setEmailMessage("이메일을 입력해주세요.");
    } else {
      setEmailMessage("");
    }
  };

  // 회원가입버튼을 계속 눌렀을 때 더이상 checkUsername메소드가 실행되지 않아 에러 메시지가 출력되지 않고 검사도 하지 않음
  const signup = async () => {
    messageReset();
    checkPassword();
    checkPasswordCheck();
    checkEmail();
    checkName();
    if (!username) {
      setUsernameMessage("유저네임을 입력해주세요.");
    }
    if (!isUsernameChecked) {
      setError("중복검사를 완료해주세요.");
      return;
    }

    if (password !== passwordCheck) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      const response = await backend_api().post("api/user/signup", {
        username,
        password,
        passwordCheck,
        email,
        name,
      });
      if (response) {
        alert("회원가입이 완료되었습니다.");
      }
      // 성공 시 리다이렉트 또는 성공 메시지 처리
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          setUsernameMessage("이미 사용 중인 유저네임입니다.");
        } else {
          setError("회원가입 중 오류가 발생했습니다.");
        }
      } else {
        setError("서버와의 통신 중 오류가 발생했습니다.");
      }
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
      <Header />
      <h1>Signup</h1>
      <div>
        <div>
          <label>Username</label>
          <InputBox
            className={"signup"}
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
            className={"signup"}
            type={"password"}
            id={"password-input-box"}
            placeholder={"비밀번호를 입력해주세요"}
            value={password}
            setValue={setPassword}
            onBlur={debounce(checkPassword, 500)}
            message={passwordMessage}
          />
        </div>
        <div>
          <label>Confirm Password</label>
          <InputBox
            className={"signup"}
            type={"password"}
            id={"password-check-input-box"}
            placeholder={"비밀번호를 다시 입력해주세요"}
            value={passwordCheck}
            setValue={setPasswordCheck}
            onBlur={debounce(checkPasswordCheck, 500)}
            message={passwordCheckMessage}
          />
        </div>
        <div>
          <label>Name</label>
          <InputBox
            className={"signup"}
            type={"text"}
            id={"name-input-box"}
            placeholder={"이름을 입력해주세요"}
            value={name}
            setValue={setName}
            onBlur={debounce(checkName, 500)}
            message={nameMessage}
          />
        </div>
        <div>
          <label>Email</label>
          <InputBox
            className={"signup"}
            type={"email"}
            id={"email-input-box"}
            placeholder={"이메일을 입력해주세요"}
            value={email}
            setValue={setEmail}
            onBlur={debounce(checkEmail, 500)}
            // onKeyUp={signup}
            message={emailMessage}
          />
        </div>
        <button type="button" className="signup--btn" onClick={signup}>
          회원가입
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </>
  );
};

export default SignupPage;
