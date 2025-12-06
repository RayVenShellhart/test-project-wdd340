import { lusitana } from '@/app/ui/fonts';
import { User } from 'next-auth';

interface SellerStory {
  id: string;
  title: string;
  story: string;
}

interface ArtisanDashboardProps {
  user: User;
  productCount: number;           // number of products the artisan has
  stories: SellerStory[];         // seller stories
}

export default function ArtisanDashboard({
  user,
  productCount,
  stories,
}: ArtisanDashboardProps) {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>
          Artisan Dashboard
        </h1>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Welcome card */}
        <div className="rounded-xl bg-gray-50 p-4">
          <h2 className="text-lg font-semibold">Welcome, {user.name}!</h2>
          <p className="mt-2 text-sm text-gray-600">
            Manage your products and share your stories.
          </p>
        </div>

        {/* My Products */}
        <div className="rounded-xl bg-orange-50 p-4">
          <h3 className="font-semibold">My Products</h3>
          <p className="mt-2 text-2xl font-bold">{productCount}</p>
          <p className="text-sm text-gray-600">Active listings</p>
        </div>

        {/* Removed Total Sales and Orders cards */}
      </div>

      {/* Seller Stories */}
      <div className="mt-6">
        <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          Your Stories
        </h2>
        {stories.length > 0 ? (
          <div className="space-y-4">
            {stories.map((story) => (
              <div
                key={story.id}
                className="rounded-xl bg-gray-50 p-4 border border-gray-200"
              >
                <h3 className="font-semibold">{story.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{story.story}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-gray-600">No stories yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
