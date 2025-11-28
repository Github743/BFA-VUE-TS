import { get } from "@/services/http";
import type { Client } from "@/types/client";

export async function getClientById(
  id: string | number,
  opts?: { signal?: AbortSignal }
): Promise<Client | null> {
  if (!id) return null;

  // Use your existing GET function
  const raw = await get<Client[]>("/clients", { clientSearch: id });
  if (!raw) return null;

  // raw may be: [] OR [client] OR { data: [...] } depending on API
  const list = Array.isArray(raw)
    ? raw
    : Array.isArray((raw as any).data)
    ? (raw as any).data
    : [];

  return list.length > 0 ? list[0] : null;
}
