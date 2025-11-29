<template>
  <Breadcrumbs />

  <ClientSearchAutocomplete
    v-show="!selectedClient"
    :clients="clients"
    :loading="loadingClients"
    :show-start="false"
    @select="onSelect"
    @search="onSearch"
  />

  <div class="d-flex justify-content-center mt-3">
    <button
      class="btn btn-primary rounded-pill px-4"
      :disabled="!selectedClient || creatingWorkOrder"
      @click="startFromSelected"
      style="min-width: 120px"
    >
      Start
    </button>
  </div>
  <LoadingOverlay :visible="creatingWorkOrder" />
</template>

<script setup lang="ts">
  import { ref, onUnmounted } from "vue";
  import { useRouter } from "vue-router";

  // Components
  import ClientSearchAutocomplete from "@/components/common/ClientSearchAutocomplete.vue";
  import LoadingOverlay from "@/components/common/LoadingOverlay.vue";

  import { fetchCustomers } from "./customerApi";
  import { showToast } from "@/shared/utils/toast";

  import type { Client } from "@/types/client";
  import Breadcrumbs from "@/components/common/Breadcrumbs.vue";
  import { useClientStore } from "@/stores/clientStore";
  import { CLIENT_ROLES } from "@/constants/bfaConstants";
  import { hasRole } from "@/helpers/bfaHelper";
  import { post } from "@/services/http";
  import { ApiResponse } from "@/models/ApiResponse";
  import { Workorder } from "@/models/WorkOrder";
  import { useWorkflowStore } from "@/stores/workflowStore";
  import {
    createWorkOrder,
    type CreateWorkOrderPayload,
  } from "@/services/workOrderService";

  defineOptions({ name: "CustomerLayout" });
  const props = defineProps<{ nextLayout?: string }>();

  const router = useRouter();

  const selectedClient = ref<Client | null>(null);
  const clients = ref<Client[]>([]);
  const loadingClients = ref<boolean>(false);
  const creatingWorkOrder = ref<boolean>(false);
  const error = ref<unknown>(null);

  let searchTimer: ReturnType<typeof setTimeout> | null = null;
  const DEBOUNCE_MS = 350;

  /* -------------------------
   Methods
   ------------------------- */

  /** Load clients from API (typed) */
  async function loadClients(search = ""): Promise<void> {
    loadingClients.value = true;
    error.value = null;

    try {
      const res = await fetchCustomers(search);
      clients.value = Array.isArray(res)
        ? res
        : Array.isArray((res as any)?.items)
        ? (res as any).items
        : Array.isArray((res as any)?.data)
        ? (res as any).data
        : [];
    } catch (err) {
      error.value = err;
      clients.value = [];
      console.error("loadClients error:", err);
    } finally {
      loadingClients.value = false;
    }
  }

  /** Called by the autocomplete when user types */
  function onSearch(query: string): void {
    if (searchTimer) {
      clearTimeout(searchTimer);
      searchTimer = null;
    }
    searchTimer = setTimeout(() => {
      loadClients(query);
    }, DEBOUNCE_MS);
  }

  function onSelect(client: Client): void {
    selectedClient.value = client;
  }

  /** Start button pressed; continue workflow using selectedClient */
  async function startFromSelected(): Promise<void> {
    if (!selectedClient.value) return;
    await handleClientSelected(selectedClient.value);
  }

  async function handleClientSelected(client: Client): Promise<void> {
    creatingWorkOrder.value = true;
    try {
      const id = client.clientNumber;
      const store = useClientStore();
      await store.setClientId(id, { load: true, force: false });
      const clientRoles = client.clientRoles ?? "";

      const hasBfaRole = hasRole(clientRoles, CLIENT_ROLES.CLIENT_ROLE_BFA);
      if (hasBfaRole) {
        showToast(
          "This client is already enrolled in BFA program. Please proceed with Amend.",
          "warning",
          "Warning",
          true,
          5000
        );
        return;
      }

      const payload: CreateWorkOrderPayload = {
        clientId: client.clientId,
        clientNumber: client.clientNumber,
        entities: [{ clientId: client.clientId ?? client.id }],
      };

      const createWO = await createWorkOrder(payload);

      if (createWO.success) {
        const useWorkOrderstore = useWorkflowStore();
        useWorkOrderstore.setWorkOrderId(createWO.data?.workOrderId ?? 0);
        useWorkOrderstore.setCurrentStep(0);
        showToast("Work order created successfully.", "success");
        router.push({
          name: "IssueWorkflow",
        });
      } else {
        showToast(
          createWO.errorMessage || "Something went wrong! Please try again.",
          "danger"
        );
      }
    } catch (err: any) {
      const serverMsg = err?.response?.data?.message || err?.message;
      showToast(
        serverMsg || "Something went wrong! Please try again.",
        "danger"
      );
      console.error("handleClientSelected error:", err);
    } finally {
      creatingWorkOrder.value = false;
    }
  }

  /* cleanup timers */
  onUnmounted?.(() => {
    if (searchTimer) {
      clearTimeout(searchTimer);
      searchTimer = null;
    }
  });
</script>

<style scoped>
  .container {
    max-width: 1200px;
  }

  .card {
    border-radius: 10px;
  }

  @media (min-width: 768px) {
    .container {
      margin-left: 0;
    }
  }
</style>
