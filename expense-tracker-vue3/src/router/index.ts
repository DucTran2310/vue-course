import { createRouter, createWebHistory } from "vue-router";
import App from "../App.vue";
import { useAuthStore } from "../stores/authStore";
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

  console.log("=== Router Guard DEBUG ===");
  console.log("To:", to.path, "Query:", to.query);
  console.log("Token:", authStore.token);
  console.log("User:", authStore.user);
  console.log("Is Authenticated:", authStore.isAuthenticated);
  console.log(
    "Requires Auth:",
    to.matched.some((record) => record.meta.requiresAuth),
  );
  console.log(
    "Requires Guest:",
    to.matched.some((record) => record.meta.requiresGuest),
  );

  // Only initialize if we have a token and haven't initialized yet
  if (authStore.token && !authStore.isInitialized) {
    console.log("Initializing auth...");
    try {
      await authStore.init();
      console.log("Auth initialized successfully");
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
      console.log("→ Root → DASHBOARD");
      next({ name: "dashboard" });
    } else {
      console.log("→ Root → LOGIN");
      next({ name: "login" });
    }
    return;
  }

  // Protected routes - require authentication
  if (requiresAuth && !authStore.isAuthenticated) {
    console.log("→ Redirecting to LOGIN");
    next({
      name: "login",
      query: { redirect: to.fullPath },
    });
    return;
  }

  // Guest routes - redirect to dashboard if already authenticated
  if (requiresGuest && authStore.isAuthenticated) {
    console.log("→ Redirecting to DASHBOARD");
    next({ name: "dashboard" });
    return;
  }

  console.log("→ ALLOWED");
  next();
});

export default router;
