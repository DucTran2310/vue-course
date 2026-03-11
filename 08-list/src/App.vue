<script setup>
import { ref } from 'vue'

const systemConfig = ref({
  appName: 'E-Commerce Platform',
  version: '2.1.0',
  debug: false,
  maxUploadSize: 10485760,
  allowedFileTypes: ['jpg', 'png', 'pdf'],
  apiTimeout: 30000,
  enableCache: true,
  cacheDuration: 3600,
  database: {
    host: 'localhost',
    port: 3306,
    name: 'shop_db',
  },
  features: {
    userRegistration: true,
    socialLogin: false,
    twoFactorAuth: true,
  },
})

const selectedJson = ref(null)
const selectedKey = ref('')
const hoveredRow = ref(null)

const formatKey = (key) => {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
}

const getDescription = (key) => {
  const descriptions = {
    appName: 'Tên ứng dụng',
    version: 'Phiên bản hiện tại',
    debug: 'Chế độ gỡ lỗi',
    maxUploadSize: 'Kích thước tối đa (bytes)',
    allowedFileTypes: 'Định dạng file cho phép',
    apiTimeout: 'Thời gian chờ API (ms)',
    enableCache: 'Bật/tắt cache',
    cacheDuration: 'Thời gian cache (giây)',
    database: 'Kết nối cơ sở dữ liệu',
    features: 'Tính năng hệ thống',
  }
  return descriptions[key] || ''
}

const getType = (value) => {
  if (Array.isArray(value)) return 'Array'
  if (value === null) return 'Null'
  return typeof value
}

const typeColor = (value) => {
  const t = getType(value)
  const map = {
    boolean: '#f59e0b',
    number: '#60a5fa',
    string: '#34d399',
    Array: '#a78bfa',
    object: '#fb923c',
    Null: '#6b7280',
  }
  return map[t] || '#9ca3af'
}

const showJson = (key) => {
  selectedKey.value = key
  selectedJson.value = systemConfig.value[key]
}

const editConfig = (key) => {
  console.log('Edit config:', key)
}
</script>

<template>
  <div class="wrapper">
    <!-- Header -->
    <div class="panel-header">
      <div class="header-left">
        <div class="status-dot"></div>
        <span class="sys-label">SYS_CONFIG</span>
        <span class="divider">/</span>
        <span class="env-tag">PRODUCTION</span>
      </div>
      <div class="header-right">
        <span class="version-chip">v2.1.0</span>
        <span class="record-count">{{ Object.keys(systemConfig).length }} params</span>
      </div>
    </div>

    <!-- Table -->
    <div class="table-wrap">
      <table class="config-table">
        <thead>
          <tr>
            <th class="col-idx">#</th>
            <th class="col-key">THAM SỐ</th>
            <th class="col-val">GIÁ TRỊ</th>
            <th class="col-type">TYPE</th>
            <th class="col-action">—</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(value, key, index) in systemConfig"
            :key="key"
            :class="{ 'row-hovered': hoveredRow === key }"
            @mouseenter="hoveredRow = key"
            @mouseleave="hoveredRow = null"
          >
            <td class="col-idx">
              <span class="idx-num">{{ String(index + 1).padStart(2, '0') }}</span>
            </td>

            <td class="col-key">
              <div class="key-block">
                <code class="key-name">{{ key }}</code>
                <span class="key-desc">{{ getDescription(key) }}</span>
              </div>
            </td>

            <td class="col-val">
              <!-- Boolean -->
              <template v-if="typeof value === 'boolean'">
                <span :class="['toggle-badge', value ? 'on' : 'off']">
                  <span class="toggle-dot"></span>
                  {{ value ? 'Bật' : 'Tắt' }}
                </span>
              </template>

              <!-- Number -->
              <template v-else-if="typeof value === 'number'">
                <span class="num-val">{{ value.toLocaleString() }}</span>
              </template>

              <!-- Object / Array -->
              <template v-else-if="typeof value === 'object'">
                <button class="btn-expand" @click="showJson(key)">
                  <span class="expand-icon">{ }</span>
                  Xem chi tiết
                </button>
              </template>

              <!-- String -->
              <template v-else>
                <span class="str-val">"{{ value }}"</span>
              </template>
            </td>

            <td class="col-type">
              <span class="type-pill" :style="{ '--tc': typeColor(value) }">
                {{ getType(value) }}
              </span>
            </td>

            <td class="col-action">
              <button class="btn-edit" @click="editConfig(key)" title="Chỉnh sửa">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <Transition name="modal">
      <div v-if="selectedJson" class="modal-overlay" @click.self="selectedJson = null">
        <div class="modal-box">
          <div class="modal-header">
            <div class="modal-title">
              <span class="modal-icon">{ }</span>
              <code>{{ selectedKey }}</code>
            </div>
            <button class="modal-close" @click="selectedJson = null">✕</button>
          </div>
          <div class="modal-body">
            <pre class="json-pre">{{ JSON.stringify(selectedJson, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=DM+Sans:wght@400;500;600&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.wrapper {
  font-family: 'DM Sans', sans-serif;
  background: #fff;
  min-height: 100vh;
  padding: 32px;
  color: #e2e8f0;
}

/* ─── Header ─────────────────────────────── */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 14px 20px;
  background: #fff;
  border: 1px solid #1e2530;
  border-radius: 10px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 8px #22c55e88;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

.sys-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.08em;
}

.divider {
  color: #2d3748;
  font-size: 16px;
}

.env-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: #f59e0b;
  background: #f59e0b18;
  border: 1px solid #f59e0b33;
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 0.1em;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.version-chip {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #60a5fa;
  background: #60a5fa14;
  border: 1px solid #60a5fa30;
  padding: 3px 10px;
  border-radius: 20px;
}

.record-count {
  font-size: 12px;
  color: #475569;
}

/* ─── Table ─────────────────────────────── */
.table-wrap {
  border: 1px solid #1e2530;
  border-radius: 10px;
  overflow: hidden;
}

.config-table {
  width: 100%;
  border-collapse: collapse;
}

thead tr {
  background: #fff;
  border-bottom: 1px solid #1e2530;
}

th {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  color: #334155;
  letter-spacing: 0.12em;
  padding: 12px 16px;
  text-align: left;
}

tbody tr {
  border-bottom: 1px solid #131720;
  background: #fff;
  transition: background 0.15s;
}

tbody tr:last-child {
  border-bottom: none;
}

.row-hovered {
  background: #13161e !important;
}

td {
  padding: 14px 16px;
  vertical-align: middle;
}

/* Columns */
.col-idx {
  width: 52px;
}
.col-key {
  width: 260px;
}
.col-val {
}
.col-type {
  width: 100px;
}
.col-action {
  width: 52px;
}

/* Index */
.idx-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #2d3a4a;
  font-weight: 700;
}

/* Key block */
.key-block {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.key-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: #cbd5e1;
  font-weight: 500;
}

.key-desc {
  font-size: 11px;
  color: #334155;
}

/* Values */
.toggle-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
}

