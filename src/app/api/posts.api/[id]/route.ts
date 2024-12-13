import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbconfigue/dbConfigue';
import { z } from 'zod';
import { auth } from '@/auth';
import AdPostModel from '@/models/post.model/post.model';
import { FarmSchema } from '@/store/type/post.types';

function handleError(error: unknown): NextResponse {
  console.error('API Error:', error);
  
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: 'Invalid data', details: error.errors },
      { status: 400 }
    );
  }
  
  return NextResponse.json(
    { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
    { status: 500 }
  );
}

// PATCH: Partially update an existing farm profile
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connect();
    const session = await auth();

    if (!session?.user?.email || !session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { flag } = await req.json();

    // Validate the flag is a valid operation
    const validFlags = ['pinned', 'favorite', 'wishlist', 'verified'];
    if (!validFlags.includes(flag)) {
      return NextResponse.json({ error: 'Invalid flag' }, { status: 400 });
    }

    // Remove the userId check to allow any user to toggle flags
    const updatedProfile = await AdPostModel.findOneAndUpdate(
      { _id: params.id },
      {
        $set: {
          [flag]: !(await AdPostModel.findById(params.id))[flag],
          updatedAt: new Date()
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedProfile) {
      return NextResponse.json({ error: 'Farm profile not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: `${flag} flag toggled successfully`,
      farmProfile: updatedProfile
    });
  } catch (error) {
    return handleError(error);
  }
}

// PUT: Full update of farm profile
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connect();

    const session = await auth();
    
    if (!session?.user?.email || !session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await req.json();
    
    // Validate the update payload
    const validatedData = FarmSchema.parse({
      ...json,
      userId: session.user.id,
      updatedAt: new Date()
    });

    const updatedProfile = await AdPostModel.findOneAndUpdate(
      { 
        _id: params.id, 
        userId: session.user.id 
      },
      { $set: validatedData },
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!updatedProfile) {
      return NextResponse.json({ error: 'Farm profile not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Farm profile updated successfully',
      farmProfile: updatedProfile
    });
  } catch (error) {
    return handleError(error);
  }
}

// GET: Retrieve a specific farm profile
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connect();

    const farmProfile = await AdPostModel.findById(params.id);

    if (!farmProfile) {
      return NextResponse.json({ error: 'Farm profile not found' }, { status: 404 });
    }

    return NextResponse.json(farmProfile);
  } catch (error) {
    return handleError(error);
  }
}

// DELETE: Remove a farm profile
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connect();

    const session = await auth();
    
    if (!session?.user?.email || !session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deletedProfile = await AdPostModel.findOneAndDelete({
      _id: params.id,
      userId: session.user.id
    });

    if (!deletedProfile) {
      return NextResponse.json({ error: 'Farm profile not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Farm profile deleted successfully',
      deletedProfile 
    });
  } catch (error) {
    return handleError(error);
  }
}
