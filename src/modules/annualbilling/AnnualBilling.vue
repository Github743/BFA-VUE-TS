<template>
  <div class="page-container">
    <h1 class="page-title" style="margin-top: 30px">Annual Billing</h1>

    <div class="tabs-container">
      <button class="tab-btn active">Annual Billing</button>
      <button class="tab-btn">Search</button>
    </div>

    <div class="filters-section">
      <select class="filter-select">
        <option>Select Year</option>
        <option>2024</option>
        <option>2023</option>
        <option>2022</option>
      </select>
      <button class="search-btn">Search</button>
    </div>
    <div class="table">
      <CustomerLayout></CustomerLayout>
    </div>
    <div class="table-container">
      <BaseTable
        :columns="columns"
        :rows="rows"
        :enableBulkDelete="false"
        @edit="onEdit"
        @delete="onDelete"
        @bulk-delete="onBulkDelete"
      >
        <!-- vessel column slot -> renders a router-link -->
        <!-- <template #cell-vessel="{ row }">
          <RouterLink
            :to="{ name: 'WorkOrderSearch', query: { imo: row.imo } }"
            class="vessel-link"
          >
            {{ row.vessel }}
          </RouterLink>
        </template> -->

        <!-- actions slot -> custom edit/delete buttons -->
        <template #cell-actions="{ row }">
          <div class="d-flex justify-content-center">
            <button
              class="btn btn-sm btn-outline-primary icon-btn me-2"
              @click="onEdit(row)"
            >
              <i class="bi bi-pencil"></i>
            </button>
            <button
              class="btn btn-sm btn-outline-danger icon-btn"
              @click="onDelete(row)"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </template>
      </BaseTable>

      <div class="btn-container">
        <button class="approve-btn">
          <i class="fas fa-check"></i>

          Approve
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";

import BaseTable from "@/components/common/BaseTableExport";
import type { Column } from "@/components/common/BaseTableExport";
import { confirmDelete } from "@/shared/utils/deleteHelper";
import type { DeletePayload } from "@/types/DeletePayload";
import type { Client } from "@/types/client";
import CustomerLayout from "@/modules/customer/CustomerLayout.vue";

type WorkOrder = {
  id: number;
  imo: string;
  vessel: string;
  product: string;
  productType: string;
  client: string;
  email: string;
  issueType: string;
  certificateIssue: string; // ISO date
  certificateExpiry: string; // ISO date
};

const loading = ref(false);
const clients = ref<Client[]>([]);

function handleSearch(query: string) {
  console.log("Searching for:", query);
  loading.value = true;

  // Example API call (replace with your API)
  setTimeout(() => {
    clients.value = [
      { clientId: 1, clientNumber: "C001", clientName: "John Shipping" },
      { clientId: 2, clientNumber: "C002", clientName: "Ocean Traders" },
    ];
    loading.value = false;
  }, 300);
}

function handleSelect(client: Client) {
  console.log("Selected client", client);
}

function handleStart(client: Client) {
  console.log("Start button clicked with:", client);
}

// --- columns with strict keyof typing ---
const columns: Column<WorkOrder>[] = [
  { field: "id", label: "Q #" },
  { field: "imo", label: "IMO NUMBER" },
  { field: "vessel", label: "VESSEL" },
  { field: "product", label: "PRODUCT" },
  { field: "productType", label: "PRODUCT TYPE" },
  { field: "client", label: "BILL TO CLIENT" },
  { field: "email", label: "BILLING EMAIL" },
  { field: "issueType", label: "ISSUE TYPE" },
  { field: "certificateIssue", label: "CERTIFICATE ISSUE", type: "date" },
  { field: "certificateExpiry", label: "CERTIFICATE EXPIRY", type: "date" },
];

// --- sample data (replace with API) ---
const rows = ref<WorkOrder[]>([
  {
    id: 92475,
    imo: "9488860",
    vessel: "ALHEIRO OLDENDORFF",
    product: "NLC Adult",
    productType: "21-225",
    client: "Oldendorff Carriers GmbH & Co. KG",
    email: "xy@axy.com",
    issueType: "Initial",
    certificateIssue: "2024-12-18",
    certificateExpiry: "2025-12-23",
  },
  {
    id: 92626,
    imo: "9098910",
    vessel: "ALHEIRO OLDENDORFF",
    product: "NLC Additional Inspection",
    productType: "21-664",
    client: "Oldendorff Carriers GmbH & Co. KG",
    email: "abc@xyz.com",
    issueType: "Renewal",
    certificateIssue: "2024-12-18",
    certificateExpiry: "2025-12-19",
  },
]);

const router = useRouter();

function onEdit(payload: any) {
  const workOrderId =
    typeof payload === "object" && payload?.row ? payload.row.id : payload;
  router.push({ name: "BfaStepper", params: { step: "edit", workOrderId } });
}

async function onDelete(payload: any) {
  const plainRow = toRaw(payload) as WorkOrder;
  const confirmed = await confirmDelete(payload, {
    title: "Delete Work Order",
    getMessage: (payload) => `Delete <strong>${plainRow.vessel}</strong>?`,
  });
}

function onBulkDelete(ids: string[]) {
  // call API to delete multiple ids
  console.log("bulk delete", ids);
}
</script>
<style scoped>
body {
  background-color: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
}

.page-container {
  padding: 20px;
  max-width: 1600px;
  margin: 0 auto;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #212529;
  margin-bottom: 25px;
}

.tabs-container {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.tab-btn {
  padding: 10px 24px;
  border: none;
  background: white;
  color: #6c757d;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: #0d6efd;
  color: white;
}

.tab-btn:hover:not(.active) {
  background: #e9ecef;
}

.filters-section {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  align-items: center;
}

.filter-select {
  padding: 10px 16px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 14px;
  color: #495057;
  background: white;
  min-width: 200px;
  cursor: pointer;
}

.search-btn {
  padding: 10px 30px;
  background: white;
  border: 1px solid #ced4da;
  border-radius: 6px;
  color: #495057;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background: #e9ecef;
}

.vessel-link {
  color: #0d6efd;
  text-decoration: none;
  font-weight: 500;
}

.vessel-link:hover {
  text-decoration: underline;
}

.action-btn {
  background: none;
  border: none;
  color: #0d6efd;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.action-btn:hover {
  color: #0a58ca;
}

.approve-btn {
  padding: 8px 24px;
  background: white;
  border: 1px solid #ced4da;
  border-radius: 20px;
  color: #495057;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  margin-top: 20px;
}

.approve-btn:hover {
  background: #0d6efd;
  color: white;
  border-color: #0d6efd;
}

.approve-btn i {
  font-size: 12px;
}

.btn-container {
  text-align: center;
  padding: 20px;
}
</style>