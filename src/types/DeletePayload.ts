// src/types/DeletePayload.ts
// src/types/DeletePayload.ts
export interface DeletePayload<T = Record<string, any>> {
  id: number | string;
  row: T;
  rowIndex?: number;
}

