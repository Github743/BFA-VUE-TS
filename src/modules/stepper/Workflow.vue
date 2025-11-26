<template>
  <div class="px-3">
    <Breadcrumbs />
    <StepperAnimated
      :steps="steps"
      :current="currentStep"
      @update:current="goToStep"
      @step-click="onStepClick"
      clickable
    />

    <div class="step-content mt-4">
      <component :is="currentComponent" />
    </div>

    <div class="d-flex gap-3 justify-content-center mt-4">
      <button
        class="btn btn-outline-secondary"
        @click="prev"
        :disabled="currentStep === 0"
      >
        Back
      </button>
      <button
        class="btn btn-primary"
        @click="next"
        :disabled="currentStep >= steps.length - 1"
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

  // <<-- SET OPTIONS (index 0) AS DEFAULT -->
  const currentStep = ref(0); // was 1; now default to Options

  // map index -> component
  const components = [
    Options,
    Agreement,
    VesselSelection,
    Invoice,
    Document,
    Summary,
  ];

  const currentComponent = computed(() => components[currentStep.value]);

  function goToStep(i: number) {
    currentStep.value = i;
  }
  function onStepClick(i: number) {
    // optional: confirm or check permissions before navigating
    goToStep(i);
  }

  function next() {
    if (currentStep.value < steps.length - 1) currentStep.value++;
  }
  function prev() {
    if (currentStep.value > 0) currentStep.value--;
  }
</script>

<style scoped>
  .step-content {
    min-height: 220px;
  } /* ensure some space under the stepper */
</style>
