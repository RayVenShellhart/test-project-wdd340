// app/dashboard/(overview)/page.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import CustomerDashboard from '@/app/ui/dashboard/customer-dashboard';
import ArtisanDashboard from '@/app/ui/dashboard/artisan-dashboard';
import { SellerStory } from '@/app/lib/definitions';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

type SessionUser = {
  id: string;
  name: string;
  email: string;
  account_type: 'customer' | 'artisan';
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const user = session.user as SessionUser;
  const accountType = user.account_type;

  // CUSTOMER DASHBOARD
  if (accountType === 'customer') {
    const products = (await sql`SELECT * FROM products`) || [];
    const featuredProduct =
      products.length > 0
        ? products[Math.floor(Math.random() * products.length)]
        : null;
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
    // Count the artisan's products
    const myProducts = await sql`
      SELECT * FROM products WHERE seller_id = ${user.id}
    `;
    const productCount = myProducts.length;

    // Fetch the artisan's stories - properly typed
    const storiesResult = await sql<SellerStory[]>`
      SELECT id, user_id, title, story 
      FROM seller_stories 
      WHERE user_id = ${user.id} 
      ORDER BY id DESC
    `;
    
    // Convert to array
    const stories: SellerStory[] = Array.from(storiesResult).map(row => ({
      id: row.id,
      user_id: row.user_id,
      title: row.title,
      story: row.story,
    }));

    return (
      <ArtisanDashboard
        user={user}
        productCount={productCount}
        stories={stories}
      />
    );
  }

  // Fallback
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome to your dashboard</h1>
      <p>Account type: {accountType || 'Not set'}</p>
    </div>
  );
}