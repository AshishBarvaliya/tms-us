"use client";

import { useState, useEffect } from "react";
import type { Shipment, ShipmentUpdateInput } from "@/graphql/shipments/types";
import { UpdateShipmentAction } from "@/graphql/shipments/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

const emptyAddress = {
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

function toFormInput(shipment: Shipment): ShipmentUpdateInput {
  return {
    shipperName: shipment.shipperName ?? "",
    carrierName: shipment.carrierName ?? "",
    status: shipment.status ?? "pending",
    estimatedDelivery: shipment.estimatedDelivery ?? undefined,
    pickupLocation: shipment.pickupLocation
      ? { ...shipment.pickupLocation }
      : { ...emptyAddress },
    deliveryLocation: shipment.deliveryLocation
      ? { ...shipment.deliveryLocation }
      : { ...emptyAddress },
    rates: shipment.rates
      ? {
          amount: shipment.rates.amount,
          currency: shipment.rates.currency ?? "USD",
          tax: shipment.rates.tax,
          total: shipment.rates.total,
        }
      : { amount: 0, currency: "USD" },
  };
}

type Props = {
  shipment: Shipment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export function EditShipmentDialog({ shipment, open, onOpenChange, onSuccess }: Props) {
  const [form, setForm] = useState<ShipmentUpdateInput>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (open && shipment) {
      setForm(toFormInput(shipment));
      setSubmitError(null);
    }
  }, [open, shipment]);

  const update = (updates: Partial<ShipmentUpdateInput>) => {
    setForm((prev) => ({ ...prev, ...updates }));
    setSubmitError(null);
  };

  const updatePickup = (updates: Partial<typeof emptyAddress>) => {
    setForm((prev) => ({
      ...prev,
      pickupLocation: { ...(prev.pickupLocation ?? emptyAddress), ...updates },
    }));
    setSubmitError(null);
  };

  const updateDelivery = (updates: Partial<typeof emptyAddress>) => {
    setForm((prev) => ({
      ...prev,
      deliveryLocation: { ...(prev.deliveryLocation ?? emptyAddress), ...updates },
    }));
    setSubmitError(null);
  };

  const updateRates = (updates: Partial<NonNullable<ShipmentUpdateInput["rates"]>>) => {
    setForm((prev) => ({
      ...prev,
      rates: { ...(prev.rates ?? { amount: 0, currency: "USD" }), ...updates },
    }));
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipment) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const input: ShipmentUpdateInput = {
        shipperName: form.shipperName?.trim(),
        carrierName: form.carrierName?.trim(),
        status: form.status?.trim() || undefined,
        estimatedDelivery: form.estimatedDelivery?.trim() || undefined,
        pickupLocation: form.pickupLocation
          ? {
              street: form.pickupLocation.street?.trim() ?? "",
              city: form.pickupLocation.city?.trim() ?? "",
              state: form.pickupLocation.state?.trim() ?? "",
              postalCode: form.pickupLocation.postalCode?.trim() ?? "",
              country: form.pickupLocation.country?.trim() ?? "",
            }
          : undefined,
        deliveryLocation: form.deliveryLocation
          ? {
              street: form.deliveryLocation.street?.trim() ?? "",
              city: form.deliveryLocation.city?.trim() ?? "",
              state: form.deliveryLocation.state?.trim() ?? "",
              postalCode: form.deliveryLocation.postalCode?.trim() ?? "",
              country: form.deliveryLocation.country?.trim() ?? "",
            }
          : undefined,
        rates: form.rates
          ? {
              amount: Number(form.rates.amount) ?? 0,
              currency: form.rates.currency?.trim() ?? "USD",
              tax: form.rates.tax != null ? Number(form.rates.tax) : undefined,
              total: form.rates.total != null ? Number(form.rates.total) : undefined,
            }
          : undefined,
      };
      await UpdateShipmentAction(shipment.id, input);
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to update shipment");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  const pickup = form.pickupLocation ?? emptyAddress;
  const delivery = form.deliveryLocation ?? emptyAddress;
  const rates = form.rates ?? { amount: 0, currency: "USD" };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] max-w-2xl overflow-y-auto p-0"
        title="Edit shipment"
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader className="border-b px-6 py-4">
            <DialogTitle className="text-xl">
              Edit Shipment {shipment?.id ?? ""}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 px-6 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Shipper name</label>
                <input
                  className={inputClass}
                  value={form.shipperName ?? ""}
                  onChange={(e) => update({ shipperName: e.target.value })}
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Carrier name</label>
                <input
                  className={inputClass}
                  value={form.carrierName ?? ""}
                  onChange={(e) => update({ carrierName: e.target.value })}
                  placeholder="FedEx"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Status</label>
                <select
                  className={inputClass}
                  value={form.status ?? "pending"}
                  onChange={(e) => update({ status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="in_transit">In transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Est. delivery (optional)</label>
                <input
                  className={inputClass}
                  type="date"
                  value={form.estimatedDelivery ?? ""}
                  onChange={(e) => update({ estimatedDelivery: e.target.value || undefined })}
                />
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold">Pickup location</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <input
                    className={inputClass}
                    placeholder="Street"
                    value={pickup.street}
                    onChange={(e) => updatePickup({ street: e.target.value })}
                  />
                </div>
                <input
                  className={inputClass}
                  placeholder="City"
                  value={pickup.city}
                  onChange={(e) => updatePickup({ city: e.target.value })}
                />
                <input
                  className={inputClass}
                  placeholder="State"
                  value={pickup.state}
                  onChange={(e) => updatePickup({ state: e.target.value })}
                />
                <input
                  className={inputClass}
                  placeholder="Postal code"
                  value={pickup.postalCode}
                  onChange={(e) => updatePickup({ postalCode: e.target.value })}
                />
                <input
                  className={inputClass}
                  placeholder="Country"
                  value={pickup.country}
                  onChange={(e) => updatePickup({ country: e.target.value })}
                />
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold">Delivery location</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <input
                    className={inputClass}
                    placeholder="Street"
                    value={delivery.street}
                    onChange={(e) => updateDelivery({ street: e.target.value })}
                  />
                </div>
                <input
                  className={inputClass}
                  placeholder="City"
                  value={delivery.city}
                  onChange={(e) => updateDelivery({ city: e.target.value })}
                />
                <input
                  className={inputClass}
                  placeholder="State"
                  value={delivery.state}
                  onChange={(e) => updateDelivery({ state: e.target.value })}
                />
                <input
                  className={inputClass}
                  placeholder="Postal code"
                  value={delivery.postalCode}
                  onChange={(e) => updateDelivery({ postalCode: e.target.value })}
                />
                <input
                  className={inputClass}
                  placeholder="Country"
                  value={delivery.country}
                  onChange={(e) => updateDelivery({ country: e.target.value })}
                />
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold">Rates</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Amount</label>
                  <input
                    className={inputClass}
                    type="number"
                    step="0.01"
                    min="0"
                    value={rates.amount ?? ""}
                    onChange={(e) => updateRates({ amount: e.target.value ? Number(e.target.value) : 0 })}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Currency</label>
                  <input
                    className={inputClass}
                    value={rates.currency ?? ""}
                    onChange={(e) => updateRates({ currency: e.target.value })}
                    placeholder="USD"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Tax (optional)</label>
                  <input
                    className={inputClass}
                    type="number"
                    step="0.01"
                    min="0"
                    value={rates.tax ?? ""}
                    onChange={(e) => updateRates({ tax: e.target.value ? Number(e.target.value) : undefined })}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Total (optional)</label>
                  <input
                    className={inputClass}
                    type="number"
                    step="0.01"
                    min="0"
                    value={rates.total ?? ""}
                    onChange={(e) => updateRates({ total: e.target.value ? Number(e.target.value) : undefined })}
                  />
                </div>
              </div>
            </div>

            {submitError && (
              <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {submitError}
              </p>
            )}
          </div>
          <DialogFooter className="border-t px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
