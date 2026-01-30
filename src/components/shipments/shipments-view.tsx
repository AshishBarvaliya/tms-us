"use client";

import { useEffect, useState } from "react";
import type { Shipment } from "@/graphql/shipments/types";
import { GetShipmentsAction } from "@/graphql/shipments/actions";
import { useMockAuth } from "@/contexts/mock-auth-context";
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
import { LayoutGrid, LayoutList, Loader2, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { ShipmentTile } from "./shipment-tile";
import { ShipmentDetailView } from "./shipment-detail-view";
import { CreateShipmentDialog } from "./create-shipment-dialog";
import { EditShipmentDialog } from "./edit-shipment-dialog";

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

const PAGE_SIZE = 10;

export function ShipmentsView() {
  const { isAdmin } = useMockAuth();
  const [shipments, setShipments] = useState<Shipment[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "tile">("grid");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageInfo, setPageInfo] = useState<{
    page: number;
    limit: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);

  const refetchShipments = () => {
    GetShipmentsAction(page, PAGE_SIZE, null, null)
      .then((data) => {
        const edges = (data as { edges?: { node: Shipment }[] })?.edges ?? [];
        const nodes = edges.map((e) => e.node);
        const info = (data as { pageInfo?: typeof pageInfo })?.pageInfo ?? null;
        setShipments(nodes);
        setPageInfo(info);
      })
      .catch(() => {});
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    GetShipmentsAction(page, PAGE_SIZE, null, null)
      .then((data) => {
        if (cancelled) return;
        const edges = (data as { edges?: { node: Shipment }[] })?.edges ?? [];
        const nodes = edges.map((e) => e.node);
        const info = (data as { pageInfo?: typeof pageInfo })?.pageInfo ?? null;
        setShipments(nodes);
        setPageInfo(info);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.message ?? "Failed to load shipments");
        setShipments([]);
        setPageInfo(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

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
          <Button
            variant="default"
            size="sm"
            className="gap-2"
            onClick={() => setCreateDialogOpen(true)}
          >
            <Plus className="size-4" />
            Create shipment
          </Button>
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
                onEdit={() => {
                  if (isAdmin) setEditingShipment(shipment);
                  else alert("Only admins can edit shipments.");
                }}
                onFlag={() => {}}
                onDelete={() => {}}
              />
            ))
          )}
        </div>
      )}

      {pageInfo && pageInfo.totalCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Page {pageInfo.page} of {Math.ceil(pageInfo.totalCount / pageInfo.limit)} ({pageInfo.totalCount} total)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!pageInfo.hasPreviousPage}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="size-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!pageInfo.hasNextPage}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
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
              onEdit={() => {
                if (isAdmin) {
                  setSelectedId(null);
                  setEditingShipment(selectedShipment);
                } else {
                  alert("Only admins can edit shipments.");
                }
              }}
              className="p-6"
            />
          )}
        </DialogContent>
      </Dialog>

      <CreateShipmentDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={refetchShipments}
      />

      <EditShipmentDialog
        shipment={editingShipment}
        open={!!editingShipment}
        onOpenChange={(open) => !open && setEditingShipment(null)}
        onSuccess={() => {
          refetchShipments();
          setEditingShipment(null);
        }}
      />
    </div>
  );
}
