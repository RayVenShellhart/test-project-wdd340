'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { signIn, auth } from '@/auth';
import { AuthError } from 'next-auth';
import { Review } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// ------------------------------
// HELPER FUNCTION - Check Product Ownership
// ------------------------------
async function checkProductOwnership(productId: string, userId: string): Promise<boolean> {
  const result = await sql`
    SELECT seller_id FROM products WHERE id = ${productId}
  `;
  
  if (result.length === 0) return false;
  
  return result[0].seller_id === userId;
}

// ------------------------------
// PRODUCT SCHEMAS
// ------------------------------
export type ProductState = {
  errors?: {
    name?: string[];
    image_url?: string[];
    price?: string[];
    description?: string[];
    category?: string[];
  };
  message?: string | null;
};

const CreateProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  image_url: z.string().min(1, 'Image URL is required'),
  price: z.coerce.number().min(0, 'Price must be 0 or higher'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
});

const UpdateProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  image_url: z.string().min(1, 'Image URL is required'),
  price: z.coerce.number().min(0, 'Price must be 0 or higher'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
});

// ------------------------------
// CREATE PRODUCT
// ------------------------------
export async function createProduct(prevState: ProductState, formData: FormData) {
  // 1. Authentication
  const session = await auth();
  if (!session?.user?.id) {
    return { message: 'Unauthorized: You must be logged in to create products.' };
  }

  // 2. Validate form data
  const validatedFields = CreateProductSchema.safeParse({
    name: formData.get('name'),
    image_url: formData.get('image_url'),
    price: formData.get('price'),
    description: formData.get('description'),
    category: formData.get('category'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Product.',
    };
  }

  // 3. Extract validated data
  const { name, image_url, price, description, category } = validatedFields.data;

  // 4. price is ALREADY A NUMBER because of z.coerce.number()
  const priceInCents = Math.round(price * 100);

  // 5. Insert into database
  try {
    await sql`
      INSERT INTO products (name, image_url, price, description, category, seller_id)
      VALUES (
        ${name},
        ${image_url},
        ${priceInCents}, 
        ${description},
        ${category},
        ${session.user.id}
      )
    `;
  } catch (error) {
    console.error('Database error creating product:', error);
    return { message: 'Database Error: Failed to Create Product.' };
  }

  // 6. Revalidate and redirect
  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}


// ------------------------------
// UPDATE PRODUCT
// ------------------------------
export async function updateProduct(
  id: string,
  prevState: ProductState,
  formData: FormData,
) {
  // 1. Check authentication
  const session = await auth();
  
  if (!session?.user?.id) {
    return {
      message: 'Unauthorized: You must be logged in to update products.',
    };
  }

  // 2. Check ownership
  const isOwner = await checkProductOwnership(id, session.user.id);
  if (!isOwner) {
    return {
      message: 'Forbidden: You can only update your own products.',
    };
  }

  // 3. Validate fields
  const validatedFields = UpdateProductSchema.safeParse({
    name: formData.get('name'),
    image_url: formData.get('image_url'),
    price: formData.get('price'),
    description: formData.get('description'),
    category: formData.get('category'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Product.',
    };
  }

  const { name, image_url, price, description, category } = validatedFields.data;

  // 4. Convert price to CENTS (multiply by 100)
  const priceInCents = Math.round(price * 100);

  // 5. Update the product
  try {
    await sql`
      UPDATE products
      SET 
        name = ${name}, 
        image_url = ${image_url}, 
        price = ${priceInCents}, 
        description = ${description},
        category = ${category}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Database error updating product:', error);
    return { message: 'Database Error: Failed to Update Product.' };
  }

  // 6. Revalidate and redirect
  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}

// ------------------------------
// DELETE PRODUCT
// ------------------------------
export async function deleteProduct(id: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized: You must be logged in to delete products.');
  }

  const isOwner = await checkProductOwnership(id, session.user.id);
  
  if (!isOwner) {
    throw new Error('Forbidden: You can only delete your own products.');
  }

  try {
    await sql`DELETE FROM products WHERE id = ${id}`;
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw new Error('Database Error: Failed to Delete Product.');
  }
  revalidatePath('/dashboard/products');
}


// ------------------------------
// AUTHENTICATE
// ------------------------------
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: formData.get('redirectTo') as string || '/dashboard',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

// ------------------------------
// SUBMIT REVIEW
// ------------------------------
export async function submitReview(
  productId: string,
  content: string,
  userId: string,
  rating: number
): Promise<Review & { user_name: string }> {
  try {
    const [review] = await sql<Review[]>`
      INSERT INTO reviews (product_id, user_id, content, rating)
      VALUES (${productId}, ${userId}, ${content}, ${rating})
      RETURNING id, product_id, user_id, content, rating;
    `;

    const [user] = await sql<{ name: string }[]>`
      SELECT name FROM users WHERE id = ${userId};
    `;

    return {
      ...review,
      user_name: user?.name || `User ${userId}`,
    };
  } catch (error) {
    console.error('Failed to submit review:', error);
    throw new Error('Database Error: Failed to submit review.');
  }
}