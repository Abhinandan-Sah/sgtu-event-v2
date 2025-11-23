// "use client";
// import Image from "next/image";

// export default function AdminHeader({ theme, toggleTheme, adminName }) {
//   return (
//     <header className="bg-soft-background/80 backdrop-blur-sm 
//       border-b border-light-gray-border dark:border-gray-800">
//       <div className="mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-20">
//             <Image
//                       src="/images/SGT-Logo.png"
//                       width={48}
//                       height={48}
//                       alt="Logo"
//                       className="rounded-full"
//                     />
//           <h1 className="text-2xl font-bold text-dark-text">
//             Welcome, {adminName || "Admin"}!
//           </h1>

//           <button
//             onClick={toggleTheme}
//             className="text-gray-600 hover:text-dark-text p-2 rounded-md"
//           >
//             {theme === "light" ? (
//               <span className="material-symbols-outlined">dark_mode</span>
//             ) : (
//               <span className="material-symbols-outlined">light_mode</span>
//             )}
//           </button>

//         </div>
//       </div>
//     </header>
//   );
// }




// "use client";
// import Image from "next/image";

// export default function AdminHeader({ adminName }) {
//   return (
//     <header
//       className="
//         h-20 sticky top-0 z-30 
//         bg-white/80 dark:bg-[#0d1117]/80 
//         backdrop-blur-xl 
//         border-b border-gray-200 dark:border-gray-800
//         flex items-center justify-between
//         px-6 lg:ml-64
//       "
//     >

//          <Image
//                       src="/images/SGT-Logo.png"
//                       width={48}
//                       height={48}
//                       alt="Logo"
//                       className="rounded-full"
//                     />

//       <h1 className="text-2xl font-bold text-[#2B6CB0]">
//         Welcome, {adminName} 
//       </h1>

//       <button
//             onClick={toggleTheme}
//             className="text-gray-600 hover:text-dark-text p-2 rounded-md"
//           >
//             {theme === "light" ? (
//               <span className="material-symbols-outlined">dark_mode</span>
//             ) : (
//               <span className="material-symbols-outlined">light_mode</span>
//             )}
//           </button>
//     </header>
//   );
// }





"use client";

import Image from "next/image";

export default function AdminHeader({ theme, toggleTheme, adminName }) {
  return (
    <header
      className="
        fixed top-0 right-0 left-0 lg:pl-64
        h-20 flex items-center
        bg-soft-background/80 dark:bg-[#0d1117]/80
        backdrop-blur-xl
        border-b border-light-gray-border dark:border-gray-800
        z-30
      "
    >
      <div className="w-full flex items-center justify-between px-6">

        {/* LEFT - LOGO */}
        {/* <div className="flex items-center gap-3"> */}
          <Image
            src="/images/SGT-Logo.png"
            width={48}
            height={48}
            alt="Logo"
            className="rounded-full shadow-md"
          />

          <h1 className="text-2xl text-center font-bold text-dark-text dark:text-white">
            Welcome, {adminName || "Admin"}!
          </h1>
        {/* </div> */}

        {/* RIGHT - THEME TOGGLE */}
        <button
          onClick={toggleTheme}
          className="
            text-gray-600 dark:text-gray-300 
            hover:bg-gray-200 dark:hover:bg-gray-800
            p-2 rounded-xl transition
          "
        >
          {theme === "light" ? (
            <span className="material-symbols-outlined text-3xl">dark_mode</span>
          ) : (
            <span className="material-symbols-outlined text-3xl">light_mode</span>
          )}
        </button>
      </div>
    </header>
  );
}
