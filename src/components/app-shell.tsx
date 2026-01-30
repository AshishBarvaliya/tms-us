"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import { Menu, Package, LayoutDashboard, FileText, Settings, ChevronDown, Truck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useMockAuth } from "@/contexts/mock-auth-context";
import type { MockRole } from "@/lib/mock-auth";

const horizontalNavItems: { href: string; label: string; icon: React.ElementType; adminOnly?: boolean }[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/shipments", label: "Shipments", icon: Truck },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings, adminOnly: true },
];

const sidebarMenuItems: {
  label: string;
  href?: string;
  icon: React.ElementType;
  adminOnly?: boolean;
  children?: { label: string; href: string; adminOnly?: boolean }[];
}[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  {
    label: "Shipments",
    icon: Package,
    children: [{ label: "All Shipments", href: "/shipments" }],
  },
  {
    label: "Reports",
    icon: FileText,
    children: [
      { label: "Analytics", href: "/reports/analytics" },
      { label: "Export", href: "/reports/export", adminOnly: true },
    ],
  },
  { label: "Settings", href: "/settings", icon: Settings, adminOnly: true },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role, setRole, isAdmin } = useMockAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const filteredHorizontalNav = useMemo(
    () => horizontalNavItems.filter((item) => !item.adminOnly || isAdmin),
    [isAdmin]
  );

  const filteredSidebarItems = useMemo(
    () =>
      sidebarMenuItems
        .filter((item) => !item.adminOnly || isAdmin)
        .map((item) =>
          item.children
            ? {
                ...item,
                children: item.children.filter((c) => !c.adminOnly || isAdmin),
              }
            : item
        ),
    [isAdmin]
  );

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-zinc-200 bg-white px-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setSidebarOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <Menu className="size-5" />
        </Button>
        <Link href="/" className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-50">
          <Truck className="size-6 text-emerald-600" />
          <span className="hidden sm:inline">TMS</span>
        </Link>
        <nav className="hidden flex-1 gap-1 md:flex">
          {filteredHorizontalNav.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <Button
                variant={pathname === href ? "navActive" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <Icon className="size-4" />
                {label}
              </Button>
            </Link>
          ))}
        </nav>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="size-4" />
              <span className="hidden sm:inline">Sign in as</span>
              <span className="font-medium capitalize">{role}</span>
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setRole("employee" as MockRole)}>
              Employee
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRole("admin" as MockRole)}>
              Admin
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="flex flex-1">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 border-r border-zinc-200 bg-white pt-14 transition-transform dark:border-zinc-800 dark:bg-zinc-900 md:static md:translate-x-0 md:pt-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-full flex-col gap-1 overflow-y-auto p-3">
            {filteredSidebarItems.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <div>
                    <Button
                      type="button"
                      variant="sidebar"
                      onClick={() => setExpandedMenu((m) => (m === item.label ? null : item.label))}
                    >
                      <span className="flex items-center gap-2">
                        <item.icon className="size-4" />
                        {item.label}
                      </span>
                      <ChevronDown
                        className={cn("size-4 transition-transform", expandedMenu === item.label && "rotate-180")}
                      />
                    </Button>
                    {expandedMenu === item.label && (
                      <div className="ml-4 mt-1 space-y-0.5 border-l border-zinc-200 pl-3 dark:border-zinc-700">
                        {item.children.map((sub) => (
                          <Button key={sub.href} variant={pathname === sub.href ? "sidebarLinkActive" : "sidebarLink"} asChild>
                            <Link href={sub.href} onClick={() => setSidebarOpen(false)}>
                              {sub.label}
                            </Link>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Button variant={pathname === item.href ? "sidebarItemActive" : "sidebarItem"} asChild>
                    <Link href={item.href!} onClick={() => setSidebarOpen(false)} className="flex items-center gap-2">
                      <item.icon className="size-4" />
                      {item.label}
                    </Link>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </aside>

        {sidebarOpen && (
          <Button
            type="button"
            variant="overlay"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
