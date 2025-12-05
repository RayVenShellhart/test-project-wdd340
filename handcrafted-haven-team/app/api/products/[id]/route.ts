import { NextResponse } from "next/server";
import postgres from "postgres";

// Ensure connection string exists
const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  throw new Error("POSTGRES_URL is not defined in environment variables.");
}

const sql = postgres(connectionString, { ssl: "require" });

// ⭐ Next.js 16 requires params to be awaited because it's a Promise
type ParamsPromise = Promise<{ id: string }>;

// GET /api/products/:id  → fetch product with reviews
export async function GET(
  req: Request,
  context: { params: ParamsPromise }
) {
  // ⭐ FIXED: must await context.params
  const { id } = await context.params;

  try {
    const [product] = await sql`
      SELECT id, name, image_url, price, description
      FROM products
      WHERE id = ${id}
      LIMIT 1
    `;

    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const reviews = await sql<{
      id: string;
      content: string;
      user_id: string;
      user_name: string;
    }[]>`
      SELECT r.id, r.content, r.user_id, u.name AS user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ${id}
      ORDER BY r.id DESC
    `;

    const result = {
      ...product,
      price: product.price / 100,
      reviews,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("GET /api/products/:id error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/products/:id  → submit review
export async function POST(
  req: Request,
  context: { params: ParamsPromise }
) {
  // ⭐ FIXED: same required change
  const { id } = await context.params;

  try {
    const body = await req.json();
    const { content, userId } = body;

    if (!userId || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const [review] = await sql`
      INSERT INTO reviews (product_id, user_id, content)
      VALUES (${id}, ${userId}, ${content})
      RETURNING id, product_id, user_id, content
    `;

    const [user] = await sql`
      SELECT name FROM users WHERE id = ${userId}
    `;

    return NextResponse.json({
      ...review,
      user_name: user?.name ?? "Unknown User",
    });
  } catch (err) {
    console.error("POST /api/products/:id error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
