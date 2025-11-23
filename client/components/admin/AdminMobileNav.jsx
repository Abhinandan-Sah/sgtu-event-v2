"use client";

import { useRouter, usePathname } from "next/navigation";

export default function AdminMobileNav() {
  const router = useRouter();
  const path = usePathname();

  const NavItem = ({ label, icon, to }) => (
    <button
      onClick={() => router.push(to)}
      className={`flex flex-col items-center py-2 rounded-xl
        ${path === to ? "text-primary" : "text-gray-600"}
      `}
    >
      <span className="material-symbols-outlined">{icon}</span>
      <span className="text-xs">{label}</span>
    </button>
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden 
      bg-soft-background/95 border-t border-light-gray-border backdrop-blur-sm">

      <div className="grid grid-cols-4 gap-1 p-2 max-w-xl mx-auto">
        <NavItem label="Home" to="/admin" icon="dashboard" />
        <NavItem label="Volunteers" to="/admin/volunteers" icon="group" />
        <NavItem label="Stalls" to="/admin/stalls" icon="store" />
        <NavItem label="Profile" to="/admin/profile" icon="person" />
      </div>
    </nav>
  );
}
