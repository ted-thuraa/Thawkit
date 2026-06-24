import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from "js-cookie";

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Define an interface for the API methods
export interface ApiClient {
  get: <T>(url: string, config?: AxiosRequestConfig) => Promise<T>;
  post: <T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ) => Promise<T>;
  put: <T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ) => Promise<T>;
  patch: <T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ) => Promise<T>;
  delete: <T>(url: string, config?: AxiosRequestConfig) => Promise<T>;
}

// Create axios instance with default configuration
const createApiClient = (): AxiosInstance => {
  const baseURL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

  const client = axios.create({
    baseURL,
    timeout: 10000, // 10 seconds
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor to add auth token
  client.interceptors.request.use(
    (config) => {
      // Get token from cookies (works both client and server side with proper setup)
      const token =
        typeof window !== "undefined" ? Cookies.get("auth-token") : null;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error) => {
      // Handle common errors
      if (error.response?.status === 401) {
        // Unauthorized - clear token and redirect to login
        if (typeof window !== "undefined") {
          Cookies.remove("auth-token");
          window.location.href = "/login";
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// Create the API client instance
export const apiClient = createApiClient();

// Generic API methods with proper typing
export const api: ApiClient = {
  // GET request
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.get<ApiResponse<T>>(url, config);
    return response.data.data;
  },

  // POST request
  post: async <T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await apiClient.post<ApiResponse<T>>(url, data, config);
    return response.data.data;
  },

  // PUT request
  put: async <T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await apiClient.put<ApiResponse<T>>(url, data, config);
    return response.data.data;
  },

  // PATCH request
  patch: async <T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await apiClient.patch<ApiResponse<T>>(url, data, config);
    return response.data.data;
  },

  // DELETE request
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.delete<ApiResponse<T>>(url, config);
    return response.data.data;
  },
};

// Server-side API client for SSR/SSG
export const createServerApiClient = (token?: string): ApiClient => {
  const serverClient = axios.create({
    baseURL:
      process.env.API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:3000/api",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  return {
    get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
      const response = await serverClient.get<ApiResponse<T>>(url, config);
      return response.data.data;
    },

    post: async <T, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig
    ): Promise<T> => {
      const response = await serverClient.post<ApiResponse<T>>(
        url,
        data,
        config
      );
      return response.data.data;
    },

    put: async <T, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig
    ): Promise<T> => {
      const response = await serverClient.put<ApiResponse<T>>(
        url,
        data,
        config
      );
      return response.data.data;
    },

    patch: async <T, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig
    ): Promise<T> => {
      const response = await serverClient.patch<ApiResponse<T>>(
        url,
        data,
        config
      );
      return response.data.data;
    },

    delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
      const response = await serverClient.delete<ApiResponse<T>>(url, config);
      return response.data.data;
    },
  };
};
