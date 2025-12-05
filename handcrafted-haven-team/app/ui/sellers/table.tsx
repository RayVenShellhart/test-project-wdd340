// app/ui/sellers/table.tsx
'use client';

import Link from 'next/link';
import { SellerTable } from '@/app/lib/definitions';

interface SellersTableProps {
  sellers: SellerTable[];
}

export default function SellersTable({ sellers }: SellersTableProps) {
  if (sellers.length === 0) {
    return <p className="py-4 text-gray-500">No sellers found.</p>;
  }

  return (
    <div className="mt-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">

            {/* Mobile view */}
            <div className="md:hidden">
              {sellers.map((seller) => (
                <Link
                  key={seller.id}
                  href={`/dashboard/sellers/${seller.id}`}
                  className="block mb-2 w-full rounded-md bg-white p-4 hover:shadow-sm transition-shadow"
                >
                  <p className="font-medium text-gray-900">{seller.name}</p>
                  <p className="text-sm text-gray-500">{seller.email}</p>
                </Link>
              ))}
            </div>

            {/* Desktop table */}
            <table className="hidden min-w-full text-gray-900 md:table">
              <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                <tr>
                  <th className="px-4 py-5 font-medium sm:pl-6">Name</th>
                  <th className="px-3 py-5 font-medium">Email</th>
                  <th className="relative py-3 pl-6 pr-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {sellers.map((seller) => (
                  <tr 
                    key={seller.id} 
                    className="group border-b last-of-type:border-none"
                  >
                    <td className="whitespace-nowrap px-4 py-5 sm:pl-6">
                      <Link
                        href={`/dashboard/sellers/${seller.id}`}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {seller.name}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      {seller.email}
                    </td>
                    <td className="whitespace-nowrap py-5 pl-6 pr-3">
                      <Link
                        href={`/dashboard/sellers/${seller.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </div>
  );
}