import type { Shipment } from "@/graphql/shipments/types";

const store = new Map<string, Shipment>();

export function getShipment(id: string): Shipment | null {
  return store.get(id) ?? null;
}

export function setShipment(shipment: Shipment): void {
  store.set(shipment.id, shipment);
}

export function getAllShipments(): Shipment[] {
  return Array.from(store.values());
}

export function hasShipments(): boolean {
  return store.size > 0;
}

export function nextShipmentId(): string {
  return `ship-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
