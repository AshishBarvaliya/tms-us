"use client";

import { useState, useEffect } from "react";
import type { ShipmentCreateInput } from "@/graphql/shipments/types";
import { AddShipmentAction } from "@/graphql/shipments/actions";
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

const defaultForm: ShipmentCreateInput = {
  shipperName: "",
  carrierName: "",
  status: "pending",
  pickupLocation: { ...emptyAddress },
  deliveryLocation: { ...emptyAddress },
  rates: { amount: 0, currency: "USD" },
  estimatedDelivery: undefined,
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export function CreateShipmentDialog({ open, onOpenChange, onSuccess }: Props) {
  const [form, setForm] = useState<ShipmentCreateInput>({ ...defaultForm });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm({
        ...defaultForm,
        pickupLocation: { ...emptyAddress },
        deliveryLocation: { ...emptyAddress },
        rates: { amount: 0, currency: "USD" },
      });
      setSubmitError(null);
    }
  }, [open]);

  const update = (updates: Partial<ShipmentCreateInput>) => {
    setForm((prev) => ({ ...prev, ...updates }));
    setSubmitError(null);
  };

  const updatePickup = (updates: Partial<typeof emptyAddress>) => {
    setForm((prev) => ({
      ...prev,
      pickupLocation: { ...prev.pickupLocation!, ...updates },
    }));
    setSubmitError(null);
  };

  const updateDelivery = (updates: Partial<typeof emptyAddress>) => {
    setForm((prev) => ({
      ...prev,
      deliveryLocation: { ...prev.deliveryLocation!, ...updates },
    }));
    setSubmitError(null);
  };

  const updateRates = (updates: Partial<NonNullable<ShipmentCreateInput["rates"]>>) => {
    setForm((prev) => ({
      ...prev,
      rates: { ...prev.rates!, ...updates },
    }));
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const input: ShipmentCreateInput = {
        shipperName: form.shipperName.trim(),
        carrierName: form.carrierName.trim(),
        status: form.status.trim() || "pending",
        pickupLocation: {
          street: form.pickupLocation!.street.trim(),
          city: form.pickupLocation!.city.trim(),
          state: form.pickupLocation!.state.trim(),
          postalCode: form.pickupLocation!.postalCode.trim(),
          country: form.pickupLocation!.country.trim(),
        },
        deliveryLocation: {
          street: form.deliveryLocation!.street.trim(),
          city: form.deliveryLocation!.city.trim(),
          state: form.deliveryLocation!.state.trim(),
          postalCode: form.deliveryLocation!.postalCode.trim(),
          country: form.deliveryLocation!.country.trim(),
        },
        rates: {
          amount: Number(form.rates!.amount) || 0,
          currency: form.rates!.currency?.trim() || "USD",
          tax: form.rates!.tax != null ? Number(form.rates!.tax) : undefined,
          total: form.rates!.total != null ? Number(form.rates!.total) : undefined,
        },
        estimatedDelivery: form.estimatedDelivery?.trim() || undefined,
      };
      await AddShipmentAction(input);
      setForm({ ...defaultForm });
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to create shipment");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] max-w-2xl overflow-y-auto p-0"
        title="Create shipment"
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader className="border-b px-6 py-4">
            <DialogTitle className="text-xl">Create Shipment</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 px-6 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Shipper name</label>
                <input
                  className={inputClass}
                  value={form.shipperName}
                  onChange={(e) => update({ shipperName: e.target.value })}
                  placeholder="Acme Corp"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Carrier name</label>
                <input
                  className={inputClass}
                  value={form.carrierName}
                  onChange={(e) => update({ carrierName: e.target.value })}
                  placeholder="FedEx"
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Status</label>
                <select
                  className={inputClass}
                  value={form.status}
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
                    value={form.pickupLocation!.street}
                    onChange={(e) => updatePickup({ street: e.target.value })}
                    required
                  />
                </div>
                <input
                  className={inputClass}
                  placeholder="City"
                  value={form.pickupLocation!.city}
                  onChange={(e) => updatePickup({ city: e.target.value })}
                  required
                />
                <input
                  className={inputClass}
                  placeholder="State"
                  value={form.pickupLocation!.state}
                  onChange={(e) => updatePickup({ state: e.target.value })}
                  required
                />
                <input
                  className={inputClass}
                  placeholder="Postal code"
                  value={form.pickupLocation!.postalCode}
                  onChange={(e) => updatePickup({ postalCode: e.target.value })}
                  required
                />
                <input
                  className={inputClass}
                  placeholder="Country"
                  value={form.pickupLocation!.country}
                  onChange={(e) => updatePickup({ country: e.target.value })}
                  required
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
                    value={form.deliveryLocation!.street}
                    onChange={(e) => updateDelivery({ street: e.target.value })}
                    required
                  />
                </div>
                <input
                  className={inputClass}
                  placeholder="City"
                  value={form.deliveryLocation!.city}
                  onChange={(e) => updateDelivery({ city: e.target.value })}
                  required
                />
                <input
                  className={inputClass}
                  placeholder="State"
                  value={form.deliveryLocation!.state}
                  onChange={(e) => updateDelivery({ state: e.target.value })}
                  required
                />
                <input
                  className={inputClass}
                  placeholder="Postal code"
                  value={form.deliveryLocation!.postalCode}
                  onChange={(e) => updateDelivery({ postalCode: e.target.value })}
                  required
                />
                <input
                  className={inputClass}
                  placeholder="Country"
                  value={form.deliveryLocation!.country}
                  onChange={(e) => updateDelivery({ country: e.target.value })}
                  required
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
                    value={form.rates!.amount ?? ""}
                    onChange={(e) => updateRates({ amount: e.target.value ? Number(e.target.value) : 0 })}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Currency</label>
                  <input
                    className={inputClass}
                    value={form.rates!.currency}
                    onChange={(e) => updateRates({ currency: e.target.value })}
                    placeholder="USD"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Tax (optional)</label>
                  <input
                    className={inputClass}
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.rates!.tax ?? ""}
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
                    value={form.rates!.total ?? ""}
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
                  Creating…
                </>
              ) : (
                "Create shipment"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
