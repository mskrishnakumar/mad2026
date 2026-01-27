import type { ApiResponse } from '@/lib/types';
import { getErrorMessage } from '@/lib/utils';

// ============================================
// API CLIENT
// Centralized HTTP client for all API calls
// ============================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface RequestOptions extends RequestInit {
  timeout?: number;
}

/**
 * Make an API request with error handling and timeout
 */
async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { timeout = 30000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      return { success: false, error: 'Request timed out' };
    }

    return { success: false, error: getErrorMessage(error) };
  }
}

// ============================================
// API METHODS
// ============================================

export const apiClient = {
  /**
   * GET request
   */
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  /**
   * POST request
   */
  post: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    }),

  /**
   * PUT request
   */
  put: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),

  /**
   * PATCH request
   */
  patch: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
};

// ============================================
// DOMAIN-SPECIFIC API FUNCTIONS
// Add your specific API calls here
// ============================================

export async function fetchRecommendations(
  profileData: unknown,
  quickMode: boolean = false
) {
  return apiClient.post('/api/recommendations', {
    profile: profileData,
    quickMode,
  });
}

export async function sendChatMessage(
  message: string,
  context?: unknown
) {
  return apiClient.post('/api/chat', {
    message,
    context,
  });
}

export async function checkHealth() {
  return apiClient.get('/api/health');
}
