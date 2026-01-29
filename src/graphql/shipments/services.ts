import type { Shipment, ShipmentCreateInput, ShipmentUpdateInput } from "./types";
import type {
  ShipmentFilter,
  ShipmentSort,
  PaginationInput,
  SliceResult,
} from "./utils";
import { filterShipments, paginate, sortShipments } from "./utils";
import {
  getShipment,
  setShipment,
  getAllShipments,
  nextShipmentId,
} from "@/db/shipments";

export function addShipment(input: ShipmentCreateInput): Shipment {
  const now = new Date().toISOString();
  const tracking = input.trackingData ?? {
    status: "pending",
    events: [],
    lastUpdated: now,
  };
  const shipment: Shipment = {
    id: nextShipmentId(),
    shipperName: input.shipperName,
    carrierName: input.carrierName,
    pickupLocation: input.pickupLocation,
    deliveryLocation: input.deliveryLocation,
    trackingData: {
      status: tracking.status ?? "pending",
      events: tracking.events ?? [],
      lastUpdated: tracking.lastUpdated ?? now,
    },
    rates: input.rates,
    status: input.status,
    estimatedDelivery: input.estimatedDelivery,
    createdAt: now,
    updatedAt: now,
  };
  setShipment(shipment);
  return shipment;
}

export function updateShipment(
  id: string,
  input: ShipmentUpdateInput
): Shipment | null {
  const existing = getShipment(id);
  if (!existing) return null;
  const now = new Date().toISOString();
  const updated: Shipment = {
    ...existing,
    ...(input.shipperName != null && { shipperName: input.shipperName }),
    ...(input.carrierName != null && { carrierName: input.carrierName }),
    ...(input.pickupLocation != null && { pickupLocation: input.pickupLocation }),
    ...(input.deliveryLocation != null && { deliveryLocation: input.deliveryLocation }),
    ...(input.trackingData != null && {
      trackingData: { ...existing.trackingData, ...input.trackingData },
    }),
    ...(input.rates != null && { rates: { ...existing.rates, ...input.rates } }),
    ...(input.status != null && { status: input.status }),
    ...(input.estimatedDelivery !== undefined && {
      estimatedDelivery: input.estimatedDelivery ?? undefined,
    }),
    updatedAt: now,
  };
  setShipment(updated);
  return updated;
}

export function getShipmentById(id: string): Shipment | null {
  return getShipment(id);
}

export function listShipments(
  filter?: ShipmentFilter | null,
  sort?: ShipmentSort | null
): Shipment[] {
  const all = getAllShipments();
  const filtered = filterShipments(all, filter);
  return sortShipments(filtered, sort);
}

export function listShipmentsPaginated(
  filter: ShipmentFilter | null | undefined,
  sort: ShipmentSort | null | undefined,
  pagination: PaginationInput | null | undefined
): SliceResult<Shipment> {
  const sorted = listShipments(filter ?? undefined, sort ?? undefined);
  return paginate(sorted, pagination);
}
