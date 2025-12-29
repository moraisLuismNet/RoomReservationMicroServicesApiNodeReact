import { environment } from "../config/environment";

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

class ApiClient {
  private getBaseUrl(endpoint: string): string {
    // Route to appropriate microservice based on endpoint prefix
    if (endpoint.startsWith("/api/auth")) {
      return environment.apiUrls.user;
    } else if (
      endpoint.startsWith("/api/rooms") ||
      endpoint.startsWith("/api/room-types")
    ) {
      return environment.apiUrls.room;
    } else if (
      endpoint.startsWith("/api/reservations") ||
      endpoint.startsWith("/api/reservation-statuses")
    ) {
      return environment.apiUrls.reservation;
    } else if (endpoint.startsWith("/api/payments")) {
      return environment.apiUrls.payment;
    } else if (endpoint.startsWith("/api/emails")) {
      return environment.apiUrls.email;
    }
    // Default to user service for unknown endpoints
    return environment.apiUrls.user;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, ...customConfig } = options;

    // Construct URL with query parameters
    let url = `${this.getBaseUrl(endpoint)}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    // Get token from localStorage
    const token = localStorage.getItem("token");

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...customConfig.headers,
    };

    const config: RequestInit = {
      ...customConfig,
      headers,
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Something went wrong");
      }

      // Check if response is empty (e.g., 204 No Content)
      if (response.status === 204) {
        return {} as T;
      }

      return (await response.json()) as T;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  post<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
