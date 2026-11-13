import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MobileNav from './MobileNav';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen relative overflow-x-hidden flex bg-gradient-to-br from-blue-50/70 via-slate-50/50 to-sky-50/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Decorative ambient glassmorphism light orbs */}
      <div className="fixed -top-32 -left-32 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/3 -right-32 w-[30rem] h-[30rem] bg-sky-300/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed -bottom-32 left-1/4 w-[28rem] h-[28rem] bg-indigo-300/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Sidebar for desktop & mobile drawer */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main app shell with fixed distance from sidebar across all resolutions & zoom levels */}
      <div className="flex-1 lg:pl-[276px] flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 px-3 sm:px-4 lg:pl-4 lg:pr-5 xl:pl-5 xl:pr-6 pt-2 sm:pt-2.5 pb-24 sm:pb-6 lg:pb-10 w-full">
          <Outlet />
        </main>

        {/* Mobile bottom nav dock */}
        <MobileNav onOpenMenu={() => setSidebarOpen(true)} />
      </div>
    </div>
  );
}
