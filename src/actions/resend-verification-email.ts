"use server";

import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { TActionResponse } from "@/lib/types";

export const resendVerificationEmail = async (email: string): Promise<TActionResponse> => {
  const existingUser = await getUserByEmail(email);

  if(!existingUser || !existingUser.email || !existingUser.password) {
    return { 
      success: false,
      errorType: 'NOT_REGISTERED',
      message: 'Email is not registered!'
    }
  }

  const newToken = await generateVerificationToken(existingUser.email);
  await sendVerificationEmail(existingUser.name as string, newToken.email, newToken.token);
  return { 
    success: true,
    message: 'A new verification email has been sent successfully.'
  }
}