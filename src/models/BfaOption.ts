export interface BfaOption {
    isMLCOption: boolean;
    isISMOption: boolean;
    isISPSOption: boolean;
    enrollmentDate?: string | null;
    amendmentDate?: string | null;
    createIntialInvoice: boolean;
    consolidatedStatement: boolean;
    agreementText?: string | null;
    appendixText?: string | null;
    hasAdditionalDiscounts: boolean;
    workOrderId: number;
    workOrderName?: string | null;
    isLISCRUser: boolean;
    readOnlyMode: boolean;
    clientName: string | null;
    clientId: number;
    workOrderClientAgreementId: number;
}
