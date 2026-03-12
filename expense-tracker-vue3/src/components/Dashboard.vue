<template>
  <div class="space-y-6">
    <!-- Header with Export Buttons -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ t("tabDashboard") }}
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ t("recentTransactions") || "Tổng quan về tài chính của bạn" }}
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          @click="handleExportCSV"
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-all"
          :title="t('exportCSV')"
        >
          <span class="text-lg">📄</span>
          <span class="hidden sm:inline">{{ t("exportCSV") }}</span>
        </button>
        <button
          @click="handleExportExcel"
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-all"
          :title="t('exportExcel')"
        >
          <span class="text-lg">📊</span>
          <span class="hidden sm:inline">{{ t("exportExcel") }}</span>
        </button>
        <button
          @click="handleExportPDF"
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-all"
          :title="t('exportPDF')"
        >
          <span class="text-lg">📑</span>
          <span class="hidden sm:inline">{{ t("exportPDF") }}</span>
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Income Card -->
      <div
        class="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 p-6 text-white shadow-xl shadow-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-1"
      >
        <div
          class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"
        ></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-3">
            <div
              class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl"
            >
              💰
            </div>
            <span class="text-emerald-100 text-sm font-medium">+12.5%</span>
          </div>
          <p class="text-emerald-100 text-sm font-medium mb-1">
            {{ t("monthlyIncome") }}
          </p>
          <p class="text-3xl font-bold">
            {{ formatCurrency(stats.totalIncome) }}
          </p>
        </div>
      </div>

      <!-- Expense Card -->
      <div
        class="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-400 via-pink-500 to-rose-500 p-6 text-white shadow-xl shadow-red-500/20 hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-300 hover:-translate-y-1"
      >
        <div
          class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"
        ></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-3">
            <div
              class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl"
            >
              💸
            </div>
            <span class="text-red-100 text-sm font-medium">-8.2%</span>
          </div>
          <p class="text-red-100 text-sm font-medium mb-1">
            {{ t("monthlyExpense") }}
          </p>
          <p class="text-3xl font-bold">
            {{ formatCurrency(stats.totalExpense) }}
          </p>
        </div>
      </div>

      <!-- Balance Card -->
      <div
        class="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-500 p-6 text-white shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1"
      >
        <div
          class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"
        ></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-3">
            <div
              class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl"
            >
              📊
            </div>
            <span
              :class="stats.balance >= 0 ? 'text-blue-100' : 'text-red-100'"
              class="text-sm font-medium"
            >
              {{ stats.balance >= 0 ? "+" : ""
              }}{{ formatCurrency(stats.balance) }}
            </span>
          </div>
          <p class="text-blue-100 text-sm font-medium mb-1">
            {{ t("balance") }}
          </p>
          <p class="text-3xl font-bold">{{ formatCurrency(stats.balance) }}</p>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 7 Days Chart -->
      <div
        class="rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-100 dark:border-gray-700"
      >
        <div class="flex items-center justify-between mb-6">
          <h3
            class="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2"
          >
            <span class="text-2xl">📈</span>
            {{ t("last7Days") }}
          </h3>
        </div>
        <div class="flex items-end justify-between gap-2 h-40">
          <div
            v-for="(day, index) in last7Days"
            :key="index"
            class="flex-1 flex flex-col items-center gap-2"
          >
            <div class="w-full relative flex items-end justify-center h-32">
              <div
                class="w-full max-w-[40px] rounded-t-xl bg-gradient-to-t from-rose-500 to-pink-400 transition-all duration-500 hover:from-rose-600 hover:to-pink-500"
                :style="{ height: Math.max(day.height, 4) + 'px' }"
              ></div>
            </div>
            <span
              class="text-xs font-medium text-gray-500 dark:text-gray-400"
              >{{ day.label }}</span
            >
          </div>
        </div>
      </div>

      <!-- Category Chart -->
      <div
        class="rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-100 dark:border-gray-700"
      >
        <div class="flex items-center justify-between mb-6">
          <h3
            class="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2"
          >
            <span class="text-2xl">🎯</span>
            {{ t("expensesByCategory") }}
          </h3>
        </div>
        <div v-if="categoryData.length > 0" class="space-y-4">
          <div v-for="(cat, index) in categoryData" :key="index" class="group">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-3">
                <div
                  class="w-3 h-3 rounded-full"
                  :style="{ backgroundColor: cat.color }"
                ></div>
                <span
                  class="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >{{ cat.label }}</span
                >
              </div>
              <div class="flex items-center gap-3">
                <span class="text-xs text-gray-400"
                  >{{ cat.percentage.toFixed(0) }}%</span
                >
                <span
                  class="text-sm font-semibold text-gray-800 dark:text-white min-w-[80px] text-right"
                >
                  {{ formatCurrency(cat.value) }}
                </span>
              </div>
            </div>
            <div
              class="h-2.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden"
            >
              <div
                class="h-full rounded-full transition-all duration-700 ease-out"
                :style="{
                  width: cat.percentage + '%',
                  backgroundColor: cat.color,
                }"
              ></div>
            </div>
          </div>
        </div>
        <div
          v-else
          class="flex flex-col items-center justify-center h-40 text-gray-400"
        >
          <span class="text-4xl mb-2">📭</span>
          <p class="text-sm">{{ t("noData") }}</p>
        </div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div
      class="rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <div class="flex items-center justify-between mb-6">
        <h3
          class="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2"
        >
          <span class="text-2xl">📝</span>
          {{ t("recentTransactions") || "Giao dịch gần đây" }}
        </h3>
        <button
          @click="$emit('edit', recentTransactions[0])"
          class="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
        >
          Xem tất cả →
        </button>
      </div>
      <div v-if="recentTransactions.length > 0" class="space-y-3">
        <TransactionItem
          v-for="transaction in recentTransactions"
          :key="transaction.id"
          :transaction="transaction"
          @edit="handleEdit"
        />
      </div>
      <div
        v-else
        class="flex flex-col items-center justify-center h-40 text-gray-400"
      >
        <span class="text-4xl mb-2">📭</span>
        <p class="text-sm">{{ t("noData") }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useExport } from "../composables/useExport";
