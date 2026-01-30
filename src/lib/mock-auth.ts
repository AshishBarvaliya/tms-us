export const MOCK_ROLE_STORAGE_KEY = "tms-mock-role";

export type MockRole = "admin" | "employee";

export function getStoredMockRole(): MockRole {
  if (typeof window === "undefined") return "employee";
  const stored = localStorage.getItem(MOCK_ROLE_STORAGE_KEY);
  if (stored === "admin" || stored === "employee") return stored;
  return "employee";
}

export function setStoredMockRole(role: MockRole): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(MOCK_ROLE_STORAGE_KEY, role);
}
