import { get } from "@/services/http";
import { Client } from "@/types/client"; 

/**
 * Fetch customers by search query.
 * The return type is Promise<Customer[]>.
 */
export async function fetchCustomers(search = ""): Promise<Client[]> {
  try {
    const raw = await get("/clients", { clientSearch: search });

  
    const payload = raw && (raw as any).data ? (raw as any).data : raw;

    if (Array.isArray(payload)) return payload as Client[];
    if (Array.isArray((payload as any).items)) return (payload as any).items as Client[];
    if (Array.isArray((payload as any).data)) return (payload as any).data as Client[];

    // if the endpoint returns an object with clients under another key:
    if (Array.isArray((payload as any).clients)) return (payload as any).clients as Client[];

    // nothing matched -> return empty array
    console.warn("fetchCustomers: unexpected payload shape", payload);
    return [];
  } catch (err) {
    console.error("fetchCustomers error:", err);
    throw err;
  }
}
