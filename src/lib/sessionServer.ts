"use server";

import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "./auth/auth";

export const getServerSession = cache(async () => {
  const data = await auth.api.getSession({ headers: await headers() });
  return data;
});
