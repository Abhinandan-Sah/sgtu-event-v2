"use client";

import { usePathname, useRouter } from "next/navigation";

export default function StudentMobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  const items = [
    { icon: "home", label: "Home", path: "/student" },
    { icon: "qr_code_2", label: "My QR", path: "/student/qr" },
    { icon: "confirmation_number", label: "My Visits", path: "/student/my-visits" },
    { icon: "person", label: "Profile", path: "/student/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-soft-background/95 border-t border-light-gray-border backdrop-blur-sm">
      <div className="grid grid-cols-4 gap-1 p-2 max-w-3xl mx-auto">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center justify-center py-2 rounded-xl 
              ${
                pathname === item.path
                  ? "text-primary font-semibold"
                  : "text-gray-600"
              }
            `}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
