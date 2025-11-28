<template>
  <div class="px-3">
    <Breadcrumbs />

    <StepperAnimated
      :steps="steps"
      :current="workflow.currentStep"
      @update:current="goToStep"
      @step-click="onStepClick"
      clickable
    />

    <div class="step-content mt-4">
      <!-- Automatically gives workOrderId from store to child -->
      <component :is="currentComponent" :workOrderId="workflow.workOrderId" />
    </div>

    <div class="d-flex gap-3 justify-content-center mt-4">
      <button
        class="btn btn-outline-secondary"
        @click="prev"
        :disabled="workflow.currentStep === 0"
      >
        Back
      </button>
      <button
        class="btn btn-primary"
        @click="next"
        :disabled="workflow.currentStep >= steps.length - 1"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from "vue";
  import StepperAnimated from "./StepperAnimated.vue";

  import Options from "./Options.vue";
  import Agreement from "./Agreement.vue";
  import VesselSelection from "./VesselSelection.vue";
  import Invoice from "./Invoice.vue";
  import Document from "./Document.vue";
  import Summary from "./Summary.vue";
  import Breadcrumbs from "@/components/common/Breadcrumbs.vue";
  import { useWorkflowStore } from "@/stores/workflowStore";

  const steps = [
    {
      key: "options",
      title: "Options",
      subtitle: "Completed",
      tooltip: "Choose products & options",
    },
    {
      key: "agreement",
      title: "Agreement",
      subtitle: "In-Progress",
      tooltip: "Sign or accept agreement",
    },
    {
      key: "vessel",
      title: "Vessel Selection",
      subtitle: "Pending",
      tooltip: "Choose vessel",
    },
    {
      key: "invoice",
      title: "Invoice",
      subtitle: "Pending",
      tooltip: "Review invoice",
    },
    {
      key: "document",
      title: "Document",
      subtitle: "Pending",
      tooltip: "Upload documents",
    },
    {
      key: "summary",
      title: "Summary",
      subtitle: "Pending",
      tooltip: "Final summary",
    },
  ];

  const workflow = useWorkflowStore();

  const currentStep = ref(0);

  // map index -> component
  const components = [
    Options,
    Agreement,
    VesselSelection,
    Invoice,
    Document,
    Summary,
  ];

  const currentComponent = computed(() => {
    return components[workflow.currentStep];
  });

  function goToStep(step: number) {
    workflow.setCurrentStep(step);
  }

  function onStepClick(step: number) {
    goToStep(step);
  }

  function next() {
    if (workflow.currentStep < steps.length - 1) {
      workflow.setCurrentStep(workflow.currentStep + 1);
    }
  }

  function prev() {
    if (workflow.currentStep > 0) {
      workflow.setCurrentStep(workflow.currentStep - 1);
    }
  }
</script>

<style scoped>
  .step-content {
    min-height: 220px;
  } /* ensure some space under the stepper */
</style>
