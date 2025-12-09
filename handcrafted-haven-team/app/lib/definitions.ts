// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  account_type: 'artisan' | 'customer';
};

export type SellerTable = {
  id: string;
  name: string;
  email: string;
};

export interface SellerStory {
  id: string;
  user_id: string;
  title: string;
  story: string;
}

export type Product = {
  id: string;
  name: string;
  image_url: string;
  price: number;
  description: string;
  category: string;
  seller_id: string;
};

export type Review = {
  id: string;
  product_id: string; // now references Product.id
  user_id: string;    // now references User.id
  content: string;
  rating: number;
};

export type ProductsTable = {
  id: string;
  name: string;
  image_url: string;
  price: number;
  description: string;
  category: string;
  seller_id: string;
};

export type ProductsTableType = {
  id: string;
  name: string;
  image_url: string;
  price: number;
  description: string;
  category: string;
  seller_id: string;
};

export interface FormattedProductsTable {
  id: string;
  name: string;
  image_url: string;
  price: number;
  description: string;
  category: string;
  seller_id: string;// optional for now
}

export type ProductForm = {
  id: string;
  name: string;
  image_url: string;
  price: number;
  description: string;
  category: string;
  seller_id: string;
};

export type ReviewsTableType = {
  id: string;
  product_id: string;
  user_id: string;
  content: string;
  rating: number;
};

export type FormattedReviewsTable = {
  id: string;
  product_name: string;
  user_name: string;
  content: string;
  rating: number;
};
