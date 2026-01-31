import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../utils/axiosClient';

const initialState = {
    comments: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// Get comments
export const getComments = createAsyncThunk(
    'comments/getAll',
    async (articleId, thunkAPI) => {
        try {
            const response = await axiosClient.get(`/comments/${articleId}`);
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Add comment
export const addComment = createAsyncThunk(
    'comments/add',
    async ({ articleId, message }, thunkAPI) => {
        try {
            const response = await axiosClient.post(`/comments/${articleId}`, { message });
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getComments.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getComments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.comments = action.payload;
            })
            .addCase(getComments.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(addComment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.comments.unshift(action.payload);
            });
    },
});

export const { reset } = commentSlice.actions;
export default commentSlice.reducer;
