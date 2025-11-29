export interface WorkOrderDetail {
  workOrderId: string;
  clientName: string;
  workOrderName: string;
  status: string;
  email: string;
  lastActivity: string;
}

export interface WorkOrdersQuery {
  q?: string;
  type?: string;
  status?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortDirection?: "asc" | "desc";
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
