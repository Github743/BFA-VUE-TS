export async function getEntityProducts(workOrderId: Number): Promise<ApiResponse<BfaProduct>> {
  const resp = await get("/GetEntityProducts", { workOrderId });
  return resp as ApiResponse<BfaProduct>;
}


import { ApiResponse } from "@/models/ApiResponse";
import { BfaProduct } from "@/models/BfaProduct";
import { get } from "@/services/http";