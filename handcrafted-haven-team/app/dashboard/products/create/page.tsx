// app/dashboard/products/create/page.tsx
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import Breadcrumbs from '@/app/ui/products/breadcrumbs';
import CreateProductForm from '@/app/ui/products/create-form';

export const metadata: Metadata = {
  title: 'Create Product',
};

export default async function CreateProductPage() {
  // Get current user session
  const session = await auth();
  const currentUser = session?.user;

  // Check if user is logged in
  if (!currentUser) {
    redirect('/login');
  }

  // Check if user is a seller (artisan)
  if (currentUser.account_type !== 'artisan') {
    // Non-sellers can't create products
    return (
      <div className="w-full">
        <Breadcrumbs
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Products', href: '/dashboard/products' },
            { label: 'Create Product', href: '/dashboard/products/create', active: true },
          ]}
        />
        
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-6">
              Only sellers can create products. If you'd like to become a seller, please contact support.
            </p>
            <a
              href="/dashboard/products"
              className="text-blue-600 hover:underline"
            >
              Back to Products
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Define breadcrumbs for navigation
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Products', href: '/dashboard/products' },
    { label: 'Create Product', href: '/dashboard/products/create', active: true },
  ];

  return (
    <div className="w-full">
      {/* Breadcrumb navigation */}
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      {/* Page title */}
      <h1 className="mb-6 text-2xl md:text-3xl font-semibold">Create Product</h1>

      {/* Form */}
      <CreateProductForm />
    </div>
  );
}