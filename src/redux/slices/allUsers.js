import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const fetchAllCustomers = createAsyncThunk(
  "customers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/super_admin/backend/fetch_all_customer");
      return response.data.data; // Assuming response follows the { data: [...] } structure
    } catch (error) {
      return rejectWithValue(error.msg || "Failed to fetch customers");
    }
  }
);

const customerSlice = createSlice({
  name: "customers",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchAllCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default customerSlice.reducer;
