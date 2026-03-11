<script setup>
import { ref, reactive, computed } from 'vue'

// ============================================
// FORM DATA & STATE MANAGEMENT
// ============================================
const form = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'developer',
  skills: [],
  agree: false,
})

// Validation errors
const errors = reactive({})

// UI states
const isSubmitting = ref(false)
const submitSuccess = ref(false)
const showPassword = ref(false)
const showConfirm = ref(false)

// Skill options
const skillOptions = ['Vue.js', 'React', 'Node.js', 'Python', 'TypeScript']

// Role options
const roleOptions = [
  { value: 'developer', label: 'Developer', icon: '💻' },
  { value: 'designer', label: 'Designer', icon: '🎨' },
  { value: 'pm', label: 'Product Manager', icon: '📊' },
]

// ============================================
// VALIDATION FUNCTIONS
// ============================================
const validateField = (fieldName) => {
  switch (fieldName) {
    case 'fullName':
      if (!form.fullName.trim()) {
        errors.fullName = 'Họ tên không được để trống'
      } else if (form.fullName.trim().length < 3) {
        errors.fullName = 'Họ tên phải có ít nhất 3 ký tự'
      } else {
        delete errors.fullName
      }
      break

    case 'email':
      if (!form.email) {
        errors.email = 'Email không được để trống'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = 'Email không đúng định dạng (vd: name@domain.com)'
      } else {
        delete errors.email
      }
      break

    case 'password':
      if (!form.password) {
        errors.password = 'Mật khẩu không được để trống'
      } else if (form.password.length < 8) {
        errors.password = 'Mật khẩu phải có ít nhất 8 ký tự'
      } else {
        delete errors.password
      }
      // Re-validate confirm password when password changes
      if (form.confirmPassword) validateField('confirmPassword')
      break

    case 'confirmPassword':
      if (!form.confirmPassword) {
        errors.confirmPassword = 'Vui lòng xác nhận mật khẩu'
      } else if (form.confirmPassword !== form.password) {
        errors.confirmPassword = 'Mật khẩu xác nhận không khớp'
      } else {
        delete errors.confirmPassword
      }
      break

    case 'skills':
      if (form.skills.length === 0) {
        errors.skills = 'Vui lòng chọn ít nhất 1 kỹ năng'
      } else {
        delete errors.skills
      }
      break

    case 'agree':
      if (!form.agree) {
        errors.agree = 'Bạn cần đồng ý với điều khoản để tiếp tục'
      } else {
        delete errors.agree
      }
      break
  }
}

const validateAll = () => {
  const fields = ['fullName', 'email', 'password', 'confirmPassword', 'skills', 'agree']
  fields.forEach((field) => validateField(field))
  return Object.keys(errors).length === 0
}

// ============================================
// PASSWORD STRENGTH CHECK
// ============================================
const passwordStrength = computed(() => {
  const pwd = form.password
  if (!pwd) return 0

  let score = 0
  // Length check
  if (pwd.length >= 8) score++
  // Uppercase check
  if (/[A-Z]/.test(pwd)) score++
  // Number check
  if (/[0-9]/.test(pwd)) score++
  // Special character check
  if (/[^A-Za-z0-9]/.test(pwd)) score++

  return score
})

const strengthConfig = {
  0: { label: 'Chưa nhập', color: '#94a3b8' },
  1: { label: 'Yếu', color: '#ef4444' },
  2: { label: 'Trung bình', color: '#f59e0b' },
  3: { label: 'Khá', color: '#3b82f6' },
  4: { label: 'Mạnh', color: '#10b981' },
}

// ============================================
// EVENT HANDLERS (ĐƯỢC CHÚ THÍCH RÕ RÀNG)
// ============================================

/**
 * @event @input - Xử lý khi người dùng gõ vào input
 * Dùng @input thay vì @blur để validate real-time
 */
const handleInput = (fieldName) => {
  validateField(fieldName)
}

