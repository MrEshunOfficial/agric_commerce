import { NextRequest, NextResponse } from 'next/server';
import { UserProfile, IUserProfile } from '@/models/profileModel/userProfileModel';
import { connect } from '@/dbconfigue/dbConfigue';
import { auth } from '@/auth';
import { z } from 'zod'; // Assuming you're using Zod for validation
import { RootFilterQuery } from 'mongoose';

function handleError(error: unknown): NextResponse {
  console.error('API Error:', error);
  return NextResponse.json(
    { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
    { status: 500 }
  );
}

// Create a Zod schema for ratings validation
const RatingSchema = z.object({
  farmer_rating: z.number().min(0, 'Rating cannot be negative').max(5, 'Rating cannot exceed 5'),
  review: z.string().optional()
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const requestingUserId = session?.user?.id;
    if (!requestingUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connect();

    // Extract query parameters for flexible filtering
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const username = searchParams.get('username');
    const email = searchParams.get('email');

    // Build dynamic query object
    const query: Partial<IUserProfile> = {};
    if (userId) query.userId = userId;
    if (username) query.username = username;
    if (email) query.email = email;

    // If no specific filters, return all profiles (or implement pagination)
    const userProfiles = query
      ? await UserProfile.find(query as RootFilterQuery<IUserProfile>).select('-__v')
      : await UserProfile.find().select('-__v');
    if (userProfiles.length === 0) {
      return NextResponse.json({ error: 'No profiles found' }, { status: 404 });
    }

    return NextResponse.json(userProfiles, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(
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

    // Validate the rating input using Zod
    const validatedRating = RatingSchema.parse({
      ...json,
      userId: session.user.id
    });

    // Update the farm profile with the new rating
    const updatedProfile = await UserProfile.findByIdAndUpdate(
      params.id,
      { 
        $push: { 
          ratings: validatedRating 
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
      message: 'Rating added successfully',
      farmProfile: updatedProfile
    });
  } catch (error) {
    return handleError(error);
  }
}