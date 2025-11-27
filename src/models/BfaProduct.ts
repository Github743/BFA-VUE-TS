export interface BfaProduct {
    systemProductId: number;
    systemProductName: string;
    amount: number;
    discountTypeName: string;
    productCode: string;
    workOrderClientAgreementId: number;
    workOrderClientAgreementEntityId: number;
    workOrderClientAgreementEntityProductId: number;
    isCustomized: boolean;
    discountType: string;
    systemProductAmount: number;
    expirationDate: string;
    limitPerYear: number;
    createdBy: string;
}
