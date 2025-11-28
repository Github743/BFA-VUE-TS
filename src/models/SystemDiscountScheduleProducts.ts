export interface SystemDiscountScheduleProducts{
    discountTypeName: string;
    systemProductName: string;
    systemProductAmount: number;
    productCode: string;
    isCustomized: boolean;
    systemDiscountScheduleProductId: number;
    systemDiscountScheduleId: number;
    systemProductId: number;
    discountType: number;
    amount: number;
    isRecurrence: boolean;
    defaultOrder: number;
}