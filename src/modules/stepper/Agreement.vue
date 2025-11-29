<template>
  <div>
    <ClientDetails v-if="true" />
    <section style="margin-top: 2%">
      <div class="header-row">
        <span class="title">Issue Block Fee Agreement</span>
      </div>
      <div class="underline"></div>
    </section>
    <div class="container mt-4">
      <!-- Tabs -->
      <ul class="nav nav-tabs mb-3 border-0">
        <li class="nav-item me-2">
          <button
            class="btn"
            :class="activeTab === 'bfa' ? 'btn-primary' : 'btn-outline-primary'"
            @click="activeTab = 'bfa'"
          >
            BFA Products
          </button>
        </li>

        <li class="nav-item" v-if="hasAdditionalDiscounts">
          <button
            class="btn"
            :class="
              activeTab === 'discounts' ? 'btn-primary' : 'btn-outline-primary'
            "
            @click="activeTab = 'discounts'"
          >
            Additional Discounts
          </button>
        </li>
      </ul>
      <BfaProductGrid v-if="activeTab === 'bfa'" />
      <AdditionalDiscountGrid v-else-if="activeTab === 'discounts'" />
    </div>
  </div>
</template>
<script setup lang="ts">
  import AdditionalDiscountGrid from "@/components/ClientAgreement/AdditionalDiscountGrid.vue";
  import BfaProductGrid from "@/components/ClientAgreement/BfaProductGrid.vue";
  import ClientDetails from "@/components/common/ClientDetails.vue";
  import { useWorkflowStore } from "@/stores/workflowStore";

  import { computed, ref } from "vue";

  const activeTab = ref<"bfa" | "discounts">("bfa");
  const workflow = useWorkflowStore();
  // expose reactive boolean
  const hasAdditionalDiscounts = computed(
    () => workflow.hasAdditionalDiscounts
  );

  // Optional: if you want to switch to the discounts tab automatically when the flag becomes true
  // watch(hasAdditionalDiscounts, (v) => { if (v) activeTab.value = 'discounts' });
</script>
<style scoped>
  .header-row {
    margin-bottom: 4px;
  }

  .title {
    font-size: 14px;
    font-weight: 600;
    color: #1d6be4;
  }
  .underline {
    width: 100%;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 12px;
  }
</style>
