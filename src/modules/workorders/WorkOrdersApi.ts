// src/modules/workorders/WorkOrdersApi.ts
import type { WorkOrder, WorkOrdersQuery, PagedResult } from "./WorkOrderType";

/**
 * Mocked data generator and API.
 * Replace with real HTTP calls when ready.
 */

const SAMPLE_COUNT = 57;

// Create some deterministic sample rows
const sampleData: WorkOrder[] = Array.from({ length: SAMPLE_COUNT }).map((_, i) => {
  const idx = i + 1;
  return {
    workOrderId: `BFA-${String(idx).padStart(3, "0")}`,
    clientName: ["Alpha Shipping", "Beta Logistics", "Cimee Ltd"][i % 3],
    type: ["Issue BFA", "Amend BFA", "Terminate BFA"][i % 3],
    status: ["Options", "Agreement", "Invoice"][i % 3],
    email: `contact${idx}@example.com`,
    lastActivity: new Date(Date.now() - i * 24 * 3600 * 1000).toISOString(),
  };
});

/**
 * Simulate server-side filtering, sorting, and paging.
 */
function applyFilters(data: WorkOrder[], q?: string, type?: string, status?: string, from?: string, to?: string) {
  return data.filter((r) => {
    if (q) {
      const qx = q.toLowerCase();
      if (!(r.clientName.toLowerCase().includes(qx) || r.workOrderId.toLowerCase().includes(qx))) {
        return false;
      }
    }
    if (type && type !== "All" && r.type !== type) return false;
    if (status && status !== "All" && r.status !== status) return false;
    if (from) {
      const fromDate = new Date(from);
      if (isFinite(fromDate.getTime())) {
        if (new Date(r.lastActivity) < fromDate) return false;
      }
    }
    if (to) {
      const toDate = new Date(to);
      if (isFinite(toDate.getTime())) {
        if (new Date(r.lastActivity) > toDate) return false;
      }
    }
    return true;
  });
}

/**
 * Public API function - returns a PagedResult<WorkOrder>
 * @param query WorkOrdersQuery
 */
export async function fetchWorkOrders(query: WorkOrdersQuery = {}): Promise<PagedResult<WorkOrder>> {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 300));

  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.max(1, query.pageSize ?? 10);

  const filtered = applyFilters(sampleData, query.q, query.type, query.status, query.from, query.to);

  const start = (page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  return {
    items: pageItems,
    total: filtered.length,
    page,
    pageSize,
  };
}