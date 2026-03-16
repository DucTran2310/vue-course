<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300"
  >
    <!-- Header -->
    <header
      class="sticky top-0 z-40 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap justify-between items-center gap-4 py-4">
          <!-- Logo -->
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/30"
            >
              💰
            </div>
            <div>
              <h1
                class="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent"
              >
                {{ t("appName") }}
              </h1>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Manage your finances wisely
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3">
            <!-- Add Transaction Button -->
            <button
              @click="showForm = !showForm"
              class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all hover:-translate-y-0.5 cursor-pointer"
              :class="{ 'opacity-75': showForm }"
            >
              <span class="text-xl">+</span>
              <span class="hidden sm:inline">{{ t("newTransaction") }}</span>
            </button>

            <!-- User Menu -->
            <div class="relative">
              <!-- User Avatar Button -->
              <button
                @click="toggleUserMenu"
                data-user-menu-button
                class="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer overflow-hidden"
                :title="t('userMenu')"
                :class="
                  !user?.avatar
                    ? 'bg-gradient-to-br from-emerald-400 to-cyan-500'
                    : ''
                "
              >
                <img
                  v-if="user?.avatar"
                  :src="user.avatar"
                  :alt="userName"
                  class="w-full h-full object-cover"
                  @error="user!.avatar = ''"
                />
                <span v-else>
                  {{ userInitial }}
                </span>
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="showUserMenu"
                class="user-menu-dropdown absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
              >
                <!-- User Info Header -->
                <div
                  class="bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3"
                >
                  <p class="text-white font-semibold text-sm">{{ userName }}</p>
                  <p class="text-white/80 text-xs truncate">{{ userEmail }}</p>
                </div>

                <!-- Email Verification Status -->
                <div
                  class="px-4 py-2 border-b border-gray-200 dark:border-gray-700"
                >
                  <div
                    v-if="!user?.email_verified"
                    class="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 text-sm"
                  >
                    <span>⚠️</span>
                    <span>{{ t("emailNotVerified") }}</span>
                  </div>
                  <div
                    v-else
                    class="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm"
                  >
                    <span>✓</span>
                    <span>{{ t("emailVerified") }}</span>
                  </div>
                </div>

                <!-- Menu Items -->
                <div class="py-2">
                  <!-- Dark Mode Toggle -->
                  <div
                    class="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <div class="flex items-center gap-3">
                      <span class="text-lg">{{ darkMode ? "☀️" : "🌙" }}</span>
                      <span>{{
                        darkMode ? t("lightMode") : t("darkMode")
                      }}</span>
                    </div>
                    <button
                      @click="toggleDarkMode"
                      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 cursor-pointer"
                      :class="
                        darkMode
                          ? 'bg-emerald-500'
                          : 'bg-gray-300 dark:bg-gray-600'
                      "
                    >
                      <span
                        class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200"
                        :class="darkMode ? 'translate-x-6' : 'translate-x-1'"
                      />
                    </button>
                  </div>

                  <!-- Edit Profile -->
                  <button
                    @click="openProfileEdit"
                    class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <span class="text-lg">✏️</span>
                    <span>{{ t("editProfile") }}</span>
                  </button>

                  <!-- Language Toggle -->
                  <div
                    class="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <div class="flex items-center gap-3">
                      <span class="text-lg">🌐</span>
                      <span>{{
                        locale === "vi" ? "Tiếng Việt" : "English"
                      }}</span>
                    </div>
                    <button
                      @click="toggleLanguage"
                      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 cursor-pointer"
                      :class="
                        locale === 'vi'
                          ? 'bg-blue-500'
                          : 'bg-gray-300 dark:bg-gray-600'
                      "
                    >
                      <span
                        class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200"
                        :class="
                          locale === 'vi' ? 'translate-x-6' : 'translate-x-1'
                        "
                      >
                      </span>
                    </button>
                  </div>

                  <!-- Logout -->
                  <button
                    @click="handleLogout"
                    class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-colors border-t border-gray-200 dark:border-gray-700 mt-2"
                  >
                    <span class="text-lg">🚪</span>
                    <span>{{ t("logout") }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Profile Edit Modal -->
    <Transition name="modal">
      <div
        v-if="showProfileEdit"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click.self="showProfileEdit = false"
        ></div>
        <div
          class="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-modal-enter p-6"
        >
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {{ t("editProfile") }}
          </h2>

          <!-- Avatar Preview -->
          <div class="flex flex-col items-center mb-6">
            <div class="relative">
              <div
                class="w-24 h-24 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center text-3xl text-white font-bold shadow-lg overflow-hidden"
              >
                <img
                  v-if="editingProfile.avatar"
                  :src="editingProfile.avatar"
                  :alt="editingProfile.fullName || 'Avatar'"
                  class="w-full h-full object-cover"
                  @error="editingProfile.avatar = ''"
                />
                <span v-else>
                  {{
                    editingProfile.fullName
                      ? editingProfile.fullName.charAt(0).toUpperCase()
                      : "?"
                  }}
                </span>
              </div>
              <button
                type="button"
                @click="showAvatarInput = !showAvatarInput"
                class="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-gray-700 rounded-full shadow-lg flex items-center justify-center text-lg hover:scale-110 transition-transform cursor-pointer"
                title="Change avatar"
              >
                📷
              </button>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {{ editingProfile.email }}
            </p>
          </div>

          <!-- Avatar Input -->
          <div v-if="showAvatarInput" class="space-y-3 mb-4">
            <!-- URL Input -->
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {{ t("avatarUrl") }}
              </label>
              <input
                v-model="editingProfile.avatar"
                type="url"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all cursor-text"
                :placeholder="t('enterAvatarUrl')"
              />
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ t("avatarUrlHint") }}
            </div>

            <!-- Divider -->
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div
                  class="w-full border-t border-gray-300 dark:border-gray-600"
                ></div>
              </div>
              <div class="relative flex justify-center text-xs uppercase">
                <span
                  class="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400"
                >
                  {{ t("or") }}
                </span>
              </div>
            </div>

            <!-- File Upload -->
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {{ t("uploadAvatar") }}
              </label>
              <div class="flex items-center gap-3">
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleFileChange"
                  class="hidden"
                />
                <button
                  type="button"
                  @click="triggerFileInput"
                  :disabled="authStore.loading"
                  class="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{{
                    authStore.loading ? t("uploading") : t("pickFile")
                  }}</span>
                  <span v-if="selectedFile" class="text-green-500">✓</span>
                </button>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ t("fileSizeLimit") }} • {{ t("fileTypeError") }}
              </p>
              <p v-if="uploadError" class="text-xs text-red-500 mt-1">
                {{ uploadError }}
              </p>
            </div>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleUpdateProfile" class="space-y-4">
            <!-- Full Name -->
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {{ t("fullName") }}
              </label>
              <input
                v-model="editingProfile.fullName"
                type="text"
                required
                class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all cursor-text"
                :placeholder="t('enterFullName')"
              />
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3 pt-4">
              <button
                type="button"
                @click="showProfileEdit = false"
                class="flex-1 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 font-semibold transition-all cursor-pointer"
              >
                {{ t("cancel") }}
              </button>
              <button
                type="submit"
                :disabled="authStore.loading"
                class="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 cursor-pointer"
              >
                {{ authStore.loading ? t("saving") : t("save") }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Transaction Form Modal -->
    <Transition name="modal">
      <div
        v-if="showForm"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click.self="showForm = false"
        ></div>
        <div
          class="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-modal-enter"
        >
          <TransactionForm
            :editing-transaction="editingTransaction"
            @form-submitted="handleFormSubmitted"
            @cancel-edit="handleCancelEdit"
          />
        </div>
      </div>
    </Transition>

    <!-- Tab Navigation -->
    <nav
      class="sticky top-[73px] z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex gap-2 py-3 overflow-x-auto scrollbar-hide">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer"
            :class="
              activeTab === tab.id
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30 shadow-emerald-500/20'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            "
          >
            <span class="text-lg">{{ tab.icon }}</span>
            <span>{{ t(tab.labelKey) }}</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Transition name="fade" mode="out-in">
        <Dashboard
          v-if="activeTab === 'dashboard'"
          key="dashboard"
          @edit="handleEdit"
        />
        <TransactionList
          v-else-if="activeTab === 'transactions'"
          key="transactions"
          @edit="handleEdit"
        />
        <Comparison v-else-if="activeTab === 'comparison'" key="comparison" />
        <Budget v-else-if="activeTab === 'budget'" key="budget" />
        <Recurring v-else-if="activeTab === 'recurring'" key="recurring" />
      </Transition>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import Budget from "./components/Budget.vue";
import Dashboard from "./components/Dashboard.vue";
import Recurring from "./components/Recurring.vue";
import TransactionForm from "./components/TransactionForm.vue";
import TransactionList from "./components/TransactionList.vue";
import { useAuthStore } from "./stores/authStore";
import { useSettingsStore } from "./stores/settingsStore";
import { useTransactionStore } from "./stores/transactionStore";
import type { Transaction } from "./types";

const router = useRouter();
const { t, locale } = useI18n();
const authStore = useAuthStore();
const settingsStore = useSettingsStore();
const transactionStore = useTransactionStore();

// State
const activeTab = ref("dashboard");
const showForm = ref(false);
const editingTransaction = ref<Transaction | undefined>(undefined);
const showUserMenu = ref(false);
const showProfileEdit = ref(false);
const showAvatarInput = ref(false);
const editingProfile = ref({ fullName: "", email: "", avatar: "" });
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const uploadError = ref("");
// User menu actions
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const closeUserMenu = () => {
  showUserMenu.value = false;
};

// Profile edit actions
const openProfileEdit = () => {
  if (user.value) {
    editingProfile.value = {
      fullName: user.value.full_name || "",
      email: user.value.email || "",
      avatar: user.value.avatar || "",
    };
  }
  showProfileEdit.value = true;
  showAvatarInput.value = false;
  selectedFile.value = null;
  uploadError.value = "";
  closeUserMenu();
};

const handleUpdateProfile = async () => {
  const result = await authStore.updateProfile(
    editingProfile.value.fullName,
    editingProfile.value.avatar || undefined,
  );
  if (result.success) {
    showProfileEdit.value = false;
  }
};

// File upload actions
const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  selectedFile.value = file;
  uploadError.value = "";

  // Upload the file
  const result = await authStore.uploadAvatar(file);
  if (result.success) {
    // Upload succeeded, fetch updated profile to get latest avatar URL
    await authStore.fetchProfile();
    if (user.value) {
      // Update the editing profile with new avatar URL
      editingProfile.value.avatar = user.value.avatar || "";
    }
    selectedFile.value = null;
  } else {
    uploadError.value = result.message || "Upload failed";
  }

  // Reset file input
  target.value = "";
};

