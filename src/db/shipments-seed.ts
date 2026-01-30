import type { Shipment } from "@/graphql/shipments/types";
import { setShipment, hasShipments, nextShipmentId } from "./shipments";

const CITIES = [
  { street: "123 Main St", city: "New York", state: "NY", postalCode: "10001" },
  { street: "456 Oak Ave", city: "Los Angeles", state: "CA", postalCode: "90001" },
  { street: "789 Harbor Rd", city: "Miami", state: "FL", postalCode: "33101" },
  { street: "321 Commerce St", city: "Chicago", state: "IL", postalCode: "60601" },
  { street: "100 Port Ave", city: "Seattle", state: "WA", postalCode: "98101" },
  { street: "200 Trade St", city: "Boston", state: "MA", postalCode: "02101" },
  { street: "500 Innovation Dr", city: "Austin", state: "TX", postalCode: "78701" },
  { street: "600 Market St", city: "San Francisco", state: "CA", postalCode: "94102" },
  { street: "700 Industrial Blvd", city: "Denver", state: "CO", postalCode: "80201" },
  { street: "800 Logistics Way", city: "Phoenix", state: "AZ", postalCode: "85001" },
  { street: "900 Warehouse Rd", city: "Dallas", state: "TX", postalCode: "75201" },
  { street: "1100 Cargo Ln", city: "Atlanta", state: "GA", postalCode: "30301" },
  { street: "1200 Freight Ave", city: "Detroit", state: "MI", postalCode: "48201" },
  { street: "1300 Ship St", city: "Philadelphia", state: "PA", postalCode: "19101" },
  { street: "1400 Transit Blvd", city: "Houston", state: "TX", postalCode: "77001" },
] as const;

const SHIPPERS = [
  "Acme Corp", "Global Goods", "Pacific Imports", "Tech Supplies Inc",
  "North Star Logistics", "Summit Freight", "Valley Distribution", "Coast to Coast",
  "Metro Movers", "Prime Cargo", "Elite Shipping", "Swift Logistics",
  "United Freight", "Central Transport", "Eastern Express", "Western Carriers",
  "Delta Logistics", "Omega Shipping", "Alpha Freight", "Beta Transport",
  "Gamma Cargo", "Atlas Movers", "Pioneer Logistics", "Horizon Shipping",
  "Apex Freight", "Vertex Transport", "Nova Logistics", "Stellar Cargo",
  "Quantum Shipping", "Zenith Freight",
];

const CARRIERS = [
  "FastFreight", "ShipIt", "DHL Express", "FedEx", "UPS", "USPS",
  "XPO Logistics", "JB Hunt", "Werner", "Schneider", "Landstar",
  "Old Dominion", "Estes", "ABF", "R+L Carriers", "Saia",
  "Yellow Freight", "Xpress", "Knight-Swift", "Heartland",
  "Covenant", "Prime Inc", "Swift Transport", "Werner Enterprises",
  "CR England", "Roehl", "Marten", "USA Truck", "Celadon", "Forward Air",
];

const STATUSES = ["pending", "in_transit", "delivered"] as const;

function addr(c: (typeof CITIES)[number]) {
  return { ...c, country: "USA" };
}

export function seedDemoShipments(): void {
  if (hasShipments()) return;
  const now = new Date().toISOString();
  const demos: Omit<Shipment, "id" | "createdAt" | "updatedAt">[] = [];

  for (let i = 0; i < 30; i++) {
    const status = STATUSES[i % STATUSES.length];
    const pickup = CITIES[i % CITIES.length];
    const delivery = CITIES[(i + 5) % CITIES.length];
    const amount = 50 + (i % 20) * 12.5;
    const tax = Math.round(amount * 0.08 * 100) / 100;
    const total = amount + tax;
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + 3 + (i % 14));
    demos.push({
      shipperName: SHIPPERS[i],
      carrierName: CARRIERS[i],
      pickupLocation: addr(pickup),
      deliveryLocation: addr(delivery),
      trackingData: {
        status,
        events: status === "pending" ? [] : [
          { timestamp: now, status: status === "delivered" ? "delivered" : "picked_up", location: pickup.city, description: status === "delivered" ? "Delivered" : "Package picked up" },
        ],
        lastUpdated: now,
      },
      rates: { amount, currency: "USD", tax, total },
      status,
      estimatedDelivery: estDate.toISOString(),
    });
  }

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
