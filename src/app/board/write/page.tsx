"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { backend_api } from "@/app/utils";
import InputBox from "@/app/components/InputBox";

const BoardListPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");

  const [content, setContent] = useState("");
  const [titleMessage, setTitleMessage] = useState("");
  const [contentMessage, setContentMessage] = useState("");

  const createBoard = async () => {
    try {
      const response = await backend_api().post(`api/board/create`, {
        title,
        content,
      });
      const data = response.data;
      if (data) {
        alert("글쓰기 성공");
        router.push("/board/list");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <h1>글 쓰는 곳</h1>
      <div>
        <label>title</label>
        <InputBox
          className={"title"}
          type={"text"}
          id={"title-input-box"}
          placeholder={"제목을 입력해주세요"}
          value={title}
          setValue={setTitle}
          message={setTitleMessage}
        />
      </div>
      <div>
        <label>content</label>
        <InputBox
          className={"content"}
          type={"text"}
          id={"content-input-box"}
          placeholder={"내용을 입력해주세요"}
          value={content}
          setValue={setContent}
          message={setContentMessage}
        />
      </div>
      <button type="button" className="create-board-btn" onClick={createBoard}>
        등록
      </button>
    </>
  );
};

export default BoardListPage;
