// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userProfileReducer from "./userProfileSlice";
import farmProfileReducer from "./farmSlice";

export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
    farmProfiles: farmProfileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
