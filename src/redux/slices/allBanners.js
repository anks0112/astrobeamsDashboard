import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
// Async thunk to fetch banners
export const fetchBanners = createAsyncThunk(
  "banners/fetchBanners",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/super_admin/backend/get_all_banner");
      return response.data.data; // Extracting the data array
    } catch (error) {
      return rejectWithValue(error.msg || "Failed to fetch banners");
    }
  }
);

const bannersSlice = createSlice({
  name: "banners",
  initialState: {
    banners: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bannersSlice.reducer;
