import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbconfigue/dbConfigue';
import { z } from 'zod';
import { auth } from '@/auth';
import FarmModel from '@/models/post.model/post.model';
import { FarmSchema } from '@/store/type/post.types';

function handleError(error: unknown): NextResponse {
  console.error('API Error:', error);
  if (error instanceof z.ZodError) {
    return NextResponse.json({ 
      error: 'Invalid data', 
      details: error.errors 
    }, { status: 400 });
  }
  return NextResponse.json( 
    { error: error instanceof Error ? error.message : 'An unexpected error occurred' }, 
    { status: 500 } 
  );
}

// POST: Create a new post
export async function POST(req: NextRequest) {
  try {
    // Ensure database connection
    await connect();

    // Authenticate the user
    const session = await auth();
    const userEmail = session?.user?.email;
    const userId = session?.user?.id;

    if (!userEmail || !userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the request body
    const body = await req.json();

    // Add userId to the body for validation and storage
    const farmProfileData = { 
      ...body, 
      userId,
      posted_at: new Date()
    };

    // Validate the farm profile data using Zod
    const validatedData = FarmSchema.parse(farmProfileData);

    // Create a new post using Mongoose model
    const newPost = new FarmModel(validatedData);
    await newPost.save();

    return NextResponse.json( 
      { 
        message: 'Post created successfully', 
        farmProfile: newPost.toObject() 
      }, 
      { status: 201 } 
    );
  } catch (error) {
    return handleError(error);
  }
}

// GET: Retrieve all posts
export async function GET(req: NextRequest) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const specificUserId = searchParams.get('userId');

    const session = await auth();
    const currentUserId = session?.user?.id;

    const queryConditions = specificUserId ? { userId: specificUserId } : {};

    if (!specificUserId && !currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const postData = await FarmModel.find(queryConditions).select('-__v').lean();

    return NextResponse.json( 
      { 
        postData, 
        total: postData.length 
      }, 
      { status: 200 } 
    );
  } catch (error) {
    return handleError(error);
  }
}