import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import authService from "../../services/authService";

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Registration failed",
      );
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Login failed",
      );
    }
  },
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token, { rejectWithValue }) => {
    try {
      const response = await authService.verifyEmail(token);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Verification failed",
      );
    }
  },
);

export const resendVerification = createAsyncThunk(
  "auth/resendVerification",
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.resendVerification(email);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to resend verification",
      );
    }
  },
);

const getStoredUser = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const userInfo = localStorage.getItem("userInfo");

    if (!userInfo || userInfo === "undefined" || userInfo === "null") {
      return null;
    }

    return JSON.parse(userInfo);
  } catch (error) {
    console.warn("Invalid stored user info removed:", error);
    localStorage.removeItem("userInfo");
    return null;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: getStoredUser(),
    loading: false,
    error: null,
    needsVerification: false,
    verificationEmail: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("userInfo");
      toast.success("Logged out successfully");
    },
    clearError: (state) => {
      state.error = null;
    },
    clearVerificationState: (state) => {
      state.needsVerification = false;
      state.verificationEmail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        if (action.payload) {
          localStorage.setItem("userInfo", JSON.stringify(action.payload));
        }
        toast.success(
          action.payload?.message ||
            "Registration successful! Please check your email to verify your account.",
        );
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || "Registration failed");
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.needsVerification = false;
        state.verificationEmail = null;
        if (action.payload) {
          localStorage.setItem("userInfo", JSON.stringify(action.payload));
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        const errorData = action.payload;
        if (errorData?.needsVerification) {
          state.needsVerification = true;
          state.verificationEmail = errorData.email;
          toast.error("Please verify your email before logging in");
        } else {
          toast.error(action.payload || "Login failed");
        }
      })
      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loading = false;
        toast.success("Email verified successfully! You can now login.");
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || "Verification failed");
      })
      // Resend Verification
      .addCase(resendVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendVerification.fulfilled, (state) => {
        state.loading = false;
        toast.success("Verification email sent! Please check your inbox.");
      })
      .addCase(resendVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to resend verification email");
      });
  },
});

export const { logout, clearError, clearVerificationState } = authSlice.actions;
export default authSlice.reducer;
