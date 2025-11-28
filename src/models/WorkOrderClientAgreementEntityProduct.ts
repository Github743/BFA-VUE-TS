export interface WorkOrderClientAgreementEntityProduct
{
    defaultOrder: number|null;
    discountType: number;
    systemProductId: number;
    discountTypeName: string;
    amount: number;
    isCustomized: boolean;
    isAdditionalDiscount: boolean;
    limitPerYear: number | null;
    expiryDate: string;
    startDate: string;
    tonnageBilling: boolean|null;
    isOngoingDiscount: boolean|null;
}