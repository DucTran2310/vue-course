<template>
  <div class="space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ t("tabBudget") }}
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ t("budgetDescription") }}
        </p>
      </div>
      <button
        @click="showAddBudget = true"
        class="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5"
      >
        <span class="text-lg">+</span>
        <span>{{ t("addBudget") }}</span>
      </button>
    </div>

    <!-- Total Budget Summary Card -->
    <div
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700"
      :class="{
        'border-l-4 border-red-500': totalBudgetStats.isOverBudget,
        'border-l-4 border-emerald-500': !totalBudgetStats.isOverBudget,
      }"
    >
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {{ t("totalBudget") }}
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t("totalLimit") }}
          </p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ formatCurrency(totalBudgetStats.totalLimit) }}
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t("totalSpent") }}
          </p>
          <p
            class="text-2xl font-bold"
            :class="
              totalBudgetStats.isOverBudget
                ? 'text-red-600 dark:text-red-400'
                : 'text-emerald-600 dark:text-emerald-400'
            "
          >
            {{ formatCurrency(totalBudgetStats.totalSpent) }}
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t("remaining") }}
          </p>
          <p
            class="text-2xl font-bold"
            :class="
              totalBudgetStats.totalRemaining > 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-600 dark:text-red-400'
            "
          >
            {{ formatCurrency(totalBudgetStats.totalRemaining) }}
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t("progress") }}
          </p>
          <p
            class="text-2xl font-bold"
            :class="
              totalBudgetStats.totalPercentage > 100
                ? 'text-red-600 dark:text-red-400'
                : totalBudgetStats.totalPercentage > 80
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-emerald-600 dark:text-emerald-400'
            "
          >
            {{ totalBudgetStats.totalPercentage.toFixed(0) }}%
          </p>
        </div>
      </div>

      <!-- Overall Progress Bar -->
      <div class="mt-4">
        <div class="flex justify-between text-sm mb-2">
          <span class="text-gray-600 dark:text-gray-400">{{
            t("progress")
          }}</span>
          <span
            :class="
              totalBudgetStats.totalPercentage > 100
                ? 'text-red-600 dark:text-red-400 font-semibold'
                : 'text-gray-900 dark:text-white'
            "
          >
            {{ totalBudgetStats.totalPercentage.toFixed(1) }}%
          </span>
        </div>
        <div
          class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden"
        >
          <div
            class="h-full rounded-full transition-all duration-500 ease-out relative"
            :class="{
              'bg-gradient-to-r from-red-500 to-red-600':
                totalBudgetStats.totalPercentage > 100,
              'bg-gradient-to-r from-amber-500 to-amber-600':
                totalBudgetStats.totalPercentage > 80 &&
                totalBudgetStats.totalPercentage <= 100,
              'bg-gradient-to-r from-emerald-500 to-cyan-500':
                totalBudgetStats.totalPercentage <= 80,
            }"
            :style="{
              width: Math.min(100, totalBudgetStats.totalPercentage) + '%',
            }"
          >
            <span
              v-if="totalBudgetStats.totalPercentage > 100"
              class="absolute right-0 top-0 h-full w-8 bg-red-700 animate-pulse"
            ></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Budget Alerts -->
    <div
      v-if="overBudgetCategories.length > 0"
      class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4"
    >
      <div class="flex items-center gap-3">
        <span class="text-3xl">⚠️</span>
        <div>
          <p class="font-semibold text-red-900 dark:text-red-100">
            {{ t("budgetWarning") }}
          </p>
          <p class="text-sm text-red-700 dark:text-red-300">
            {{ t("overBudgetCategories") }}:
            {{ overBudgetCategories.map((c) => c.categoryName).join(", ") }}
          </p>
        </div>
      </div>
    </div>

    <!-- Budget Cards Grid -->
    <div
      v-if="budgetStatus.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div
        v-for="status in budgetStatus"
        :key="status.categoryId"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all hover:-translate-y-1"
        :class="{
          'border-l-4 border-red-500': status.isOverBudget,
          'border-l-4 border-emerald-500':
            !status.isOverBudget && status.percentage > 50,
          'border-l-4 border-blue-500':
            !status.isOverBudget && status.percentage <= 50,
        }"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              :style="{ backgroundColor: status.categoryColor + '20' }"
            >
              {{ status.categoryIcon }}
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">
                {{ status.categoryName }}
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 capitalized">
                {{ t(status.period) }}
              </p>
            </div>
          </div>
          <button
            @click="editBudget(status.categoryId)"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span class="text-lg">✏️</span>
          </button>
        </div>

        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ t("limit") }}:
            </span>
            <span class="font-semibold text-gray-900 dark:text-white">
              {{ formatCurrency(status.limit) }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ t("spent") }}:
            </span>
            <span
              class="font-semibold"
              :class="
                status.isOverBudget
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-900 dark:text-white'
              "
            >
              {{ formatCurrency(status.spent) }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ t("remaining") }}:
            </span>
            <span
              class="font-semibold"
              :class="
                status.remaining > 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              "
            >
              {{ formatCurrency(status.remaining) }}
            </span>
          </div>

          <!-- Progress Bar -->
          <div class="mt-4">
            <div class="flex justify-between text-sm mb-2">
              <span class="text-gray-600 dark:text-gray-400">{{
                t("progress")
              }}</span>
              <span
                :class="
                  status.percentage > 100
                    ? 'text-red-600 dark:text-red-400 font-semibold'
                    : 'text-gray-900 dark:text-white'
                "
              >
                {{ status.percentage.toFixed(0) }}%
              </span>
            </div>
            <div
              class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden"
            >
              <div
                class="h-full rounded-full transition-all duration-500 ease-out relative"
                :class="{
                  'bg-gradient-to-r from-red-500 to-red-600':
                    status.percentage > 100,
                  'bg-gradient-to-r from-amber-500 to-amber-600':
                    status.percentage > 80 && status.percentage <= 100,
                  'bg-gradient-to-r from-emerald-500 to-cyan-500':
                    status.percentage <= 80,
                }"
                :style="{ width: Math.min(100, status.percentage) + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 border border-gray-200 dark:border-gray-700 text-center"
    >
      <div class="text-6xl mb-4">💰</div>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {{ t("noBudgets") }}
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        {{ t("noBudgetsDescription") }}
      </p>
      <button
        @click="showAddBudget = true"
        class="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5"
      >
        {{ t("addFirstBudget") }}
      </button>
    </div>

    <!-- Add Budget Modal -->
    <Transition name="modal">
      <div
        v-if="showAddBudget"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click.self="showAddBudget = false"
        ></div>
        <div
          class="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 animate-modal-enter"
        >
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {{ editingBudgetCategoryId ? t("editBudget") : t("addBudget") }}
          </h2>

          <form @submit.prevent="handleSubmitBudget" class="space-y-4">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {{ t("category") }}
              </label>
              <select
                v-model="budgetForm.categoryId"
                required
                class="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              >
                <option value="">{{ t("selectCategory") }}</option>
                <option
                  v-for="category in expenseCategories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.icon }} {{ category.name }}
                </option>
              </select>
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {{ t("budgetAmount") }}
              </label>
              <input
                v-model.number="budgetForm.amount"
                type="number"
                min="0"
                required
                placeholder="0"
                class="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {{ t("period") }}
              </label>
              <select
                v-model="budgetForm.period"
                required
                class="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              >
                <option value="daily">{{ t("daily") }}</option>
                <option value="weekly">{{ t("weekly") }}</option>
                <option value="monthly">{{ t("monthly") }}</option>
              </select>
            </div>

            <div class="flex gap-3 pt-4">
              <button
                type="button"
                @click="showAddBudget = false"
                class="flex-1 px-4 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold transition-all"
              >
                {{ t("cancel") }}
              </button>
              <button
                type="submit"
                class="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-emerald-500/30 transition-all"
              >
                {{ t("save") }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useFormat } from "../composables/useFormat";
