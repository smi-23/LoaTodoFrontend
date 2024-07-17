"use client";
import { useSession } from "next-auth/react";
import jwt from "jsonwebtoken";
import { Role } from "@/types";

export interface Token {
  role: Role;
  exp: number;
  iat: number;
  sub: string;
  name: string;
  email: string;
}

// TODO: 여기 안에서 token을 state로 가지고, useEffect로 변화를 관리하도록 수정 필요
const useToken = async (): Promise<Token | null> => {
  const { data: session } = useSession();

  const token =
    session?.user?.Authorization.toString().replace("Bearer ", "") ?? null;

  if (!token) return null;

  const decoded = await jwt.decode(token);
  // console.log(decoded as Token);
  return decoded as Token;
};

export default useToken;
