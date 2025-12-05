// app/ui/sellers/seller-story-form.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SellerStory } from '@/app/lib/definitions';

interface SellerStoryFormProps {
  sellerId: string;
  existingStory?: SellerStory | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function SellerStoryForm({ 
  sellerId, 
  existingStory,
  onSuccess,
  onCancel,
}: SellerStoryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: existingStory?.title || '',
    story: existingStory?.story || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/seller-stories', {
        method: existingStory ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: existingStory?.id,
          user_id: sellerId,
          title: formData.title,
          story: formData.story,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save story');
      }

      router.refresh(); // Refresh the page to show updated data
      onSuccess?.(); // Call success callback
    } catch (err) {
      setError('Failed to save your story. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (existingStory) {
      setFormData({
        title: existingStory.title,
        story: existingStory.story,
      });
    }
    setError(null);
    onCancel?.(); // Call cancel callback
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        {existingStory ? 'Edit Story' : 'Add New Story'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Story Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            maxLength={100}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g., From Forest to Workshop"
          />
        </div>

        <div>
          <label htmlFor="story" className="block text-sm font-medium text-gray-700 mb-2">
            Your Story
          </label>
          <textarea
            id="story"
            name="story"
            value={formData.story}
            onChange={(e) => setFormData({ ...formData, story: e.target.value })}
            required
            rows={6}
            maxLength={1000}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Share your journey, inspiration, and what makes your craft special..."
          />
          <p className="mt-1 text-sm text-gray-500">
            {formData.story.length}/1000 characters
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : existingStory ? 'Update Story' : 'Add Story'}
          </button>
          
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}