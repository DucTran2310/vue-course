<template>
  <form @submit.prevent="handleSubmit" class="space-y-5 p-6">
    <!-- Header -->
    <div
      class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700"
    >
      <h3
        class="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2"
      >
        <span class="text-2xl">{{ editingTransaction ? "✏️" : "➕" }}</span>
        {{ editingTransaction ? t("editTransaction") : t("addTransaction") }}
      </h3>
    </div>

    <!-- Type Toggle -->
    <div class="flex gap-3 p-1 bg-gray-100 dark:bg-gray-900 rounded-2xl">
      <label class="flex-1 cursor-pointer">
        <input
          type="radio"
          v-model="formData.type"
          value="expense"
          @change="handleTypeChange"
          class="hidden"
        />
        <div
          class="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all"
          :class="
            formData.type === 'expense'
              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/30'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          "
        >
          <span class="text-lg">💸</span>
          <span>{{ t("expense") }}</span>
        </div>
      </label>
      <label class="flex-1 cursor-pointer">
        <input
          type="radio"
          v-model="formData.type"
          value="income"
          @change="handleTypeChange"
          class="hidden"
        />
        <div
          class="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all"
          :class="
            formData.type === 'income'
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          "
        >
          <span class="text-lg">💰</span>
          <span>{{ t("income") }}</span>
        </div>
      </label>
    </div>

    <!-- Title -->
    <div>
      <label
        class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
      >
        {{ t("title") }}
      </label>
      <input
        v-model="formData.title"
        type="text"
        :placeholder="t('title') + '...'"
        required
        class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
      />
    </div>

    <!-- Amount -->
    <div>
      <label
        class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
      >
        {{ t("amount") }}
      </label>
      <div class="relative">
        <input
          v-model="amountInput"
          type="text"
          inputmode="numeric"
          placeholder="1,500,000"
          required
          class="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono text-lg font-semibold"
        />
        <span
          class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold"
          >₫</span
        >
        <span
          class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold"
          >VND</span
        >
      </div>
    </div>

    <!-- Category -->
    <div>
      <label
        class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
      >
        {{ t("category") }}
      </label>
      <select
        v-model.number="formData.category"
        class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer"
      >
        <option value="">{{ t("allCategories") }}</option>
        <option
          v-for="cat in availableCategories"
          :key="cat.id"
          :value="cat.id"
        >
          {{ cat.icon }} {{ cat.name }}
        </option>
      </select>
    </div>

    <!-- Date & Status Row -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label
          class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
        >
          {{ t("date") }}
        </label>
        <input
          v-model="dateString"
          type="date"
          required
          class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>
      <div>
        <label
          class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
        >
          {{ t("status") }}
        </label>
        <select
          v-model="formData.status"
          class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer"
        >
          <option value="completed">{{ t("completed") }}</option>
          <option value="pending">{{ t("pending") }}</option>
          <option value="cancelled">{{ t("cancelled") }}</option>
        </select>
      </div>
    </div>

    <!-- Notes -->
    <div>
      <label
        class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
      >
        {{ t("notes") }}
      </label>
      <textarea
        v-model="formData.notes"
        :placeholder="t('notes') + '...'"
        rows="2"
        class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
      />
    </div>

    <!-- Buttons -->
    <div class="flex gap-3 pt-4">
      <button
        type="submit"
        class="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5 hover:shadow-emerald-500/40"
      >
        {{ editingTransaction ? t("save") : t("save") }}
      </button>
      <button
        v-if="editingTransaction"
        type="button"
        @click="handleCancel"
        class="flex-1 py-3 px-6 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold transition-all"
      >
        {{ t("cancel") }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useCategoryStore } from "../stores/categoryStore";
import { useSettingsStore } from "../stores/settingsStore";
import { useTransactionStore } from "../stores/transactionStore";
import type { Transaction, TransactionStatus, TransactionType } from "../types";

interface Props {
  editingTransaction?: Transaction;
  onCancelEdit?: () => void;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  formSubmitted: [];
  cancelEdit: [];
}>();

const { t } = useI18n();
const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();
const settingsStore = useSettingsStore();

// Form state
const formData = ref<{
  title: string;
  amount: number;
  type: TransactionType;
  category: number | undefined;
  date: Date;
  status: TransactionStatus;
  notes: string;
}>({
  title: "",
  amount: 0,
  type: "expense",
  category: undefined,
  date: new Date(),
  status: "completed",
  notes: "",
});

const dateString = computed({
  get: () => {
    return formData.value.date.toISOString().split("T")[0];
  },
  set: (value: string) => {
    formData.value.date = new Date(value);
  },
});

// Format number with thousand separators (e.g., 1,500,000)
const formatNumber = (num: number): string => {
  if (!num) return "";
  return num.toLocaleString("vi-VN");
};

// Parse formatted number string to number
const parseNumber = (str: string): number => {
  if (!str) return 0;
  // Remove all non-digit characters except minus sign
  const cleaned = str.replace(/[^\d-]/g, "");
  return parseInt(cleaned, 10) || 0;
};

// Computed for amount input with formatting
const amountInput = computed({
  get: () => {
    return formatNumber(formData.value.amount);
  },
  set: (value: string) => {
    formData.value.amount = parseNumber(value);
  },
});

// Available categories based on type
const availableCategories = computed(() => {
  if (formData.value.type === "expense") {
    return categoryStore.expenseCategories;
  }
  return categoryStore.incomeCategories;
});

// Get categories for specified type
const handleTypeChange = () => {
  if (formData.value.type === "expense") {
    formData.value.category = settingsStore.settings.defaultCategoryExpense;
  } else {
    formData.value.category = settingsStore.settings.defaultCategoryIncome;
  }
};

// Submit form
const handleSubmit = () => {
  if (!formData.value.title.trim() || formData.value.amount <= 0) {
    return;
  }

  if (props.editingTransaction) {
    transactionStore.updateTransaction(
      props.editingTransaction.id,
      formData.value,
    );
  } else {
    transactionStore.addTransaction(
      formData.value.title,
      formData.value.amount,
      formData.value.type,
      formData.value.category,
      formData.value.date,
      formData.value.status,
      formData.value.notes || undefined,
    );
  }

  emit("formSubmitted");
  resetForm();
};

// Reset form
const resetForm = () => {
  formData.value = {
    title: "",
    amount: 0,
    type: "expense",
    category: undefined,
    date: new Date(),
    status: "completed",
    notes: "",
  };
};

// Cancel edit
const handleCancel = () => {
  resetForm();
  emit("cancelEdit");
};

// Watch for editing transaction changes
watch(
  () => props.editingTransaction,
  (transaction) => {
    if (transaction) {
      formData.value = {
        title: transaction.title,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        date: new Date(transaction.date),
        status: transaction.status,
        notes: transaction.notes || "",
      };
    }
  },
  { immediate: true },
);
</script>

<style scoped>
/* Input autofill styling */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-text-fill-color: inherit;
  -webkit-box-shadow: 0 0 0 40px inherit inset;
  transition: background-color 5000s ease-in-out 0s;
}

/* Dark mode autofill */
:global(.dark) input:-webkit-autofill,
:global(.dark) input:-webkit-autofill:hover,
:global(.dark) input:-webkit-autofill:focus {
  -webkit-text-fill-color: white;
  -webkit-box-shadow: 0 0 0 40px #111827 inset;
}
</style>