/**
 * @event @blur - Xử lý khi rời khỏi input
 * Validate khi người dùng đã gõ xong
 */
const handleBlur = (fieldName) => {
  validateField(fieldName)
}

/**
 * @event @click (toggle password) - Hiện/ẩn mật khẩu
 */
const togglePasswordVisibility = (field) => {
  if (field === 'password') {
    showPassword.value = !showPassword.value
  } else {
    showConfirm.value = !showConfirm.value
  }
}

/**
 * @event @change (checkbox) - Xử lý khi chọn checkbox kỹ năng
 */
const handleSkillChange = (skill) => {
  const index = form.skills.indexOf(skill)
  if (index === -1) {
    form.skills.push(skill)
  } else {
    form.skills.splice(index, 1)
  }
  validateField('skills')
}

/**
 * @event @click - Xử lý khi click vào role option
 */
const handleRoleSelect = (roleValue) => {
  form.role = roleValue
  // Không cần validate role vì luôn có giá trị mặc định
}

/**
 * @event @click - Xử lý khi click vào checkbox đồng ý điều khoản
 */
const handleAgreeToggle = () => {
  form.agree = !form.agree
  validateField('agree')
}

/**
 * @event @submit - Xử lý submit form
 */
const handleSubmit = async () => {
  console.log('📝 Event: form submitted')

  if (!validateAll()) {
    console.log('❌ Validation failed:', errors)
    return
  }

  isSubmitting.value = true
  console.log('⏳ Submitting form data:', { ...form, password: '***' })

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log('✅ Form submitted successfully')
    submitSuccess.value = true

    // Log form data (in real app, send to API)
    console.log('📦 Form data:', {
      fullName: form.fullName,
      email: form.email,
      role: form.role,
      skills: form.skills,
      agree: form.agree,
    })
  } catch (error) {
    console.error('❌ Submit error:', error)
  } finally {
    isSubmitting.value = false
  }
}

/**
 * @event @click - Xử lý reset form
 */
const handleReset = () => {
  console.log('🔄 Event: form reset')

  // Reset form data
  form.fullName = ''
  form.email = ''
  form.password = ''
  form.confirmPassword = ''
  form.role = 'developer'
  form.skills = []
  form.agree = false

  // Clear all errors
  Object.keys(errors).forEach((key) => delete errors[key])

  // Reset UI states
  submitSuccess.value = false
  showPassword.value = false
  showConfirm.value = false
}

/**
 * @event @click - Xử lý khi submit lại sau thành công
 */
const handleCreateNew = () => {
  console.log('🔄 Event: create new account')
  handleReset()
}
</script>

