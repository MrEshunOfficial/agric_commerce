import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { 
  FarmProfileData, 
  FarmProfileFormSchema 
} from './type/formtypes';

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

// Async Thunks for API Interactions
interface FetchFarmProfilesParams {
  userId?: string;
}

export const fetchFarmProfiles = createAsyncThunk<
  FarmProfileData[], 
  FetchFarmProfilesParams, 
  { rejectValue: string }
>(
  'farmProfiles/fetchFarmProfiles',
  async (params: FetchFarmProfilesParams = {}, { rejectWithValue }) => {
    try {
      const url = params.userId 
        ? `/api/farmdataapi?userId=${params.userId}`
        : '/api/farmdataapi';

      const response = await axios.get<{ farmProfiles: FarmProfileData[] }>(url);
      
      if (!response.data || !response.data.farmProfiles) {
        return rejectWithValue('Invalid response structure');
      }
      
      return response.data.farmProfiles;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data || 'Error fetching farm profiles'
        );
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const fetchFarmProfileById = createAsyncThunk<
  FarmProfileData, 
  string, 
  { rejectValue: string }
>(
  'farmProfiles/fetchFarmProfileById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<FarmProfileData>(`/api/farmdataapi/${id}`);
      
      if (!response.data) {
        return rejectWithValue('No farm profile found');
      }
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return rejectWithValue('Farm profile not found');
        }
        
        return rejectWithValue(
          error.response?.data?.message || 
          'Error fetching farm profile by ID'
        );
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const createFarmProfile = createAsyncThunk<
  FarmProfileData, 
  FarmProfileData, 
  { rejectValue: string }
>(
  'farmProfiles/createFarmProfile',
  async (profileData: FarmProfileData, { rejectWithValue }) => {
    try {
      // Validate input using Zod schema before sending
      const validationResult = FarmProfileFormSchema.safeParse(profileData);
      
      if (!validationResult.success) {
        return rejectWithValue(
          validationResult.error.errors.map(err => err.message).join(', ')
        );
      }

      const response = await axios.post<FarmProfileData>('/api/farmdataapi', profileData); 
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data || 'Error creating farm profile'
        );
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const updateFarmProfile = createAsyncThunk<
  FarmProfileData, 
  { id: string, profileData: Partial<FarmProfileData> }, 
  { rejectValue: string }
>(
  'farmProfiles/updateFarmProfile',
  async ({ id, profileData }, { rejectWithValue }) => {
    try {
      // Validate partial update using Zod schema
      const validationResult = FarmProfileFormSchema.safeParse(profileData);
      
      if (!validationResult.success) {
        return rejectWithValue(
          validationResult.error.errors.map((err: any) => err.message).join(', ')
        );
      }
      const response = await axios.put<FarmProfileData>(
        `/api/farmdataapi/${id}`, 
        profileData
      );
      return response.data;
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

export const deleteFarmProfile = createAsyncThunk<
  string, 
  string, 
  { rejectValue: string }
>(
  'farmProfiles/deleteFarmProfile',
  async (id: string, { rejectWithValue }) => {
    try {
      console.log('Attempting to delete profile with ID:', id);
      const response = await axios.delete(`/api/farmdataapi/${id}`);
      
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
    setCurrentProfile: (state, action: PayloadAction<FarmProfileData>) => {
      state.currentProfile = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Farm Profiles
      .addCase(fetchFarmProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFarmProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.farmProfiles = action.payload;
      })
      .addCase(fetchFarmProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error fetching farm profiles';
      })
      
      // Create Farm Profile
      .addCase(createFarmProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFarmProfile.fulfilled, (state, action) => {
        state.loading = false;
        
        // Ensure the new profile has an _id
        const newProfile = action.payload;
        if (newProfile && !newProfile._id) {
          newProfile._id;
        }
        
        state.farmProfiles.push(newProfile);
        state.currentProfile = newProfile;
      })
      .addCase(createFarmProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error creating farm profile';
      })
      
      // Update Farm Profile
      .addCase(updateFarmProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFarmProfile.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.farmProfiles.findIndex(profile => 
          profile._id === action.payload._id
        );
        
        if (index !== -1) {
          state.farmProfiles[index] = action.payload;
        }
        
        state.currentProfile = action.payload;
      })
      .addCase(updateFarmProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error updating farm profile';
      })
      
      // Delete Farm Profile
      .addCase(deleteFarmProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFarmProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.farmProfiles = state.farmProfiles.filter(profile => 
          profile._id !== action.payload
        );
        
        if (state.currentProfile && state.currentProfile._id === action.payload) {
          state.currentProfile = null;
        }
        
        if (state.farmProfiles.length > 0) {
          state.currentProfile = state.farmProfiles[state.farmProfiles.length - 1];
        }
      })
      .addCase(deleteFarmProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error deleting farm profile';
      });
  }
});

export const { 
  clearCurrentProfile, 
  clearError, 
  setCurrentProfile 
} = farmProfileSlice.actions;

export default farmProfileSlice.reducer;