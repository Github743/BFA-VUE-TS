<template>
  <div>
    <ClientDetails v-if="true" />
    <section style="margin-top: 2%">
      <!-- Certificate Type -->
      <div class="header-row">
        <span class="title">Certificate Type</span>
      </div>
      <div class="underline"></div>

      <div class="mb-4 pb-3">
        <div class="row gx-2 gy-2 align-items-center">
          <div class="col-2">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                id="cert-mlc"
                v-model="BfaOption.isMLCOption"
              />
              <label class="form-check-label" for="cert-mlc">MLC</label>
            </div>
          </div>

          <div class="col-2">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                id="cert-ism"
                v-model="BfaOption.isISMOption"
              />
              <label class="form-check-label" for="cert-ism">ISM</label>
            </div>
          </div>

          <div class="col-2">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                id="cert-isps"
                v-model="BfaOption.isISPSOption"
              />
              <label class="form-check-label" for="cert-isps">ISPS</label>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Discounts header -->
      <div class="header-row">
        <span class="title">Additional Discounts</span>
      </div>
      <div class="underline"></div>

      <!-- toggle include additional discounts -->
      <div class="form-check mb-3">
        <input
          id="include-discounts"
          class="form-check-input"
          type="checkbox"
          v-model="BfaOption.hasAdditionalDiscounts"
        />
        <label class="form-check-label" for="include-discounts">
          Include additional discounts
        </label>
      </div>
      <div class="row align-items-center mb-3" style="margin-left: 5%">
        <label class="col-sm-2 col-form-label">Enrollment Date:</label>
        <div class="col-sm-5">
          <div class="input-group">
            <flat-pickr
              ref="fp"
              v-model="BfaOption.enrollmentDate"
              :config="config"
              class="form-control"
              id="enrollmentDate"
            />
            <button
              class="btn btn-outline-secondary compact-cal"
              type="button"
              @click="openCalendar"
              aria-label="Open calendar"
            >
              <i class="bi bi-calendar3"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="row align-items-center" style="margin-left: 5%">
        <label class="col-sm-2 col-form-label">Agreement Text:</label>
        <div class="col-sm-5">
          <input
            type="text"
            class="form-control"
            v-model="BfaOption.agreementText"
          />
        </div>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
  import ClientDetails from "@/components/common/ClientDetails.vue";
  import { onMounted, reactive, ref } from "vue";
  import { BfaOption } from "@/models/BfaOption";
  import { getWorkOrderOptions } from "@/services/optionService";
  import { showToast } from "@/shared/utils/toast";
  import { useClientStore } from "@/stores/clientStore";

  const clientStore = useClientStore();

  const BfaOption = reactive<BfaOption>({
    isMLCOption: false,
    isISMOption: false,
    isISPSOption: false,
    enrollmentDate: "",
    amendmentDate: "",
    createIntialInvoice: false,
    consolidatedStatement: false,
    agreementText: "",
    appendixText: "",
    hasAdditionalDiscounts: false,
    workOrderId: 0,
    workOrderName: "",
    isLISCRUser: false,
    readOnlyMode: false,
    clientName: "",
    clientId: 0,
    workOrderClientAgreementId: 0,
  });
  const config = {
    allowInput: false,
    clickOpens: false,
  };

  const fp = ref<any>(null);

  function openCalendar(): void {
    // fp.value may contain Flatpickr instance or a component wrapper depending on usage
    const instance = (fp.value as any)?.fp || fp.value;

    // Check if we have a Flatpickr instance with `.open()`
    if (instance && typeof instance.open === "function") {
      instance.open();
      return;
    }

    // Fallback to focusing the input element
    const el = document.getElementById(
      "enrollmentDate"
    ) as HTMLInputElement | null;
    el?.focus();
  }

  onMounted(async () => {
    try {
      const result = await getWorkOrderOptions(1156999);

      if (!result.success) {
        showToast("Invalid workorder id", "danger");
      }
      if (result.success && result.data) {
        await clientStore.setClientId(result.data.clientId, { load: true });
        Object.assign(BfaOption, result.data);
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