.toggle-badge.on {
  color: #22c55e;
  background: #22c55e14;
  border: 1px solid #22c55e30;
}

.toggle-badge.off {
  color: #ef4444;
  background: #ef444414;
  border: 1px solid #ef444430;
}

.toggle-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.toggle-badge.on .toggle-dot {
  box-shadow: 0 0 6px #22c55e;
}

.num-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: #60a5fa;
}

.str-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: #34d399;
}

.btn-expand {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #1e2530;
  border: 1px solid #2d3748;
  color: #94a3b8;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-expand:hover {
  background: #252d3d;
  color: #e2e8f0;
  border-color: #3d4f6b;
}

.expand-icon {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #fb923c;
}

/* Type pill */
.type-pill {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 600;
  color: var(--tc);
  background: color-mix(in srgb, var(--tc) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--tc) 25%, transparent);
  padding: 3px 8px;
  border-radius: 4px;
  display: inline-block;
}

/* Edit button */
.btn-edit {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  color: #334155;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-edit:hover {
  background: #1e2530;
  border-color: #2d3748;
  color: #94a3b8;
}

/* ─── Modal ─────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: #00000099;
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-box {
  background: #13161c;
  border: 1px solid #1e2530;
  border-radius: 12px;
  width: 480px;
  max-width: 90vw;
  overflow: hidden;
  box-shadow: 0 24px 64px #00000088;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #1e2530;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  color: #e2e8f0;
}

.modal-icon {
  color: #fb923c;
  font-size: 16px;
  font-weight: 700;
}

.modal-close {
  background: none;
  border: none;
  color: #475569;
  cursor: pointer;
  font-size: 16px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.15s;
}

.modal-close:hover {
  background: #1e2530;
  color: #94a3b8;
}

.modal-body {
  padding: 20px;
}

.json-pre {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: #94a3b8;
  background: #fff;
  border: 1px solid #1a2030;
  border-radius: 8px;
  padding: 16px;
  overflow: auto;
  max-height: 320px;
  line-height: 1.7;
}

/* ─── Transitions ───────────────────────── */
.modal-enter-active,
.modal-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
