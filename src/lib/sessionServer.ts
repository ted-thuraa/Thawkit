"use server";

import { headers } from "next/headers";
import { auth } from "./auth/auth";

export const getServerSession = async () => {
  const data = await auth.api.getSession({ headers: await headers() });
  return data;
};
