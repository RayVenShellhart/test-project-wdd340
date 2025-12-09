// app/ui/products/product-details.tsx

'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Review } from '@/app/lib/definitions';
import { submitReview } from '@/app/lib/actions';
import { useSession } from "next-auth/react";

interface ReviewWithName extends Review {
  user_name: string;
}

interface ProductDetailsTableProps {
  product: {
    id: string;
    name: string;
    image_url: string;
    price: number;
    description?: string;
    category?: string;
    inventory?: number;
    reviews?: ReviewWithName[]; // Optional: may be empty
  };
}

export default function ProductDetailsTable({ product }: ProductDetailsTableProps) {
  const { data: session } = useSession();
  const user = session?.user;

  console.log('Session data:', session);
  console.log('User:', user);
  console.log('User ID:', user?.id);

  // Initialize reviews from product prop if available
  const [reviews, setReviews] = useState<ReviewWithName[]>(product.reviews || []);
  const [reviewContent, setReviewContent] = useState('');

  // Fetch latest reviews if not provided
  useEffect(() => {
    if (!product.reviews || product.reviews.length === 0) {
      async function loadReviews() {
        try {
          const res = await fetch(`/api/products/${product.id}`);
          if (!res.ok) throw new Error('Failed to fetch reviews');
          const data = await res.json();
          setReviews(
            data.reviews.map((r: any) => ({
              ...r,
              user_name: r.user_name || `User ${r.user_id}`,
            }))
          );
        } catch (err) {
          console.error('Error loading reviews:', err);
        }
      }
      loadReviews();
    }
  }, [product.id, product.reviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewContent.trim()) return;

    if (!user?.id) {
      alert("You must be logged in to leave a review.");
      return;
    }

    try {
      const newReview = await submitReview(product.id, reviewContent, user.id);
      // Ensure newReview has user_name
      setReviews([{ ...newReview, user_name: user.name || `User ${user.id}` }, ...reviews]);
      setReviewContent('');
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* Product Name */}
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900">Product Name</h2>
          <p className="mt-2 text-sm text-gray-700">{product.name}</p>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-900">Description</h2>
            <p className="mt-2 text-sm text-gray-700">{product.description}</p>
          </div>
        )}

        {/* Image */}
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900">Product Image</h2>
          <div className="mt-2 w-48 h-48 relative rounded-md overflow-hidden border border-gray-200">
            <Image
              src={product.image_url || '/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover"
              sizes="192px"
            />
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900">Price</h2>
          <p className="mt-2 text-sm text-gray-700">${product.price.toFixed(2)}</p>
        </div>

        {/* Reviews */}
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            Reviews {reviews.length > 0 && `(${reviews.length})`}
          </h2>

          {reviews.length > 0 ? (
            <div className="mt-2 space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-md border border-gray-200 bg-white p-4">
                  <p className="font-medium text-gray-900">
                    {review.user_name}
                  </p>
                  <p className="mt-1 text-sm text-gray-700">{review.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-500 italic">No reviews yet.</p>
          )}

          {/* Review Form */}
          {user ? (
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
              <textarea
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                placeholder="Write your review..."
                className="w-full rounded-md border p-2 text-sm"
                rows={3}
              />
              <button
                type="submit"
                className="self-end rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Submit Review
              </button>
            </form>
          ) : (
            <p className="mt-2 text-sm italic text-gray-500">Log in to leave a review.</p>
          )}
        </div>

      </div>
    </div>
  );
}
