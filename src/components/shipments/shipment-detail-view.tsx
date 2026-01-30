"use client";

import type { Shipment } from "@/graphql/shipments/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, DollarSign, Calendar, Activity, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

function formatDate(s: string | undefined) {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return s;
  }
}

function formatAmount(amount: number | undefined, currency: string) {
  if (amount == null) return "—";
  return new Intl.NumberFormat(undefined, { style: "currency", currency: currency || "USD" }).format(amount);
}

function AddressBlock({ label, address }: { label: string; address: Shipment["pickupLocation"] }) {
  if (!address) return null;
  const lines = [address.street, [address.city, address.state, address.postalCode].filter(Boolean).join(", "), address.country].filter(Boolean);
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">{lines.join("\n")}</p>
    </div>
  );
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  in_transit: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  cancelled: "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300",
};

export function ShipmentDetailView({
  shipment,
  onBack,
  onEdit,
  className,
}: {
  shipment: Shipment;
  onBack: () => void;
  onEdit?: () => void;
  className?: string;
}) {
  const statusClass = statusColors[shipment.status?.toLowerCase() ?? ""] ?? "bg-zinc-100 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300";

  return (
    <div className={cn("mx-auto max-w-3xl space-y-6", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" className="gap-2 -ml-2" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Back to list
        </Button>
        {onEdit && (
          <Button variant="outline" size="sm" className="gap-2" onClick={onEdit}>
            <Pencil className="size-4" />
            Edit
          </Button>
        )}
      </div>

      <Card className="overflow-hidden border-2 border-zinc-200 dark:border-zinc-700">
        <CardHeader className="border-b border-zinc-200 bg-zinc-50/50 dark:border-zinc-700 dark:bg-zinc-900/50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CardTitle className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Shipment {shipment.id}
            </CardTitle>
            <span className={cn("rounded-full px-3 py-1 text-sm font-medium", statusClass)}>
              {shipment.status ?? "—"}
            </span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {shipment.shipperName} · {shipment.carrierName}
          </p>
        </CardHeader>
        <CardContent className="divide-y divide-zinc-200 dark:divide-zinc-700">
          <section className="grid gap-6 py-6 sm:grid-cols-2">
            <div className="flex gap-3">
              <MapPin className="size-5 shrink-0 text-zinc-500 dark:text-zinc-400" />
              <div className="grid flex-1 gap-4 sm:grid-cols-2">
                <AddressBlock label="Pickup" address={shipment.pickupLocation} />
                <AddressBlock label="Delivery" address={shipment.deliveryLocation} />
              </div>
            </div>
          </section>

          <section className="py-6">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              <DollarSign className="size-4" />
              Rates
            </div>
            <div className="mt-3 flex flex-wrap gap-6">
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Amount</p>
                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {formatAmount(shipment.rates?.amount, shipment.rates?.currency ?? "USD")}
                </p>
              </div>
              {shipment.rates?.tax != null && (
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Tax</p>
                  <p className="font-medium">{formatAmount(shipment.rates.tax, shipment.rates?.currency ?? "USD")}</p>
                </div>
              )}
              {shipment.rates?.total != null && (
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Total</p>
                  <p className="font-medium">{formatAmount(shipment.rates.total, shipment.rates?.currency ?? "USD")}</p>
                </div>
              )}
            </div>
          </section>

          <section className="py-6">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              <Calendar className="size-4" />
              Dates
            </div>
            <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <p><span className="text-zinc-500 dark:text-zinc-400">Created:</span> {formatDate(shipment.createdAt)}</p>
              <p><span className="text-zinc-500 dark:text-zinc-400">Updated:</span> {formatDate(shipment.updatedAt)}</p>
              <p><span className="text-zinc-500 dark:text-zinc-400">Est. delivery:</span> {formatDate(shipment.estimatedDelivery)}</p>
            </div>
          </section>

          {shipment.trackingData && (
            <section className="py-6">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                <Activity className="size-4" />
                Tracking
              </div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Status: {shipment.trackingData.status} · Last updated: {formatDate(shipment.trackingData.lastUpdated)}
              </p>
              {shipment.trackingData.events?.length ? (
                <ul className="mt-4 space-y-2 border-l-2 border-zinc-200 pl-4 dark:border-zinc-700">
                  {shipment.trackingData.events.map((ev, i) => (
                    <li key={i} className="text-sm">
                      <span className="font-medium">{ev.status}</span>
                      {ev.location && <span className="text-zinc-500"> · {ev.location}</span>}
                      <span className="block text-xs text-zinc-500">{formatDate(ev.timestamp)}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
