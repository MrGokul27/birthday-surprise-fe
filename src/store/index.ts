import { configureStore } from "@reduxjs/toolkit";
import birthdayReducer from "./birthdaySlice";

export const store = configureStore({
    reducer: {
        birthday: birthdayReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
