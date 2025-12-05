import Image from 'next/image';
import Link from 'next/link';
import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredInvoices } from '@/app/lib/data';

export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const invoices = await fetchFilteredInvoices(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile View */}
          <div className="md:hidden">
            {invoices?.map((invoice) => (
              <div
                key={invoice.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <Link
                  href={`/dashboard/products/${invoice.id}`}
                  className="block w-full"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="mb-2 flex items-center">
                      <Image
                        src={invoice.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${invoice.name}'s profile picture`}
                      />
                      <p className="font-medium text-gray-900">{invoice.name}</p>
                    </div>
                    <InvoiceStatus status={invoice.status} />
                  </div>
                  <div className="pt-4">
                    <p className="text-xl font-medium">
                      {formatCurrency(invoice.amount)}
                    </p>
                    <p>{formatDateToLocal(invoice.date)}</p>
                  </div>
                </Link>
                <div className="flex justify-end gap-2 mt-2">
                  <UpdateInvoice id={invoice.id} />
                  <DeleteInvoice id={invoice.id} />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th className="px-4 py-5 font-medium sm:pl-6">Customer</th>
                <th className="px-3 py-5 font-medium">Email</th>
                <th className="px-3 py-5 font-medium">Amount</th>
                <th className="px-3 py-5 font-medium">Date</th>
                <th className="px-3 py-5 font-medium">Status</th>
                <th className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {invoices?.map((invoice) => (
                <tr key={invoice.id} className="border-b last-of-type:border-none">
                  <td colSpan={6}>
                    <Link
                      href={`/dashboard/products/${invoice.id}`}
                      className="block w-full hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between px-6 py-3">
                        <div className="flex items-center gap-3">
                          <Image
                            src={invoice.image_url}
                            className="rounded-full"
                            width={28}
                            height={28}
                            alt={`${invoice.name}'s profile picture`}
                          />
                          <p className="font-medium text-gray-900">{invoice.name}</p>
                        </div>
                        <div className="hidden md:flex items-center gap-6">
                          <p>{invoice.email}</p>
                          <p>{formatCurrency(invoice.amount)}</p>
                          <p>{formatDateToLocal(invoice.date)}</p>
                          <InvoiceStatus status={invoice.status} />
                        </div>
                      </div>
                    </Link>
                    <div className="flex justify-end gap-3 px-6 py-2">
                      <UpdateInvoice id={invoice.id} />
                      <DeleteInvoice id={invoice.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
