import { SystemDiscountScheduleProducts } from "@/models/SystemDiscountScheduleProducts";

export interface SaveDiscountPayload {
  scheduleId: number | string;
  rows: SystemDiscountScheduleProducts[];
}
