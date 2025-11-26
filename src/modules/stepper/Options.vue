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
                v-model="certificates.mlc"
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
                v-model="certificates.ism"
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
                v-model="certificates.isps"
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
          v-model="includeDiscounts"
        />
        <label class="form-check-label" for="include-discounts">
          Include additional discounts
        </label>
      </div>
      <div class="row align-items-center mb-3" style="margin-left: 5%">
        <label class="col-sm-2 col-form-label">Enrollment Date:</label>
        <div class="col-sm-5">
          <div class="input-group">
            <input
              id="enrollmentDate"
              class="form-control"
              type="date"
              v-model="enrollmentDate"
              :aria-label="'Enrollment date'"
            />
          </div>
        </div>
      </div>

      <div class="row align-items-center" style="margin-left: 5%">
        <label class="col-sm-2 col-form-label">Agreement Text:</label>
        <div class="col-sm-5">
          <input type="text" class="form-control" v-model="agreementText" />
        </div>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
  import ClientDetails from "@/components/common/ClientDetails.vue";
  import { useClientStore } from "@/stores/clientStore";
  import { reactive, ref, toRefs } from "vue";

  interface Certificates {
    mlc: boolean;
    ism: boolean;
    isps: boolean;
  }

  const certificates = reactive<Certificates>({
    mlc: false,
    ism: false,
    isps: false,
  });
  const includeDiscounts = ref<boolean>(false);
  const enrollmentDate = ref<string>("");
  const agreementText = ref<string>("");

  const store = useClientStore();
  // reactive refs:
  const client = store.client;
  const loading = store.loading;
  const error = store.error;
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
