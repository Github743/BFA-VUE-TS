import { post } from "@/services/http";
import type { ApiResponse } from "@/models/ApiResponse";
import type { Workorder } from "@/models/WorkOrder";

export interface CreateWorkOrderPayload {
  clientId: number;
  clientNumber: number;
  entities: { clientId: number }[];
}

export async function createWorkOrder(
  payload: CreateWorkOrderPayload
): Promise<ApiResponse<Workorder>> {
  try {
    return await post<Workorder>("/createwo", payload);
  } catch (err) {
    console.error("createWorkOrder failed:", err);
    throw err;
  }
}