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
            <!-- Language Switcher -->
            <button
              @click="toggleLanguage"
              class="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-sm font-medium text-gray-700 dark:text-gray-300"
              :title="t('language')"
            >
              {{ locale === "vi" ? "🇻🇳" : "🇺🇸" }} {{ locale.toUpperCase() }}
            </button>
            <!-- Dark Mode Toggle -->
            <button
              @click="toggleDarkMode"
              class="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center text-xl hover:scale-110 transition-all shadow-md"
              :title="darkMode ? t('light') : t('dark')"
            >
              {{ darkMode ? "☀️" : "🌙" }}
            </button>
            <!-- Add Transaction Button -->
            <button
              @click="showForm = !showForm"
              class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all hover:-translate-y-0.5"
              :class="{ 'opacity-75': showForm }"
            >
              <span class="text-xl">+</span>
              <span class="hidden sm:inline">{{ t("newTransaction") }}</span>
            </button>
          </div>
        </div>
      </div>
    </header>

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
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all"
            :class="
              activeTab === tab.id
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30'
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
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import Budget from "./components/Budget.vue";
import Comparison from "./components/Comparison.vue";
import Dashboard from "./components/Dashboard.vue";
import Recurring from "./components/Recurring.vue";
import TransactionForm from "./components/TransactionForm.vue";
import TransactionList from "./components/TransactionList.vue";
import { useSettingsStore } from "./stores/settingsStore";
import { useTransactionStore } from "./stores/transactionStore";
import type { Transaction } from "./types";

const { t, locale } = useI18n();
const settingsStore = useSettingsStore();
const transactionStore = useTransactionStore();

// State
const activeTab = ref("dashboard");
const showForm = ref(false);
const editingTransaction = ref<Transaction | undefined>(undefined);

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

// Lifecycle - Add sample data on first load
onMounted(() => {
  if (transactionStore.transactions.length === 0) {
    addSampleData();
  }
  // Load saved locale
  const savedLocale = localStorage.getItem("locale");
  if (savedLocale && (savedLocale === "vi" || savedLocale === "en")) {
    locale.value = savedLocale;
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
