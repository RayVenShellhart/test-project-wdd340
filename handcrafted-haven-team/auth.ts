// auth.ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

interface DbUser {
  id: string;
  email: string;
  name: string;
  password: string;
  account_type: 'artisan' | 'customer';
}

async function getUser(email: string): Promise<DbUser | undefined> {
  const users = await sql`
    SELECT * FROM users WHERE email=${email}
  ` as DbUser[];
  return users[0];
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,

  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const parsed = z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }).safeParse(credentials);

        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await getUser(email);
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        // Return user object with account_type
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          account_type: user.account_type,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // When user signs in, add custom fields to token
      if (user) {
        token.id = user.id;
        token.account_type = user.account_type;
      }
      return token;
    },

    async session({ session, token }) {
      // Add custom fields from token to session
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.account_type = token.account_type as 'artisan' | 'customer';
      }
      return session;
    },
  },
});