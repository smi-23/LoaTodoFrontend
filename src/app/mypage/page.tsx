"use client";

import useToken from "@/app/hooks/userToken";
import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { backend_api } from "@/app/utils";
import Header from "@/app/components/Header";
import InputBox from "@/app/components/InputBox";

const MyPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [newName, setNewName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const token = useToken();

  useEffect(() => {
    token.then((response) => {
      if (response) {
        setRole(response.role);
        setUsername(response.sub);
        setName(response.name);
        setEmail(response.email);
      }
    });
  }, [token]);

  const updateName = async () => {
    try {
      const response = await backend_api().post("api/user/update/name", {
        // name,
        newName,
      });
      if (response.status === 200) {
        setName(response.data.newName);
        console.log("성공하면 보는 리스폰스", response);
      }
    } catch (error) {
      if (error.response) {
        console.log(error);
      }
    }
  };
  return (
    <>
      <Header />
      <h1>Welcome to MyPage</h1>
      <div>
        <label>Name</label>
        <InputBox
          className={"signup"}
          type={"text"}
          id={"Name-input-box"}
          placeholder={"네임을 입력해주세요"}
          value={newName}
          setValue={setNewName}
        />
        <button type="button" className="updateName--btn" onClick={updateName}>
          updateName
        </button>
      </div>
    </>
  );
};

export default MyPage;
