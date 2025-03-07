import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { authApi } from "./lib/api";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    error?: string;
  }
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
}
const GOOGLE_AUTHORIZATION_URL =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({
    prompt: "consent",
    access_type: "offline",
    response_type: "code",
  });

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: any) {
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.AUTH_GOOGLE_ID || "",
        client_secret: process.env.AUTH_GOOGLE_SECRET || "",
        grant_type: "refresh_token",
        refresh_token: token.refreshToken || "",
      });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

// NextAuth Configuration
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline", // Needed to receive a refresh token
          response_type: "code",
        },
      },
    }),
  ],
  cookies:
    process.env.NEXT_PUBLIC_IS_LOCALHOST === "true"
      ? {}
      : {
          pkceCodeVerifier: {
            name: "next-auth.pkce.code_verifier",
            options: {
              httpOnly: true,
              sameSite: "none",
              path: "/",
              secure: true,
            },
          },
        },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Register the user with our backend
          await authApi.registerUser({
            ...user,
            googleId: account?.providerAccountId || "",
          });
          return true;
        } catch (error) {
          console.error("Error registering user:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, account, user }) {
      // Initial sign-in
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + (account.expires_in || 0) * 1000,
          refreshToken: account.refresh_token,
          user,
        };
      }
      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (token) {
        session.user = token.user as any;
        session.accessToken = token.accessToken as any;
        session.error = token.error as string;
      }
      return session;
    },
  },
});
