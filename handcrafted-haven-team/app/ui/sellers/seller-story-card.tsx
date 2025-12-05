// app/ui/sellers/seller-story-card.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SellerStory } from '@/app/lib/definitions';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

interface SellerStoryCardProps {
  story: SellerStory;
  isOwnProfile: boolean;
  onEdit: () => void;
}

export default function SellerStoryCard({
  story,
  isOwnProfile,
  onEdit,
}: SellerStoryCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/seller-stories?id=${story.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete story');
      }

      router.refresh();
    } catch (error) {
      console.error('Failed to delete story:', error);
      alert('Failed to delete story. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{story.title}</h3>
        {isOwnProfile && (
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="text-blue-600 hover:text-blue-800 p-2 rounded-md hover:bg-blue-50 transition-colors"
              title="Edit story"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 hover:text-red-800 p-2 rounded-md hover:bg-red-50 transition-colors"
              title="Delete story"
              disabled={isDeleting}
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{story.story}</p>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Story?
            </h4>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{story.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}