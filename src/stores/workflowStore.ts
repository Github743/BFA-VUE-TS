import { defineStore } from "pinia";

export const useWorkflowStore = defineStore("workflow", {
  state: () => ({
    workOrderId: 0 as number,
        currentStep: 0,
    hasAdditionalDiscounts: false as boolean,

  }),
  actions: {
    setWorkOrderId(id: number) { this.workOrderId = id; },
      setCurrentStep(i: number) { this.currentStep = i; },
    setHasAdditionalDiscounts(v: boolean) { this.hasAdditionalDiscounts = v; },
    reset() {
      this.workOrderId = 0;
        this.currentStep = 0;
        this.hasAdditionalDiscounts = false;
    },
    },
  
});
