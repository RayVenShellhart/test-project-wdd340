// app/dashboard/sellers/[id]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@/auth'; // Adjust this import based on your auth setup
import {
  fetchSellerById,
  fetchProductsBySeller,
  fetchSellerStories, // Changed: fetch all stories
} from '@/app/lib/data';
import { formatCurrency } from '@/app/lib/utils';
import SellerStoriesSection from '@/app/ui/sellers/seller-stories-section';

interface SellerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SellerDetailPage(props: SellerDetailPageProps) {
  const params = await props.params;
  const { id } = params;

  // Get current user session
  const session = await auth();
  const currentUserId = session?.user?.id;

  // Fetch seller data
  const seller = await fetchSellerById(id);
  
  if (!seller) {
    notFound();
  }

  // Check if current user is the seller
  const isOwnProfile = currentUserId === id;

  // Fetch related data
  const products = await fetchProductsBySeller(id);
  const sellerStories = await fetchSellerStories(id); // Get all stories

  return (
    <div className="w-full">
      {/* Back button */}
      <Link
        href="/dashboard/sellers"
        className="mb-6 inline-flex items-center text-sm text-blue-600 hover:underline"
      >
        ← Back to Sellers
      </Link>

      {/* Seller Info */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">{seller.name}</h1>
        <p className="mt-2 text-gray-600">{seller.email}</p>
      </div>

      {/* Seller Stories Section */}
      <SellerStoriesSection 
        sellerId={id} 
        stories={sellerStories}
        isOwnProfile={isOwnProfile}
      />

      {/* Products */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Products by {seller.name}
        </h2>
        
        {products.length === 0 ? (
          <p className="text-gray-500">No products available.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/dashboard/products/${product.id}`}
                className="group rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 bg-gray-100">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="mt-2 text-lg font-bold text-gray-900">
                    {formatCurrency(product.price)}
                  </p>
                  <span className="mt-2 inline-block text-xs text-gray-500 uppercase">
                    {product.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}