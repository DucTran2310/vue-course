import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { apiService } from "../services/api";

interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar?: string;
  email_verified: boolean;
  created_at?: string;
}

interface UserSettings {
  currency: string;
  language: string;
  theme: string;
  defaultCategoryExpense: string | null;
  defaultCategoryIncome: string | null;
}

export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref<User | null>(null);
  const settings = ref<UserSettings | null>(null);
  const token = ref<string | null>(localStorage.getItem("token"));
  const loading = ref(false);
  const error = ref<string | null>(null);
  const isInitialized = ref(false);

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const userEmail = computed(() => user.value?.email || "");
  const userName = computed(
    () => user.value?.full_name || user.value?.email || "",
  );

  // Helper function to convert relative avatar URL to full URL
  const getFullAvatarUrl = (avatar: string | undefined): string | undefined => {
    if (!avatar) return undefined;
    // Cloudinary returns full URL (https://...), local storage returns relative path (/uploads/...)
    if (avatar.startsWith("http://") || avatar.startsWith("https://"))
      return avatar;
    // For local storage, convert to full URL
    return `http://localhost:3000${avatar}`;
  };

  // Actions
  function setToken(newToken: string | null) {
    token.value = newToken;
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
  }

  async function register(email: string, password: string, fullName?: string) {
    loading.value = true;
    error.value = null;

    try {
      const response = await apiService.register(email, password, fullName);

      if (response.success && response.data) {
        const data = response.data as { token: string; user: User };
        // Save token
        setToken(data.token);

        // Save user info
        user.value = data.user;

        return { success: true };
      }

      return { success: false, message: response.message };
    } catch (err: any) {
      error.value = err.message;
      return { success: false, message: err.message };
    } finally {
      loading.value = false;
    }
  }

  async function login(email: string, password: string) {
    loading.value = true;
    error.value = null;

    try {
      const response = await apiService.login(email, password);

      if (response.success && response.data) {
        const data = response.data as { token: string; user: User };
        // Save token
        setToken(data.token);

        // Save user info
        user.value = data.user;

        // Fetch profile to get settings
        await fetchProfile();

        return { success: true };
      }

      return { success: false, message: response.message };
    } catch (err: any) {
      error.value = err.message;
      return { success: false, message: err.message };
    } finally {
      loading.value = false;
    }
  }

  async function verifyEmail(tokenInput: string) {
    loading.value = true;
    error.value = null;

    try {
      const response = await apiService.verifyEmail(tokenInput);

      if (response.success) {
        // Update user email verification status
        if (user.value) {
          user.value.email_verified = true;
        }

        return { success: true, message: response.message };
      }

      return { success: false, message: response.message };
    } catch (err: any) {
      error.value = err.message;
      return { success: false, message: err.message };
    } finally {
      loading.value = false;
    }
  }

  async function resendVerificationEmail(email: string) {
    loading.value = true;
    error.value = null;

    try {
      const response = await apiService.resendVerificationEmail(email);

      if (response.success) {
        return { success: true, message: response.message };
      }

      return { success: false, message: response.message };
    } catch (err: any) {
      error.value = err.message;
      return { success: false, message: err.message };
    } finally {
      loading.value = false;
    }
  }

  async function fetchProfile() {
    if (!token.value) return { success: false, message: "Not authenticated" };

    loading.value = true;
    error.value = null;

    try {
      const response = await apiService.getProfile();

      if (response.success && response.data) {
        const data = response.data as { user: User; settings: UserSettings };
        // Convert relative avatar URL to full URL
        data.user.avatar = getFullAvatarUrl(data.user.avatar);
        user.value = data.user;
        settings.value = data.settings;
        return { success: true, settings: data.settings };
      }

      // If getProfile fails (e.g., unauthorized), clear token
      setToken(null);
      return { success: false, message: response.message || "Session expired" };
    } catch (err: any) {
      error.value = err.message;
      // If request fails (e.g., 401 unauthorized), clear token
      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
        setToken(null);
      }
      return { success: false, message: err.message };
    } finally {
      loading.value = false;
    }
  }

  async function uploadAvatar(file: File) {
    loading.value = true;
    error.value = null;

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      error.value = "File size exceeds 5MB limit";
      loading.value = false;
      return { success: false, message: "File size exceeds 5MB limit" };
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      error.value = "Only image files are allowed";
      loading.value = false;
      return { success: false, message: "Only image files are allowed" };
    }

    try {
      const response = await apiService.uploadAvatar(file);

      if (response.success && response.data) {
        const data = response.data as { user: User };
        const updatedUser = data.user;
        // Convert relative avatar URL to full URL
        updatedUser.avatar = getFullAvatarUrl(updatedUser.avatar);
        // Merge updated fields into existing user
        user.value = { ...user.value, ...updatedUser };
        return { success: true, message: "Avatar uploaded successfully" };
      }

      return { success: false, message: response.message };
    } catch (err: any) {
      error.value = err.message;
      return { success: false, message: err.message };
    } finally {
      loading.value = false;
    }
  }

  async function updateProfile(fullName?: string, avatar?: string) {
    loading.value = true;
    error.value = null;

    try {
      const response = await apiService.updateProfile({ fullName, avatar });

      if (response.success && response.data) {
        const updatedUser = response.data.user as User;
        // Convert relative avatar URL to full URL
        updatedUser.avatar = getFullAvatarUrl(updatedUser.avatar);
        user.value = { ...user.value, ...updatedUser };
        return { success: true, message: "Profile updated successfully" };
      }

      return { success: false, message: response.message };
    } catch (err: any) {
      error.value = err.message;
      return { success: false, message: err.message };
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    user.value = null;
    settings.value = null;
    setToken(null);
    error.value = null;
  }

  function clearError() {
    error.value = null;
  }

  // Initialize: fetch profile on page load if token exists
  async function init() {
    if (token.value) {
      await fetchProfile();
    }
  }

  return {
    // State
    user,
    settings,
    token,
    loading,
    error,
    isInitialized,
    // Getters
    isAuthenticated,
    userEmail,
    userName,
    // Actions
    register,
    login,
    verifyEmail,
    resendVerificationEmail,
    fetchProfile,
    uploadAvatar,
    updateProfile,
    logout,
    clearError,
    init,
  };
});
