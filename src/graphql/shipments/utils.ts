import type { Shipment } from "./types";

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export interface PaginationInput {
  page?: number | null;
  limit?: number | null;
}

export interface PageInfo {
  page: number;
  limit: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface Edge<T> {
  node: T;
  cursor: string;
}

export interface SliceResult<T> {
  items: T[];
  edges: Edge<T>[];
  pageInfo: PageInfo;
  totalCount: number;
}

export function paginate<T>(
  items: T[],
  pagination: PaginationInput | null | undefined
): SliceResult<T> {
  const totalCount = items.length;
  const limit = Math.min(
    Math.max(1, pagination?.limit ?? DEFAULT_PAGE_SIZE),
    MAX_PAGE_SIZE
  );
  const page = Math.max(1, pagination?.page ?? 1);
  const start = (page - 1) * limit;
  const slice = items.slice(start, start + limit);

  const edges = slice.map((node, i) => ({
    node,
    cursor: String(start + i),
  }));

  return {
    items: slice,
    edges,
    pageInfo: {
      page,
      limit,
      totalCount,
      hasNextPage: start + limit < totalCount,
      hasPreviousPage: page > 1,
      startCursor: edges[0]?.cursor ?? null,
      endCursor: edges[edges.length - 1]?.cursor ?? null,
    },
    totalCount,
  };
}

export type ShipmentSortField =
  | "createdAt"
  | "updatedAt"
  | "status"
  | "shipperName"
  | "carrierName"
  | "estimatedDelivery";

export type SortDirection = "ASC" | "DESC";

export interface ShipmentSort {
  field: ShipmentSortField;
  direction?: SortDirection | null;
}

const DEFAULT_SORT: ShipmentSort = { field: "createdAt", direction: "DESC" };

function compare<T>(a: T, b: T, dir: SortDirection): number {
  const mult = dir === "ASC" ? 1 : -1;
  if (a === b) return 0;
  if (a == null) return mult;
  if (b == null) return -mult;
  if (typeof a === "string" && typeof b === "string") return mult * a.localeCompare(b);
  if (typeof a === "number" && typeof b === "number") return mult * (a - b);
  return mult * String(a).localeCompare(String(b));
}

function getSortKey(s: Shipment, field: ShipmentSortField): string | number | undefined {
  switch (field) {
    case "createdAt": return s.createdAt;
    case "updatedAt": return s.updatedAt;
    case "status": return s.status;
    case "shipperName": return s.shipperName;
    case "carrierName": return s.carrierName;
    case "estimatedDelivery": return s.estimatedDelivery ?? "";
    default: return s.createdAt;
  }
}

export function sortShipments(
  shipments: Shipment[],
  sort: ShipmentSort | null | undefined
): Shipment[] {
  const { field, direction } = sort ?? DEFAULT_SORT;
  const dir = (direction ?? "ASC") as SortDirection;
  return [...shipments].sort((a, b) =>
    compare(getSortKey(a, field), getSortKey(b, field), dir)
  );
}

export interface ShipmentFilter {
  shipperName?: string | null;
  carrierName?: string | null;
  status?: string | null;
  createdAfter?: string | null;
  createdBefore?: string | null;
}

function matches(shipment: Shipment, filter: ShipmentFilter): boolean {
  if (filter.shipperName != null && filter.shipperName !== "") {
    if (!shipment.shipperName.toLowerCase().includes(filter.shipperName.toLowerCase())) return false;
  }
  if (filter.carrierName != null && filter.carrierName !== "") {
    if (!shipment.carrierName.toLowerCase().includes(filter.carrierName.toLowerCase())) return false;
  }
  if (filter.status != null && filter.status !== "") {
    if (shipment.status.toLowerCase() !== filter.status.toLowerCase()) return false;
  }
  if (filter.createdAfter != null && filter.createdAfter !== "") {
    if (shipment.createdAt < filter.createdAfter) return false;
  }
  if (filter.createdBefore != null && filter.createdBefore !== "") {
    if (shipment.createdAt > filter.createdBefore) return false;
  }
  return true;
}

export function filterShipments(
  shipments: Shipment[],
  filter: ShipmentFilter | null | undefined
): Shipment[] {
  if (!filter) return shipments;
  return shipments.filter((s) => matches(s, filter));
}
