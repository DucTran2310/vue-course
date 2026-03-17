<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8 animate-fade-in"
    >
      <!-- Header -->
      <div class="text-center mb-8">
        <div
          class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-3xl shadow-lg"
        >
          🔐
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t("changePassword") }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm">
          {{ t("changePassword") }} {{ t("appName").toLowerCase() }}
        </p>
      </div>

      <!-- Step Indicator -->
      <div class="flex items-center justify-center gap-2 mb-6">
        <div
          class="flex items-center gap-2 px-4 py-2 rounded-full"
          :class="
            step === 1
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
              : 'text-gray-400'
          "
        >
          <span
            class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            :class="
              step === 1 ? 'bg-emerald-500 text-white' : 'bg-gray-300 dark:bg-gray-600'
            "
          >
            1
          </span>
          <span class="text-sm font-medium">Xác nhận</span>
        </div>
        <div class="w-8 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
        <div
          class="flex items-center gap-2 px-4 py-2 rounded-full"
          :class="
            step === 2
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
              : 'text-gray-400'
          "
        >
          <span
            class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            :class="
              step === 2 ? 'bg-emerald-500 text-white' : 'bg-gray-300 dark:bg-gray-600'
            "
          >
            2
          </span>
          <span class="text-sm font-medium">OTP</span>
        </div>
        <div class="w-8 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
        <div
          class="flex items-center gap-2 px-4 py-2 rounded-full"
          :class="
            step === 3
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
              : 'text-gray-400'
          "
        >
          <span
            class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            :class="
              step === 3 ? 'bg-emerald-500 text-white' : 'bg-gray-300 dark:bg-gray-600'
            "
          >
            3
          </span>
          <span class="text-sm font-medium">Đổi mật khẩu</span>
        </div>
      </div>

      <!-- Step 1: Enter Current Password -->
      <form v-if="step === 1" @submit.prevent="handleSendOTP" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t("currentPassword") }}
          </label>
          <div class="relative">
            <input
              v-model="form.currentPassword"
              :type="showCurrentPassword ? 'text' : 'password'"
              required
              class="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              :placeholder="t('enterCurrentPassword')"
            />
            <button
              type="button"
              @click="showCurrentPassword = !showCurrentPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
            >
              {{ showCurrentPassword ? "🙈" : "👁️" }}
            </button>
          </div>
        </div>

        <div
          v-if="errorMessage"
          class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-red-600 dark:text-red-400 text-sm"
        >
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ authStore.loading ? t("saving") : "Gửi mã OTP" }}
        </button>

        <button
          type="button"
          @click="goBack"
          class="w-full px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 font-semibold transition-all cursor-pointer"
        >
          {{ t("cancel") }}
        </button>
      </form>

      <!-- Step 2: Enter OTP -->
      <form v-else-if="step === 2" @submit.prevent="handleVerifyOTP" class="space-y-5">
        <div class="text-center mb-4">
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            Mã OTP đã được gửi đến email
            <span class="font-semibold text-emerald-600 dark:text-emerald-400">{{
              userEmail
            }}</span>
          </p>
          <p class="text-gray-500 dark:text-gray-500 text-xs mt-1">
            OTP có hiệu lực trong 10 phút
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mã OTP (6 số)
          </label>
          <input
            v-model="form.otp"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="6"
            required
            class="w-full px-4 py-3 text-center text-2xl tracking-[8px] rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-mono"
            placeholder="000000"
          />
        </div>

        <div
          v-if="errorMessage"
          class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-red-600 dark:text-red-400 text-sm"
        >
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          :disabled="authStore.loading || form.otp.length !== 6"
          class="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ authStore.loading ? t("saving") : "Xác nhận OTP" }}
        </button>

        <button
          type="button"
          @click="step = 1"
          class="w-full px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 font-semibold transition-all cursor-pointer"
        >
          Quay lại
        </button>
      </form>

      <!-- Step 3: Enter New Password -->
      <form
        v-else-if="step === 3"
        @submit.prevent="handleChangePassword"
        class="space-y-5"
      >
        <div
          class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 text-green-600 dark:text-green-400 text-sm text-center"
        >
          ✓ OTP xác nhận thành công!
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t("newPassword") }}
          </label>
          <div class="relative">
            <input
              v-model="form.newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              required
              minlength="8"
              class="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              :placeholder="t('enterNewPassword')"
            />
            <button
              type="button"
              @click="showNewPassword = !showNewPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
            >
              {{ showNewPassword ? "🙈" : "👁️" }}
            </button>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {{ t("passwordTooShort") }} (8+ ký tự, kết hợp chữ hoa, thường, số và ký tự
            đặc biệt)
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t("confirmPassword") }}
          </label>
          <div class="relative">
            <input
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              minlength="6"
              class="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              :placeholder="t('enterConfirmPassword')"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
            >
              {{ showConfirmPassword ? "🙈" : "👁️" }}
            </button>
          </div>
        </div>

        <div
          v-if="errorMessage"
          class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-red-600 dark:text-red-400 text-sm"
        >
          {{ errorMessage }}
        </div>

        <div
          v-if="successMessage"
          class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 text-green-600 dark:text-green-400 text-sm"
        >
          {{ successMessage }}
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ authStore.loading ? t("saving") : t("changePassword") }}
        </button>

        <button
          type="button"
          @click="step = 2"
          class="w-full px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 font-semibold transition-all cursor-pointer"
        >
          Quay lại
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { apiService } from "../services/api";
import { useAuthStore } from "../stores/authStore";

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();

const step = ref(1);
const userEmail = computed(() => authStore.userEmail);

const form = reactive({
  currentPassword: "",
  otp: "",
  newPassword: "",
  confirmPassword: "",
});

const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const handleSendOTP = async () => {
  errorMessage.value = "";

  try {
    const response = await apiService.requestPasswordChange(form.currentPassword);

    if (response.success) {
      step.value = 2;
    } else {
      errorMessage.value = response.message || "Có lỗi xảy ra";
    }
  } catch (error: any) {
    errorMessage.value = error.message || "Có lỗi xảy ra";
  }
};

const handleVerifyOTP = async () => {
  errorMessage.value = "";

  if (form.otp.length !== 6) {
    errorMessage.value = "OTP phải có 6 chữ số";
    return;
  }

  // Store the OTP temporarily for verification in step 3
  // We'll verify OTP and change password together in the final step
  step.value = 3;
};

const handleChangePassword = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  // Validate passwords match
  if (form.newPassword !== form.confirmPassword) {
    errorMessage.value = t("passwordMismatch");
    return;
  }

  // Validate password length
  if (form.newPassword.length < 8) {
    errorMessage.value = t("passwordTooShort");
    return;
  }

  try {
    const response = await apiService.verifyOTPAndChangePassword(
      form.otp,
      form.newPassword
    );

    if (response.success) {
      successMessage.value = t("passwordChanged");
      // Clear form
      form.currentPassword = "";
      form.otp = "";
      form.newPassword = "";
      form.confirmPassword = "";
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push({ name: "dashboard" });
      }, 2000);
    } else {
      errorMessage.value = response.message || t("passwordMismatch");
    }
  } catch (error: any) {
    errorMessage.value = error.message || "Có lỗi xảy ra";
  }
};

const goBack = () => {
  router.push({ name: "dashboard" });
};
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>
