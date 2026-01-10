import { configureStore } from "@reduxjs/toolkit";
import birthdayReducer from "./birthdaySlice";
import userReducer from "./userSlice";

export const store = configureStore({
    reducer: {
        birthday: birthdayReducer,
        user: userReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
