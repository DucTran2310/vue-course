<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 py-12 px-4"
  >
    <div class="max-w-md w-full">
      <!-- Logo & Header -->
      <div class="text-center mb-8">
        <div
          class="mx-auto w-20 h-20 mb-4 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-4xl shadow-lg shadow-emerald-500/30"
        >
          💰
        </div>
        <h2
          class="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent"
        >
          Welcome Back
        </h2>
        <p class="mt-3 text-gray-600 dark:text-gray-400 text-lg">
          Sign in to your account to continue
        </p>
      </div>

      <!-- Login Card -->
      <div
        class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 transform transition-all hover:scale-[1.01]"
      >
        <form class="space-y-6" @submit.prevent="handleLogin">
          <!-- Email Field -->
          <div>
            <label
              for="email"
              class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              📧 Email Address
            </label>
            <div class="relative">
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                v-model="formData.email"
                class="block w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 dark:text-white transition-all duration-200 text-sm"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <label
              for="password"
              class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              🔒 Password
            </label>
            <div class="relative">
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                v-model="formData.password"
                class="block w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 dark:text-white transition-all duration-200 text-sm"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <!-- Error Message -->
          <div
            v-if="authStore.error"
            class="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4"
          >
            <div class="flex gap-3">
              <div class="flex-shrink-0">
                <svg
                  class="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-red-800 dark:text-red-400">
                  Login Failed
                </h3>
                <p class="mt-1 text-sm text-red-700 dark:text-red-300">
                  {{ authStore.error }}
                </p>
              </div>
            </div>
          </div>

          <!-- Login Button -->
          <div>
            <button
              type="submit"
              :disabled="authStore.loading"
              class="group relative w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-white font-semibold text-base bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all duration-300 hover:-translate-y-0.5"
            >
              <span
                v-if="authStore.loading"
                class="absolute left-0 pl-3 flex items-center"
              >
                <svg
                  class="animate-spin h-5 w-5 text-emerald-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
              {{ authStore.loading ? "Signing in..." : "Sign in →" }}
            </button>
          </div>

          <!-- Resend Verification Link -->
          <div v-if="showResendVerification" class="text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Need to verify your email?
              <router-link
                to="/verify-email"
                class="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline"
              >
                Click here
              </router-link>
            </p>
          </div>
        </form>

        <!-- Divider -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white dark:bg-gray-800 text-gray-500">
                Don't have an account?
              </span>
            </div>
          </div>

          <!-- Register Link -->
          <div class="mt-6">
            <router-link
              to="/register"
              class="w-full flex justify-center py-3 px-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:border-emerald-500 dark:hover:text-emerald-400 transition-all duration-200"
            >
              Create New Account 🚀
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const router = useRouter();
const authStore = useAuthStore();

const formData = ref({
  email: "",
  password: "",
});

const showResendVerification = ref(false);

const handleLogin = async () => {
  authStore.clearError();
  showResendVerification.value = false;

  const result = await authStore.login(formData.value.email, formData.value.password);

  if (result.success) {
    if (!authStore.user?.emailVerified) {
      showResendVerification.value = true;
      router.push("/verify-email");
    } else {
      router.push("/dashboard");
    }
  }
};
</script>
