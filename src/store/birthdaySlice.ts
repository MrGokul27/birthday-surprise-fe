import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axios";

export type Birthday = {
    _id: string;
    name: string;
    age: number;
    gender: string;
    relationship: string;
    contact: string;
    dob: string;
    email: string;
};

interface BirthdayState {
    data: Birthday[];
    loading: boolean;
    error: string | null;
}

const initialState: BirthdayState = {
    data: [],
    loading: false,
    error: null,
};

/* FETCH */
export const fetchBirthdays = createAsyncThunk(
    "birthday/fetch",
    async () => {
        const res = await api.get("/birthday");
        return res.data;
    }
);

/* ADD */
export const addBirthday = createAsyncThunk(
    "birthday/add",
    async (payload: Omit<Birthday, "_id">) => {
        const res = await api.post("/birthday", payload);
        return res.data;
    }
);

/* UPDATE */
export const updateBirthday = createAsyncThunk(
    "birthday/update",
    async ({ id, data }: { id: string; data: Partial<Birthday> }) => {
        const res = await api.put(`/birthday/${id}`, data);
        return res.data;
    }
);

/* DELETE */
export const deleteBirthday = createAsyncThunk(
    "birthday/delete",
    async (id: string) => {
        await api.delete(`/birthday/${id}`);
        return id;
    }
);

const birthdaySlice = createSlice({
    name: "birthday",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBirthdays.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(addBirthday.fulfilled, (state, action) => {
                state.data.push(action.payload);
            })
            .addCase(updateBirthday.fulfilled, (state, action) => {
                const index = state.data.findIndex(
                    (b) => b._id === action.payload._id
                );
                if (index !== -1) state.data[index] = action.payload;
            })
            .addCase(deleteBirthday.fulfilled, (state, action) => {
                state.data = state.data.filter((b) => b._id !== action.payload);
            });
    },
});

export default birthdaySlice.reducer;
