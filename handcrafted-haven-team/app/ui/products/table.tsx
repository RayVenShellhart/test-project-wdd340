// app/ui/products/table.tsx
import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@/auth'; // Adjust based on your auth setup
import { fetchFilteredProducts } from '@/app/lib/data';
import { FormattedProductsTable } from '@/app/lib/definitions';
import { UpdateProduct, DeleteProduct } from './buttons';

export default async function ProductsTable({
  query = '',
  category = '',
  minPrice = '',
  maxPrice = '',
  currentPage = 1,
}: {
  query?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  currentPage?: number;
}) {
  // Get current user session
  const session = await auth();
  const currentUserId = session?.user?.id;

  const products: FormattedProductsTable[] = await fetchFilteredProducts(
    query,
    category,
    minPrice,
    maxPrice,
    currentPage
  );
  
  return (
    <div className="mt-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">

            {/* Mobile view */}
            <div className="md:hidden">
              {products?.length === 0 ? (
                <p className="text-gray-500 py-4">No products found.</p>
              ) : (
                products.map((product) => {
                  const isOwner = currentUserId === product.seller_id;
                  
                  return (
                    <div
                      key={product.id}
                      className="mb-2 w-full rounded-md bg-white p-4 hover:shadow-sm transition-shadow"
                    >
                      <Link
                        href={`/dashboard/products/${product.id}`}
                        className="block w-full"
                      >
                        <div className="flex items-center justify-between border-b pb-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-7 w-7">
                              <Image
                                src={product.image_url}
                                className="rounded-full object-cover"
                                alt={`${product.name} product image`}
                                fill
                                sizes="28px"
                              />
                            </div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                          </div>
                        </div>
                        <div className="pt-4">
                          <p className="text-xs">Price</p>
                          <p className="font-medium">${product.price.toFixed(2)}</p>
                        </div>
                      </Link>
                      {isOwner && (
                        <div className="flex justify-end gap-2 mt-2">
                          <UpdateProduct id={product.id} />
                          <DeleteProduct id={product.id} />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Desktop table */}
            <table className="hidden min-w-full text-gray-900 md:table">
              <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                <tr>
                  <th className="px-4 py-5 font-medium sm:pl-6">Name</th>
                  <th className="px-3 py-5 font-medium">Price</th>
                  <th className="relative py-3 pl-6 pr-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-900">
                {products?.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-gray-500">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const isOwner = currentUserId === product.seller_id;
                    
                    return (
                      <tr key={product.id} className="border-b last-of-type:border-none">
                        {/* Content Cells */}
                        <td colSpan={2} className="whitespace-nowrap bg-white">
                          <Link 
                            href={`/dashboard/products/${product.id}`} 
                            className="flex items-center gap-3 px-4 py-5 sm:pl-6 hover:bg-gray-100 transition-colors rounded-md"
                          >
                            <div className="relative h-7 w-7 flex-shrink-0">
                              <Image
                                src={product.image_url}
                                className="rounded-full object-cover"
                                alt={`${product.name} product image`}
                                fill
                                sizes="28px"
                              />
                            </div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <span className="ml-6 font-medium">${product.price.toFixed(2)}</span>
                          </Link>
                        </td>

                        {/* Action Buttons - Only show if user is the owner */}
                        <td className="whitespace-nowrap py-5 pl-6 pr-3">
                          {isOwner && (
                            <div className="flex justify-end gap-3">
                              <UpdateProduct id={product.id} />
                              <DeleteProduct id={product.id} />
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </div>
  );
}