const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add Authorization header if token exists
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Add additional headers from options
    if (options.headers) {
      Object.assign(headers, options.headers as Record<string, string>);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`,
        );
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`API Error: ${error.message}`);
      }
      throw new Error("Unknown error occurred");
    }
  }

  // Authentication
  async register(email: string, password: string, fullName?: string) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, fullName }),
    });
  }

  async login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async verifyEmail(token: string) {
    return this.request("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  }

  async resendVerificationEmail(email: string) {
    return this.request("/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async getProfile() {
    return this.request("/auth/profile");
  }

  async uploadAvatar(file: File): Promise<
    ApiResponse<{
      user: { id: string; email: string; full_name: string; avatar: string };
    }>
  > {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await fetch(`${this.baseUrl}/auth/avatar`, {
      method: "PUT",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: formData,
    });

    const data: ApiResponse<{
      user: { id: string; email: string; full_name: string; avatar: string };
    }> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  async updateProfile(data: { fullName?: string; avatar?: string }): Promise<
    ApiResponse<{
      user: { id: string; email: string; full_name: string; avatar: string };
    }>
  > {
    return this.request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // OTP-based password change (more secure)
  async requestPasswordChange(currentPassword: string) {
    return this.request("/auth/request-password-change", {
      method: "POST",
      body: JSON.stringify({ currentPassword }),
    });
  }

  async verifyOTPAndChangePassword(otp: string, newPassword: string) {
    return this.request("/auth/verify-otp-and-change-password", {
      method: "POST",
      body: JSON.stringify({ otp, newPassword }),
    });
  }

  // Categories
  async getCategories(type?: "expense" | "income") {
    const params = type ? `?type=${type}` : "";
    return this.request(`/categories${params}`);
  }

  // Transactions
  async getTransactions(params?: {
    startDate?: string;
    endDate?: string;
    type?: "expense" | "income";
    categoryId?: number;
    status?: string;
  }) {
    const queryString = new URLSearchParams(params as any).toString();
    return this.request(`/transactions${queryString ? `?${queryString}` : ""}`);
  }

  async createTransaction(data: any) {
    return this.request("/transactions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateTransaction(id: number, data: any) {
    return this.request(`/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteTransaction(id: number) {
    return this.request(`/transactions/${id}`, {
      method: "DELETE",
    });
  }

  async getTransactionSummary(params?: {
    startDate?: string;
    endDate?: string;
  }) {
    const queryString = new URLSearchParams(params as any).toString();
    return this.request(
      `/transactions/summary${queryString ? `?${queryString}` : ""}`,
    );
  }

  // Budgets
  async getBudgets() {
    return this.request("/budgets");
  }

  async createBudget(data: any) {
    return this.request("/budgets", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateBudget(id: number, data: any) {
    return this.request(`/budgets/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteBudget(id: number) {
    return this.request(`/budgets/${id}`, {
      method: "DELETE",
    });
  }

  // Recurring Transactions
  async getRecurringTransactions() {
    return this.request("/recurring");
  }

  async createRecurringTransaction(data: any) {
    return this.request("/recurring", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateRecurringTransaction(id: number, data: any) {
    return this.request(`/recurring/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteRecurringTransaction(id: number) {
    return this.request(`/recurring/${id}`, {
      method: "DELETE",
    });
  }

  // Settings
  async getSettings() {
    return this.request("/settings");
  }

  async updateSettings(data: any) {
    return this.request("/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService(API_BASE_URL);
