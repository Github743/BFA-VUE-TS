// src/modules/workorders/WorkOrdersApi.ts
import { post } from "@/services/http";
import type { WorkOrdersQuery, PagedResult, WorkOrderDetail } from "./WorkOrderType";

/**
 * Mocked data generator and API.
 * Replace with real HTTP calls when ready.
 */

const SAMPLE_COUNT = 57;

// Create some deterministic sample rows
const sampleData: WorkOrderDetail[] = Array.from({ length: SAMPLE_COUNT }).map((_, i) => {
  const idx = i + 1;
  return {
    workOrderId: `BFA-${String(idx).padStart(3, "0")}`,
    clientName: ["Alpha Shipping", "Beta Logistics", "Cimee Ltd"][i % 3],
    workOrderName: ["Issue BFA", "Amend BFA", "Terminate BFA"][i % 3],
    status: ["Options", "Agreement", "Invoice"][i % 3],
    email: `contact${idx}@example.com`,
    lastActivity: new Date(Date.now() - i * 24 * 3600 * 1000).toISOString(),
  };
});

/**
 * Simulate server-side filtering, sorting, and paging.
 */
function applyFilters(data: WorkOrderDetail[], q?: string, type?: string, status?: string, from?: string, to?: string) {
  return data.filter((r) => {
    if (q) {
      const qx = q.toLowerCase();
      if (!(r.clientName.toLowerCase().includes(qx) || r.workOrderId.toLowerCase().includes(qx))) {
        return false;
      }
    }
    if (type && type !== "All" && r.workOrderName !== type) return false;
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

function isPagedResult<T>(v: any): v is PagedResult<T> {
  return (
    v != null &&
    Array.isArray(v.items) &&
    typeof v.total === "number" &&
    typeof v.page === "number" &&
    typeof v.pageSize === "number"
  );
}

/**
 * Public API function - returns a PagedResult<WorkOrder>
 * @param query WorkOrdersQuery
 */
export async function fetchWorkOrders(
  query: WorkOrdersQuery
): Promise<PagedResult<WorkOrderDetail>> {
  const payload = {
    workOrderName: query.q ?? null,
    status: query.status ?? null,
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 10,
    from: query.from ?? null,
    to: query.to ?? null,
    sortField: query.sortField ?? null,
    sortDirection: query.sortDirection ?? null,
  };

  // Tell post we expect a PagedResult (server may still return null)
  const res = await post<PagedResult<WorkOrderDetail> | null>(
    "/searchwo",
    payload
  );

  if (!res.success) {
    // normalized error from ApiResponse
    throw new Error(res.errorMessage ?? "Failed to fetch work orders");
  }

  const d = res.data;

  // runtime guard
  if (!isPagedResult<WorkOrderDetail>(d)) {
    // helpful error for debugging; you can customize message
    throw new Error("Malformed response: expected PagedResult<WorkOrderDetail>");
  }

  // now d is narrowed to PagedResult<WorkOrderDetail>
  return d;
}