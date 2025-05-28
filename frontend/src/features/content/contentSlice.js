import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  contents: [],
  categories: [],
  currentContent: null,
  favorites: [],
  watchHistory: [],
  loading: false,
  error: null
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    fetchContentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchContentsSuccess: (state, action) => {
      state.contents = action.payload;
      state.loading = false;
    },
    fetchContentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchCategoriesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCategoriesSuccess: (state, action) => {
      state.categories = action.payload;
      state.loading = false;
    },
    fetchCategoriesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchContentDetailStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchContentDetailSuccess: (state, action) => {
      state.currentContent = action.payload;
      state.loading = false;
    },
    fetchContentDetailFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchFavoritesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchFavoritesSuccess: (state, action) => {
      state.favorites = action.payload;
      state.loading = false;
    },
    fetchFavoritesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchWatchHistoryStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchWatchHistorySuccess: (state, action) => {
      state.watchHistory = action.payload;
      state.loading = false;
    },
    fetchWatchHistoryFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addToFavorites: (state, action) => {
      state.favorites.push(action.payload);
    },
    removeFromFavorites: (state, action) => {
      state.favorites = state.favorites.filter(item => item.id !== action.payload);
    },
    updateWatchHistory: (state, action) => {
      const { content, watch_position } = action.payload;
      const existingIndex = state.watchHistory.findIndex(item => item.content.id === content.id);
      
      if (existingIndex !== -1) {
        state.watchHistory[existingIndex].watch_position = watch_position;
        state.watchHistory[existingIndex].last_watched = new Date().toISOString();
      } else {
        state.watchHistory.push({
          content,
          watch_position,
          last_watched: new Date().toISOString()
        });
      }
    }
  }
});

export const {
  fetchContentsStart,
  fetchContentsSuccess,
  fetchContentsFailure,
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  fetchContentDetailStart,
  fetchContentDetailSuccess,
  fetchContentDetailFailure,
  fetchFavoritesStart,
  fetchFavoritesSuccess,
  fetchFavoritesFailure,
  fetchWatchHistoryStart,
  fetchWatchHistorySuccess,
  fetchWatchHistoryFailure,
  addToFavorites,
  removeFromFavorites,
  updateWatchHistory
} = contentSlice.actions;

export default contentSlice.reducer;
