// app/ui/dashboard/customer-dashboard.tsx
import { lusitana } from '@/app/ui/fonts';
import { User } from 'next-auth';

interface FeaturedProduct {
  id: string;
  name: string;
  price: number;
  image: string | null;
  description?: string;
}

interface CustomerDashboardProps {
  user: User;
  featuredProduct: any; // or your Product type
  reviewCount: number;
}


export default function CustomerDashboard({ user, featuredProduct, reviewCount }: CustomerDashboardProps) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>
          Customer Dashboard
        </h1>
      </div>

      {/* Welcome */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl bg-gray-50 p-4 col-span-1">
          <h2 className="text-lg font-semibold">Welcome, {user.name}!</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enjoy browsing our handcrafted products and reviews.
          </p>
        </div>

        {/* Reviews */}
        <div className="rounded-xl bg-purple-50 p-4">
          <h3 className="font-semibold">Reviews</h3>
          <p className="mt-2 text-2xl font-bold">{reviewCount}</p>
          <p className="text-sm text-gray-600">Products you have reviewed</p>
        </div>

        {/* Featured Product */}
        <div className="rounded-xl bg-blue-50 p-4">
          <h3 className="font-semibold">Featured Product</h3>

          {featuredProduct ? (
            <div className="mt-3">
              {featuredProduct.image && (
                <img
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  className="h-32 w-full object-cover rounded-lg mb-2"
                />
              )}
              <p className="font-semibold text-lg">{featuredProduct.name}</p>
              <p className="text-gray-700">${featuredProduct.price.toFixed(2)}</p>
              {featuredProduct.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {featuredProduct.description}
                </p>
              )}
            </div>
          ) : (
            <p className="mt-2 text-gray-600">No featured product available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
