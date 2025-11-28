export interface SystemDiscountSchedule
{
    systemDiscountScheduleId: number;
    systemDiscountProgramTypeId: number;
    name: string;
    displayName: string;
    description: string;
    scheduleCategoryName: string;
    ism: boolean;
    mlc: boolean;
    isps: boolean;
}