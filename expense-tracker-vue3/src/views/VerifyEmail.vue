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
          Verify Your Email
        </h2>
        <p class="mt-3 text-gray-600 dark:text-gray-400 text-lg">
          Complete your registration
        </p>
      </div>

      <!-- Verify Email Card -->
      <div
        class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 transform transition-all hover:scale-[1.01]"
      >
        <!-- Verify by Token Form -->
        <div v-if="!showResendForm" class="space-y-5">
          <div
            class="rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 mb-6"
          >
            <p class="text-sm text-blue-800 dark:text-blue-300">
              🔐 We've sent a verification link to your email address. Please enter the
              token you received.
            </p>
          </div>

          <form @submit.prevent="handleVerify">
            <!-- Token Field -->
            <div>
              <label
                for="token"
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                ✉️ Verification Token
              </label>
              <input
                id="token"
                name="token"
                type="text"
                required
                v-model="token"
                class="block w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 dark:text-white transition-all duration-200 text-sm font-mono"
                placeholder="Enter verification token"
              />
            </div>

            <!-- Error Message -->
            <div
              v-if="authStore.error && !verificationSuccess"
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
                    Verification Failed
                  </h3>
                  <p class="mt-1 text-sm text-red-700 dark:text-red-300">
                    {{ authStore.error }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Success Message -->
            <div
              v-if="verificationSuccess"
              class="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4"
            >
              <div class="flex gap-3">
                <div class="flex-shrink-0">
                  <svg
                    class="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="text-sm font-semibold text-green-800 dark:text-green-400">
                    Verification Successful!
                  </h3>
                  <p class="mt-1 text-sm text-green-700 dark:text-green-300">
                    {{ verificationMessage }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Verify Button -->
            <div>
              <button
                type="submit"
                :disabled="authStore.loading || verificationSuccess"
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
                {{
                  authStore.loading
                    ? "Verifying..."
                    : verificationSuccess
                    ? "Verified ✓"
                    : "Verify Email"
                }}
              </button>
            </div>
          </form>

          <!-- Resend Email Link -->
          <div class="text-center">
            <button
              @click="showResendForm = true"
              class="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline"
            >
              Didn't receive the email? Click here to resend
            </button>
          </div>
        </div>

        <!-- Resend Verification Form -->
        <div v-else class="space-y-5">
          <div
            class="rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 mb-6"
          >
            <p class="text-sm text-yellow-800 dark:text-yellow-300">
              📧 Enter your email address to receive a new verification link.
            </p>
          </div>

          <form @submit.prevent="handleResendVerification">
            <!-- Email Field -->
            <div>
              <label
                for="email"
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                📧 Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                v-model="email"
                class="block w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 dark:text-white transition-all duration-200 text-sm"
                placeholder="Enter your email address"
              />
            </div>

            <!-- Error Message -->
            <div
              v-if="authStore.error && !resendSuccess"
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
                    Resend Failed
                  </h3>
                  <p class="mt-1 text-sm text-red-700 dark:text-red-300">
                    {{ authStore.error }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Success Message -->
            <div
              v-if="resendSuccess"
              class="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4"
            >
              <div class="flex gap-3">
                <div class="flex-shrink-0">
                  <svg
                    class="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="text-sm font-semibold text-green-800 dark:text-green-400">
                    Email Sent!
                  </h3>
                  <p class="mt-1 text-sm text-green-700 dark:text-green-300">
                    Verification email has been resent! Please check your inbox.
                  </p>
                </div>
              </div>
            </div>

            <!-- Resend Button -->
            <div>
              <button
                type="submit"
                :disabled="authStore.loading || resendSuccess"
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
                {{
                  authStore.loading
                    ? "Sending..."
                    : resendSuccess
                    ? "Email Sent ✓"
                    : "Resend Verification Email"
                }}
              </button>
            </div>
          </form>

          <!-- Back to Verification Link -->
          <div class="text-center">
            <button
              @click="showResendForm = false"
              class="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline"
            >
              Back to verification form
            </button>
          </div>
        </div>

        <!-- Back to Login Link -->
        <div class="mt-6 text-center border-t border-gray-200 dark:border-gray-700 pt-4">
          <router-link
            to="/login"
            class="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            ← Back to login
          </router-link>
        </div>
      </div>

      <!-- Footer -->
      <p class="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        Secure verification powered by Expense Tracker
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const token = ref("");
const email = ref("");
const showResendForm = ref(false);
const verificationSuccess = ref(false);
const verificationMessage = ref("");
const resendSuccess = ref(false);

onMounted(() => {
  // Check if token is in URL query parameter (from email link)
  const tokenParam = route.query.token as string;
  if (tokenParam) {
    token.value = tokenParam;
    handleVerify();
  }

  // Pre-fill email from auth store if available
  if (authStore.userEmail) {
    email.value = authStore.userEmail;
  }
});

const handleVerify = async () => {
  authStore.clearError();
  verificationSuccess.value = false;

  const result = await authStore.verifyEmail(token.value);

  if (result.success) {
    verificationSuccess.value = true;
    verificationMessage.value = result.message || "Email verified successfully!";

    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  }
};

const handleResendVerification = async () => {
  authStore.clearError();
  resendSuccess.value = false;

  const result = await authStore.resendVerificationEmail(email.value);

  if (result.success) {
    resendSuccess.value = true;
  }
};
</script>
