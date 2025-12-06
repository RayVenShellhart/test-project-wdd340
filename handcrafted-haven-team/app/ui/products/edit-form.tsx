'use client';

import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { updateProduct, ProductState } from '@/app/lib/actions';
import { useActionState } from 'react';
import { FormattedProductsTable } from '@/app/lib/definitions';

export default function EditProductForm({
  product,
}: {
  product: FormattedProductsTable;
}) {
  const initialState: ProductState = { message: null, errors: {} };

  const updateProductWithId = updateProduct.bind(null, product.id);
  const [state, formAction] = useActionState(updateProductWithId, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* Product Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Product Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={product.name}
            className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            aria-describedby="name-error"
            required
          />
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={product.description}
            placeholder="Enter product description"
            className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm h-28 resize-none"
            aria-describedby="description-error"
            required
          />
          <div id="description-error" aria-live="polite" aria-atomic="true">
            {state.errors?.description?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Image URL */}
        <div className="mb-4">
          <label htmlFor="image_url" className="mb-2 block text-sm font-medium">
            Image URL
          </label>
          <input
            id="image_url"
            name="image_url"
            type="text"
            defaultValue={product.image_url}
            className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            aria-describedby="image-error"
            required
          />
          <div id="image-error" aria-live="polite" aria-atomic="true">
            {state.errors?.image_url?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Use a relative path like <code>/products/product.jpg</code> or a full URL.
          </p>
        </div>

        {/* Price */}
        <div className="mb-4">
          <label htmlFor="price" className="mb-2 block text-sm font-medium">
            Price
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            defaultValue={product.price}
            className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            aria-describedby="price-error"
            required
          />
          <div id="price-error" aria-live="polite" aria-atomic="true">
            {state.errors?.price?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <label htmlFor="category" className="mb-2 block text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue={product.category}
            className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            aria-describedby="category-error"
            required
          >
            <option value="all">All</option>
            <option value="jewelry">Jewelry</option>
            <option value="art">Art</option>
            <option value="home decor">Home Decor</option>
            <option value="clothing">Clothing</option>
            <option value="other">Other</option>
          </select>
          <div id="category-error" aria-live="polite" aria-atomic="true">
            {state.errors?.category?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

      </div>

      {/* Error Message */}
      {state.message && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{state.message}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/products"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Update Product</Button>
      </div>
    </form>
  );
}