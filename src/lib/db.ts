import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined
}

export const db = globalThis.prisma || new PrismaClient();

if(process.env.NODE_ENV !== "production") globalThis.prisma = db;
// This was done for development only, if we don't do this, whenever we make changes to our code, next js will hot reload our application and a new PrismaClient will be created which might give error in certain scenario's (Too many active prisma client's)

