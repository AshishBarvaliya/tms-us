"use client";

import { useEffect, useState } from "react";
import type { Shipment } from "@/graphql/shipments/types";
import { GetShipmentsListAction } from "@/graphql/shipments/actions";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { LayoutGrid, LayoutList, Loader2 } from "lucide-react";
import { ShipmentTile } from "./shipment-tile";
import { ShipmentDetailView } from "./shipment-detail-view";

function formatDate(s: string | undefined) {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return s;
  }
}

function formatAmount(amount: number | undefined, currency: string) {
  if (amount == null) return "—";
  return new Intl.NumberFormat(undefined, { style: "currency", currency: currency || "USD" }).format(amount);
}

const GRID_COLUMNS = [
  { key: "id", label: "ID", className: "font-mono text-xs" },
  { key: "shipperName", label: "Shipper" },
  { key: "carrierName", label: "Carrier" },
  { key: "status", label: "Status" },
  { key: "pickupCity", label: "Pickup City" },
  { key: "deliveryCity", label: "Delivery City" },
  { key: "amount", label: "Amount" },
  { key: "currency", label: "Currency" },
  { key: "estimatedDelivery", label: "Est. Delivery" },
  { key: "createdAt", label: "Created" },
] as const;

export function ShipmentsView() {
  const [shipments, setShipments] = useState<Shipment[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "tile">("grid");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    GetShipmentsListAction(null, null)
      .then((data) => {
        if (cancelled) return;
        setShipments(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.message ?? "Failed to load shipments");
        setShipments([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedShipment = selectedId && shipments ? shipments.find((s) => s.id === selectedId) : null;

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-900/20 dark:text-red-200">
        <p className="font-medium">Error loading shipments</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const list = shipments ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Shipments</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">View:</span>
          <Button
            variant={viewMode === "grid" ? "navActive" : "ghost"}
            size="sm"
            className="gap-2"
            onClick={() => setViewMode("grid")}
          >
            <LayoutList className="size-4" />
            Grid
          </Button>
          <Button
            variant={viewMode === "tile" ? "navActive" : "ghost"}
            size="sm"
            className="gap-2"
            onClick={() => setViewMode("tile")}
          >
            <LayoutGrid className="size-4" />
            Tiles
          </Button>
        </div>
      </div>

      {viewMode === "grid" && (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow className="border-b bg-muted/50 hover:bg-muted/50">
                {GRID_COLUMNS.map(({ label }) => (
                  <TableHead key={label} className="px-4 py-3 font-semibold">
                    {label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={GRID_COLUMNS.length}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No shipments found.
                  </TableCell>
                </TableRow>
              ) : (
                list.map((s) => (
                  <TableRow
                    key={s.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedId(s.id)}
                  >
                    <TableCell className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {s.id}
                    </TableCell>
                    <TableCell className="px-4 py-3 font-medium">{s.shipperName ?? "—"}</TableCell>
                    <TableCell className="px-4 py-3">{s.carrierName ?? "—"}</TableCell>
                    <TableCell className="px-4 py-3">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                        {s.status ?? "—"}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3">{s.pickupLocation?.city ?? "—"}</TableCell>
                    <TableCell className="px-4 py-3">{s.deliveryLocation?.city ?? "—"}</TableCell>
                    <TableCell className="px-4 py-3 font-medium">
                      {s.rates?.amount != null ? formatAmount(s.rates.amount, s.rates?.currency ?? "USD") : "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground">{s.rates?.currency ?? "—"}</TableCell>
                    <TableCell className="px-4 py-3">{formatDate(s.estimatedDelivery)}</TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground">{formatDate(s.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {viewMode === "tile" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.length === 0 ? (
            <p className="col-span-full py-12 text-center text-zinc-500">No shipments found.</p>
          ) : (
            list.map((shipment) => (
              <ShipmentTile
                key={shipment.id}
                shipment={shipment}
                onClick={() => setSelectedId(shipment.id)}
                onEdit={() => {}}
                onFlag={() => {}}
                onDelete={() => {}}
              />
            ))
          )}
        </div>
      )}

      <Dialog open={!!selectedShipment} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent
          className="max-h-[90vh] max-w-3xl overflow-y-auto p-0"
          showCloseButton={true}
          title="Shipment details"
        >
          {selectedShipment && (
            <ShipmentDetailView
              shipment={selectedShipment}
              onBack={() => setSelectedId(null)}
              className="p-6"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
