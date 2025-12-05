import Breadcrumbs from '@/app/ui/products/breadcrumbs';
import ProductDetailsTable from '@/app/ui/products/product-details';
import { fetchProductById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Product Details',
};

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>; // params is a Promise in Next.js 15+
}) {
  // Await the params Promise
  const { id } = await params;

  if (!id) {
    notFound(); // safely handle missing id
  }

  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Products', href: '/dashboard/products' },
          {
            label: 'Product Details',
            href: `/dashboard/products/${id}`,
            active: true,
          },
        ]}
      />
      <ProductDetailsTable product={product} />
    </main>
  );
}