"use server";

import { signOut } from "@/auth";

export const logout = async() => {
  // can do server stuff before logging out
  await signOut();
}