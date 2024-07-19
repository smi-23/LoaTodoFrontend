"use client";

import useToken from "@/app/hooks/userToken";
import React, { useEffect, useState } from "react";
import { backend_api } from "@/app/utils";
import Header from "@/app/components/Header";
import InputBox from "@/app/components/InputBox";

const MyPage = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [newName, setNewName] = useState("");
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordCheck, setNewPasswordCheck] = useState("");

  const [role, setRole] = useState("");
  const token = useToken();

  useEffect(() => {
    if (token) {
      setRole(token.role);
      setUsername(token.sub);
      setName(token.name || ""); // response.name이 없으면 빈 문자열로 설정
    }
  }, [token]);

  const updateName = async () => {
    try {
      const response = await backend_api().post("api/user/update/name", {
        name: newName,
      });
      if (response.status === 200) {
        setName(response.data.newName);
        setNewName(""); // 업데이트 후 입력창을 비워줍니다.
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateEmail = async () => {
    try {
      const response = await backend_api().post("api/user/update/email", {
        email: newEmail,
      });
      if (response.status === 200) {
        setEmail(response.data.newName);
        setNewEmail(""); // 업데이트 후 입력창을 비워줍니다.
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updatePassword = async () => {
    try {
      const response = await backend_api().post("api/user/update/password", {
        currentPassword: password,
        newPassword: newPassword,
        newPasswordCheck: newPasswordCheck,
      });
      if (response.status === 200) {
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header />
      <h1>Welcome {username}</h1>
      <h2>This page is Mypage</h2>
      <div>
        <label>Name</label>
        <label>{name}</label>

        <InputBox
          className={"updateInfo"}
          type={"text"}
          id={"name-input-box"}
          placeholder={"네임을 입력해주세요"}
          value={newName}
          setValue={setNewName}
        />
        <button type="button" className="updateName--btn" onClick={updateName}>
          updateName
        </button>
      </div>
      <div>
        <label>Email</label>
        <div>
          <label>{email}</label>
        </div>
        <InputBox
          className={"updateInfo"}
          type={"email"}
          id={"mail-input-box"}
          placeholder={"이메을 입력해주세요"}
          value={newEmail}
          setValue={setNewEmail}
        />
        <button
          type="button"
          className="updateEmail--btn"
          onClick={updateEmail}
        >
          updateEmail
        </button>
      </div>
      <div>
        <label>current password</label>
        <InputBox
          className={"updateInfo"}
          type={"password"}
          id={"password-input-box"}
          placeholder={"현재 비밀번호를 입력해주세요"}
          value={password}
          setValue={setPassword}
        />
        <label>new password</label>
        <InputBox
          className={"updateInfo"}
          type={"password"}
          id={"password-input-box"}
          placeholder={"새로운 비밀번호를 입력해주세요"}
          value={newPassword}
          setValue={setNewPassword}
        />{" "}
        <label>new password check</label>
        <InputBox
          className={"updateInfo"}
          type={"password"}
          id={"password-input-box"}
          placeholder={"새로운 비밀번호를 다시 입력해주세요"}
          value={newPasswordCheck}
          setValue={setNewPasswordCheck}
        />
        <button
          type="button"
          className="updatePassword--btn"
          onClick={updatePassword}
        >
          updatePassword
        </button>
      </div>
    </>
  );
};

export default MyPage;
