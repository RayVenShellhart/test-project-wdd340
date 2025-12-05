// app/ui/sellers/seller-stories-section.tsx
'use client';

import { useState } from 'react';
import { SellerStory } from '@/app/lib/definitions';
import SellerStoryForm from './seller-story-form';
import SellerStoryCard from './seller-story-card';

interface SellerStoriesSectionProps {
  sellerId: string;
  stories: SellerStory[];
  isOwnProfile: boolean;
}

export default function SellerStoriesSection({
  sellerId,
  stories,
  isOwnProfile,
}: SellerStoriesSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);

  const handleFormSuccess = () => {
    setShowAddForm(false);
    setEditingStoryId(null);
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingStoryId(null);
  };

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          {isOwnProfile ? 'My Stories' : 'Stories'}
        </h2>
        {isOwnProfile && !showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            + Add New Story
          </button>
        )}
      </div>

      {/* Add New Story Form */}
      {showAddForm && isOwnProfile && (
        <div className="mb-6">
          <SellerStoryForm
            sellerId={sellerId}
            existingStory={null}
            onSuccess={handleFormSuccess}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      {/* Stories List */}
      {stories.length === 0 && !showAddForm ? (
        <div className="rounded-lg bg-white p-8 shadow-sm text-center">
          <p className="text-gray-500">
            {isOwnProfile 
              ? 'You haven\'t shared any stories yet. Click "Add New Story" to get started!'
              : 'No stories available yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {stories.map((story) => (
            <div key={story.id}>
              {editingStoryId === story.id && isOwnProfile ? (
                <SellerStoryForm
                  sellerId={sellerId}
                  existingStory={story}
                  onSuccess={handleFormSuccess}
                  onCancel={handleCancelForm}
                />
              ) : (
                <SellerStoryCard
                  story={story}
                  isOwnProfile={isOwnProfile}
                  onEdit={() => setEditingStoryId(story.id)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}