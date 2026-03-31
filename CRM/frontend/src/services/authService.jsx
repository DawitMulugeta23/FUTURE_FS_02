import api from "./api";

const extractAuthData = (payload) => {
  if (!payload) {
    return null;
  }

  if (payload.data) {
    return payload.data;
  }

  if (payload.user || payload.token) {
    return {
      ...(payload.user || {}),
      token: payload.token,
    };
  }

  return payload;
};

const authService = {
  async register(userData) {
    const response = await api.post("/auth/register", userData);
    const authData = extractAuthData(response.data);

    if (response.data?.success && authData) {
      localStorage.setItem("userInfo", JSON.stringify(authData));
    }

    return authData;
  },

  async login(credentials) {
    const response = await api.post("/auth/login", credentials);
    const authData = extractAuthData(response.data);

    if (response.data?.success && authData) {
      localStorage.setItem("userInfo", JSON.stringify(authData));
    }

    return authData;
  },

  async verifyEmail(token) {
    const response = await api.get(`/auth/verify-email?token=${token}`);
    return response.data;
  },

  async resendVerification(email) {
    const response = await api.post("/auth/resend-verification", { email });
    return response.data;
  },

  async getProfile() {
    const response = await api.get("/auth/me");
    return response.data;
  },

  logout() {
    localStorage.removeItem("userInfo");
  },

  getCurrentUser() {
    try {
      const userInfo = localStorage.getItem("userInfo");

      if (!userInfo || userInfo === "undefined" || userInfo === "null") {
        return null;
      }

      return JSON.parse(userInfo);
    } catch (error) {
      localStorage.removeItem("userInfo");
      return null;
    }
  },
};

export default authService;
