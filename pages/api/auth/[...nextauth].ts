// pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/business.manage",
          ].join(" "),
        },
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) (token as any).accessToken = account.access_token;
      if (account?.refresh_token) (token as any).refreshToken = account.refresh_token;
      if (account?.expires_at)  (token as any).accessTokenExpires = account.expires_at * 1000;
      return token;
    },
    // FIX: mora da VRATI session
    session({ session, token }) {
      (session as any).accessToken = (token as any).accessToken;
      (session as any).refreshToken = (token as any).refreshToken;
      return session;
    },
  },

  logger: {
    error(code, metadata) {
      console.error("NEXTAUTH ERROR:", code, metadata);
    },
    warn(code) {
      console.warn("NEXTAUTH WARN:", code);
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV !== "production") {
        console.debug("NEXTAUTH DEBUG:", code, metadata);
      }
    },
  },
};

export default NextAuth(authOptions);
