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


import { ApiResponse } from "@/models/ApiResponse";
import { BfaProduct } from "@/models/BfaProduct";
import{LookupType}from "@/models/LookupType";
import { get, post } from "@/services/http";