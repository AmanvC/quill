import NextAuth, { DefaultSession, type Session } from "next-auth"
import authConfig from "@/auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import { getUserById } from "@/data/user";

// FOR TYPES
declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }
}

type ExtendedUser = DefaultSession["user"] & {
  allowChangePassword: boolean
}

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
      if(!existingUser?.emailVerified) return false;
      return true;
    },

    // TODO - Bug in TS or NextAuth, will be fixed in future, remove types for params
    async session({ token, session }: {token?: any, session: Session}) {
      if(token.sub && session.user) {
        session.user.allowChangePassword = token.allowChangePassword;
      }
      return session;
    },
    async jwt({token}) {
      if(!token.sub) return token;

      const user = await getUserById(token.sub);

      if(!user) return token;

      token.allowChangePassword = user.password ? true : false;
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig
})