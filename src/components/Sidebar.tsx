"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Tooltip from "@/components/Tooltip";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  ListTodo,
  UserCircle,
} from "lucide-react";

export default function Sidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile) setCollapsed(false);
  }, [isMobile]);

  const items = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: ShoppingBag },
    { href: "/admin/orders", label: "Orders", icon: Package },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/tasks", label: "Tasks", icon: ListTodo },
    { href: "/admin/profile", label: "Profile", icon: UserCircle },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {open && isMobile && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

     <aside
  className={`
    glass z-40
    bg-[color:var(--sidebar-bg)]
    text-[color:var(--sidebar-text)]
    overflow-visible

    transition-[transform,width] duration-300 ease-in-out

    ${isMobile ? "w-64 max-w-[85vw] fixed top-16 left-0 bottom-0" : "md:sticky md:top-16 md:h-[calc(100vh-4rem)]"}
    ${isMobile ? (open ? "translate-x-0" : "-translate-x-full") : ""}
    ${!isMobile ? (collapsed ? "md:w-20" : "md:w-64") : ""}
  `}
>

        {/* Desktop collapse toggle */}
        <div className="hidden md:flex justify-end pt-4 pr-2 pb-2">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="text-[color:var(--sidebar-text)]/70 hover:text-[color:var(--sidebar-text)] transition"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Mobile close row */}
        {isMobile && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-black/10 dark:border-white/10 md:hidden">
            <span className="text-sm font-semibold text-[color:var(--sidebar-text)]">
              Menu
            </span>
            <button onClick={() => setOpen(false)}>
              <X size={20} />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="px-2 pt-3 pb-6 space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <div key={item.href} className="relative">
  {!isMobile && collapsed ? (
    <Tooltip label={item.label} side="right">
      <Link
        href={item.href}
        onClick={() => isMobile && setOpen(false)}
        className={`
          sidebar-item 
          ${active ? "sidebar-item-active" : ""}
          justify-center
        `}
        title={item.label} // fallback
      >
        <Icon size={18} className="shrink-0 text-[color:var(--sidebar-text)]" />
      </Link>
    </Tooltip>
  ) : (
    <Link
      href={item.href}
      onClick={() => isMobile && setOpen(false)}
      className={`
        sidebar-item
        ${active ? "sidebar-item-active" : ""}
        ${!isMobile && collapsed ? "justify-center" : ""}
      `}
      title={item.label}
    >
      <Icon size={18} className="shrink-0 text-[color:var(--sidebar-text)]" />
      {(!collapsed || isMobile) && <span>{item.label}</span>}
    </Link>
  )}
</div>

            );
          })}
        </nav>
      </aside>
    </>
  );
}
