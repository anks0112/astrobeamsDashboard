import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const fetchAllAstrologers = createAsyncThunk(
  "astrologers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(
        "/super_admin/backend/fetch_all_astrologer"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const astrologerSlice = createSlice({
  name: "astrologers",
  initialState: {
    astrologers: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAstrologersState: (state) => {
      state.astrologers = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAstrologers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAstrologers.fulfilled, (state, action) => {
        state.loading = false;
        state.astrologers = action.payload;
        state.error = null;
      })
      .addCase(fetchAllAstrologers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAstrologersState } = astrologerSlice.actions;
export default astrologerSlice.reducer;
