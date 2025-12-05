// app/dashboard/(overview)/page.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import CustomerDashboard from '@/app/ui/dashboard/customer-dashboard';
import ArtisanDashboard from '@/app/ui/dashboard/artisan-dashboard';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Type for session user
type SessionUser = {
  id: string;
  name: string;
  email: string;
  account_type: 'customer' | 'artisan';
};

export default async function DashboardPage() {
  const session = await auth();

  // Redirect if unauthenticated
  if (!session?.user) {
    redirect('/login');
  }

  const user = session.user as SessionUser;
  const accountType = user.account_type;

  // CUSTOMER DASHBOARD
  if (accountType === 'customer') {
    const products = (await sql`SELECT * FROM products`) || [];

    // Pick a random featured product (null if none)
    const featuredProduct =
      products.length > 0
        ? products[Math.floor(Math.random() * products.length)]
        : null;

    // Get review count (0 if none)
    const reviewRows = (await sql`SELECT COUNT(*) FROM reviews WHERE user_id = ${user.id}`) || [];
    const reviewCount = reviewRows.length > 0 ? Number(reviewRows[0].count) : 0;

    return (
      <CustomerDashboard
        user={user}
        featuredProduct={featuredProduct}
        reviewCount={reviewCount}
      />
    );
  }

  // ARTISAN DASHBOARD
  if (accountType === 'artisan') {
    return <ArtisanDashboard user={user} />;
  }

  // FALLBACK (unknown account type)
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome to your dashboard</h1>
      <p>Account type: {accountType || 'Not set'}</p>
    </div>
  );
}
