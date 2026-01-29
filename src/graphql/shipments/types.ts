export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface TrackingEvent {
  timestamp: string;
  status: string;
  location?: string;
  description?: string;
}

export interface TrackingData {
  status: string;
  events: TrackingEvent[];
  lastUpdated: string;
}

export interface Rates {
  amount: number;
  currency: string;
  tax?: number;
  total?: number;
}

export interface Shipment {
  id: string;
  shipperName: string;
  carrierName: string;
  pickupLocation: Address;
  deliveryLocation: Address;
  trackingData: TrackingData;
  rates: Rates;
  status: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export type ShipmentCreateInput = Omit<
  Shipment,
  "id" | "createdAt" | "updatedAt" | "trackingData"
> & {
  trackingData?: Partial<TrackingData>;
};

export type ShipmentUpdateInput = Partial<
  Omit<Shipment, "id" | "createdAt" | "updatedAt" | "trackingData" | "rates">
> & {
  trackingData?: Partial<TrackingData>;
  rates?: Partial<Rates>;
};
