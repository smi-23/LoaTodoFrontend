"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
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

const useToken = (): Token | null => {
  const { data: session } = useSession();
  const [token, setToken] = useState<Token | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const authToken =
        session?.user?.Authorization?.toString().replace("Bearer ", "") ?? null;
      if (!authToken) {
        setToken(null);
        return;
      }

      const decoded = jwt.decode(authToken) as Token;
      setToken(decoded);
    };

    fetchToken();
  }, [session]);

  return token;
};

export default useToken;
