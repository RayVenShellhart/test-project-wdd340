// app/dashboard/sellers/page.tsx
import { Metadata } from 'next';
import SellersTable from '@/app/ui/sellers/table';
import SellersPagination from '@/app/ui/sellers/pagination';
import { fetchSellersPages, fetchFilteredSellers } from '@/app/lib/data';

export const metadata: Metadata = {
  title: 'Sellers',
};

interface SellersPageProps {
  searchParams?: Promise<{ query?: string; page?: string }>;
}

export default async function SellersPage(props: SellersPageProps) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const query = searchParams.query || '';
  const currentPage = Number(searchParams.page) || 1;

  // Fetch the actual sellers data
  const sellers = await fetchFilteredSellers(query, currentPage);
  
  // Get total pages for pagination
  const totalPages = await fetchSellersPages(query);

  return (
    <div className="w-full">
      {/* Page Title */}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-semibold">Sellers</h1>
      </div>

      {/* Sellers Table - now passing sellers data */}
      <SellersTable sellers={sellers} />

      {/* Pagination */}
      <div className="mt-5 flex w-full justify-center">
        <SellersPagination totalPages={totalPages} />
      </div>
    </div>
  );
}