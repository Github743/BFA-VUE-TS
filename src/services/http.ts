import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError
} from "axios";

export interface ApiResponseDTO<T> {
  Success?: boolean;
  success?: boolean;
  Data?: T;
  data?: T;
  ErrorMessage?: string;
  errorMessage?: string;
}

// ----- Axios instance -----

export const API_BASE = import.meta.env.PROD
  ? "https://archerfish-dev.liscr.com/bfa/api"
  : "https://localhost:7020/api";

const api: AxiosInstance = axios.create({
  baseURL:
    import.meta.env.PROD
      ? "https://archerfish-dev.liscr.com/bfa/api"
      : "https://localhost:7020/api",
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.response.use(
  (response: AxiosResponse<ApiResponseDTO<any>>) => {
    const body = response.data;

    if (body && typeof body === "object") {
      const hasSuccess = "Success" in body || "success" in body;
      const hasData = "Data" in body || "data" in body;

      if (hasSuccess && hasData) {
        const success = body.Success ?? body.success;
        const data = body.Data ?? body.data;
        const errorMessage = body.ErrorMessage ?? body.errorMessage;

        if (success) {
          // unwrap
          return { ...response, data };
        } else {
          const error = new Error(errorMessage || "API request failed") as AxiosError;
          error.response = response;
          throw error;
        }
      }
    }

    return response;
  },

  (error: AxiosError) => {
    if (error.response && error.response.data) {
      const dto = error.response.data as ApiResponseDTO<any>;
      const msg = dto.ErrorMessage || dto.errorMessage;

      if (msg) error.message = msg;
    }
    return Promise.reject(error);
  }
);

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



export async function get<T = any>(url: string, params?: Record<string, any>): Promise<T> {
  const full = `${API_BASE}${url}${buildQuery(params)}`;
  const resp = await fetch(full, { method: "GET", headers: { "Content-Type": "application/json" } });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const data = await resp.json();
  // if your server wraps responses, unwrap here
  return data as T;
}

export async function post<T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const res = await api.post<T>(url, data, config);
    return res.data;
  } catch (err) {
    handleError(err);
    throw err;
  }
}

export async function put<T>(
  url: string,
  data?: any
): Promise<T> {
  try {
    const res = await api.put<T>(url, data);
    return res.data;
  } catch (err) {
    handleError(err);
    throw err;
  }
}

export async function del<T>(url: string): Promise<T> {
  try {
    const res = await api.delete<T>(url);
    return res.data;
  } catch (err) {
    handleError(err);
    throw err;
  }
}

function handleError(error: any): void {
  if (error?.response) {
    console.error(
      "API error:",
      error.response?.status,
      error.response?.data
    );
  } else if (error?.request) {
    console.error("API no response:", error.request);
  } else {
    console.error("API setup error:", error?.message || error);
  }
}

export default api;
