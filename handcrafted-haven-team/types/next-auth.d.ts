// types/next-auth.d.ts
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      account_type: 'artisan' | 'customer';
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    account_type: 'artisan' | 'customer';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    account_type: 'artisan' | 'customer';
  }
}