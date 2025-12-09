// placeholder-data-handcraftedhaven.ts
// Sample placeholder data for Handcrafted Haven project
// cSpell:ignore handcraftedhaven

import { User, Product, Review, SellerStory } from './definitions';

// --- Users ---
const users: User[] = [
  // Artisans (sellers)
  {
    id: '1f5c8b32-1d2a-4d57-9b8a-1e6b0f9a2a01',
    name: 'Olivia Woodcraft',
    email: 'olivia@handcrafted.com',
    password: 'password123',
    account_type: 'artisan',
  },
  {
    id: '2a7f9c21-3e4b-4d67-bc1d-3f8c2a9e7f22',
    name: 'Liam Leatherworks',
    email: 'liam@handcrafted.com',
    password: 'password123',
    account_type: 'artisan',
  },
  {
    id: '3c9d7e45-6f8a-4a21-a5d7-9c0e1f2b3d34',
    name: 'Sophia Stonecraft',
    email: 'sophia@handcrafted.com',
    password: 'password123',
    account_type: 'artisan',
  },
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'User',
    email: 'user@nextmail.com',
    password: '123456',
    account_type: 'artisan',
  },

  // Customers
  {
    id: 'c1d2e3f4-1111-2222-3333-444455556666',
    name: 'Alice Johnson',
    email: 'alice@test.com',
    password: 'password123',
    account_type: 'customer',
  },
  {
    id: 'c2d2e3f4-1111-2222-3333-444455556667',
    name: 'Mark Spencer',
    email: 'mark@test.com',
    password: 'password123',
    account_type: 'customer',
  },
  {
    id: 'c3d2e3f4-1111-2222-3333-444455556668',
    name: 'Nina Patel',
    email: 'nina@test.com',
    password: 'password123',
    account_type: 'customer',
  },
  {
    id: 'c4d2e3f4-1111-2222-3333-444455556669',
    name: 'Tommy Lee',
    email: 'tommy@test.com',
    password: 'password123',
    account_type: 'customer',
  },
  {
    id: 'c5d2e3f4-1111-2222-3333-444455556670',
    name: 'Emily Davis',
    email: 'emily@test.com',
    password: 'password123',
    account_type: 'customer',
  },
];

// --- Products ---
const products: Product[] = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    name: 'Handmade Wooden Bowl',
    image_url: '/products/wooden-bowl.jpg',
    price: 4500,
    description:
      'A beautifully handcrafted wooden bowl made from sustainably sourced hardwood. Each piece is carved, sanded, and finished by hand, creating a smooth, natural texture perfect for serving or display.',
    category: 'home',
    seller_id: '1f5c8b32-1d2a-4d57-9b8a-1e6b0f9a2a01', // Olivia Woodcraft
  },
  {
    id: 'b2222222-2222-2222-2222-222222222222',
    name: 'Leather Journal',
    image_url: '/products/leather-journal.jpg',
    price: 3200,
    description:
      'A premium handcrafted leather journal featuring thick, lay-flat pages ideal for sketching, writing, or daily reflections. The natural leather cover ages beautifully, developing a unique patina over time.',
    category: 'other',
    seller_id: '2a7f9c21-3e4b-4d67-bc1d-3f8c2a9e7f22', // Liam Leatherworks
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    name: 'Ceramic Vase',
    image_url: '/products/ceramic-vase.jpg',
    price: 5200,
    description:
      'A hand-thrown ceramic vase glazed in earthy, warm tones. Its organic silhouette and subtle variations make it a perfect centerpiece for fresh florals or decorative greenery.',
    category: 'home',
    seller_id: '3c9d7e45-6f8a-4a21-a5d7-9c0e1f2b3d34', // Sophia Stonecraft
  },
  {
    id: 'd4444444-4444-4444-4444-444444444444',
    name: 'Knitted Scarf',
    image_url: '/products/knitted-scarf.jpg',
    price: 2800,
    description:
      'A cozy, hand-knitted scarf created with soft, high-quality yarn. Its timeless pattern and gentle drape make it an essential accessory for cooler seasons.',
    category: 'clothing',
    seller_id: '1f5c8b32-1d2a-4d57-9b8a-1e6b0f9a2a01', // Olivia Woodcraft
  },
  {
    id: 'e5555555-5555-5555-5555-555555555555',
    name: 'Handcrafted Candle',
    image_url: '/products/handcrafted-candle.jpg',
    price: 1500,
    description:
      'A small-batch, hand-poured candle made with natural wax and infused with subtle botanical fragrances. Designed to bring warmth and calm to any space.',
    category: 'home',
    seller_id: '2a7f9c21-3e4b-4d67-bc1d-3f8c2a9e7f22', // Liam Leatherworks
  },
  {
    id: 'f6666666-6666-6666-6666-666666666666',
    name: 'Silver Pendant Necklace',
    image_url: '/products/silver-pendant.jpg',
    price: 3800,
    description: 'A delicate silver pendant necklace handcrafted with precision and care.',
    category: 'jewelry',
    seller_id: '3c9d7e45-6f8a-4a21-a5d7-9c0e1f2b3d34', // Sophia Stonecraft
  },
  {
    id: 'a7777777-7777-7777-7777-777777777777', // Keep it in hex range
    name: 'Watercolor Print - Sunset',
    image_url: '/products/watercolor-sunset.jpg',
    price: 2400,
    description: 'A vibrant watercolor print of a sunset, perfect for framing and gifting.',
    category: 'art',
    seller_id: '1f5c8b32-1d2a-4d57-9b8a-1e6b0f9a2a01',
  },
  {
    id: 'b8888888-8888-8888-8888-888888888888',
    name: 'Woolen Beanie',
    image_url: '/products/woolen-beanie.jpg',
    price: 1800,
    description: 'A soft, warm woolen beanie for cozy winter days.',
    category: 'clothing',
    seller_id: '2a7f9c21-3e4b-4d67-bc1d-3f8c2a9e7f22',
  },
  {
    id: 'c9999999-9999-9999-9999-999999999999',
    name: 'Hand-Painted Ceramic Mug',
    image_url: '/products/ceramic-mug.jpg',
    price: 2200,
    description: 'A hand-painted ceramic mug with a unique artistic design.',
    category: 'home',
    seller_id: '3c9d7e45-6f8a-4a21-a5d7-9c0e1f2b3d34',
  },
  {
    id: 'da000000-0000-0000-0000-000000000000',
    name: 'Leather Bookmark',
    image_url: '/products/leather-bookmark.jpg',
    price: 900,
    description: 'A handcrafted leather bookmark, perfect for readers and gift-giving.',
    category: 'other',
    seller_id: '410544b2-4001-4271-9855-fec4b6a6442a',
  },
];

