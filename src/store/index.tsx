// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userProfileReducer from "./userProfileSlice";
import farmProfileReducer from "./farmSlice";
import postDataReducer from "./postSlice";

export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
    farmProfiles: farmProfileReducer,
    posts: postDataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
