import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbconfigue/dbConfigue';
import { z } from 'zod';
import { auth } from '@/auth';
import { FarmProfileFormSchema } from '@/store/type/formtypes';
import FarmProfile from '@/models/farm.data.model/farm.Data.Model';

function handleError(error: unknown): NextResponse {
  console.error('API Error:', error);
  if (error instanceof z.ZodError) {
    return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
  }
  return NextResponse.json(
    { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
    { status: 500 }
  );
}

// POST: Create a new farm profile
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
      userId
    };

    // Validate the farm profile data
    const validatedData = FarmProfileFormSchema.parse(farmProfileData);

    // Create a new farm profile
    const newFarmProfile = new FarmProfile(validatedData);
    await newFarmProfile.save();

    return NextResponse.json(
      { 
        message: 'Farm profile created successfully', 
        farmProfile: newFarmProfile.toObject() 
      }, 
      { status: 201 }
    );

  } catch (error) {
    return handleError(error);
  }
}

// GET: Retrieve farm profiles 
export async function GET(req: NextRequest) {
  try {
    // Ensure database connection
    await connect();
    
    // Check if a specific user ID is requested in the query parameters
    const { searchParams } = new URL(req.url);
    const specificUserId = searchParams.get('userId');

    // Authenticate the session (optional, depends on your authorization requirements)
    const session = await auth();
    const currentUserId = session?.user?.id;

    // Determine query conditions
    const queryConditions = specificUserId 
      ? { userId: specificUserId }
      : {}; 

    if (!specificUserId && !currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch farm profiles based on conditions
    const farmProfiles = await FarmProfile.find(queryConditions).select('-__v').lean();

    return NextResponse.json(
      { 
        farmProfiles,
        total: farmProfiles.length
      }, 
      { status: 200 }
    );

  } catch (error) {
    return handleError(error);
  }
}