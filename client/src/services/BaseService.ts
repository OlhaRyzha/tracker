import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosError,
} from 'axios';
import qs from 'qs';
import { QueryParams } from '../types/shared/track';

const cleanParams = (params: QueryParams): Record<string, string> => {
  const cleanedParams: Record<string, string> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (!value) return;

    if (Array.isArray(value)) {
      const filtered = value.filter((item) => item != null && item !== '');
      if (filtered.length > 0) {
        cleanedParams[key] = filtered.join(',');
      }
    } else {
      cleanedParams[key] = String(value);
    }
  });

  return cleanedParams;
};

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      timeout: 30000,
      paramsSerializer: {
        serialize: (params) =>
          qs.stringify(cleanParams(params as QueryParams), {
            arrayFormat: 'repeat',
            encode: false,
          }),
      },
    });

    this.axiosInstance.interceptors.request.use(this.handleRequest);
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      this.handleResponseError
    );
  }

  private handleRequest(
    config: InternalAxiosRequestConfig
  ): InternalAxiosRequestConfig {
    return config;
  }

  private handleResponseError(error: AxiosError): Promise<never> {
    console.error('[API ERROR]', error);
    return Promise.reject(error);
  }

  public async get<TResponse>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    const response = await this.axiosInstance.get<TResponse>(url, config);
    return response.data;
  }

  public async post<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    const response = await this.axiosInstance.post<TResponse>(
      url,
      body,
      config
    );
    return response.data;
  }

  public async put<TResponse, TBody = unknown>(
    url: string,
    body: TBody,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    const response = await this.axiosInstance.put<TResponse>(url, body, config);
    return response.data;
  }

  public async delete<TResponse>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    const response = await this.axiosInstance.delete<TResponse>(url, config);
    return response.data;
  }
}

const apiClient = new ApiClient();
export default apiClient;
