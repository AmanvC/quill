"use server";

import * as z from "zod";

import { ResetPasswordSchema } from "@/lib/schemas"; 
import { getUserByEmail } from "@/data/user";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";

export const resetPassword = async (values: z.infer<typeof ResetPasswordSchema>) => {
  const validatedFields = ResetPasswordSchema.safeParse(values);

  if(!validatedFields.success){
    return { error: "Invalid email format!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if(!existingUser){
    return { error: "Email is not registered!" }
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(existingUser.name as string, passwordResetToken.email, passwordResetToken.token);

  return { success: "Check your email to reset your password." }
}