import { useBudgetStore } from "../stores/budgetStore";
import { useCategoryStore } from "../stores/categoryStore";

const { t } = useI18n();
const budgetStore = useBudgetStore();
const categoryStore = useCategoryStore();
const { formatCurrency } = useFormat();

// State
const showAddBudget = ref(false);
const editingBudgetCategoryId = ref<number | undefined>(undefined);
const budgetForm = ref({
  categoryId: "",
  amount: 0,
  period: "monthly" as "daily" | "weekly" | "monthly",
});

// Computed
const budgetStatus = computed(() => budgetStore.budgetStatus);
const totalBudgetStats = computed(() => budgetStore.totalBudgetStats);
const expenseCategories = computed(() => categoryStore.expenseCategories);
const overBudgetCategories = computed(() =>
  budgetStatus.value.filter((status) => status.isOverBudget),
);

// Actions
const editBudget = (categoryId: number) => {
  const budget = budgetStore.getBudgetByCategory(categoryId);
  if (budget) {
    editingBudgetCategoryId.value = categoryId;
    budgetForm.value = {
      categoryId: String(categoryId),
      amount: budget.amount,
      period: budget.period,
    };
    showAddBudget.value = true;
  }
};

const handleSubmitBudget = () => {
  if (budgetForm.value.categoryId && budgetForm.value.amount > 0) {
    budgetStore.setBudgetLimit(
      Number(budgetForm.value.categoryId),
      budgetForm.value.amount,
      budgetForm.value.period,
    );
    showAddBudget.value = false;
    editingBudgetCategoryId.value = undefined;
    budgetForm.value = { categoryId: "", amount: 0, period: "monthly" };
  }
};
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
</style>