<template>
  <div class="app">
    <!-- HEADER: Giải thích về Events -->
    <div class="events-header">
      <div class="events-title">
        <span class="event-badge">📌 EVENT DEMO</span>
        <h1>Form với Event Handling</h1>
      </div>

      <div class="events-legend">
        <div class="legend-item">
          <span class="legend-dot dot-input"></span>
          <span>@input / @blur</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot dot-click"></span>
          <span>@click / @change</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot dot-submit"></span>
          <span>@submit</span>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- LEFT PANEL: Event Monitor -->
      <div class="event-monitor">
        <h3 class="monitor-title">
          <span class="monitor-icon">⚡</span>
          Event Monitor
        </h3>

        <div class="event-feed">
          <div class="event-item" v-if="!submitSuccess">
            <div class="event-time">live</div>
            <div class="event-desc">Đang theo dõi form...</div>
          </div>

          <!-- Các event sẽ được log ở đây (trong console) -->
          <div class="event-note">
            <p>📢 Mở console (F12) để xem event log chi tiết</p>
            <code class="event-code">
              console.log('📝 Event: form submitted')<br />
              console.log('🔄 Event: form reset')<br />
              console.log('✅ Validation passed')
            </code>
          </div>
        </div>
      </div>

      <!-- RIGHT PANEL: Form -->
      <div class="form-container">
        <!-- SUCCESS STATE và FORM - CÙNG NẰM TRONG TRANSITION -->
        <transition name="fade">
          <!-- Success state - hiển thị khi submitSuccess = true -->
          <div v-if="submitSuccess" class="success-card" key="success">
            <div class="success-icon">✓</div>
            <h2 class="success-title">Đăng ký thành công!</h2>
            <p class="success-message">
              Chào mừng <strong>{{ form.fullName }}</strong> đến với cộng đồng.
            </p>
            <div class="success-info">
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value">{{ form.email }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Vai trò:</span>
                <span class="info-value">{{ form.role }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Kỹ năng:</span>
                <span class="info-value">{{ form.skills.join(', ') }}</span>
              </div>
            </div>
            <button class="btn-primary" @click="handleCreateNew">+ Tạo tài khoản mới</button>
          </div>

          <!-- Form - hiển thị khi submitSuccess = false (v-else) -->
          <form v-else @submit.prevent="handleSubmit" class="form" key="form">
            <h2 class="form-title">Tạo tài khoản mới</h2>
            <p class="form-subtitle">Điền thông tin để bắt đầu hành trình</p>

            <!-- Full Name Field -->
            <div class="form-group" :class="{ 'has-error': errors.fullName }">
              <label class="form-label">
                Họ và tên
                <span class="event-tag">@input @blur</span>
              </label>
              <input
                v-model="form.fullName"
                type="text"
                class="form-input"
                placeholder="Nguyễn Văn A"
                @input="handleInput('fullName')"
                @blur="handleBlur('fullName')"
              />
              <transition name="slide">
                <div v-if="errors.fullName" class="error-message">⚠️ {{ errors.fullName }}</div>
              </transition>
            </div>

            <!-- Email Field -->
            <div class="form-group" :class="{ 'has-error': errors.email }">
              <label class="form-label">
                Email
                <span class="event-tag">@input @blur</span>
              </label>
              <input
                v-model="form.email"
                type="email"
                class="form-input"
                placeholder="example@domain.com"
                @input="handleInput('email')"
                @blur="handleBlur('email')"
              />
              <transition name="slide">
                <div v-if="errors.email" class="error-message">⚠️ {{ errors.email }}</div>
              </transition>
            </div>

            <!-- Password Row -->
            <div class="form-row">
              <!-- Password Field -->
              <div class="form-group" :class="{ 'has-error': errors.password }">
                <label class="form-label">
                  Mật khẩu
                  <span class="event-tag">@input @click</span>
                </label>
                <div class="input-group">
                  <input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-input"
                    placeholder="********"
                    @input="handleInput('password')"
                    @blur="handleBlur('password')"
                  />
                  <button
                    type="button"
                    class="input-toggle"
                    @click="togglePasswordVisibility('password')"
                  >
                    {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                  </button>
                </div>

                <!-- Password Strength -->
                <div v-if="form.password" class="strength-meter">
                  <div
                    class="strength-bar"
                    :style="{
                      width: (passwordStrength / 4) * 100 + '%',
                      backgroundColor: strengthConfig[passwordStrength].color,
                    }"
                  ></div>
                  <span
                    class="strength-label"
                    :style="{ color: strengthConfig[passwordStrength].color }"
                  >
                    {{ strengthConfig[passwordStrength].label }}
                  </span>
                </div>

                <transition name="slide">
                  <div v-if="errors.password" class="error-message">⚠️ {{ errors.password }}</div>
                </transition>
              </div>

              <!-- Confirm Password Field -->
              <div class="form-group" :class="{ 'has-error': errors.confirmPassword }">
                <label class="form-label">
                  Xác nhận
                  <span class="event-tag">@input @click</span>
                </label>
                <div class="input-group">
                  <input
                    v-model="form.confirmPassword"
                    :type="showConfirm ? 'text' : 'password'"
                    class="form-input"
                    placeholder="********"
                    @input="handleInput('confirmPassword')"
                    @blur="handleBlur('confirmPassword')"
                  />
                  <button
                    type="button"
                    class="input-toggle"
                    @click="togglePasswordVisibility('confirm')"
                  >
                    {{ showConfirm ? '👁️' : '👁️‍🗨️' }}
                  </button>
                </div>
                <transition name="slide">
                  <div v-if="errors.confirmPassword" class="error-message">
                    ⚠️ {{ errors.confirmPassword }}
                  </div>
                </transition>
              </div>
            </div>

            <!-- Role Selection -->
            <div class="form-group">
              <label class="form-label">
                Vai trò của bạn
                <span class="event-tag">@click</span>
              </label>
              <div class="role-grid">
                <button
                  type="button"
                  v-for="role in roleOptions"
                  :key="role.value"
                  class="role-btn"
                  :class="{ active: form.role === role.value }"
                  @click="handleRoleSelect(role.value)"
                >
                  <span class="role-icon">{{ role.icon }}</span>
                  <span class="role-text">{{ role.label }}</span>
                </button>
              </div>
            </div>

            <!-- Skills Selection -->
            <div class="form-group" :class="{ 'has-error': errors.skills }">
              <label class="form-label">
                Kỹ năng
                <span class="event-tag">@click (multiple)</span>
              </label>
              <div class="skills-grid">
                <button
                  type="button"
                  v-for="skill in skillOptions"
                  :key="skill"
                  class="skill-btn"
                  :class="{ active: form.skills.includes(skill) }"
                  @click="handleSkillChange(skill)"
                >
                  {{ skill }}
                </button>
              </div>
              <transition name="slide">
                <div v-if="errors.skills" class="error-message">⚠️ {{ errors.skills }}</div>
              </transition>
            </div>

            <!-- Terms Agreement -->
            <div class="form-group" :class="{ 'has-error': errors.agree }">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  class="checkbox-input"
                  :checked="form.agree"
                  @change="handleAgreeToggle"
                />
                <span class="checkbox-custom"></span>
                <span class="checkbox-text">
                  Tôi đồng ý với
                  <a href="#" class="link">Điều khoản dịch vụ</a>
                  và
                  <a href="#" class="link">Chính sách bảo mật</a>
                </span>
              </label>
              <transition name="slide">
                <div v-if="errors.agree" class="error-message">⚠️ {{ errors.agree }}</div>
              </transition>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button type="button" class="btn-secondary" @click="handleReset">Xóa form</button>
              <button type="submit" class="btn-primary" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="spinner"></span>
                <span v-else>
                  Đăng ký
                  <span class="event-tag event-tag-light">@submit</span>
                </span>
              </button>
            </div>
          </form>
        </transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: #f8fafc;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding: 2rem;
}

