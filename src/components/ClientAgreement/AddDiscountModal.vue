<template>
  <teleport to="body">
    <div
      v-if="visible"
      class="modal-backdrop-custom"
      @keydown.esc="close"
      tabindex="-1"
    >
      <div class="modal-dialog-custom" role="dialog" aria-modal="true">
        <div class="card">
          <div
            class="card-header header-blue d-flex justify-content-between align-items-center"
          >
            <h5 class="mb-0">Add Discount</h5>
            <button
              class="btn btn-link text-white"
              @click="close"
              aria-label="Close"
            >
              <i class="bi bi-x-lg" style="font-size: 1.3rem"></i>
            </button>
          </div>

          <div class="card-body">
            <div class="mb-3">
              <label class="form-label">Pick Discount Schedule</label>
              <select
                class="form-select"
                v-model="selectedScheduleId"
                @change="onScheduleChange"
              >
                <option value="">Select schedule</option>
                <option
                  v-for="s in discountSchedules"
                  :key="s.id"
                  :value="s.id"
                >
                  {{ s.name }}
                </option>
              </select>
            </div>

            <div class="table-container position-relative">
              <LoadingOverlay v-if="loading" />
              <div
                v-else
                class="table-responsive"
                style="max-height: 420px; overflow: auto"
              >
                <table class="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th style="width: 220px">Discount Type</th>
                      <th style="width: 140px">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(p, idx) in tableRows"
                      :key="p.systemProductId ?? idx"
                    >
                      <td class="align-middle">{{ p.systemProductName }}</td>

                      <td class="align-middle">
                        <select
                          class="form-select form-select-sm"
                          v-model="p.discountTypeName"
                        >
                          <option value="">Select discount type</option>
                          <option
                            v-for="d in discountTypes"
                            :key="d.code"
                            :value="d.name"
                          >
                            {{ d.name }}
                          </option>
                        </select>
                      </td>

                      <td class="align-middle">
                        <input
                          type="number"
                          class="form-control form-control-sm"
                          v-model.number="p.amount"
                          min="0"
                          step="0.01"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="card-footer d-flex justify-content-end gap-2">
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="close"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              :disabled="
                saving || !selectedScheduleId || tableRows.length === 0
              "
              @click="save"
            >
              <span
                v-if="saving"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted } from "vue";
  import LoadingOverlay from "@/components/common/LoadingOverlay.vue";
  import {
    getDiscountTypes,
    getScheduleProducts,
    getSchedules,
  } from "@/services/bfaAgreementService"; // your real service
  import { SystemDiscountScheduleProducts } from "@/models/SystemDiscountScheduleProducts";
  // import getScheduleProducts, getDiscountTypesSvc from your services as needed

  // ----- Props / Emits -----
  const props = defineProps({
    visible: { type: Boolean, default: false },
    workOrderId: { type: Number, required: false },
  });

  const emit = defineEmits<{
    (e: "update:visible", v: boolean): void;
    (e: "save", payload: { scheduleId: number | string; rows: any[] }): void;
    (e: "close"): void;
  }>();

  // ----- Local state -----
  const visible = ref<boolean>(props.visible);
  watch(
    () => props.visible,
    (v) => (visible.value = v)
  );
  watch(visible, (v) => emit("update:visible", v));

  const loading = ref(false);
  const saving = ref(false);

  type DiscountType = { code: number | string; name: string };

  const discountSchedules = ref<{ id: number; name: string }[]>([]);
  const discountTypes = ref<DiscountType[]>([]);
  const selectedScheduleId = ref<number | string | "">("");
  const tableRows = ref<SystemDiscountScheduleProducts[]>([]);

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

  async function loadSchedules() {
    loading.value = true;
    try {
      const res = await getSchedules(Number(props.workOrderId ?? 0), 1);

      if (!res?.success || !res.data) {
        discountSchedules.value = [];
        return;
      }

      const raw = res.data as any;
      const arr = Array.isArray(raw) ? raw : [raw];
      discountSchedules.value = arr.map((s: any) => {
        const id = s.systemDiscountScheduleId;
        const name = s.name;
        return { id: Number(id), name: String(name) };
      });
    } catch (err) {
      discountSchedules.value = [];
    } finally {
      loading.value = false;
    }
  }

  // when schedule select changes
  async function onScheduleChange() {
    if (!selectedScheduleId.value) {
      tableRows.value = [];
      return;
    }

    try {
      loading.value = true;
      const res = await getScheduleProducts(Number(selectedScheduleId.value));
      const raw = res.data;
      const arr = Array.isArray(raw) ? raw : [raw];
      tableRows.value = arr.map((r) => ({
        // map exactly to your interface
        discountTypeName: r.discountTypeName,
        systemProductName: r.systemProductName,
        systemProductAmount: Number(r.systemProductAmount),
        productCode: r.productCode,
        isCustomized: r.isCustomized,
        systemDiscountScheduleProductId: Number(
          r.systemDiscountScheduleProductId
        ),
        systemDiscountScheduleId: Number(r.systemDiscountScheduleId),
        systemProductId: Number(r.systemProductId),
        discountType: Number(r.discountType ?? 0),
        amount: Number(r.amount),
        isRecurrence: r.isRecurrence,
        defaultOrder: r.defaultOrder,
      }));
    } catch (err) {
    } finally {
      loading.value = false;
    }
  }

  // watch modal visible: load lists on open
  watch(visible, (v) => {
    if (v) {
      void Promise.all([loadSchedules(), loadDiscountTypes()]);
    }
  });

  // public close
  function close() {
    visible.value = false;
    emit("close");
  }

  // Save: emit edited rows to parent
  async function save() {
    if (!selectedScheduleId.value) return;
    saving.value = true;
    try {
      emit("save", {
        scheduleId: selectedScheduleId.value,
        rows: tableRows.value,
      });
      visible.value = false;
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      saving.value = false;
    }
  }

  // auto load if visible initially
  onMounted(() => {
    if (visible.value) {
      void Promise.all([loadSchedules(), loadDiscountTypes()]);
    }
  });
</script>

<style scoped>
  .modal-backdrop-custom {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1050;
  }

  .modal-dialog-custom {
    max-width: 900px;
    width: 100%;
    padding: 12px;
    box-sizing: border-box;
  }

  .card {
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }

  .header-blue {
    background: #1078ff;
    color: white;
    padding: 16px 20px;
  }

  .card-body {
    padding: 16px 20px;
  }

  .card-footer {
    padding: 12px 16px;
    background: #fff;
    border-top: 1px solid #e9ecef;
  }
  .table-container {
    min-height: 80px;
  }
</style>
