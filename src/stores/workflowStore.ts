import { defineStore } from "pinia";

export const useWorkflowStore = defineStore("workflow", {
  state: () => ({
    workOrderId: 0 as number,
    currentStep: 0,
  }),
  actions: {
    setWorkOrderId(id: number) { this.workOrderId = id; },
    setCurrentStep(i: number) { this.currentStep = i; },
    reset() {
      this.workOrderId = 0;
      this.currentStep = 0;
    },
  },
});
