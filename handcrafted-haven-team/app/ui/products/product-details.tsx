'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Review } from '@/app/lib/definitions';
import { submitReview } from '@/app/lib/actions';
import { useSession } from "next-auth/react";

interface ReviewWithName extends Review {
  user_name: string;
  rating: number; // Rating 1-5
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
    reviews?: ReviewWithName[];
  };
}

export default function ProductDetailsTable({ product }: ProductDetailsTableProps) {
  const { data: session, status } = useSession(); // include status
  const user = session?.user;

  const [reviews, setReviews] = useState<ReviewWithName[]>(product.reviews || []);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState<number>(5); // Default 5

 useEffect(() => {
    if (status === 'unauthenticated') {
      setReviewContent('');
      setReviewRating(5);
      setReviews([]); // clear previous user's reviews if desired
    }
  }, [status]);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch(`/api/products/${product.id}`);
        if (!res.ok) throw new Error('Failed to fetch reviews');
        const data = await res.json();
        console.log('Fetched reviews:', data.reviews);
        setReviews(
          data.reviews.map((r: any) => ({
            ...r,
            user_name: r.user_name || `User ${r.user_id}`,
            rating: r.rating ?? 5,
          }))
        );
      } catch (err) {
        console.error('Error loading reviews:', err);
      }
    }
    loadReviews();
  }, [product.id]);


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!reviewContent.trim()) return;

  // Always get the latest session user
  const currentUser = session?.user;

  if (!currentUser?.id) {
    alert("You must be logged in to leave a review.");
    return;
  }

  try {
    console.log('Submitting review as user:', currentUser);
    const newReview = await submitReview(
      product.id,
      reviewContent,
      currentUser.id,
      reviewRating
    );

    setReviews([
      { ...newReview, user_name: currentUser.name || `User ${currentUser.id}`, rating: reviewRating },
      ...reviews
    ]);

    setReviewContent('');
    setReviewRating(5);
  } catch (err) {
    console.error('Error submitting review:', err);
    alert('Failed to submit review.');
  }
  };


  // Helper to render stars for display
  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) =>
      i < rating ? <span key={i} className="text-yellow-500">★</span> : <span key={i} className="text-gray-300">★</span>
    );

  return (
    <div className="space-y-6">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* Product Info (name, description, image, price) */}
        {/* ...keep your existing product info here... */}

        {/* Reviews */}
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900">Reviews {reviews.length > 0 && `(${reviews.length})`}</h2>

          {reviews.length > 0 ? (
            <div className="mt-2 space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-md border border-gray-200 bg-white p-4">
                  <p className="font-medium text-gray-900">{review.user_name}</p>
                  <div className="flex text-yellow-500">
                    {renderStars(review.rating)}
                  </div>
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

              <label className="text-sm font-medium text-gray-700">Your Rating</label>
              <div className="flex gap-1">
                {Array.from({ length: 5 }, (_, i) => {
                  const starNumber = i + 1;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setReviewRating(starNumber)}
                      className={`text-2xl ${starNumber <= reviewRating ? 'text-yellow-500' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  );
                })}
              </div>

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