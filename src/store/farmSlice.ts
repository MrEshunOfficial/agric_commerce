import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { FarmProfileData, validateFarmProfileForm } from './type/formtypes';

// Initial State Interface
interface FarmProfileState {
  farmProfiles: FarmProfileData[];
  currentProfile: FarmProfileData | null;
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: FarmProfileState = {
  farmProfiles: [],
  currentProfile: null,
  loading: false,
  error: null
};

function generateUniqueId(): string {
  return `farm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Async Thunks for API Interactions
export const fetchFarmProfiles = createAsyncThunk(
  'farmProfiles/fetchFarmProfiles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/farmdataapi');
      // Verify data structure
      if (!response.data || !response.data.farmProfiles) {
        return rejectWithValue('Invalid response structure');
      }
      // Validate each profile in the farmProfiles array
      const validatedProfiles = response.data.farmProfiles.map((profile: unknown) => 
        validateFarmProfileForm(profile)
      );
      
      return validatedProfiles;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || 'Error fetching farm profiles');
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const createFarmProfile = createAsyncThunk(
  'farmProfiles/createFarmProfile',
  async (profileData: FarmProfileData, { rejectWithValue }) => {
    try {
      const validatedProfile = validateFarmProfileForm(profileData);
      const response = await axios.post('/api/farmdataapi', validatedProfile);
      
      // Ensure the response includes an _id
      if (!response.data._id) {
        console.warn('Created profile is missing _id');
        response.data._id = generateUniqueId(); // Fallback ID generation
      }
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || 'Error creating farm profile');
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);


export const updateFarmProfile = createAsyncThunk(
  'farmProfiles/updateFarmProfile',
  async ({ id, profileData }: { id: string, profileData: Partial<FarmProfileData> }, { rejectWithValue }) => {
    try {
      // Validate the profile data before sending
      const validatedProfile = validateFarmProfileForm({
        ...profileData    // Overwrite with new data
      });

      const response = await axios.put(`/api/farmdataapi/${id}`, validatedProfile);
      return response.data; // Adjust based on your actual API response structure
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Update Error Details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });

        return rejectWithValue(
          error.response?.data?.message || 
          'Error updating farm profile'
        );
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const deleteFarmProfile = createAsyncThunk(
  'farmProfiles/deleteFarmProfile',
  async (id: string, { rejectWithValue }) => {
    try {
      console.log('Attempting to delete profile with ID:', id);
      const response = await axios.delete(`/api/farmdataapi/${id}`);
      
      // Add more detailed error handling
      if (response.status !== 200) {
        console.error('Unexpected response status:', response.status);
        return rejectWithValue(`Unexpected status code: ${response.status}`);
      }
      
      return id;
    } catch (error) {
      console.error('Full error object:', error);

      if (axios.isAxiosError(error)) {
        console.error('Detailed Axios Error:', {
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers
        });
        
        // More specific error handling
        if (error.response?.status === 404) {
          return rejectWithValue('Farm profile not found. It may have been already deleted or the ID is incorrect.');
        }
        
        return rejectWithValue(
          error.response?.data?.error || 
          error.response?.data?.message || 
          'Error deleting farm profile'
        );
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Redux Slice
const farmProfileSlice = createSlice({
  name: 'farmProfiles',
  initialState,
  reducers: {
    clearCurrentProfile: (state) => {
      state.currentProfile = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentProfile: (state, action) => {
      state.currentProfile = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Fetch All Profiles
    builder.addCase(fetchFarmProfiles.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchFarmProfiles.fulfilled, (state, action) => {
      state.loading = false;
      state.farmProfiles = action.payload;
    });
    builder.addCase(fetchFarmProfiles.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create Farm Profile
    builder.addCase(createFarmProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
   // In createFarmProfile reducer
    builder.addCase(createFarmProfile.fulfilled, (state, action) => {
      state.loading = false;
      // Ensure the new profile has an _id
      const newProfile = action.payload;
      if (newProfile && !newProfile._id) {
        newProfile._id = newProfile._id || generateUniqueId(); // Add a fallback ID generation
      }
      state.farmProfiles.push(newProfile);
      state.currentProfile = newProfile;
    });
    builder.addCase(createFarmProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Farm Profile
    builder.addCase(updateFarmProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateFarmProfile.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.farmProfiles.findIndex(profile => 
        profile.farmName === action.payload.farmName
      );
      if (index !== -1) {
        state.farmProfiles[index] = action.payload;
      }
      state.currentProfile = action.payload;
    });
    builder.addCase(updateFarmProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete Farm Profile
    builder.addCase(deleteFarmProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteFarmProfile.fulfilled, (state, action) => {
      state.loading = false;
      // Filter out the profile with the matching _id
      state.farmProfiles = state.farmProfiles.filter(profile => 
        profile._id !== action.payload
      );
      
      // If the current profile was deleted, clear it
      if (state.currentProfile && state.currentProfile._id === action.payload) {
        state.currentProfile = null;
      }
      
      // If there are remaining profiles, select the last one
      if (state.farmProfiles.length > 0) {
        state.currentProfile = state.farmProfiles[state.farmProfiles.length - 1];
      }
    });
    builder.addCase(deleteFarmProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  }
});

// Export actions and reducer
export const { clearCurrentProfile, clearError, setCurrentProfile } = farmProfileSlice.actions;
export default farmProfileSlice.reducer;