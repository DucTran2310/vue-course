<template>
  <div
    class="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
    :class="{
      'border-l-4 border-l-emerald-500': transaction.type === 'income',
      'border-l-4 border-l-red-500': transaction.type === 'expense',
      'opacity-60': transaction.status === 'cancelled',
    }"
  >
    <!-- Main Content -->
    <div class="flex items-center gap-4">
      <!-- Icon -->
      <div
        class="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-md flex-shrink-0"
        :style="{ backgroundColor: category?.color || '#a8a8a8' }"
      >
        {{ category?.icon || "📦" }}
      </div>

      <!-- Info -->
      <div class="flex-1 min-w-0">
        <h4
          class="text-base font-semibold text-gray-800 dark:text-white truncate mb-1"
        >
          {{ transaction.title }}
        </h4>
        <div class="flex items-center gap-2 flex-wrap text-xs">
          <span
            class="flex items-center gap-1 text-gray-500 dark:text-gray-400"
          >
            <span>📅</span>
            {{ formatDate(transaction.date) }}
          </span>
          <span
            v-if="category"
            class="px-2 py-0.5 rounded-full text-xs font-medium"
            :style="{
              backgroundColor: category.color + '20',
              color: category.color,
            }"
          >
            {{ category.name }}
          </span>
          <span
            class="px-2 py-0.5 rounded-full text-xs font-medium"
            :class="statusClass"
          >
            {{ statusIcon }} {{ statusLabel }}
          </span>
        </div>
        <p
          v-if="transaction.notes"
          class="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate"
        >
          {{ transaction.notes }}
        </p>
      </div>

      <!-- Amount -->
      <div class="flex-shrink-0 text-right">
        <p
          class="text-xl font-bold font-mono"
          :class="
            transaction.type === 'income'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-red-500 dark:text-red-400'
          "
        >
          {{ amountSign }}{{ formatCurrency(transaction.amount) }}
        </p>
      </div>
    </div>

    <!-- Hover Actions -->
    <div
      class="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    >
      <button
        @click="handleToggleStatus"
        class="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-lg hover:scale-110 transition-all"
        :title="toggleTooltip"
      >
        {{ statusIcon }}
      </button>
      <button
        @click="handleEdit"
        class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-lg hover:scale-110 transition-all"
        title="Sửa"
      >
        ✏️
      </button>
      <button
        @click="handleDelete"
        class="w-9 h-9 rounded-xl bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 flex items-center justify-center text-lg hover:scale-110 transition-all"
        title="Xóa"
      >
        🗑️
      </button>
    </div>

    <!-- Decorative gradient -->
    <div
      class="absolute top-0 right-0 w-24 h-24 -translate-y-12 translate-x-12 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
      :class="transaction.type === 'income' ? 'bg-emerald-500' : 'bg-red-500'"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useFormat } from "../composables/useFormat";
import { useCategoryStore } from "../stores/categoryStore";
import { useTransactionStore } from "../stores/transactionStore";
import type { Transaction } from "../types";

interface Props {
  transaction: Transaction;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  edit: [transaction: Transaction];
}>();

const { t } = useI18n();
const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();
const { formatCurrency, formatDate } = useFormat();

// Computed
const category = computed(() => {
  return props.transaction.category
    ? categoryStore.getCategoryById(props.transaction.category)
    : null;
});

const amountSign = computed(() => {
  return props.transaction.type === "expense" ? "-" : "+";
});

const statusLabel = computed(() => {
  const labels = {
    completed: t("statusCompleted"),
    pending: t("statusPending"),
    cancelled: t("statusCancelled"),
  };
  return labels[props.transaction.status];
});

const statusClass = computed(() => {
  const classes = {
    completed:
      "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
    pending:
      "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    cancelled: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  };
  return classes[props.transaction.status];
});

const statusIcon = computed(() => {
  const icons = {
    completed: "✓",
    pending: "⏳",
    cancelled: "✕",
  };
  return icons[props.transaction.status];
});

const toggleTooltip = computed(() => {
  return props.transaction.status === "completed"
    ? "Đánh dấu chưa hoàn thành"
    : "Đánh dấu hoàn thành";
});

// Handlers
const handleToggleStatus = () => {
  transactionStore.toggleStatus(props.transaction.id);
};

const handleEdit = () => {
  emit("edit", props.transaction);
};

const handleDelete = () => {
  if (confirm(t("confirmDelete"))) {
    transactionStore.deleteTransaction(props.transaction.id);
  }
};
</script>

<style scoped>
/* Subtle hover effect */
.group:hover {
  transform: translateY(-2px);
}

/* Animation */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.group {
  animation: slideIn 0.3s ease-out;
}
</style>
