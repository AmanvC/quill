"use server";

import * as z from "zod";

import { ChangePasswordSchema } from "@/lib/schemas";
import { TActionResponse } from "@/lib/types";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const updatePassword = async (
  values: z.infer<typeof ChangePasswordSchema>,
  userEmail: string
) : Promise<TActionResponse> => {
  try{
    const validatedFields = ChangePasswordSchema.safeParse(values);

    if(!validatedFields.success){
      return {
        success: false,
        errorType: "INVALID_DATA",
        message: "Invalid data!"
      }
    }

    const existingUser = await getUserByEmail(userEmail);
    if(!existingUser){
      return { 
        success: false,
        errorType: 'NOT_REGISTERED',
        message: 'Email is not registered!'
      }
    }

    const { currentPassword, newPassword } = validatedFields.data;
    const passwordMatch = await bcrypt.compare(currentPassword, existingUser.password as string);

    if(!passwordMatch) {
      return {
        success: false,
        errorType: 'CREDENTIALS_ERROR',
        message: 'Current password does not match!'
      }
    }

    const isNewSameAsCurrent = await bcrypt.compare(newPassword, existingUser.password as string);
    if(isNewSameAsCurrent) {
      return {
        success: false,
        errorType: 'CREDENTIALS_ERROR',
        message: 'New password cannot be same as old password!'
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword }
    });

    return {
      success: true,
      message: "Password changed successfully."
    }

  } catch {
    return {
      success: false,
      errorType: "DEFAULT",
      message: "Something went wrong!"
    }
  }
}