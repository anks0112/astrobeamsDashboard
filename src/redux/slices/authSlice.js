import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api"; // Ensure API utility is correctly set up

// Async Thunk for Super Admin Login
export const loginSuperAdmin = createAsyncThunk(
  "authSuperAdmin/login",
  async ({ super_admin_email, super_admin_password }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/super_admin/backend/login/super_admin",
        {
          super_admin_email,
          super_admin_password,
        }
      );

      if (response.data.success) {
        return {
          user_id: response.data.user_id,
          user_full_name: response.data.user_full_name,
          message: response.data.msg,
        };
      } else {
        return rejectWithValue(response.data.msg || "Login failed");
      }
    } catch (error) {
      return rejectWithValue(error.msg || "An error occurred");
    }
  }
);

// Slice for handling login state
const superAdminSlice = createSlice({
  name: "authSuperAdmin",
  initialState: {
    user_id: null,
    user_full_name: "",
    message: "",
    isLoggedIn: false, // ✅ Added state to track login status
    loading: false,
    error: null,
  },
  reducers: {
    logoutSuperAdmin: (state) => {
      state.user_id = null;
      state.user_full_name = "";
      state.message = "";
      state.isLoggedIn = false; // ✅ Set to false on logout
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginSuperAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginSuperAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user_id = action.payload.user_id;
        state.user_full_name = action.payload.user_full_name;
        state.message = action.payload.message;
        state.isLoggedIn = true;
      })
      .addCase(loginSuperAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isLoggedIn = false; // ✅ Ensure false if login fails
      });
  },
});

// Export actions and reducer
export const { logoutSuperAdmin } = superAdminSlice.actions;
export default superAdminSlice.reducer;
