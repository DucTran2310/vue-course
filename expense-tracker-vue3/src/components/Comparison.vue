<template>
  <div class="space-y-6">
    <!-- Month Selection -->
    <div
      class="rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <h2
        class="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2"
      >
        <span class="text-2xl">📊</span>
        {{ t("compareMonths") }}
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div>
          <label
            class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            {{ t("selectMonth1") }}
          </label>
          <input
            v-model="month1"
            type="month"
            class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <div class="flex items-center justify-center pb-3">
          <span class="text-3xl text-gray-300 dark:text-gray-600">↔️</span>
        </div>
        <div>
          <label
            class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            {{ t("selectMonth2") }}
          </label>
          <input
            v-model="month2"
            type="month"
            class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>
    </div>

    <!-- Comparison Results -->
    <div v-if="hasData" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Month 1 Stats -->
      <div
        class="rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white shadow-xl shadow-blue-500/20"
      >
        <h3 class="text-lg font-bold mb-6 flex items-center gap-2">
          <span class="text-2xl">📅</span>
          {{ formatMonth(month1) }}
        </h3>
        <div class="space-y-4">
          <div
            class="flex justify-between items-center p-3 rounded-xl bg-white/10 backdrop-blur-sm"
          >
            <span class="text-blue-100">{{ t("monthlyIncome") }}</span>
            <span class="text-xl font-bold text-green-300">{{
              formatCurrency(stats1.totalIncome)
            }}</span>
          </div>
          <div
            class="flex justify-between items-center p-3 rounded-xl bg-white/10 backdrop-blur-sm"
          >
            <span class="text-blue-100">{{ t("monthlyExpense") }}</span>
            <span class="text-xl font-bold text-red-300">{{
              formatCurrency(stats1.totalExpense)
            }}</span>
          </div>
          <div
            class="flex justify-between items-center p-4 rounded-xl bg-white/20 backdrop-blur-sm"
          >
            <span class="text-blue-100 font-semibold">{{ t("balance") }}</span>
            <span
              :class="stats1.balance >= 0 ? 'text-green-300' : 'text-red-300'"
              class="text-2xl font-bold"
            >
              {{ formatCurrency(stats1.balance) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Month 2 Stats -->
      <div
        class="rounded-3xl bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white shadow-xl shadow-purple-500/20"
      >
        <h3 class="text-lg font-bold mb-6 flex items-center gap-2">
          <span class="text-2xl">📅</span>
          {{ formatMonth(month2) }}
        </h3>
        <div class="space-y-4">
          <div
            class="flex justify-between items-center p-3 rounded-xl bg-white/10 backdrop-blur-sm"
          >
            <span class="text-purple-100">{{ t("monthlyIncome") }}</span>
            <span class="text-xl font-bold text-green-300">{{
              formatCurrency(stats2.totalIncome)
            }}</span>
          </div>
          <div
            class="flex justify-between items-center p-3 rounded-xl bg-white/10 backdrop-blur-sm"
          >
            <span class="text-purple-100">{{ t("monthlyExpense") }}</span>
            <span class="text-xl font-bold text-red-300">{{
              formatCurrency(stats2.totalExpense)
            }}</span>
          </div>
          <div
            class="flex justify-between items-center p-4 rounded-xl bg-white/20 backdrop-blur-sm"
          >
            <span class="text-purple-100 font-semibold">{{
              t("balance")
            }}</span>
            <span
              :class="stats2.balance >= 0 ? 'text-green-300' : 'text-red-300'"
              class="text-2xl font-bold"
            >
              {{ formatCurrency(stats2.balance) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Difference Section -->
    <div
      v-if="hasData"
      class="rounded-3xl bg-gradient-to-r from-emerald-50 via-cyan-50 to-blue-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 p-6 shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <h3
        class="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2"
      >
        <span class="text-2xl">📈</span>
        {{ t("comparison") }}
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <!-- Income Diff -->
        <div
          class="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-md border border-gray-100 dark:border-gray-700"
        >
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {{ t("incomeDifference") }}
          </p>
          <p
            :class="
              diffIncome >= 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            "
            class="text-2xl font-bold mb-1"
          >
            {{ diffIncome >= 0 ? "↑" : "↓" }}
            {{ formatCurrency(Math.abs(diffIncome)) }}
          </p>
          <div class="flex items-center gap-2">
            <div
              class="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"
            >
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="diffIncome >= 0 ? 'bg-green-500' : 'bg-red-500'"
                :style="{
                  width: Math.min(Math.abs(diffIncomePercent), 100) + '%',
                }"
              ></div>
            </div>
            <span
              :class="diffIncome >= 0 ? 'text-green-600' : 'text-red-600'"
              class="text-xs font-semibold"
            >
              {{ Math.abs(diffIncomePercent).toFixed(1) }}%
            </span>
          </div>
        </div>

        <!-- Expense Diff -->
        <div
          class="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-md border border-gray-100 dark:border-gray-700"
        >
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {{ t("expenseDifference") }}
          </p>
          <p
            :class="
              diffExpense <= 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            "
            class="text-2xl font-bold mb-1"
          >
            {{ diffExpense >= 0 ? "↑" : "↓" }}
            {{ formatCurrency(Math.abs(diffExpense)) }}
          </p>
          <div class="flex items-center gap-2">
            <div
              class="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"
            >
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="diffExpense <= 0 ? 'bg-green-500' : 'bg-red-500'"
                :style="{
                  width: Math.min(Math.abs(diffExpensePercent), 100) + '%',
                }"
              ></div>
            </div>
            <span
              :class="diffExpense <= 0 ? 'text-green-600' : 'text-red-600'"
              class="text-xs font-semibold"
            >
              {{ Math.abs(diffExpensePercent).toFixed(1) }}%
            </span>
          </div>
        </div>

        <!-- Balance Diff -->
        <div
          class="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-md border border-gray-100 dark:border-gray-700"
        >
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {{ t("balanceDifference") }}
          </p>
          <p
            :class="
              diffBalance >= 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            "
            class="text-2xl font-bold mb-1"
          >
            {{ diffBalance >= 0 ? "↑" : "↓" }}
            {{ formatCurrency(Math.abs(diffBalance)) }}
          </p>
          <div class="flex items-center gap-2">
            <div
              class="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"
            >
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="diffBalance >= 0 ? 'bg-green-500' : 'bg-red-500'"
                :style="{
                  width: Math.min(Math.abs(diffBalancePercent), 100) + '%',
                }"
              ></div>
            </div>
            <span
              :class="diffBalance >= 0 ? 'text-green-600' : 'text-red-600'"
              class="text-xs font-semibold"
            >
              {{ Math.abs(diffBalancePercent).toFixed(1) }}%
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bar Chart Comparison -->
    <div
      v-if="hasData"
      class="rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <h3
        class="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2"
      >
        <span class="text-2xl">📊</span>
        {{ t("comparison") }}
      </h3>
      <div class="space-y-6">
        <!-- Income Comparison -->
        <div>
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-600 dark:text-gray-400 font-medium">{{
              t("monthlyIncome")
            }}</span>
          </div>
          <div
            class="relative h-10 bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden"
          >
            <div
              class="absolute h-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-700 flex items-center justify-end pr-3"
              :style="{ width: barWidth(stats1.totalIncome, maxValue) + '%' }"
            >
              <span class="text-xs font-bold text-white">{{
                formatCurrency(stats1.totalIncome)
              }}</span>
            </div>
          </div>
          <div
            class="relative h-10 bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden mt-2"
          >
            <div
              class="absolute h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700 flex items-center justify-end pr-3"
              :style="{ width: barWidth(stats2.totalIncome, maxValue) + '%' }"
            >
              <span class="text-xs font-bold text-white">{{
                formatCurrency(stats2.totalIncome)
              }}</span>
            </div>
          </div>
          <div
            class="flex justify-between text-xs mt-2 text-gray-500 dark:text-gray-400"
          >
            <span>{{ formatMonth(month1) }}</span>
            <span>{{ formatMonth(month2) }}</span>
          </div>
        </div>

        <!-- Expense Comparison -->
        <div>
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-600 dark:text-gray-400 font-medium">{{
              t("monthlyExpense")
            }}</span>
          </div>
          <div
            class="relative h-10 bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden"
          >
            <div
              class="absolute h-full bg-gradient-to-r from-red-400 to-pink-500 transition-all duration-700 flex items-center justify-end pr-3"
              :style="{ width: barWidth(stats1.totalExpense, maxValue) + '%' }"
            >
              <span class="text-xs font-bold text-white">{{
                formatCurrency(stats1.totalExpense)
              }}</span>
            </div>
          </div>
          <div
            class="relative h-10 bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden mt-2"
          >
            <div
              class="absolute h-full bg-gradient-to-r from-orange-400 to-rose-500 transition-all duration-700 flex items-center justify-end pr-3"
              :style="{ width: barWidth(stats2.totalExpense, maxValue) + '%' }"
            >
              <span class="text-xs font-bold text-white">{{
                formatCurrency(stats2.totalExpense)
              }}</span>
            </div>
          </div>
          <div
            class="flex justify-between text-xs mt-2 text-gray-500 dark:text-gray-400"
          >
            <span>{{ formatMonth(month1) }}</span>
            <span>{{ formatMonth(month2) }}</span>
          </div>
        </div>

        <!-- Balance Comparison -->
        <div>
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-600 dark:text-gray-400 font-medium">{{
              t("balance")
            }}</span>
          </div>
          <div
            class="relative h-10 bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden"
          >
            <div
              class="absolute h-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-700 flex items-center justify-end pr-3"
              :style="{
                width: barWidth(Math.abs(stats1.balance), maxAbsBalance) + '%',
              }"
            >
              <span class="text-xs font-bold text-white">{{
                formatCurrency(stats1.balance)
              }}</span>
            </div>
          </div>
          <div
            class="relative h-10 bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden mt-2"
          >
            <div
              class="absolute h-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-700 flex items-center justify-end pr-3"
              :style="{
                width: barWidth(Math.abs(stats2.balance), maxAbsBalance) + '%',
              }"
            >
              <span class="text-xs font-bold text-white">{{
                formatCurrency(stats2.balance)
              }}</span>
            </div>
          </div>
          <div
            class="flex justify-between text-xs mt-2 text-gray-500 dark:text-gray-400"
          >
            <span>{{ formatMonth(month1) }}</span>
            <span>{{ formatMonth(month2) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="!hasData"
      class="flex flex-col items-center justify-center py-16 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
    >
      <div
        class="w-24 h-24 mb-6 flex items-center justify-center text-6xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full"
      >
        📭
      </div>
      <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">
        {{ t("emptyComparison") }}
      </h3>
      <p class="text-gray-500 dark:text-gray-400 text-sm text-center">
        Chọn hai tháng để so sánh
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useFormat } from "../composables/useFormat";
import { useTransactionStore } from "../stores/transactionStore";

const { t } = useI18n();
const transactionStore = useTransactionStore();
const { formatCurrency } = useFormat();

// Get current month for default
const now = new Date();
const currentMonth = now.toISOString().slice(0, 7);
const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  .toISOString()
  .slice(0, 7);

const month1 = ref(currentMonth);
const month2 = ref(lastMonth);

// Helper to get stats for a month
function getMonthStats(month: string) {
  const [year, monthNum] = month.split("-").map(Number);
  return transactionStore.getMonthlyStats(year, monthNum - 1);
}

const stats1 = computed(() => getMonthStats(month1.value));
const stats2 = computed(() => getMonthStats(month2.value));

const hasData = computed(() => {
  return stats1.value.transactionCount > 0 || stats2.value.transactionCount > 0;
});

// Differences
const diffIncome = computed(
  () => stats2.value.totalIncome - stats1.value.totalIncome,
);
const diffExpense = computed(
  () => stats2.value.totalExpense - stats1.value.totalExpense,
);
const diffBalance = computed(() => stats2.value.balance - stats1.value.balance);

// Percentage differences
const diffIncomePercent = computed(() => {
  if (stats1.value.totalIncome === 0) return 0;
  return (diffIncome.value / stats1.value.totalIncome) * 100;
});

const diffExpensePercent = computed(() => {
  if (stats1.value.totalExpense === 0) return 0;
  return (diffExpense.value / stats1.value.totalExpense) * 100;
});

const diffBalancePercent = computed(() => {
  if (stats1.value.balance === 0) return 0;
  return (diffBalance.value / stats1.value.balance) * 100;
});

// For bar chart
const maxValue = computed(() =>
  Math.max(
    stats1.value.totalIncome,
    stats2.value.totalIncome,
    stats1.value.totalExpense,
    stats2.value.totalExpense,
    1,
  ),
);

const maxAbsBalance = computed(() =>
  Math.max(Math.abs(stats1.value.balance), Math.abs(stats2.value.balance), 1),
);

const barWidth = (value: number, max: number) => {
  return Math.min((value / max) * 100, 100);
};

const formatMonth = (monthStr: string) => {
  const [year, month] = monthStr.split("-");
  return `Tháng ${month}/${year}`;
};
</script>

<style scoped>
.comparison-container {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
