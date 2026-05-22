"use client";

import {
  LayoutDashboard,
  Map,
  Star,
  BarChart3,
  Settings,
  HelpCircle,
  Plus,
  LogOut,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SIDEBAR_LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/manage", label: "Manage Locations", icon: Map },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/admins", label: "Gestionar Admins", icon: Shield },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) return null;

  return (
    <aside className="w-64 bg-surface-container-lowest border-r border-outline-variant/20 shadow-md flex-col hidden lg:flex">
      <div className="p-8">
        <Link
          href="/"
          className="text-xl font-bold text-primary tracking-tight block"
        >
          Andahuaylas Go
        </Link>
        <p className="text-xs text-on-surface-variant mt-1">
          Admin Console - Apur&iacute;mac
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {SIDEBAR_LINKS.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-secondary-container text-on-secondary-container shadow-sm translate-x-1"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 mb-4">
        <Link
          href="/admin/lugares/nuevo"
          className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3 rounded-lg text-sm font-medium hover:opacity-90 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add New Listing
        </Link>
      </div>

      <div className="border-t border-outline-variant/20 pt-4 space-y-1">
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 px-8 py-3 text-sm text-on-surface-variant hover:bg-surface-container-high transition-all"
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>
        <Link
          href="/admin/support"
          className="flex items-center gap-3 px-8 py-3 text-sm text-on-surface-variant hover:bg-surface-container-high transition-all"
        >
          <HelpCircle className="w-5 h-5" />
          Support
        </Link>
        <div className="px-8 py-4 flex items-center gap-3 mt-4 border-t border-outline-variant/10">
          <div className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center bg-primary-fixed text-primary font-bold">
            A
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface">Admin User</p>
            <Link
              href="/"
              className="text-xs text-on-surface-variant hover:text-secondary flex items-center gap-1"
            >
              Logout <LogOut className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
