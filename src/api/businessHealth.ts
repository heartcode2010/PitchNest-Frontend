import type { AuthFetch } from "./businesses";

export interface BusinessHealthSnapshot {
  id: string;
  periodStart: string;
  currency: string;
  revenue: number;
  directCosts: number;
  operatingExpenses: number;
  cashBalance: number;
  marketingSpend: number;
  newCustomers: number;
  activeCustomers: number;
  lostCustomers: number;
  notes: string;
  updatedAt: string;
}

export interface BusinessHealthDiagnosis {
  status: "insufficient_data" | "critical" | "attention" | "stable";
  metrics: null | {
    currency: string;
    grossProfit: number;
    grossMargin: number | null;
    operatingProfit: number;
    operatingMargin: number | null;
    monthlyNetBurn: number;
    runwayMonths: number | null;
    customerAcquisitionCost: number | null;
    churnRate: number | null;
  };
  issues: Array<{ severity: "critical" | "warning" | "info"; title: string; detail: string }>;
  nextActions: string[];
  history: Array<{ periodStart: string; revenue: number; expenses: number; cash: number }>;
}

export interface BusinessHealthResult {
  snapshots: BusinessHealthSnapshot[];
  diagnosis: BusinessHealthDiagnosis;
}

export type BusinessHealthInput = Omit<BusinessHealthSnapshot, "id" | "updatedAt">;

export async function getBusinessHealth(
  authFetch: AuthFetch,
  businessId: string,
): Promise<BusinessHealthResult> {
  const response = await authFetch(`/api/businesses/${encodeURIComponent(businessId)}/health`);
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error || `Unable to load business health (${response.status}).`);
  return body.data as BusinessHealthResult;
}

export async function saveBusinessHealth(
  authFetch: AuthFetch,
  businessId: string,
  input: Omit<BusinessHealthInput, "id" | "updatedAt">,
): Promise<BusinessHealthResult> {
  const response = await authFetch(`/api/businesses/${encodeURIComponent(businessId)}/health`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error || `Unable to save business figures (${response.status}).`);
  return { snapshots: body.data.snapshots, diagnosis: body.data.diagnosis };
}
