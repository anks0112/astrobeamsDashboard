import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Async thunk for creating an astrologer
export const createAstrologer = createAsyncThunk(
  "astrologer/createAstrologer",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/super_admin/backend/create_astrologer",
        payload
      );
      return response.data; // Return the response data
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

const astrologerSlice = createSlice({
  name: "astrologer",
  initialState: {
    loading: false,
    error: null,
    success: false,
    data: null,
  },
  reducers: {
    resetAstrologerState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAstrologer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createAstrologer.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(createAstrologer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetAstrologerState } = astrologerSlice.actions;
export default astrologerSlice.reducer;