// Handle click outside to close menu
const handleClickOutside = (event: MouseEvent) => {
  const menuElement = document.querySelector(".user-menu-dropdown");
  const buttonElement = document.querySelector("[data-user-menu-button]");

  if (
    showUserMenu.value &&
    menuElement &&
    !menuElement.contains(event.target as Node) &&
    (!buttonElement || !buttonElement.contains(event.target as Node))
  ) {
    closeUserMenu();
  }
};

// Add/remove click outside listener
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

// User info
const user = computed(() => authStore.user);
const userEmail = computed(() => authStore.userEmail);
const userName = computed(() => authStore.userName);

// Get user initial for avatar
const userInitial = computed(() => {
  if (user.value?.full_name) {
    return user.value.full_name.charAt(0).toUpperCase();
  }
  if (user.value?.email) {
    return user.value.email.charAt(0).toUpperCase();
  }
  return "?";
});

// Logout handler
const handleLogout = async () => {
  await authStore.logout();
  router.push({ name: "login" });
};

// Tabs configuration
const tabs = [
  { id: "dashboard", labelKey: "tabDashboard", icon: "📊" },
  { id: "transactions", labelKey: "tabTransactions", icon: "📝" },
  { id: "comparison", labelKey: "tabComparison", icon: "📈" },
  { id: "budget", labelKey: "tabBudget", icon: "💰" },
  { id: "recurring", labelKey: "tabRecurring", icon: "🔄" },
];

