<template>
  <div class="d-flex flex-column align-items-center justify-content-center">
    <div
      ref="root"
      class="client-search position-relative w-100"
      style="max-width: 500px"
    >
      <!-- Search Bar -->
      <div class="input-group">
        <input
          ref="inputEl"
          type="text"
          v-model="searchQuery"
          class="form-control"
          placeholder="Enter Minimum 3 Characters To Search."
          @input="onInput"
          @keydown="onKeyDown"
          @focus="onFocus"
          :aria-expanded="showDropdown && searchQuery.length >= 3"
          aria-controls="client-list"
          aria-autocomplete="list"
          role="combobox"
        />

        <button class="btn btn-success" type="button" @click="triggerSearch">
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <i v-else class="bi bi-search" aria-hidden="true"></i>
          <span class="visually-hidden">Search</span>
        </button>
      </div>

      <!-- Dropdown -->
      <ul
        id="client-list"
        v-if="showDropdown && searchQuery.length >= 3"
        class="list-group position-absolute w-100 mt-1 dropdown-list"
        role="listbox"
        :aria-activedescendant="activeDescId"
      >
        <template v-if="clients && clients.length > 0">
          <li
            v-for="(client, idx) in clients"
            :key="client.clientId"
            :id="`client-${idx}`"
            class="list-group-item list-group-item-action"
            :class="{ 'active-item': idx === highlightedIndex }"
            @click="selectClient(client)"
            @mousemove="onMouseMove(idx)"
            role="option"
            :aria-selected="idx === highlightedIndex ? 'true' : 'false'"
          >
            <strong>{{ client.clientNumber }}</strong> - {{ client.clientName }}
          </li>
        </template>

        <template v-else>
          <li class="list-group-item text-muted text-center" role="option">
            No results found
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
  import type { PropType } from "vue";
  import type { Client } from "@/types/client";

  const props = defineProps({
    clients: {
      type: Array as PropType<Client[]>,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits<{
    (e: "start", client: Client): void;
    (e: "search", query: string): void;
    (e: "select", client: Client): void;
  }>();

  // reactive state
  const searchQuery = ref<string>("");
  const selectedClient = ref<Client | null>(null);
  const showDropdown = ref<boolean>(false);
  const timer = ref<number | null>(null);
  const root = ref<HTMLElement | null>(null);
  const inputEl = ref<HTMLInputElement | null>(null);

  // keyboard navigation
  const highlightedIndex = ref<number>(-1);

  /** computed helper for aria (use undefined for optional attributes) */
  const activeDescId = ref<string | undefined>(undefined);

  watch(
    () => props.clients,
    (newClients) => {
      // reset highlighted index when list changes
      highlightedIndex.value = newClients && newClients.length > 0 ? 0 : -1;
      activeDescId.value =
        highlightedIndex.value >= 0
          ? `client-${highlightedIndex.value}`
          : undefined;
    }
  );

  function onInput(): void {
    selectedClient.value = null;
    showDropdown.value = true;

    if (timer.value) {
      clearTimeout(timer.value);
      timer.value = null;
    }

    timer.value = window.setTimeout(() => {
      timer.value = null;
      if (searchQuery.value && searchQuery.value.length >= 3) {
        emit("search", searchQuery.value);
      }
    }, 300);
  }

  function triggerSearch(): void {
    if (searchQuery.value && searchQuery.value.length >= 3) {
      emit("search", searchQuery.value);
      showDropdown.value = true;
    }
  }

  function selectClient(client: Client): void {
    searchQuery.value = `${client.clientNumber} - ${client.clientName}`;
    selectedClient.value = client;
    showDropdown.value = false;
    highlightedIndex.value = -1;
    activeDescId.value = undefined;
    emit("select", client);
  }

  function startSearch(): void {
    if (selectedClient.value) {
      emit("start", selectedClient.value);
    }
  }

  function onClickOutside(e: MouseEvent): void {
    const target = e.target as Node | null;
    if (!root.value) return;
    if (!target) {
      showDropdown.value = false;
      return;
    }
    if (!root.value.contains(target)) {
      showDropdown.value = false;
    }
  }

  function onFocus() {
    // show dropdown on focus if query is >= 3 chars
    if (searchQuery.value && searchQuery.value.length >= 3) {
      showDropdown.value = true;
    }
  }

  function onMouseMove(idx: number) {
    highlightedIndex.value = idx;
    activeDescId.value = `client-${idx}`;
  }

  /** keyboard handler for arrow/enter/escape */
  function onKeyDown(e: KeyboardEvent) {
    if (!showDropdown.value || !props.clients?.length) {
      // If dropdown hidden and user presses ArrowDown, attempt to trigger search & open list
      if (
        (e.key === "ArrowDown" || e.key === "ArrowUp") &&
        searchQuery.value.length >= 3
      ) {
        e.preventDefault();
        emit("search", searchQuery.value);
        showDropdown.value = true;
        return;
      }
      return;
    }

    const max = props.clients.length - 1;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (highlightedIndex.value < max) highlightedIndex.value++;
      else highlightedIndex.value = 0;
      activeDescId.value = `client-${highlightedIndex.value}`;
      scrollIntoView(`#client-${highlightedIndex.value}`);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (highlightedIndex.value > 0) highlightedIndex.value--;
      else highlightedIndex.value = max;
      activeDescId.value = `client-${highlightedIndex.value}`;
      scrollIntoView(`#client-${highlightedIndex.value}`);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const idx = highlightedIndex.value;
      if (idx >= 0 && idx <= max) {
        const c = props.clients[idx];
        if (c) selectClient(c);
      } else if (selectedClient.value) {
        startSearch();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      showDropdown.value = false;
      highlightedIndex.value = -1;
      activeDescId.value = undefined;
    }
  }

  /** small helper to keep highlighted item visible */
  function scrollIntoView(selector: string) {
    nextTick(() => {
      try {
        const el = root.value?.querySelector(selector) as HTMLElement | null;
        if (el && "scrollIntoView" in el) {
          el.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
      } catch {
        /* ignore */
      }
    });
  }

  // lifecycle
  onMounted(() => {
    document.addEventListener("click", onClickOutside);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("click", onClickOutside);
    if (timer.value) {
      clearTimeout(timer.value);
      timer.value = null;
    }
  });
</script>

<style scoped>
  .dropdown-list {
    max-height: 250px;
    overflow-y: auto;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    background: #fff;
    z-index: 3000;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  }

  .dropdown-list .list-group-item {
    cursor: pointer;
    background: transparent;
    color: #212529;
    padding: 0.65rem 0.75rem;
    transition: background-color 0.12s ease, color 0.12s ease;
  }

  /* Hover state - visible darker background */
  .dropdown-list .list-group-item:hover,
  .dropdown-list .list-group-item:focus {
    background-color: #f3f6fb;
    color: #000;
  }

  .dropdown-list .list-group-item.active-item,
  .dropdown-list .list-group-item.active-item:hover,
  .dropdown-list .list-group-item[aria-selected="true"] {
    background-color: #0d6efd !important;
    color: #fff !important;
    border-color: transparent !important;
  }

  .dropdown-list .list-group-item + .list-group-item {
    border-top: 1px solid #f1f1f1;
  }

  /* Accessibility: visibly highlight keyboard focus */
  .dropdown-list .list-group-item:focus {
    outline: 2px solid rgba(13, 110, 253, 0.18);
    outline-offset: 1px;
  }
</style>
