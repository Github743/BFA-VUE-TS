export async function getEntityProducts(workOrderId: Number): Promise<ApiResponse<BfaProduct>> {
  const resp = await get("/GetEntityProducts", { workOrderId });
  return resp as ApiResponse<BfaProduct>;
}

export async function getDiscountEntityProducts(workOrderId: Number): Promise<ApiResponse<BfaProduct>> {
  const resp = await get("/AdditionalDiscountedProducts", { workOrderId });
  return resp as ApiResponse<BfaProduct>;
}

export async function deleteEntityProduct(workOrderClientAgreementEntityProductId: Number): Promise<ApiResponse<boolean>> {
  const resp = await post("/RemoveEntity",  workOrderClientAgreementEntityProductId );
  return resp as ApiResponse<boolean>;
}

export async function getDiscountTypes(LookupTypeName: string): Promise<ApiResponse<LookupType>> {
  const resp = await get("/lookupByName", { LookupTypeName });
  return resp as ApiResponse<LookupType>;
}


export async function getSchedules(workOrderId: number, systemDiscountProgramId: number): Promise<ApiResponse<SystemDiscountSchedule>> {
  const resp = await get("/schedules", { workOrderId, systemDiscountProgramId });
  return resp as ApiResponse<SystemDiscountSchedule>;
}

export async function getScheduleProducts(systemDiscountScheduleId: number): Promise<ApiResponse<SystemDiscountScheduleProducts>> {
  const resp = await get("/schedule-products", { systemDiscountScheduleId });
  return resp as ApiResponse<SystemDiscountScheduleProducts>;
}

import { ApiResponse } from "@/models/ApiResponse";
import { BfaProduct } from "@/models/BfaProduct";
import { LookupType } from "@/models/LookupType";
import{SystemDiscountScheduleProducts}from "@/models/SystemDiscountScheduleProducts";
import { SystemDiscountSchedule } from "@/models/SystemDiscountSchedule";
import { get, post } from "@/services/http";