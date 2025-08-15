// lib/auth.ts
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import { creativityAgentFunctionsApi } from "@/utils/api";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async createUser({ user }) {
      try {
        await creativityAgentFunctionsApi.post('/cloud-function', {
          userId: user.id,
        });
      }  catch (error) {
        console.log("error creating user:", error)
        //TODO: delete the user maybe
      }
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Persistir dados do usuário no token JWT
      if (user) {
        token.sub = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Enviar propriedades do token para o cliente
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.email = token.email!;
      }
      return session;
    },
  },
  debug: true,
};
