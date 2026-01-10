import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axios";

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface UserState {
    data: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    data: null,
    loading: false,
    error: null,
};

/* ✅ FETCH LOGGED-IN USER */
export const fetchUser = createAsyncThunk(
    "user/fetch",
    async () => {
        const res = await api.get("/users/me");
        return res.data;
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearUser: (state) => {
            state.data = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(fetchUser.rejected, (state) => {
                state.loading = false;
                state.error = "Failed to load user";
            });
    },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
