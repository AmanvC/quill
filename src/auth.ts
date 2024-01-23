import NextAuth, { DefaultSession } from "next-auth"
import authConfig from "@/auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import { getUserById } from "@/data/user";
// import { UserRole } from "@prisma/client";

// FOR TYPES
// declare module "next-auth" {
//   interface Session {
//     user: {
//       role: UserRole
//     } & DefaultSession["user"]
//   }
// }

// THESE METHODS ARE EXCLUSIVELY FOR SERVER COMPONENTS
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  pages: {
    signIn: "/login",
    error: "/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: {id: user.id},
        data: {emailVerified: new Date()}
      })
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      if(account?.provider !== "credentials") return true;
      const existingUser = await getUserById(user.id as string);
      if(!existingUser.emailVerified) return false;
      return true;
    },
    async jwt({token}) {
      return token;
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig
})