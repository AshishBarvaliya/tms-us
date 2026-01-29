"use client";

import type { Shipment } from "@/graphql/shipments/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Flag, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

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

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  in_transit: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  cancelled: "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300",
};

export function ShipmentTile({
  shipment,
  onClick,
  onEdit,
  onFlag,
  onDelete,
  className,
}: {
  shipment: Shipment;
  onClick: () => void;
  onEdit?: () => void;
  onFlag?: () => void;
  onDelete?: () => void;
  className?: string;
}) {
  const statusClass = statusColors[shipment.status?.toLowerCase() ?? ""] ?? "bg-zinc-100 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300";

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
            {shipment.shipperName} → {shipment.carrierName}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">ID: {shipment.id}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-xs"
              className="shrink-0 rounded-full"
              onClick={(e) => e.stopPropagation()}
              aria-label="More options"
            >
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onSelect={() => onEdit?.()}>
              <Pencil className="size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onFlag?.()}>
              <Flag className="size-4" />
              Flag
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={() => onDelete?.()}>
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-1.5 pt-0">
        <div className="flex items-center gap-2">
          <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", statusClass)}>
            {shipment.status ?? "—"}
          </span>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          {shipment.pickupLocation?.city ?? "—"} → {shipment.deliveryLocation?.city ?? "—"}
        </p>
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {formatAmount(shipment.rates?.amount, shipment.rates?.currency ?? "USD")}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Est. delivery: {formatDate(shipment.estimatedDelivery)}
        </p>
      </CardContent>
    </Card>
  );
}
