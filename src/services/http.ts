// src/services/http.ts
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError
} from "axios";
import type { ApiResponse } from "@/models/ApiResponse";

/**
 * ApiResponseDTO is the server-side wrapper shape (casing may vary)
 * We accept both `Success`/`success`, `Data`/`data`, `ErrorMessage`/`errorMessage`.
 */
export interface ApiResponseDTO<T> {
  Success?: boolean;
  success?: boolean;
  Data?: T;
  data?: T;
  ErrorMessage?: string;
  errorMessage?: string;
}

// ----- Base URL -----
export const API_BASE = import.meta.env.PROD
  ? "https://archerfish-dev.liscr.com/bfa/api"
  : "https://localhost:7020/api";

// ----- Axios instance -----
const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json"
  },
  // keep default transformResponse; we'll handle normalization in interceptor
});

/**
 * Normalizes an ApiResponseDTO (server shape) to the frontend ApiResponse<T>.
 */
function normalizeApiResponse<T>(dto: ApiResponseDTO<T>): ApiResponse<T> {
  const success = (dto as any).Success ?? (dto as any).success ?? false;
  const data = (dto as any).Data ?? (dto as any).data ?? null;
  const errorMessage = (dto as any).ErrorMessage ?? (dto as any).errorMessage ?? null;

  return {
    success: Boolean(success),
    errorMessage,
    data,
  } as ApiResponse<T>;
}

/**
 * Response interceptor:
 * - If server returned the wrapper (ApiResponseDTO), we convert it into the frontend ApiResponse<T>
 *   and set response.data to that wrapper (so callers see consistent res.data).
 * - If the wrapper indicates failure (success === false), we throw an AxiosError with response attached.
 * - If server returned something else (raw T), we leave response.data as-is; callers will be defensive-wrapped.
 */
api.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    const body = response.data;

    // If the response body looks like the wrapper, normalize it.
    if (body && typeof body === "object" && (("Success" in body) || ("success" in body) || ("Data" in body) || ("data" in body))) {
      const normalized = normalizeApiResponse<any>(body as ApiResponseDTO<any>);

      // Replace response.data with the normalized wrapper
      response.data = normalized;

      // If backend reported failure, throw so catch blocks run
      if (!normalized.success) {
        const err = new Error(normalized.errorMessage ?? "API request failed") as AxiosError;
        err.response = response;
        throw err;
      }

      // success -> return response with response.data = ApiResponse<T>
      return response as AxiosResponse<ApiResponse<any>>;
    }

    // Not a wrapped response; return original response (raw payload)
    return response;
  },
  (error: AxiosError) => {
    // If error response has the DTO wrapper, expose its message
    if (error.response && error.response.data) {
      const dto = error.response.data as ApiResponseDTO<any>;
      const msg = (dto && (dto.ErrorMessage ?? dto.errorMessage)) as string | undefined;
      if (msg) {
        error.message = msg;
      }
    }
    return Promise.reject(error);
  }
);

/* -------------------------
   Utility: buildQuery (unused by axios version but kept for reference)
   ------------------------- */
function buildQuery(params?: Record<string, any>): string {
  if (!params) return "";
  const q = new URLSearchParams();
  for (const k of Object.keys(params)) {
    const v = params[k];
    if (v === undefined || v === null) continue;
    q.append(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

/* -------------------------
   HTTP helpers (all return a normalized ApiResponse<T>)
   - get/post/put/del are defensive: if server returned a raw T, wrap it into ApiResponse<T>.
   ------------------------- */

/**
 * GET -> expects ApiResponse<T> but will wrap raw payload if needed.
 */
export async function get<T = any>(url: string, params?: Record<string, any>, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const res = await api.get<any>(url, { params, ...(config ?? {}) });

    // res.data may already be ApiResponse<T> (because interceptor normalized)
    const d = res.data;

    if (d && typeof d === "object" && ("success" in d || "Success" in d)) {
      // already normalized wrapper
      return d as ApiResponse<T>;
    }

    // fallback: wrap raw payload
    return {
      success: true,
      errorMessage: null,
      data: d as T,
    } as ApiResponse<T>;
  } catch (err) {
    handleError(err);
    throw err;
  }
}

/**
 * POST -> expects ApiResponse<T> but will wrap raw payload if needed.
 */
export async function post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const res = await api.post<any>(url, data, config);

    // res.data is either:
    // - ApiResponse<T> (normalized by interceptor)
    // - raw T (if server didn't wrap or interceptor unwrapped)
    const d = res.data;

    if (d && typeof d === "object" && ("success" in d || "Success" in d)) {
      return d as ApiResponse<T>;
    }

    // fallback: wrap raw payload
    return {
      success: true,
      errorMessage: null,
      data: d as T,
    } as ApiResponse<T>;
  } catch (err) {
    handleError(err);
    throw err;
  }
}

/**
 * PUT -> returns raw T if your API returns raw, otherwise returns wrapped data's .data property.
 * We'll follow same defensive approach and return ApiResponse<T> for consistency.
 */
export async function put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const res = await api.put<any>(url, data, config);
    const d = res.data;
    if (d && typeof d === "object" && ("success" in d || "Success" in d)) {
      return d as ApiResponse<T>;
    }
    return {
      success: true,
      errorMessage: null,
      data: d as T,
    } as ApiResponse<T>;
  } catch (err) {
    handleError(err);
    throw err;
  }
}

/**
 * DELETE
 */
export async function del<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const res = await api.delete<any>(url, config);
    const d = res.data;
    if (d && typeof d === "object" && ("success" in d || "Success" in d)) {
      return d as ApiResponse<T>;
    }
    return {
      success: true,
      errorMessage: null,
      data: d as T,
    } as ApiResponse<T>;
  } catch (err) {
    handleError(err);
    throw err;
  }
}

/* -------------------------
   Error logging helper
   ------------------------- */
function handleError(error: any): void {
  if (error?.response) {
    // Axios error with server response
    try {
      console.error(
        "API error:",
        error.response?.status,
        JSON.stringify(error.response?.data, null, 2)
      );
    } catch (e) {
      console.error("API error (non-serializable response):", error.response);
    }
  } else if (error?.request) {
    console.error("API no response:", error.request);
  } else {
    console.error("API setup error:", error?.message ?? error);
  }
}

/* -------------------------
   Export axios instance as default
   ------------------------- */
export default api;