/* ===== HEADER STYLES ===== */
.events-header {
  max-width: 1200px;
  margin: 0 auto 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.event-badge {
  display: inline-block;
  background: #3b82f6;
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.events-title h1 {
  font-size: 1.8rem;
  color: #1e293b;
  font-weight: 700;
}

.events-legend {
  display: flex;
  gap: 1.5rem;
  background: white;
  padding: 0.75rem 1.5rem;
  border-radius: 40px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #475569;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot-input {
  background: #3b82f6;
}
.dot-click {
  background: #f59e0b;
}
.dot-submit {
  background: #10b981;
}

/* ===== CONTAINER ===== */
.container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
}

/* ===== EVENT MONITOR ===== */
.event-monitor {
  background: white;
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  height: fit-content;
  position: sticky;
  top: 2rem;
}

.monitor-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  color: #1e293b;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f1f5f9;
}

.monitor-icon {
  font-size: 1.3rem;
}

.event-feed {
  min-height: 400px;
}

.event-item {
  background: #f1f5f9;
  border-radius: 12px;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-left: 3px solid #3b82f6;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.event-time {
  font-size: 0.7rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
}

.event-desc {
  font-size: 0.9rem;
  color: #1e293b;
  font-weight: 500;
}

.event-note {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1rem;
  border: 1px dashed #cbd5e1;
  margin-top: 1rem;
}

