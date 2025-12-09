// cSpell:ignore ILIKE

import postgres from 'postgres';
import {
  Product,
  Review,
  ProductsTable,
  ProductsTableType,
  ProductForm,
  FormattedProductsTable,
  SellerTable,
  SellerStory,
} from './definitions';
import { formatCurrency } from './utils';


const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredProducts(
  query: string,
  category: string,
  minPrice: string,
  maxPrice: string,
  currentPage: number
): Promise<FormattedProductsTable[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // Convert min/max price to cents
  const minPriceInCents = minPrice ? Math.round(parseFloat(minPrice) * 100) : 0;
  const maxPriceInCents = maxPrice ? Math.round(parseFloat(maxPrice) * 100) : 999999999;

  const results = await sql<FormattedProductsTable[]>`
    SELECT
      p.id,
      p.name,
      p.description,
      p.price,
      p.image_url,
      p.category,
      p.seller_id
    FROM products p
    WHERE
      (p.name ILIKE ${'%' + query + '%'} OR p.description ILIKE ${'%' + query + '%'})
      ${category ? sql`AND p.category = ${category}` : sql``}
      AND p.price >= ${minPriceInCents}
      AND p.price <= ${maxPriceInCents}
    LIMIT ${ITEMS_PER_PAGE}
    OFFSET ${offset};
  `;

  return results.map(product => ({
    ...product,
    price: product.price, // convert cents to dollars here
  }));
}


export async function fetchProductsPages(query: string) {
  try {
    const data = await sql<{ count: string }[]>`
      SELECT COUNT(*)
      FROM products
      WHERE
        name ILIKE ${`%${query}%`} OR
        price::text ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of products.');
  }
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const data = await sql`
      SELECT id, name, image_url, price, description
      FROM products
      ORDER BY name ASC
    `;

    // First assert as unknown, then map to Product[]
    const products = (data as unknown as Product[]).map((product) => ({
      ...product,
      price: product.price / 100, // convert cents to dollars
    }));

    return products;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products.');
  }
}

export async function fetchProductById(
  id: string
): Promise<(Product & { reviews: (Review & { user_name: string })[], seller_id: string }) | null> {
  try {
    // Fetch the product - MAKE SURE TO INCLUDE seller_id
    const [product] = await sql<Product[]>`
      SELECT id, name, image_url, price, description, seller_id
      FROM products
      WHERE id = ${id}
      LIMIT 1
    `;

    if (!product) return null;

    // Fetch the reviews for this product with user names AND rating
    const reviewsData = await sql<{
      id: string;
      content: string;
      user_id: string;
      user_name: string;
      rating: number;
    }[]>`
      SELECT r.id, r.content, r.user_id, r.rating, u.name AS user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ${id}
      ORDER BY r.id DESC
    `;

    // Map to Review[] with user_name
    const reviews: (Review & { user_name: string })[] = reviewsData.map(r => ({
      id: r.id,
      product_id: id,
      user_id: r.user_id,
      content: r.content,
      rating: r.rating, 
      user_name: r.user_name,
    }));

    return {
      ...product,
      price: product.price / 100,
      reviews,
      seller_id: product.seller_id, // Make sure this is included
    };
  } catch (error) {
    console.error('Database Error in fetchProductById:', error);
    throw new Error('Failed to fetch product.');
  }
}

// ------------------------------
// Fetch filtered sellers
// ------------------------------
export async function fetchFilteredSellers(
  query: string,
  currentPage: number
): Promise<SellerTable[]> {
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const result = await sql`
    SELECT id, name, email
    FROM users
    WHERE account_type = 'artisan'
      AND (name ILIKE ${'%' + query + '%'} OR email ILIKE ${'%' + query + '%'})
    ORDER BY name
    LIMIT ${limit} OFFSET ${offset};
  `;

  // Convert RowList to array and map to SellerTable
  const rows = Array.from(result);

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
  }));
}

// ------------------------------
// Fetch a single seller by ID
// ------------------------------
export async function fetchSellerById(sellerId: string): Promise<SellerTable | null> {
  const result = await sql`
    SELECT id, name, email
    FROM users
    WHERE id = ${sellerId} AND account_type = 'artisan'
    LIMIT 1;
  `;

  if (!result || result.length === 0) return null;

  // Explicitly cast Row to your type
  const seller: SellerTable = {
    id: result[0].id,
    name: result[0].name,
    email: result[0].email,
  };

  return seller;
}

// ------------------------------
// Fetch products for a specific seller
// ------------------------------
export async function fetchProductsBySeller(
  sellerId: string
): Promise<FormattedProductsTable[]> {
  const result = await sql`
    SELECT id, name, image_url, price, description, category, seller_id
    FROM products
    WHERE seller_id = ${sellerId}
    ORDER BY name;
  `;

  // postgres.js RowList behaves like an array, but TypeScript doesn't see it as one
  const rows = Array.from(result); // convert RowList to array

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    image_url: row.image_url,
    price: row.price,
    description: row.description,
    category: row.category,
    seller_id: row.seller_id, // include required field
  }));
}

// ------------------------------
// Fetch all stories for a specific seller
// ------------------------------
export async function fetchSellerStories(sellerId: string): Promise<SellerStory[]> {
  try {
    const result = await sql`
      SELECT id, user_id, title, story
      FROM seller_stories
      WHERE user_id = ${sellerId}
      ORDER BY id DESC
    `;

    const rows = Array.from(result);

    return rows.map((row) => ({
      id: row.id,
      user_id: row.user_id,
      title: row.title,
      story: row.story,
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch seller stories.');
  }
}

// ------------------------------
// Update the existing fetchSellerStory to return the first story
// (Keep for backward compatibility)
// ------------------------------
export async function fetchSellerStory(sellerId: string): Promise<SellerStory | null> {
  const result = await sql`
    SELECT id, user_id, title, story
    FROM seller_stories
    WHERE user_id = ${sellerId}
    ORDER BY id DESC
    LIMIT 1;
  `;

  if (!result || result.length === 0) return null;

  const story: SellerStory = {
    id: result[0].id,
    user_id: result[0].user_id,
    title: result[0].title,
    story: result[0].story,
  };

  return story;
}

// ------------------------------
// Get total number of seller pages
// ------------------------------
export async function fetchSellersPages(query: string) {
  const limit = 10; // same limit as in your SellersTable

  const result = await sql`
    SELECT COUNT(*) AS count
    FROM users
    WHERE account_type = 'artisan'
      AND (name ILIKE ${'%' + query + '%'} OR email ILIKE ${'%' + query + '%'});
  `;

  // `result[0].count` will be a string, so convert to number
  const totalCount = Number(result[0].count);

  const totalPages = Math.ceil(totalCount / limit);
  return totalPages;
}