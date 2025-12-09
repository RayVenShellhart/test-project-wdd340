'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { generatePagination } from '@/app/lib/utils';

interface SellersPaginationProps {
  totalPages: number;
}

export default function SellersPagination({ totalPages }: SellersPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1; // read from URL

  const createPageURL = (pageNumber: number | string) => {
    if (pageNumber === '...') return '#'; // ellipsis is non-clickable
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <div className="inline-flex items-center">
      {/* Left Arrow */}
      <PaginationArrow
        direction="left"
        href={createPageURL(currentPage - 1)}
        isDisabled={currentPage <= 1}
      />

      {/* Page Numbers */}
      <div className="flex -space-x-px">
        {allPages.map((page, index) => {
          const position =
            allPages.length === 1
              ? 'single'
              : index === 0
              ? 'first'
              : index === allPages.length - 1
              ? 'last'
              : page === '...'
              ? 'middle'
              : 'middle';

          const isActive = typeof page === 'number' && currentPage === page;

          return (
            <PaginationNumber
              key={`${page}-${index}`}
              page={page}
              href={createPageURL(page)}
              position={position}
              isActive={isActive}
            />
          );
        })}
      </div>

      {/* Right Arrow */}
      <PaginationArrow
        direction="right"
        href={createPageURL(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
      />
    </div>
  );
}

interface PaginationNumberProps {
  page: number | string;
  href: string;
  isActive: boolean;
  position?: 'first' | 'last' | 'middle' | 'single';
}

function PaginationNumber({ page, href, isActive, position }: PaginationNumberProps) {
  const className = clsx(
    'flex h-10 w-10 items-center justify-center text-sm border',
    {
      'rounded-l-md': position === 'first' || position === 'single',
      'rounded-r-md': position === 'last' || position === 'single',
      'z-10 bg-[#ffb703] border-[#ffb703] text-[#333333]': isActive,
      'hover:bg-gray-100': !isActive && page !== '...',
      'text-gray-300 cursor-default': page === '...',
    }
  );

  if (page === '...') {
    return <div className={className}>{page}</div>;
  }

  return (
    <Link href={href} className={className}>
      {page}
    </Link>
  );
}

interface PaginationArrowProps {
  href: string;
  direction: 'left' | 'right';
  isDisabled?: boolean;
}

function PaginationArrow({ href, direction, isDisabled }: PaginationArrowProps) {
  const className = clsx(
    'flex h-10 w-10 items-center justify-center rounded-md border',
    {
      'pointer-events-none text-gray-300': isDisabled,
      'hover:bg-gray-100': !isDisabled,
      'mr-2 md:mr-4': direction === 'left',
      'ml-2 md:ml-4': direction === 'right',
    }
  );

  const icon = direction === 'left' ? <ArrowLeftIcon className="w-4" /> : <ArrowRightIcon className="w-4" />;

  return isDisabled ? <div className={className}>{icon}</div> : <Link href={href} className={className}>{icon}</Link>;
}
