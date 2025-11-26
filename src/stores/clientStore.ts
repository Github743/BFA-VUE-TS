// src/stores/clientStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Client } from '@/types/client'
import { getClientById } from '@/services/clientService'

type CacheEntry = { client: Client; fetchedAt: number }

export const useClientStore = defineStore('client', () => {
  // state
  const clientId = ref<string | number | null>(null)
  const client = ref<Client | null>(null)
  const loading = ref(false)
  const error = ref<unknown | null>(null)

  // in-memory cache with optional TTL
  const cache: Record<string | number, CacheEntry> = {}
  const CACHE_TTL_MS = 1000 * 60 * 10 // 10 minutes - tune as needed

  // abort controller
  let controller: AbortController | null = null

  const hasClient = computed(() => !!client.value)
  const clientNumber = computed(() => client.value?.clientNumber ?? null)

  async function loadClient(id?: string | number | null, opts?: { force?: boolean }) {
    if (!id) {
      clientId.value = null
      client.value = null
      loading.value = false
      error.value = null
      return
    }

    // check cache
    const cached = cache[id]
    const now = Date.now()
    if (!opts?.force && cached && (now - cached.fetchedAt) < CACHE_TTL_MS) {
      clientId.value = id
      client.value = cached.client
      loading.value = false
      error.value = null
      return
    }

    // cancel previous in-flight
    if (controller) {
      controller.abort()
      controller = null
    }

    controller = new AbortController()
    const signal = controller.signal

    clientId.value = id
    loading.value = true
    client.value = null
    error.value = null

    try {
      const data = await getClientById(id, { signal })
      if (!data) {
        client.value = null
        error.value = new Error('No client returned')
      } else {
        client.value = data
        cache[id] = { client: data, fetchedAt: Date.now() }
      }
    } catch (err: any) {
      if ((err as any)?.name === 'AbortError') {
        // ignore aborts
      } else {
        error.value = err
        client.value = null
      }
    } finally {
      loading.value = false
    }
  }

  async function setClientId(id: string | number | null, { load = true, force = false } = {}) {
    clientId.value = id
    if (load) {
      await loadClient(id, { force })
    }
  }

  function clearClient() {
    if (controller) {
      controller.abort()
      controller = null
    }
    clientId.value = null
    client.value = null
    loading.value = false
    error.value = null
  }

  return {
    clientId,
    client,
    loading,
    error,
    hasClient,
    clientNumber,
    loadClient,
    setClientId,
    clearClient,
  }
})
