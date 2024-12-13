import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer';
import api from '@/lib/api';
import axios from 'axios';
import { RatingSchema } from './type/profileSchema';

export interface RatingInput {
  farmer_rating: number;
  review?: string;
}

export interface IUserProfile {
  _id: string;
  userId: string;
  email: string;
  fullName: string;
  username: string;
  profilePicture?: string;
  bio?: string;
  gender: 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say';
  phoneNumber: string;
  country: string;
  socialMediaLinks?: {
    twitter?: string | null;
    facebook?: string | null;
    instagram?: string | null;
    linkedIn?: string | null;
  };
  // Identity card details
  identityCardType?: string;
  identityCardNumber?: string;
  ratings?: RatingInput[] | undefined;
  verified?: boolean;
  role: 'Farmer' | 'Buyer';
}

// Modify the UserProfileState interface
interface UserProfileState {
  profile: IUserProfile | null;
  profiles: IUserProfile[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

// Update initial state
const initialState: UserProfileState = {
  profile: null,
  profiles: [],
  loading: 'idle',
  error: null,
};

interface FetchProfilesParams {
  userId?: string;
}

export const fetchUserProfile = createAsyncThunk(
  'userProfile/fetchUserProfile',
  async (params: FetchProfilesParams = {}, { rejectWithValue }) => {
    try {
      const url = params.userId 
        ? `/api/profileApi?userId=${params.userId}` 
        : '/api/profileApi';

      const response = await axios.get(url);

      // Check for different possible response structures
      if (!response.data) {
        return rejectWithValue('No data received from the API');
      }

      // Check if the response is an array or a single profile
      const profileData = Array.isArray(response.data) 
        ? response.data 
        : response.data.userProfile || response.data.profile || response.data;

      // Validate the profile data
      if (!profileData) {
        return rejectWithValue('Could not extract profile data from response');
      }

      return profileData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('API Error:', error.response?.data);
        return rejectWithValue(error.response?.data || 'Error fetching user profiles');
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const fetchUserProfileById = createAsyncThunk(
  'userProfiles/fetchUserProfileById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/profileApi/${id}`);
      
      // Verify data structure
      if (!response.data) {
        return rejectWithValue('No profile found');
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return rejectWithValue('profile not found');
        }
        
        return rejectWithValue(
          error.response?.data?.message || 
          'Error fetching profile by ID'
        );
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const createUserProfile = createAsyncThunk(
  'userProfile/createUserProfile',
  async (profileData: Partial<IUserProfile>, { rejectWithValue }) => {
    try {
      const response = await api.post('/profileApi', profileData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to create profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'userProfile/updateUserProfile',
  async (profileData: Partial<IUserProfile>, { rejectWithValue }) => {
    try {
      const response = await api.put('/profileApi', profileData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to update profile');
    }
  }
);

// Add Rating to a Farm Profile
export const addRatingToPost = createAsyncThunk(
  'userProfile/addRating',
  async ({ id, rating }: { id: string, rating: RatingInput }, { rejectWithValue }) => {
    try {
      // Validate rating using Zod schema before sending
      const validatedRating = RatingSchema.parse(rating);
      
      const response = await axios.post(`/api/profileApi/${id}`, validatedRating);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred while adding rating');
    }
  }
);

export const updateProfilePicture = createAsyncThunk(
  'userProfile/updateProfilePicture',
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      const response = await api.patch('/profileApi', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to update profile picture');
    }
  }
);

export const deleteUserProfile = createAsyncThunk(
  'userProfile/deleteUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete('/profileApi');
      return null;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to delete profile');
    }
  }
);

// Create the slice
const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    resetProfileState: (state) => {
      state.profile = null;
      state.loading = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profiles
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        // Check if the response is an array or a single profile
        if (Array.isArray(action.payload)) {
          state.profiles = action.payload;
        } else {
          // If it's a single profile, wrap it in an array or set it accordingly
          state.profiles = action.payload ? [action.payload] : [];
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = 'failed';
        state.profiles = []; // Clear profiles on error
        state.error = action.payload as string;
        if (action.payload === 'Unauthorized: Please log in again') {
          state.profile = null;
        }
      })
      // Other cases remain the same as in the original slice...
      .addCase(createUserProfile.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(createUserProfile.fulfilled, (state, action: PayloadAction<IUserProfile>) => {
        state.loading = 'succeeded';
        state.profile = { ...action.payload } as WritableDraft<IUserProfile>;
        // Optionally add the new profile to the profiles array
        state.profiles.push(action.payload);
      })
      .addCase(createUserProfile.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })
      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<IUserProfile>) => {
        state.loading = 'succeeded';
        state.profile = { ...action.payload } as WritableDraft<IUserProfile>;
        // Update the profile in the profiles array if it exists
        const index = state.profiles.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.profiles[index] = action.payload;
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })
      // Delete profile
      .addCase(deleteUserProfile.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(deleteUserProfile.fulfilled, (state) => {
        state.loading = 'succeeded';
        state.profile = null;
        state.profiles = []; // Clear all profiles
      })
      .addCase(deleteUserProfile.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateProfilePicture.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(updateProfilePicture.fulfilled, (state, action: PayloadAction<{ profilePictureUrl: string }>) => {
        state.loading = 'succeeded';
        if (state.profile) {
          state.profile.profilePicture = action.payload.profilePictureUrl;
          // Also update the profile picture in the profiles array
          const index = state.profiles.findIndex(p => p._id === state.profile?._id);
          if (index !== -1 && state.profile) {
            state.profiles[index].profilePicture = state.profile.profilePicture;
          }
        }
      })
      builder
  .addCase(addRatingToPost.pending, (state) => {
    state.loading = 'pending';
    state.error = null;
  })
  .addCase(addRatingToPost.fulfilled, (state, action) => {
    state.loading = 'succeeded';
    if ('_id' in action.payload) {
      const index = state.profiles.findIndex(profile => profile._id === action.payload._id);
      if (index !== -1) {
        state.profiles[index] = action.payload;
      }
    }
  })
  .addCase(addRatingToPost.rejected, (state, action) => {
    state.loading = 'failed';
    state.error = action.payload as string;
  })
      .addCase(updateProfilePicture.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { resetProfileState } = userProfileSlice.actions;

export default userProfileSlice.reducer;