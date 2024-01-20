"use server"; // It won't be sent to server ever, it's like creating a API route

import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/lib/schemas";
import * as z from "zod";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";

export const login = async (values: z.infer<typeof LoginSchema>) => {
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
    return { error: "Email is not verified!" }
    // TODO - Create a new compoenent or append in old one to add a resend email button
    // OR create a new link to send verification email (NEW COMPOENENT LIKE LOGIN AND REGISTER)
    // const verificationToken = await generateVerificationToken(existingUser.email);
    // return { success: "A confirmation email has been sent to the registered mail ID." }
  }

  try{
    await signIn("credentials",  {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
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