// Computed
const darkMode = computed(() => settingsStore.settings.enableDarkMode);

// Actions
const toggleDarkMode = () => {
  settingsStore.toggleDarkMode();
};

const toggleLanguage = () => {
  locale.value = locale.value === "vi" ? "en" : "vi";
  localStorage.setItem("locale", locale.value);
};

const handleEdit = (transaction: Transaction) => {
  editingTransaction.value = transaction;
  showForm.value = true;
};

const handleFormSubmitted = () => {
  showForm.value = false;
  editingTransaction.value = undefined;
};

const handleCancelEdit = () => {
  editingTransaction.value = undefined;
};

// Apply user settings from API
const applyUserSettings = (userSettings: any) => {
  if (!userSettings) return;

  // Apply language
  if (
    userSettings.language &&
    (userSettings.language === "vi" || userSettings.language === "en")
  ) {
    locale.value = userSettings.language;
    localStorage.setItem("locale", userSettings.language);
  }

  // Apply theme
  if (userSettings.theme) {
    const isDarkMode = userSettings.theme === "dark";
    if (settingsStore.settings.enableDarkMode !== isDarkMode) {
      settingsStore.toggleDarkMode();
    }
  }
};

// Watch for settings changes from auth store
watch(
  () => authStore.settings,
  (newSettings) => {
    if (newSettings) {
      applyUserSettings(newSettings);
    }
  },
  { immediate: true },
);

