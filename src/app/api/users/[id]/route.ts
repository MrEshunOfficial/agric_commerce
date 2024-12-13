import { NextApiRequest, NextApiResponse } from 'next';
import { UserProfile } from '@/models/profileModel/userProfileModel';
import { connect } from '@/dbconfigue/dbConfigue';



export async function GET(req: NextApiRequest, res: NextApiResponse) {
  // Connect to the database
  await connect();
  try {
    // Check if it's a request for a specific profile or all profiles
    const { userId, username, email } = req.query;

    if (userId) {
      // Fetch profile by userId
      const profile = await UserProfile.findOne({ userId: userId as string });
      if (!profile) {
        return res.status(404).json({ success: false, message: 'Profile not found' });
      }
      return res.status(200).json({ success: true, data: profile });
    } 
    
    if (username) {
      // Fetch profile by username
      const profile = await UserProfile.findOne({ username: username as string });
      if (!profile) {
        return res.status(404).json({ success: false, message: 'Profile not found' });
      }
      return res.status(200).json({ success: true, data: profile });
    }
    
    if (email) {
      // Fetch profile by email
      const profile = await UserProfile.findOne({ email: email as string });
      if (!profile) {
        return res.status(404).json({ success: false, message: 'Profile not found' });
      }
      return res.status(200).json({ success: true, data: profile });
    }

    // If no specific identifier, fetch all profiles with pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skipIndex = (page - 1) * limit;

    const profiles = await UserProfile.find({})
      .limit(limit)
      .skip(skipIndex)
      .select('-__v'); // Exclude version key

    const total = await UserProfile.countDocuments({});

    return res.status(200).json({
      success: true,
      data: profiles,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProfiles: total
      }
    });

  } catch (error) {
    return res.status(400).json({ 
      success: false, 
      message: 'Error fetching profiles',
      error: (error as Error).message 
    });
  }
}

// Middleware for connection handling
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb'
    }
  }
};