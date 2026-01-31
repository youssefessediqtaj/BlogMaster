import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../utils/axiosClient';

const initialState = {
    articles: [],
    article: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// Create new article
export const createArticle = createAsyncThunk(
    'articles/create',
    async (articleData, thunkAPI) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
            const response = await axiosClient.post('/articles', articleData, config);
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

// Get all articles
export const getArticles = createAsyncThunk(
    'articles/getAll',
    async (query, thunkAPI) => {
        try {
            let url = '/articles';
            if (query) {
                url += `?${query}`;
            }
            const response = await axiosClient.get(url);
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

// Get article by ID
export const getArticleById = createAsyncThunk(
    'articles/getById',
    async (id, thunkAPI) => {
        try {
            const response = await axiosClient.get(`/articles/${id}`);
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

// Delete article
export const deleteArticle = createAsyncThunk(
    'articles/delete',
    async (id, thunkAPI) => {
        try {
            await axiosClient.delete(`/articles/${id}`);
            return id;
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

// Auto save draft
export const autoSaveDraft = createAsyncThunk(
    'articles/autoSave',
    async (articleData, thunkAPI) => {
        try {
            const response = await axiosClient.post('/articles/draft', articleData);
            return response.data;
        } catch (error) {
            // Silent fail for auto save or just log
            console.error(error);
            return thunkAPI.rejectWithValue('Auto save failed');
        }
    }
)

export const articleSlice = createSlice({
    name: 'article',
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
            .addCase(createArticle.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createArticle.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.articles.push(action.payload);
            })
            .addCase(createArticle.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getArticles.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getArticles.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.articles = action.payload;
            })
            .addCase(getArticles.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getArticleById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getArticleById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.article = action.payload;
            })
            .addCase(getArticleById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteArticle.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.articles = state.articles.filter(
                    (article) => article._id !== action.payload
                );
            })
            .addCase(autoSaveDraft.fulfilled, (state, action) => {
                // Update the current article state if it matches or just log
            });
    },
});

export const { reset } = articleSlice.actions;
export default articleSlice.reducer;
