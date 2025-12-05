// app/ui/dashboard/artisan-dashboard.tsx
import { lusitana } from '@/app/ui/fonts';
import { User } from 'next-auth';

interface ArtisanDashboardProps {
  user: User;
}

export default function ArtisanDashboard({ user }: ArtisanDashboardProps) {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>
          Artisan Dashboard
        </h1>
      </div>
      
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Artisan-specific content */}
        <div className="rounded-xl bg-gray-50 p-4">
          <h2 className="text-lg font-semibold">Welcome, {user.name}!</h2>
          <p className="mt-2 text-sm text-gray-600">
            Manage your products and track your sales.
          </p>
        </div>

        <div className="rounded-xl bg-orange-50 p-4">
          <h3 className="font-semibold">My Products</h3>
          <p className="mt-2 text-2xl font-bold">0</p>
          <p className="text-sm text-gray-600">Active listings</p>
        </div>

        <div className="rounded-xl bg-green-50 p-4">
          <h3 className="font-semibold">Total Sales</h3>
          <p className="mt-2 text-2xl font-bold">$0</p>
          <p className="text-sm text-gray-600">This month</p>
        </div>

        <div className="rounded-xl bg-blue-50 p-4">
          <h3 className="font-semibold">Orders</h3>
          <p className="mt-2 text-2xl font-bold">0</p>
          <p className="text-sm text-gray-600">Pending orders</p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          Recent Orders
        </h2>
        <div className="rounded-xl bg-gray-50 p-4">
          <p className="text-gray-600">No recent orders</p>
        </div>
      </div>
    </div>
  );
}