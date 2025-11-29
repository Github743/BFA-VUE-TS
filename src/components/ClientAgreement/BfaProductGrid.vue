<template>
  <LoadingOverlay :visible="loading" />
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h6 class="fw-bold mb-0">
      Combined Block Fee for ISM-ISPS-MLC (21–30 Ships)
    </h6>

    <button class="btn btn-outline-primary btn-sm" @click="showAdd = true">
      + Add Discount
    </button>
    <AddDiscountModal
      v-model:visible="showAdd"
      :workOrderId="workOrderId"
      @save="onDiscountsSaved"
      @close="showAdd = false"
    />
  </div>

  <!-- Table -->
  <BaseTable :columns="columns" :rows="rows" :enableBulkDelete="false">
    <template #amount="{ row }">{{ formatMoney(row.amount) }}</template>
    <template #cell-actions="{ row, rowIndex }">
      <button
        class="btn btn-sm btn-outline-primary icon-btn me-2"
        @click="
          onEdit({
            id: String(
              row.workOrderClientAgreementEntityId ??
                row.systemProductId ??
                row.id ??
                ''
            ),
            row,
            rowIndex,
          })
        "
      >
        <i class="bi bi-pencil"></i>
      </button>
      <button
        class="btn btn-sm btn-outline-danger icon-btn"
        @click="
          onDelete({
            id: String(
              row.workOrderClientAgreementEntityId ??
                row.systemProductId ??
                row.id ??
                ''
            ),
            row,
          })
        "
      >
        <i class="bi bi-trash"></i>
      </button>
    </template>
  </BaseTable>
  <teleport to="body">
    <div
      v-if="showModal"
      class="modal-backdrop-custom"
      @click.self="closeModal"
    >
      <div class="modal-dialog-custom" role="dialog" aria-modal="true">
        <div class="card">
          <div
            class="card-header d-flex justify-content-between align-items-center"
          >
            <h5 class="mb-0">Edit Product</h5>
            <button
              class="btn btn-sm btn-link text-muted"
              @click="closeModal"
              aria-label="Close"
            >
              <i class="bi bi-x-lg" style="font-size: 1.2rem"></i>
            </button>
          </div>

          <form>
            <div class="card-body">
              <div class="mb-3">
                <label class="form-label">Product</label>
                <input
                  type="text"
                  disabled
                  class="form-control"
                  v-model="form.systemProductName"
                  readonly
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Discount Type</label>
                <select v-model="form.discountType" class="form-select">
                  <option value="">Select discount type</option>
                  <option
                    v-for="t in discountTypes"
                    :key="t.code"
                    :value="t.code"
                  >
                    {{ t.name }}
                  </option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  class="form-control"
                  v-model="form.amount"
                  required
                />
              </div>

              <!-- <div v-if="error" class="alert alert-danger py-2">{{ error }}</div> -->
            </div>

            <div class="card-footer d-flex justify-content-end gap-2">
              <button
                type="button"
                class="btn btn-outline-secondary"
                @click="closeModal"
              >
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">
                <!-- <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> -->
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </teleport>
</template>
<script setup lang="ts">
  import BaseTable, { Column } from "@/components/common/BaseTable.vue";
  import { BfaProduct } from "@/models/BfaProduct";
  import {
    deleteEntityProduct,
    getDiscountTypes,
    getEntityProducts,
  } from "@/services/bfaAgreementService";
  import { showToast } from "@/shared/utils/toast";
  import { onMounted, ref, toRaw } from "vue";

  import LoadingOverlay from "@/components/common/LoadingOverlay.vue";
  import confirmDialog from "@/shared/utils/confirm";
  import AddDiscountModal from "./AddDiscountModal.vue";
  import { SaveDiscountPayload } from "./SaveDiscountPayload";
  import { WorkOrderClientAgreementEntityProduct } from "@/models/WorkOrderClientAgreementEntityProduct";
  import { useWorkflowStore } from "@/stores/workflowStore";

  const workOrdeStore = useWorkflowStore();
  const showAdd = ref(false);
  const workOrderId = workOrdeStore.workOrderId;

  const loading = ref(false);
  const showModal = ref(false);
  const discountTypes = ref<{ code: number; name: string }[]>([]);

  async function onDiscountsSaved(payload: SaveDiscountPayload) {
    const products: WorkOrderClientAgreementEntityProduct[] = payload.rows.map(
      (r) => {
        return {
          defaultOrder: r.defaultOrder,
          discountType: r.discountType,
          systemProductId: Number(r.systemProductId ?? 0),
          discountTypeName: r.discountTypeName,
          amount: r.amount,
          isCustomized: false,
          isAdditionalDiscount: false,
          limitPerYear: null,
          expiryDate: "",
          startDate: "",
          tonnageBilling: null,
          isOngoingDiscount: null,
        };
      }
    );

    showToast("Discounts saved (client-side).", "success");
  }

  async function loadDiscountTypes() {
    try {
      const res = await getDiscountTypes("DiscountType");
      discountTypes.value = (Array.isArray(res) ? res : []).map((d) => ({
        code: d.lookupId,
        name: d.displayName,
      }));
    } catch (err) {
      console.error("Failed to load discount types:", err);
      discountTypes.value = [];
    }
  }

  const columns: Column<BfaProduct>[] = [
    {
      field: "workOrderClientAgreementId",
      label: "workOrderClientAgreementId",
      hidden: true,
    },
    { field: "systemProductName", label: "PRODUCT" },
    { field: "amount", label: "DISCOUNT" },
    { field: "discountTypeName", label: "DISCOUNT TYPE" },
  ];
  const rows = ref<BfaProduct[]>([]);
  const form = ref<Partial<BfaProduct>>({});

  function formatMoney(n: number | string | null | undefined): string {
    const num = typeof n === "number" ? n : parseFloat(n ?? "0");
    return num.toFixed(2);
  }

  const loadProducts = async () => {
    try {
      loading.value = true;
      const result = await getEntityProducts(workOrderId);

      if (!result.success) {
        showToast("Invalid workorder id", "danger");
        rows.value = [];
        return;
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
  };

  onMounted(async () => {
    loadProducts();
    loadDiscountTypes();
  });

  function onEdit(payload: { id: string; row: BfaProduct; rowIndex?: number }) {
    // fill the form with the row data (shallow clone)
    const raw = toRaw(payload.row);
    form.value = structuredClone(raw);

    //error.value = null;
    showModal.value = true;
  }

  async function onDelete(payload: { id: string | number; row: BfaProduct }) {
    const productName = payload.row.systemProductName; // customize
    const message = `Are you sure you want to delete the discount for ${productName}? This action cannot be undone.`;
    const confirmed = await confirmDialog({
      title: "Confirm Delete",
      message,
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmClass: "btn-danger",
    });

    if (!confirmed) return;
    try {
      loading.value = true;
      if (
        await deleteEntityProduct(
          Number(payload.row.workOrderClientAgreementEntityProductId)
        )
      ) {
        showToast("Deleted the selected product " + productName, "success");
        loadProducts();
      } else {
        showToast("Failed to delete product. Please try again.", "danger");
      }
    } catch (err) {
      showToast("Failed to delete product. Please try again.", "danger");
    } finally {
      loading.value = false;
    }
  }

  /**
   * Close modal and reset error
   */
  function closeModal() {
    showModal.value = false;
    // error.value = null;
    // optionally clear form: form.value = {}
  }
</script>
<style scoped>
  /* Modal backdrop + dialog centered */
  .modal-backdrop-custom {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1050;
  }

  /* Dialog sizing */
  .modal-dialog-custom {
    max-width: 620px;
    width: 100%;
    padding: 12px;
    box-sizing: border-box;
  }

  /* Slightly rounded card modal */
  .card {
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }

  /* header spacing */
  .card-header {
    padding: 18px 20px;
    border-bottom: 1px solid #e9ecef;
  }

  /* body padding */
  .card-body {
    padding: 18px 20px;
  }

  /* footer */
  .card-footer {
    padding: 12px 16px;
    background: #fff;
    border-top: 1px solid #e9ecef;
  }

  /* small adjustments for form controls in the modal */
  .form-label {
    font-weight: 500;
    font-size: 0.9rem;
  }

  .spinner-border {
    vertical-align: middle;
  }
</style>
