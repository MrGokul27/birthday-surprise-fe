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
    users: User[];
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    data: null,
    users: [],
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

/* ✅ FETCH ALL USERS (Admin) */
export const fetchAllUsers = createAsyncThunk(
    "user/fetchAll",
    async () => {
        const res = await api.get("/users/userDetails");
        return res.data;
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearUser: (state) => {
            state.data = null;
            state.users = [];
        },
    },
    extraReducers: (builder) => {
        builder
            /* logged-in user */
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
            })

            /* all users */
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.users = action.payload;
                state.loading = false;
            })
            .addCase(fetchAllUsers.rejected, (state) => {
                state.loading = false;
                state.error = "Failed to load users";
            });
    },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