// Lifecycle - Add sample data on first load
onMounted(() => {
  if (transactionStore.transactions.length === 0) {
    addSampleData();
  }

  // Apply stored settings if no user settings yet
  if (!authStore.settings) {
    const savedLocale = localStorage.getItem("locale");
    if (savedLocale && (savedLocale === "vi" || savedLocale === "en")) {
      locale.value = savedLocale;
    }
  }
});

function addSampleData() {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const lastWeek = new Date(now);
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lastMonth = new Date(now);
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  // Add sample transactions
  transactionStore.addTransaction("Lương tháng", 15000000, "income", 9, now);
  transactionStore.addTransaction("Thưởng dự án", 3000000, "income", 10, now);
  transactionStore.addTransaction("Ăn trưa", 150000, "expense", 1, now);
  transactionStore.addTransaction("Đi làm xe bus", 15000, "expense", 2, now);
  transactionStore.addTransaction("Cà phê", 35000, "expense", 1, yesterday);
  transactionStore.addTransaction(
    "Tiền điện",
    500000,
    "expense",
    5,
    twoDaysAgo,
  );
  transactionStore.addTransaction("Mua sách", 200000, "expense", 7, yesterday);
  transactionStore.addTransaction("Hội thảo online", 100000, "expense", 4, now);
  transactionStore.addTransaction("Siêu thị", 850000, "expense", 1, lastWeek);
  transactionStore.addTransaction("Xăng xe", 200000, "expense", 2, lastWeek);
  transactionStore.addTransaction(
    "Freelance",
    5000000,
    "income",
    11,
    lastMonth,
  );
}
</script>

<style scoped>
/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .animate-modal-enter,
.modal-leave-active .animate-modal-enter {
  animation: modalSlideUp 0.3s ease;
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Hide scrollbar */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
