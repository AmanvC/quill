import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { LoginSchema } from "@/lib/schemas";
import { getUserByEmail } from "@/lib/user";
import bcrypt from "bcryptjs";

// We can access routes through API, so we should authenticate from here as well
export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if(validatedFields.success){
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);
          // No password if using OAuth
          if(!user || !user.password) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);
          if(passwordMatch) return user;
        }
        return null;
      }
    })
  ],
} satisfies NextAuthConfig