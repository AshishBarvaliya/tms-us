import type { Shipment } from "@/graphql/shipments/types";
import { setShipment, hasShipments, nextShipmentId } from "./shipments";

export function seedDemoShipments(): void {
  if (hasShipments()) return;
  const now = new Date().toISOString();
  const demos: Omit<Shipment, "id" | "createdAt" | "updatedAt">[] = [
    {
      shipperName: "Acme Corp",
      carrierName: "FastFreight",
      pickupLocation: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "USA",
      },
      deliveryLocation: {
        street: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        postalCode: "90001",
        country: "USA",
      },
      trackingData: {
        status: "in_transit",
        events: [
          {
            timestamp: now,
            status: "picked_up",
            location: "New York",
            description: "Package picked up",
          },
        ],
        lastUpdated: now,
      },
      rates: { amount: 125.5, currency: "USD", tax: 10, total: 135.5 },
      status: "in_transit",
      estimatedDelivery: "2025-02-05T18:00:00Z",
    },
    {
      shipperName: "Global Goods",
      carrierName: "ShipIt",
      pickupLocation: {
        street: "789 Harbor Rd",
        city: "Miami",
        state: "FL",
        postalCode: "33101",
        country: "USA",
      },
      deliveryLocation: {
        street: "321 Commerce St",
        city: "Chicago",
        state: "IL",
        postalCode: "60601",
        country: "USA",
      },
      trackingData: {
        status: "delivered",
        events: [
          {
            timestamp: now,
            status: "delivered",
            location: "Chicago",
            description: "Delivered",
          },
        ],
        lastUpdated: now,
      },
      rates: { amount: 89.0, currency: "USD", tax: 7.12, total: 96.12 },
      status: "delivered",
      estimatedDelivery: "2025-01-28T12:00:00Z",
    },
  ];
  demos.forEach((d) => {
    const s: Shipment = {
      ...d,
      id: nextShipmentId(),
      createdAt: now,
      updatedAt: now,
    };
    setShipment(s);
  });
}