.event-note p {
  font-size: 0.85rem;
  color: #475569;
  margin-bottom: 0.75rem;
}

.event-code {
  display: block;
  background: #1e293b;
  color: #a5f3fc;
  padding: 0.75rem;
  border-radius: 8px;
  font-family: 'Monaco', monospace;
  font-size: 0.7rem;
  line-height: 1.5;
  white-space: pre-wrap;
}

/* ===== FORM CONTAINER ===== */
.form-container {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.form-title {
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.form-subtitle {
  color: #64748b;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f5f9;
}

/* ===== FORM GROUPS ===== */
.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 0.5rem;
}

.event-tag {
  background: #f1f5f9;
  color: #475569;
  font-size: 0.65rem;
  font-weight: 500;
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
  letter-spacing: 0.3px;
}

.event-tag-light {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.2s;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.has-error .form-input {
  border-color: #ef4444;
}

.input-group {
  position: relative;
}

.input-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.25rem;
  color: #64748b;
  transition: color 0.2s;
}

.input-toggle:hover {
  color: #1e293b;
}

/* ===== PASSWORD STRENGTH ===== */
.strength-meter {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.strength-bar {
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  transition: all 0.3s;
  flex: 1;
}

.strength-label {
  font-size: 0.8rem;
  font-weight: 500;
  min-width: 65px;
}

/* ===== ROLE BUTTONS ===== */
.role-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.role-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0.5rem;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.role-btn:hover {
  background: #f1f5f9;
}

.role-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
}

.role-btn.active .role-text {
  color: white;
}

.role-icon {
  font-size: 1.5rem;
}

.role-text {
  font-size: 0.85rem;
  font-weight: 500;
  color: #475569;
}

/* ===== SKILL BUTTONS ===== */
.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-btn {
  padding: 0.5rem 1rem;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 30px;
  font-size: 0.9rem;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.skill-btn:hover {
  background: #f1f5f9;
}

.skill-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

/* ===== CHECKBOX ===== */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #cbd5e1;
  border-radius: 6px;
  transition: all 0.2s;
  position: relative;
}

.checkbox-input:checked + .checkbox-custom {
  background: #3b82f6;
  border-color: #3b82f6;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.8rem;
}

.checkbox-text {
  font-size: 0.9rem;
  color: #334155;
}

.link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}

/* ===== ERROR MESSAGES ===== */
.error-message {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #ef4444;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* ===== FORM ACTIONS ===== */
.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 0.9rem;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

/* ===== SUCCESS CARD ===== */
.success-card {
  text-align: center;
  padding: 2rem;
}

.success-icon {
  width: 64px;
  height: 64px;
  background: #10b981;
  color: white;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin: 0 auto 1.5rem;
}

.success-title {
  font-size: 1.8rem;
  color: #1e293b;
  margin-bottom: 1rem;
}

.success-message {
  color: #475569;
  margin-bottom: 1.5rem;
}

.success-info {
  background: #f8fafc;
  border-radius: 16px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  text-align: left;
}

.info-row {
  display: flex;
  gap: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  width: 100px;
  color: #64748b;
  font-weight: 500;
}

.info-value {
  color: #1e293b;
  font-weight: 600;
}

/* ===== SPINNER ===== */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ===== TRANSITIONS ===== */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 50px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 900px) {
  .container {
    grid-template-columns: 1fr;
  }

  .event-monitor {
    position: static;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .app {
    padding: 1rem;
  }

  .events-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .role-grid {
    grid-template-columns: 1fr;
  }
}
</style>
