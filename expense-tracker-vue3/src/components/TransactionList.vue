<template>
  <div class="space-y-6">
    <!-- Filter Bar -->
    <div
      class="rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1 relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            >🔍</span
          >
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('search')"
            class="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <!-- Filters -->
        <div class="flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide">
          <!-- Type Filter -->
          <select
            v-model="filterType"
            class="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer whitespace-nowrap"
          >
            <option value="all">{{ t("allTypes") }}</option>
            <option value="expense">{{ t("expense") }}</option>
            <option value="income">{{ t("income") }}</option>
          </select>

          <!-- Category Filter -->
          <select
            v-model="filterCategory"
            class="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer whitespace-nowrap"
          >
            <option value="all">{{ t("allCategories") }}</option>
            <option v-for="cat in allCategories" :key="cat.id" :value="cat.id">
              {{ cat.icon }} {{ cat.name }}
            </option>
          </select>

          <!-- Sort Button -->
          <button
            @click="toggleSortOrder"
            class="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all whitespace-nowrap flex items-center gap-2 font-medium"
          >
            <span>{{ sortOrder === "asc" ? "↑" : "↓" }}</span>
            <span class="hidden sm:inline">{{ sortOrderLabel }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Transaction List -->
    <div v-if="filteredTransactions.length > 0" class="space-y-3">
      <TransitionGroup name="list">
        <TransactionItem
          v-for="transaction in filteredTransactions"
          :key="transaction.id"
          :transaction="transaction"
          @edit="handleEdit"
        />
      </TransitionGroup>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="flex flex-col items-center justify-center py-16 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
    >
      <div
        class="w-24 h-24 mb-6 flex items-center justify-center text-6xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full"
      >
        📭
      </div>
      <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">
        {{ t("noTransactions") }}
      </h3>
      <p
        class="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-xs text-center"
      >
        {{ t("trySearch") }}
      </p>
      <button
        @click="$emit('addTransaction')"
        class="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5"
      >
        + {{ t("newTransaction") }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useCategoryStore } from "../stores/categoryStore";
import { useTransactionStore } from "../stores/transactionStore";
import type { SortOption, SortOrder, Transaction } from "../types";
import TransactionItem from "./TransactionItem.vue";

interface Props {
  onEdit?: (transaction: Transaction) => void;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  edit: [transaction: Transaction];
  addTransaction: [];
}>();

const { t } = useI18n();
const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();

// Local filter state
const searchQuery = ref("");
const filterType = ref("all");
const filterCategory = ref("all");
const sortBy = ref<SortOption>("date");
const sortOrder = ref<SortOrder>("desc");

// All categories
const allCategories = computed(() => [
  ...categoryStore.expenseCategories,
  ...categoryStore.incomeCategories,
]);

// Watch and update store filter
watch(
  [searchQuery, filterType, filterCategory],
  () => {
    transactionStore.setFilter({
      type: filterType.value as any,
      category:
        filterCategory.value === "all" ? "all" : Number(filterCategory.value),
      searchQuery: searchQuery.value,
    });
  },
  { immediate: true },
);

// Watch and update store sort
watch([sortBy, sortOrder], () => {
  transactionStore.setSort(sortBy.value, sortOrder.value);
});

const sortOrderLabel = computed(() => {
  return sortOrder.value === "asc"
    ? t("sortByDate").replace("Theo ", "") + " ↑"
    : t("sortByDate").replace("Theo ", "") + " ↓";
});

const filteredTransactions = computed(() => {
  return transactionStore.filteredTransactions;
});

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
};

const handleEdit = (transaction: Transaction) => {
  emit("edit", transaction);
  if (props.onEdit) {
    props.onEdit(transaction);
  }
};
</script>

<style scoped>
/* List Animation */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.list-leave-active {
  position: absolute;
  width: 100%;
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
