// app/dashboard/products/page.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import { auth } from '@/auth';

import { playfairDisplay } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import ProductsTable from '@/app/ui/products/table';
import { ProductsTableSkeleton } from '@/app/ui/skeletons';
import { CreateProduct } from '@/app/ui/products/buttons';
import Pagination from '@/app/ui/products/pagination';
import { fetchProductsPages } from '@/app/lib/data';

export const metadata: Metadata = {
  title: 'Products',
};

export default async function ProductsPage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}) {

  const searchParams = await props.searchParams;

  // Get current user session
  const session = await auth();
  const currentUser = session?.user;
  
  // Check if user is a seller (artisan)
  const isSeller = currentUser?.account_type === 'artisan';

  // Existing
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  // NEW — add filter params here
  const category = searchParams?.category || '';
  const minPrice = searchParams?.minPrice || '';
  const maxPrice = searchParams?.maxPrice || '';

  const totalPages = await fetchProductsPages(query);

  return (
    <div className="w-full">

      {/* Page Title */}
      <div className="flex w-full items-center justify-between">
        <h1 className={`${playfairDisplay.className} text-2xl`}>Products</h1>
      </div>

      {/* Search + Add Product (only show button to sellers) */}
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search products..." />
        {isSeller && <CreateProduct />}
      </div>

      {/* Filter Form */}
      <form
        className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl"
        action="/dashboard/products"
        method="get"
      >
        {/* Category Filter */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            defaultValue={category}
            className="rounded-md border border-gray-300 p-2"
          >
            <option value="">All</option>
            <option value="jewelry">Jewelry</option>
            <option value="art">Art</option>
            <option value="home">Home Decor</option>
            <option value="clothing">Clothing</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Min Price */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Min Price</label>
          <input
            type="number"
            name="minPrice"
            defaultValue={minPrice}
            placeholder="0"
            className="rounded-md border border-gray-300 p-2"
            min="0"
          />
        </div>

        {/* Max Price */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Max Price</label>
          <input
            type="number"
            name="maxPrice"
            defaultValue={maxPrice}
            placeholder="999"
            className="rounded-md border border-gray-300 p-2"
            min="0"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-[#ffb703] text-[#333333] hover:text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Apply Filters
          </button>
        </div>
      </form>

      {/* TABLE + Pagination */}
      <Suspense
        key={query + currentPage + category + minPrice + maxPrice}
        fallback={<ProductsTableSkeleton />}
      >
        <ProductsTable
          query={query}
          currentPage={currentPage}
          category={category}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>

      

    </div>
  );
}