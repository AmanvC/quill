"use server"; // It won't be sent to server ever, it's like creating a API route

import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/lib/schemas";
import * as z from "zod";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { sendVerificationEmail } from "@/lib/mail";

export const login = async (values: z.infer<typeof LoginSchema>, callbackUrl?: string) => {
  const validatedFields = LoginSchema.safeParse(values);

  if(!validatedFields.success){
    return {error: "Invalid fields!"};
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if(!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email is not registered!" }
  }

  if(!existingUser.emailVerified) {
    const existingToken = await getVerificationTokenByEmail(existingUser.email);
    const hasExpired = new Date(existingToken.expires) < new Date();
    if(hasExpired) {
      const newToken = await generateVerificationToken(existingUser.email);
      await sendVerificationEmail(existingUser.name, newToken.email, newToken.token);
      return { success: "A confirmation email has been sent to the registered mail ID." }
    }
    return { error: "Email is not verified!" }
  }

  try{
    await signIn("credentials",  {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    })
  }catch(error) {
    if(error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" }
      }
    }

    throw error;
  }

  // return {success: "Email sent."}
}