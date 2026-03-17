import { createRouter, createWebHistory } from "vue-router";
import App from "../App.vue";
import { useAuthStore } from "../stores/authStore";
import ChangePassword from "../views/ChangePassword.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import VerifyEmail from "../views/VerifyEmail.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: Login, // Default to login
      meta: { requiresGuest: true }, // If already authenticated, will redirect to dashboard
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: { requiresGuest: true },
    },
    {
      path: "/register",
      name: "register",
      component: Register,
      meta: { requiresGuest: true },
    },
    {
      path: "/verify-email",
      name: "verify-email",
      component: VerifyEmail,
    },
    {
      path: "/change-password",
      name: "change-password",
      component: ChangePassword,
      meta: { requiresAuth: true },
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: App,
      meta: { requiresAuth: true },
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Only initialize if we have a token and haven't initialized yet
  // Check token first (from localStorage) before checking isAuthenticated
  // Because user might not be loaded yet on page reload
  if (authStore.token && !authStore.isInitialized) {
    try {
      await authStore.init();
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      authStore.logout();
    }
    authStore.isInitialized = true;
  }

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest);

  // If trying to access root path, redirect based on auth state
  if (to.path === "/") {
    if (authStore.isAuthenticated) {
      next({ name: "dashboard" });
    } else {
      next({ name: "login" });
    }
    return;
  }

  // Protected routes - require authentication
  if (requiresAuth && !authStore.isAuthenticated) {
    // Only add redirect query if not already on a guest route
    if (to.path !== "/login" && to.path !== "/register") {
      next({
        name: "login",
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
    return;
  }

  // Guest routes - redirect to dashboard if already authenticated
  if (requiresGuest && authStore.isAuthenticated) {
    // If there's a redirect query, use it; otherwise go to dashboard
    const redirectQuery = to.query.redirect as string;
    if (redirectQuery) {
      next({ path: redirectQuery });
    } else {
      next({ name: "dashboard" });
    }
    return;
  }

  next();
});

export default router;
