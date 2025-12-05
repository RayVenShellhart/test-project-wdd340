// app/api/seller-stories/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/auth'; // Adjust based on your auth setup
import { sql } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';

// POST - Create a new seller story
export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { user_id, title, story } = await request.json();

    // Verify the user is creating a story for themselves
    if (session.user.id !== user_id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only create stories for your own account' },
        { status: 403 }
      );
    }

    // Validate input
    if (!title || !story || title.length > 100 || story.length > 1000) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }

    const id = uuidv4();

    await sql`
      INSERT INTO seller_stories (id, user_id, title, story)
      VALUES (${id}, ${user_id}, ${title}, ${story})
    `;

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    console.error('Failed to create seller story:', error);
    return NextResponse.json(
      { error: 'Failed to create seller story' },
      { status: 500 }
    );
  }
}

// PUT - Update an existing seller story
export async function PUT(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, user_id, title, story } = await request.json();

    // Verify the user is updating their own story
    if (session.user.id !== user_id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only update your own story' },
        { status: 403 }
      );
    }

    // Validate input
    if (!title || !story || title.length > 100 || story.length > 1000) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }

    await sql`
      UPDATE seller_stories
      SET title = ${title}, story = ${story}
      WHERE id = ${id} AND user_id = ${user_id}
    `;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Failed to update seller story:', error);
    return NextResponse.json(
      { error: 'Failed to update seller story' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a seller story
export async function DELETE(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Story ID required' },
        { status: 400 }
      );
    }

    // Delete only if the story belongs to the current user
    await sql`
      DELETE FROM seller_stories
      WHERE id = ${id} AND user_id = ${session.user.id}
    `;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete seller story:', error);
    return NextResponse.json(
      { error: 'Failed to delete seller story' },
      { status: 500 }
    );
  }
}