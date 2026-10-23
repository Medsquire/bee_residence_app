import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MobileNav from './MobileNav';
import SimulationBar from '../simulation/SimulationBar';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar for desktop & mobile drawer */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main app shell */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <Navbar onOpenSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-12 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Mobile bottom nav bar */}
        <MobileNav onOpenMenu={() => setSidebarOpen(true)} />

        {/* Floating Simulation Assistant */}
        <SimulationBar />
      </div>
    </div>
  );
}
