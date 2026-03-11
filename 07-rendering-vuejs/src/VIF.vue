<template>
  <!-- Ví dụ 1: Hiển thị trạng thái đơn hàng -->
  <div class="order-status">
    <span v-if="order.status === 'pending'" class="badge bg-warning">
      <i class="fas fa-clock"></i> Chờ xử lý
    </span>

    <span v-else-if="order.status === 'processing'" class="badge bg-info">
      <i class="fas fa-spinner fa-spin"></i> Đang xử lý
    </span>

    <span v-else-if="order.status === 'shipped'" class="badge bg-primary">
      <i class="fas fa-truck"></i> Đã giao hàng
    </span>

    <span v-else-if="order.status === 'delivered'" class="badge bg-success">
      <i class="fas fa-check-circle"></i> Hoàn thành
    </span>

    <span v-else class="badge bg-danger"> <i class="fas fa-times-circle"></i> Đã hủy </span>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const order = ref({
  id: 'ORD-001',
  status: 'pending',
})
</script>
