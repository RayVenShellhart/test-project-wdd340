// app/api/seed/route.ts (or wherever your seed file is)
// cSpell:ignore handcraftedhaven

import bcryptjs from 'bcryptjs'; // Changed from bcrypt
import postgres from 'postgres';
import { users, products, reviews, sellerStories } from '../../lib/placeholder-data-handcraftedhaven';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// ------------------------------
// Seed Users
// ------------------------------
async function seedUsers() {
  console.log("🔄 Seeding users...");

  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      account_type TEXT NOT NULL CHECK (account_type IN ('artisan', 'customer'))
    );
  `;

  let inserted = 0;

  for (const user of users) {
    const hashedPassword = await bcryptjs.hash(user.password, 10);
    const result = await sql`
      INSERT INTO users (id, name, email, password, account_type)
      VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword}, ${user.account_type})
      ON CONFLICT (email) DO NOTHING;
    `;
    inserted += result.count;
  }

  console.log(`✅ Users seeding complete. Inserted: ${inserted}`);
  return inserted;
}

// ------------------------------
// Seed Products
// ------------------------------
async function seedProducts() {
  console.log("🔄 Seeding products...");

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name TEXT NOT NULL,
      image_url TEXT NOT NULL,
      price INT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      seller_id UUID REFERENCES users(id)
    );
  `;

  let inserted = 0;

  for (const product of products) {
    // Ensure all fields are defined
    const { id, name, image_url, price, description, category, seller_id } = product;
    
    const result = await sql`
      INSERT INTO products (id, name, image_url, price, description, category, seller_id)
      VALUES (${id}, ${name}, ${image_url}, ${price}, ${description}, ${category}, ${seller_id})
      ON CONFLICT (id) DO NOTHING;
    `;
    inserted += result.count;
  }

  console.log(`✅ Products seeding complete. Inserted: ${inserted}`);
  return inserted;
}

// ------------------------------
// Seed Reviews
// ------------------------------
async function seedReviews() {
  console.log("🔄 Seeding reviews...");

  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      product_id UUID REFERENCES products(id),
      user_id UUID REFERENCES users(id),
      content TEXT NOT NULL
    );
  `;

  let inserted = 0;

  for (const review of reviews) {
    const result = await sql`
      INSERT INTO reviews (id, product_id, user_id, content)
      VALUES (${review.id}, ${review.product_id}, ${review.user_id}, ${review.content})
      ON CONFLICT (id) DO NOTHING;
    `;
    inserted += result.count;
  }

  console.log(`✅ Reviews seeding complete. Inserted: ${inserted}`);
  return inserted;
}

// ------------------------------
// Seed Seller Stories
// ------------------------------
async function seedSellerStories() {
  console.log("🔄 Seeding seller stories...");

  await sql`
    CREATE TABLE IF NOT EXISTS seller_stories (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID REFERENCES users(id),
      title TEXT NOT NULL,
      story TEXT NOT NULL
    );
  `;

  let inserted = 0;

  for (const story of sellerStories) {
    const result = await sql`
      INSERT INTO seller_stories (id, user_id, title, story)
      VALUES (${story.id}, ${story.user_id}, ${story.title}, ${story.story})
      ON CONFLICT (id) DO NOTHING;
    `;
    inserted += result.count;
  }

  console.log(`✅ Seller stories seeding complete. Inserted: ${inserted}`);
  return inserted;
}


// ------------------------------
// Seed All Data
// ------------------------------
export async function GET() {
  const logs: string[] = [];

  // Monkey-patch console.log so we can capture logs
  const originalLog = console.log;
  console.log = (msg: any) => {
    logs.push(String(msg));
    originalLog(msg);
  };

  try {
    console.log("🚀 Starting database seed...");

    const usersInserted = await seedUsers();
    const productsInserted = await seedProducts();
    const reviewsInserted = await seedReviews();
    const sellerStoriesInserted = await seedSellerStories();


    console.log("🎉 Seed complete!");

    return Response.json({
      message: "Database seeded!",
      usersInserted,
      productsInserted,
      reviewsInserted,
      sellerStoriesInserted,
      logs
    });
  } catch (error: any) {
    console.log("❌ Error during seed:");
    console.log(error);

    return Response.json(
      { error: error.message, logs },
      { status: 500 }
    );
  } finally {
    console.log = originalLog; // restore console.log
  }
}