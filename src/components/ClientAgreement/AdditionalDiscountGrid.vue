<template>
  <LoadingOverlay :visible="loading" />
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
</template>
<script setup lang="ts">
  import BaseTable, { Column } from "@/components/common/BaseTable.vue";
  import { BfaProduct } from "@/models/BfaProduct";
  import {
    getDiscountEntityProducts,
    getEntityProducts,
  } from "@/services/bfaAgreementService";
  import { showToast } from "@/shared/utils/toast";
  import { onMounted, ref } from "vue";
  import LoadingOverlay from "../common/LoadingOverlay.vue";

  const loading = ref(false);

  const columns: Column<BfaProduct>[] = [
    {
      field: "workOrderClientAgreementId",
      label: "workOrderClientAgreementId",
      hidden: true,
    },
    { field: "systemProductName", label: "PRODUCT" },
    { field: "productCode", label: "PRODUCT CODE" },
    { field: "amount", label: "DISCOUNT" },
    { field: "discountTypeName", label: "DISCOUNT TYPE" },
    { field: "expirationDate", label: "Expiration Date" },
    { field: "limitPerYear", label: "Limit" },
    { field: "createdBy", label: "Added By" },
  ];
  const rows = ref<BfaProduct[]>([]);

  function formatMoney(n: number | string | null | undefined): string {
    const num = typeof n === "number" ? n : parseFloat(n ?? "0");
    return num.toFixed(2);
  }

  onMounted(async () => {
    try {
      loading.value = true;
      const result = await getDiscountEntityProducts(1156999);

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
    } finally {
      loading.value = false;
    }
  });
</script>