// --- Reviews ---
const reviews: Review[] = [
  {
    id: 'f6666666-6666-6666-6666-666666666666',
    product_id: 'a1111111-1111-1111-1111-111111111111',
    user_id: 'c1d2e3f4-1111-2222-3333-444455556666',
    content: 'Beautiful craftsmanship! Love the natural finish.',
    rating: 5
  },
  {
    id: 'f7777777-7777-7777-7777-777777777777',
    product_id: 'b2222222-2222-2222-2222-222222222222',
    user_id: 'c2d2e3f4-1111-2222-3333-444455556667',
    content: 'The leather quality is excellent, very durable.',
    rating: 4
  },
  {
    id: 'f8888888-8888-8888-8888-888888888888',
    product_id: 'c3333333-3333-3333-3333-333333333333',
    user_id: 'c3d2e3f4-1111-2222-3333-444455556668',
    content: 'Looks amazing on my shelf, exactly as pictured.',
    rating: 5
  },
  {
    id: 'f9999999-9999-9999-9999-999999999999',
    product_id: 'd4444444-4444-4444-4444-444444444444',
    user_id: 'c4d2e3f4-1111-2222-3333-444455556669',
    content: 'Warm and cozy! The colors are vibrant.',
    rating: 4
  },
  {
    id: 'f0000000-0000-0000-0000-000000000000',
    product_id: 'e5555555-5555-5555-5555-555555555555',
    user_id: 'c5d2e3f4-1111-2222-3333-444455556670',
    content: 'Lovely scent and long-lasting burn time.',
    rating: 5
  },
];


 const sellerStories: SellerStory[] = [
  {
    id: '01a7df3e-aaa6-4c78-bc19-d4c0f0028901',
    user_id: '1f5c8b32-1d2a-4d57-9b8a-1e6b0f9a2a01',
    title: 'From Forest to Workshop',
    story:
      'I began woodworking as a way to feel closer to nature. Every piece I create starts as a fallen branch or reclaimed wood. My goal is to give forgotten materials a new life, filled with warmth and personality.',
  },
  {
    id: '02c7af3e-77c9-4f22-b4d1-8b05fbde8902',
    user_id: '2a7f9c21-3e4b-4d67-bc1d-3f8c2a9e7f22',
    title: 'Crafting Leather, Crafting Legacy',
    story:
      'My grandfather taught me the art of leatherwork when I was a child. Today I honor his legacy by creating durable, timeless leather goods using traditional hand-stitching techniques passed down through generations.',
  },
  {
    id: '03b9ce44-ad98-4229-a316-4b2df8f88903',
    user_id: '3c9d7e45-6f8a-4a21-a5d7-9c0e1f2b3d34',
    title: 'Shaping Stories in Stone',
    story:
      'Stone carving began as a hobby during college and quickly became my passion. Each sculpture I make is meant to reflect peace, grounding, and the quiet magic of natural stone.',
  },
  {
    id: '04d844ce-8911-4899-8f2f-31c971b68904',
    user_id: '410544b2-4001-4271-9855-fec4b6a6442a',
    title: 'The Joy of Creating',
    story:
      'I love working with my hands and experimenting with new crafts. My shop is a place to explore creativity, try new ideas, and share my handmade pieces with others.',
  },
];

export { users, products, reviews, sellerStories };