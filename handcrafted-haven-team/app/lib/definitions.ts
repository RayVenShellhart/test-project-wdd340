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

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
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

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
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

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
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

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

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
  // Add any other fields you need
};

export type FormattedReviewsTable = {
  id: string;
  product_name: string;
  user_name: string;
  content: string;
  // Add any other formatted fields
};
