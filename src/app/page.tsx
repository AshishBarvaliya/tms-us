import Link from "next/link";
import { Truck, Package, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Transportation Management
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Manage shipments, track deliveries, and view reports from one place.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/shipments">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800">
            <Package className="size-10 text-emerald-600 dark:text-emerald-500" />
            <h2 className="mt-4 font-semibold text-zinc-900 dark:text-zinc-50">Shipments</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              View and manage all shipments.
            </p>
            <Button variant="linkAccent" className="mt-4">
              Open Shipments →
            </Button>
          </div>
        </Link>
        <Link href="/shipments">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800">
            <Truck className="size-10 text-emerald-600 dark:text-emerald-500" />
            <h2 className="mt-4 font-semibold text-zinc-900 dark:text-zinc-50">Create Shipment</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Add a new shipment to the system.
            </p>
            <Button variant="linkAccent" className="mt-4">
              Create →
            </Button>
          </div>
        </Link>
        <Link href="/reports">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800">
            <BarChart3 className="size-10 text-emerald-600 dark:text-emerald-500" />
            <h2 className="mt-4 font-semibold text-zinc-900 dark:text-zinc-50">Reports</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Analytics and export options.
            </p>
            <Button variant="linkAccent" className="mt-4">
              View Reports →
            </Button>
          </div>
        </Link>
      </div>
    </div>
  );
}
