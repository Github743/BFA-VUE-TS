export interface WorkOrder {
  workOrderId: string;
  clientName: string;
  type: string;
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
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
