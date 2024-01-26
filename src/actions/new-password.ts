"use server";

import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { NewPasswordSchema } from "@/lib/schemas";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const tokenExists = async(token: string | null) => {
  if(!token){
    return { error: "Invalid Link! Please request a new link." }
  }

  const existingToken = await getPasswordResetTokenByToken(token);

  if(!existingToken){
    return { error: "Invalid Link! Please request a new link." }
  }

  if(new Date(existingToken.expires) < new Date()){
    return { error: "Link expired! Please request a new link." }
  }

  return { success: "Valid token." }
}

export const newPassword = async(
  values: z.infer<typeof NewPasswordSchema>,
  token: string | null
) => {
  if(!token){
    return { error: "Invalid Link! Please try again." }
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if(!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  const existingUser = existingToken && await getUserByEmail(existingToken.email);
  
  if(!existingUser){
    return { error: "Link expired, please request a new one!" }
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword }
  })

  await db.passwordResetToken.delete({
    where: { id: existingToken.id }
  });

  return { success: "Password changed successfully." }

}