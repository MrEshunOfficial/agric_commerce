import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { PostData } from './type/post.types';


// Initial State Interface
interface PostDataState {
  posts: PostData[];
  currentFarmProfile: PostData | null;
  loading: boolean;
  error: string | null;
  total: number;
}

// Initial State
const initialState: PostDataState = {
  posts: [],
  currentFarmProfile: null,
  loading: false,
  error: null,
  total: 0
};

// CREATE Farm Profile
export const postNewAd = createAsyncThunk(
  'farmProfile/create',
  async (farmProfileData: PostData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/posts.api', farmProfileData);
      return response.data.farmProfile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

interface FetchFarmProfilesParams {
  userId?: string;
}

// READ All Farm Profiles
export const fetchPostedAds = createAsyncThunk(
  'farmProfile/fetchAll',
  async (userId: FetchFarmProfilesParams = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/posts.api', { 
        params: userId ? { userId } : {} 
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// READ Single Farm Profile
export const fetchSinglePost = createAsyncThunk(
  'farmProfile/fetchSingle',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/posts.api/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// UPDATE Farm Profile (Partial)
export const updatePosts = createAsyncThunk(
  'farmProfile/update',
  async ({ id, data }: { id: string, data: Partial<PostData> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/posts.api/${id}`, data); // Changed from .patch to .put
      return response.data.farmProfile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// DELETE Farm Profile
export const deleteAdPost = createAsyncThunk(
  'farmProfile/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/posts.api/${id}`);
      return response.data.deletedProfile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Add Tags to a Farm Profile
export const addTagsToPost = createAsyncThunk(
  'farmProfile/addTags',
  async ({ id, tags }: { id: string, tags: string[] }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/posts.api/${id}`, { tags });
      return response.data.farmProfile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred while adding tags');
    }
  }
);

// Toggle Boolean Flags
export const togglePostFlag = createAsyncThunk(
  'farmProfile/toggleFlag',
  async ({ 
    id, 
    flag 
  }: { 
    id: string,
    flag: 'pinned' | 'favorite' | 'wishlist' 
  }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/posts.api/${id}`, { flag });
      return response.data.farmProfile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || `An error occurred while toggling ${flag}`);
    }
  }
);


const postDataSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    resetCurrentFarmProfile: (state) => {
      state.currentFarmProfile = null;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(postNewAd.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(postNewAd.fulfilled, (state, action) => {
      state.loading = false;
      state.posts.push(action.payload);
      state.currentFarmProfile = action.payload;
    });
    builder.addCase(postNewAd.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(fetchPostedAds.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPostedAds.fulfilled, (state, action) => {
      state.loading = false;
      state.posts = action.payload.postData;
      state.total = action.payload.total;
    });
    builder.addCase(fetchPostedAds.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(fetchSinglePost.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSinglePost.fulfilled, (state, action) => {
      state.loading = false;
      state.currentFarmProfile = action.payload;
    });
    builder.addCase(fetchSinglePost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(updatePosts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updatePosts.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.posts.findIndex(profile => profile._id === action.payload._id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
      state.currentFarmProfile = action.payload;
    });
    builder.addCase(updatePosts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(deleteAdPost.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteAdPost.fulfilled, (state, action) => {
      state.loading = false;
      state.posts = state.posts.filter(profile => profile._id !== action.payload._id);
      state.currentFarmProfile = null;
      state.total -= 1;
    });
    builder.addCase(deleteAdPost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(addTagsToPost.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addTagsToPost.fulfilled, (state, action) => {
      state.loading = false;
      
      const index = state.posts.findIndex(post => post._id === action.payload._id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
      
      state.currentFarmProfile = action.payload;
    });
    builder.addCase(addTagsToPost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(togglePostFlag.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(togglePostFlag.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.posts.findIndex(post => post._id === action.payload._id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
      state.currentFarmProfile = action.payload;
    });
    builder.addCase(togglePostFlag.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  
  }
});

// Selectors
export const selectPinnedPosts = (state: { posts: PostDataState }) => 
  state.posts.posts.filter(post => post.pinned);

export const selectFavoritePosts = (state: { posts: PostDataState }) => 
  state.posts.posts.filter(post => post.favorite);

export const selectWishlistPosts = (state: { posts: PostDataState }) => 
  state.posts.posts.filter(post => post.wishlist);

// Export actions and reducer
export const { resetCurrentFarmProfile, setError } = postDataSlice.actions;
export default postDataSlice.reducer;