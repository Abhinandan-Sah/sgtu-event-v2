// "use client";

// import { usePathname, useRouter } from "next/navigation";

// export default function AdminSidebar({ onLogout }) {
//   const pathname = usePathname();
//   const router = useRouter();

//   return (
//     <aside className="hidden lg:flex flex-col w-64 
//       bg-card-light dark:bg-card-dark 
//       border-r border-light-gray-border dark:border-gray-800 p-6">

//       {/* LOGO */}
//       <div className="flex items-center justify-center gap-2 mb-10">
//         <h2 className="font-bold text-xl text-primary">Admin Panel</h2>
//       </div>

//       <SidebarLink
//         label="Dashboard"
//         icon="dashboard"
//         active={pathname === "/admin"}
//         onClick={() => router.push("/admin")}
//       />

//       <SidebarLink
//         label="Volunteers"
//         icon="group"
//         active={pathname === "/admin/volunteers"}
//         onClick={() => router.push("/admin/volunteers")}
//       />

//       <SidebarLink
//         label="Students"
//         icon="school"
//         active={pathname === "/admin/students"}
//         onClick={() => router.push("/admin/students")}
//       />

//       <SidebarLink
//         label="Stalls"
//         icon="store"
//         active={pathname === "/admin/stalls"}
//         onClick={() => router.push("/admin/stalls")}
//       />

//       <SidebarLink
//         label="Scan Logs"
//         icon="qr_code_scanner"
//         active={pathname === "/admin/logs"}
//         onClick={() => router.push("/admin/logs")}
//       />

//       {/* LOGOUT */}
//       <div className="mt-auto">
//         <SidebarLink
//           label="Logout"
//           icon="logout"
//           danger
//           onClick={onLogout}
//         />
//       </div>
//     </aside>
//   );
// }

// function SidebarLink({ label, icon, active, danger, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition
//       ${
//         danger
//           ? "text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
//           : active
//           ? "bg-blue-100 text-primary dark:bg-blue-900/30 dark:text-blue-300"
//           : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
//       }`}
//     >
//       <span className="material-symbols-outlined">{icon}</span>
//       {label}
//     </button>
//   );
// }





"use client";

import { usePathname, useRouter } from "next/navigation";

export default function AdminSidebar({ onLogout }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside
      className="
        hidden lg:flex flex-col 
        w-64 h-screen fixed left-0 top-0 
        bg-white dark:bg-[#0d1117] 
        border-r border-gray-200 dark:border-gray-800 
        shadow-xl 
        z-40
      "
    >
      {/* LOGO */}
      <div className="h-20 flex items-center justify-center border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold text-[#2B6CB0]">Admin Panel</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">

        <SidebarLink
          label="Dashboard"
          icon="dashboard"
          active={pathname === "/admin"}
          onClick={() => router.push("/admin")}
        />

        <SidebarLink
          label="Volunteers"
          icon="group"
          active={pathname === "/admin/volunteers"}
          onClick={() => router.push("/admin/volunteers")}
        />

        <SidebarLink
          label="Students"
          icon="school"
          active={pathname === "/admin/students"}
          onClick={() => router.push("/admin/students")}
        />

        <SidebarLink
          label="Stalls"
          icon="store"
          active={pathname === "/admin/stalls"}
          onClick={() => router.push("/admin/stalls")}
        />

        <SidebarLink
          label="Scan Logs"
          icon="qr_code_scanner"
          active={pathname === "/admin/logs"}
          onClick={() => router.push("/admin/logs")}
        />
      </div>

      {/* LOGOUT */}
      <button
        onClick={onLogout}
        className="
          flex items-center gap-3 m-4 mb-6 px-4 py-3 rounded-xl
          text-red-600 hover:bg-red-100
          dark:text-red-400 dark:hover:bg-red-900/40
        "
      >
        <span className="material-symbols-outlined">logout</span>
        Logout
      </button>

    </aside>
  );
}

function SidebarLink({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 w-full px-4 py-3 rounded-lg mb-2 transition-all
        ${active
          ? "bg-blue-100 text-[#2B6CB0] dark:bg-blue-900/40 dark:text-blue-300 shadow-sm"
          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"}
      `}
    >
      <span className="material-symbols-outlined">{icon}</span>
      {label}
    </button>
  );
}
