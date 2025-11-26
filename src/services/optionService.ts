export async function getWorkOrderOptions(workOrderId: Number): Promise<ApiResponse<BfaOption>> {
  const resp = await get(`/${workOrderId}/options`);
  return resp as ApiResponse<BfaOption>;
}


import { ApiResponse } from "@/models/ApiResponse";
import { BfaOption } from "@/models/BfaOption";
import { get } from "@/services/http";