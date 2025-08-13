import type { ApiResponse } from '../types';
import { localStorage, STORAGE_KEYS } from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.get(STORAGE_KEYS.AUTH_TOKEN);
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { requiresAuth = true, ...requestOptions } = options;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(requiresAuth ? this.getAuthHeaders() : {}),
      ...requestOptions.headers,
    };

    const config: RequestInit = {
      ...requestOptions,
      headers,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      if (!response.ok) {
        if (response.status === 401) {
          // Handle unauthorized access
          localStorage.remove(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.remove(STORAGE_KEYS.USER_DATA);
          window.location.href = '/login';
          throw new Error('Unauthorized');
        }

        if (response.status === 403) {
          throw new Error('Forbidden');
        }

        if (response.status === 404) {
          throw new Error('Not Found');
        }

        if (response.status >= 500) {
          throw new Error('Server Error');
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error');
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      requiresAuth: false,
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: { email: string; password: string; name: string }) {
    return this.request('/auth/register', {
      method: 'POST',
      requiresAuth: false,
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async refreshToken() {
    return this.request('/auth/refresh', {
      method: 'POST',
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(userData: any) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Forms endpoints
  async getForms(params?: { page?: number; limit?: number; search?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    return this.request(`/forms${queryString ? `?${queryString}` : ''}`);
  }

  async getForm(id: string) {
    return this.request(`/forms/${id}`);
  }

  async createForm(formData: any) {
    return this.request('/forms', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  async updateForm(id: string, formData: any) {
    return this.request(`/forms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
    });
  }

  async deleteForm(id: string) {
    return this.request(`/forms/${id}`, {
      method: 'DELETE',
    });
  }

  // Responses endpoints
  async getResponses(formId: string, params?: { page?: number; limit?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    return this.request(`/forms/${formId}/responses${queryString ? `?${queryString}` : ''}`);
  }

  async getResponse(formId: string, responseId: string) {
    return this.request(`/forms/${formId}/responses/${responseId}`);
  }

  // Analytics endpoints
  async getAnalytics(formId: string, params?: { startDate?: string; endDate?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const queryString = queryParams.toString();
    return this.request(`/forms/${formId}/analytics${queryString ? `?${queryString}` : ''}`);
  }

  // Team endpoints
  async getTeamMembers() {
    return this.request('/team/members');
  }

  async inviteTeamMember(email: string, role: string) {
    return this.request('/team/invite', {
      method: 'POST',
      body: JSON.stringify({ email, role }),
    });
  }

  async updateTeamMember(memberId: string, data: any) {
    return this.request(`/team/members/${memberId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async removeTeamMember(memberId: string) {
    return this.request(`/team/members/${memberId}`, {
      method: 'DELETE',
    });
  }

  // Billing endpoints
  async getBillingInfo() {
    return this.request('/billing/info');
  }

  async updateBillingInfo(billingData: any) {
    return this.request('/billing/info', {
      method: 'PUT',
      body: JSON.stringify(billingData),
    });
  }

  async getInvoices() {
    return this.request('/billing/invoices');
  }

  // Admin endpoints
  async getUsers(params?: { page?: number; limit?: number; search?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    return this.request(`/admin/users${queryString ? `?${queryString}` : ''}`);
  }

  async updateUser(userId: string, userData: any) {
    return this.request(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId: string) {
    return this.request(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService(API_BASE_URL); 