export function hasRole(clientRoles: string | null | undefined, role: string): boolean {
  if (!clientRoles) return false;

  return clientRoles
    .split(",")
    .map(r => r.trim().toLowerCase())
    .includes(role.toLowerCase());
}