import { useFormat } from "../composables/useFormat";
import { useTransactionStore } from "../stores/transactionStore";
import type { Transaction } from "../types";
import TransactionItem from "./TransactionItem.vue";

const { t } = useI18n();
const transactionStore = useTransactionStore();
const { formatCurrency } = useFormat();
const { exportToCSV, exportToExcel, exportToPDF } = useExport();

// Stats from store
const stats = computed(() => transactionStore.monthlyStats);

// Last 7 days chart data
const last7Days = computed(() => {
  const chartData = transactionStore.last7DaysChart;
  const maxValue = Math.max(...chartData.map((d) => d.value), 1);

  return chartData.map((d) => ({
    label: d.label,
    value: d.value,
    height: (d.value / maxValue) * 128,
    color: d.color,
  }));
});

// Category chart data
const categoryData = computed(() => {
  const chartData = transactionStore.expensesByCategoryChart;
  const totalValue = chartData.reduce((sum, d) => sum + d.value, 0);

  if (totalValue === 0) return [];

  return chartData.map((d) => ({
    label: d.label,
    value: d.value,
    color: d.color,
    percentage: (d.value / totalValue) * 100,
  }));
});

// Recent transactions (last 5)
const recentTransactions = computed(() => {
  return transactionStore.filteredTransactions.slice(0, 5);
});

// Handle edit
const handleEdit = (transaction: Transaction) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).$emit("edit-transaction", transaction);
};

// Export functions
const handleExportCSV = async () => {
  await exportToCSV(transactionStore.filteredTransactions, "transactions");
};

const handleExportExcel = async () => {
  await exportToExcel(transactionStore.filteredTransactions, "transactions");
};

const handleExportPDF = async () => {
  await exportToPDF(transactionStore.filteredTransactions, "transactions");
};

// Debug export
const debugExport = () => {
  console.log(
    "Exporting transactions:",
    transactionStore.filteredTransactions.length,
  );
  console.log("First transaction:", transactionStore.filteredTransactions[0]);
};

defineEmits<{
  edit: [transaction: Transaction];
}>();
</script>

<style scoped>
/* Smooth bar animation */
@keyframes growUp {
  from {
    transform: scaleY(0);
    opacity: 0;
  }
  to {
    transform: scaleY(1);
    opacity: 1;
  }
}

.group:hover .w-full {
  animation: growUp 0.3s ease-out;
}
</style>
