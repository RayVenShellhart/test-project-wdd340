import Form from '@/app/ui/products/edit-form';
import Breadcrumbs from '@/app/ui/products/breadcrumbs';
import { fetchProductById } from '@/app/lib/data';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Edit Product',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  // Get current user session
  const session = await auth();
  const currentUserId = session?.user?.id;

  if (!currentUserId) {
    // Redirect to login if not authenticated
    redirect('/login');
  }

  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  // Check if user is the owner
  if (product.seller_id !== currentUserId) {
    // Return unauthorized page
    return (
      <main>
        <Breadcrumbs
          breadcrumbs={[
            { label: 'Products', href: '/dashboard/products' },
            {
              label: 'Edit Product',
              href: `/dashboard/products/${id}/edit`,
              active: true,
            },
          ]}
        />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Unauthorized
            </h1>
            <p className="text-gray-600 mb-6">
              You don't have permission to edit this product. Only the product owner can make changes.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href={`/dashboard/products/${id}`}
                className="text-blue-600 hover:underline"
              >
                View Product
              </a>
              <a
                href="/dashboard/products"
                className="text-blue-600 hover:underline"
              >
                All Products
              </a>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Products', href: '/dashboard/products' },
          {
            label: 'Edit Product',
            href: `/dashboard/products/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form product={product} />
    </main>
  );
}