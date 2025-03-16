import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { toast } from "react-toastify";

// ✅ Async Thunk for Fetching Astrologer Earnings
export const fetchAstrologerEarnings = createAsyncThunk(
  "astrologerEarnings/fetchEarnings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(
        "/super_admin/backend/fetch_astrologer_earning"
      );
      if (response.data.success === 1) {
        return response.data.data; // ✅ Store earnings data in state
      } else {
        return rejectWithValue(
          response.data.msg || "Failed to fetch earnings."
        );
      }
    } catch (error) {
      return rejectWithValue(error.msg || "Server Error");
    }
  }
);

const astrologerEarningsSlice = createSlice({
  name: "astrologerEarnings",
  initialState: {
    earnings: [],
    loading: false,
    error: null,
  },
  reducers: {}, // No manual reducers needed

  extraReducers: (builder) => {
    builder
      .addCase(fetchAstrologerEarnings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAstrologerEarnings.fulfilled, (state, action) => {
        state.loading = false;
        state.earnings = action.payload;
      })
      .addCase(fetchAstrologerEarnings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || "Error fetching astrologer earnings!", {
          position: "top-center",
          autoClose: 3000,
        });
      });
  },
});

export default astrologerEarningsSlice.reducer;
