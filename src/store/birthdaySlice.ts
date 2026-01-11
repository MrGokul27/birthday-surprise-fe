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
    image?: boolean;
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

/* 🎂 ADD or UPDATE WISH */
export const updateBirthdayWish = createAsyncThunk(
    "birthday/updateWish",
    async (
        { id, wish }: { id: string; wish: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await api.patch(`/birthday/${id}/wish`, { wish });
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

/* 📸 UPLOAD IMAGE */
export const uploadBirthdayImage = createAsyncThunk(
    "birthday/uploadImage",
    async ({ id, file }: { id: string; file: File }) => {
        const formData = new FormData();
        formData.append("image", file);

        await api.patch(`/birthday/${id}/image`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return id;
    }
);

const birthdaySlice = createSlice({
    name: "birthday",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            /* FETCH */
            .addCase(fetchBirthdays.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBirthdays.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })

            /* ADD */
            .addCase(addBirthday.fulfilled, (state, action) => {
                state.data.push(action.payload);
            })

            /* UPDATE */
            .addCase(updateBirthday.fulfilled, (state, action) => {
                const index = state.data.findIndex(
                    (b) => b._id === action.payload._id
                );
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })

            /* 🗑 DELETE */
            .addCase(deleteBirthday.fulfilled, (state, action) => {
                state.data = state.data.filter(
                    (b) => b._id !== action.payload
                );
            })

            /* 🎂 UPDATE WISH */
            .addCase(updateBirthdayWish.fulfilled, (state, action) => {
                const index = state.data.findIndex(
                    (b) => b._id === action.payload._id
                );
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            });
    },
});

export default birthdaySlice.reducer;
