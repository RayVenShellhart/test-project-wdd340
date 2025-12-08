// auth.config.ts
import type { NextAuthConfig } from "next-auth";

const appUrl = process.env.NEXTAUTH_URL

export const authConfig = {
  pages: {
    signIn: '/login',
  },
callbacks: {
  authorized({ auth, request: { nextUrl } }) {
    const isLoggedIn = !!auth?.user;
    const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

    // Protect dashboard routes
    if (isOnDashboard && !isLoggedIn) {
      return false; // NextAuth will redirect to /login automatically
    }

    // Allow everything else without redirecting
    return true;
  },
},
  providers: [], // Add providers with .credentials() if they are not defined yet
} satisfies NextAuthConfig;