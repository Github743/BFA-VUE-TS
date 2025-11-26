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
          <button class="btn btn-primary active" data-bs-toggle="tab">
            BFA Products
          </button>
        </li>

        <li class="nav-item">
          <button class="btn btn-outline-primary" data-bs-toggle="tab">
            Additional Discounts
          </button>
        </li>
      </ul>

      <!-- Section Title -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="fw-bold mb-0">
          Combined Block Fee for ISM-ISPS-MLC (21–30 Ships)
        </h6>

        <button class="btn btn-outline-primary btn-sm">+ Add Discount</button>
      </div>

      <!-- Table -->
      <BaseTable :columns="columns" :rows="rows" :enableBulkDelete="false">
        <template #amount="{ row }">{{
          formatMoney(row.amount)
        }}</template></BaseTable
      >
    </div>
  </div>
</template>
<script setup lang="ts">
  import BaseTable, { Column } from "@/components/common/BaseTable.vue";
  import ClientDetails from "@/components/common/ClientDetails.vue";
  import { BfaProduct } from "@/models/BfaProduct";
  import { getEntityProducts } from "@/services/bfaProductService";
  import { showToast } from "@/shared/utils/toast";
  import { ref, onMounted, reactive } from "vue";

  function formatMoney(n: number | string | null | undefined): string {
    const num = typeof n === "number" ? n : parseFloat(n ?? "0");
    return num.toFixed(2);
  }

  const rows = ref<BfaProduct[]>([]);

  const columns: Column<BfaProduct>[] = [
    {
      field: "workOrderClientAgreementId",
      label: "workOrderClientAgreementId",
      hidden: true,
    },
    { field: "productCode", label: "PRODUCT" },
    { field: "amount", label: "DISCOUNT" },
    { field: "discountTypeName", label: "DISCOUNT TYPE" },
  ];
  onMounted(async () => {
    try {
      const result = await getEntityProducts(1156999);

      if (!result.success) {
        showToast("Invalid workorder id", "danger");
      }
      if (Array.isArray(result.data)) {
        rows.value = result.data as BfaProduct[];
      } else if (result.data) {
        rows.value = [result.data as BfaProduct];
      } else {
        rows.value = [];
      }
    } catch (err) {
      showToast("Invalid workorder id", "danger");
    }
  });
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
