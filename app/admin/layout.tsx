"use client";

import {
  LayoutDashboard,
  BookOpen,
  User,
  LogOut,
  Bell,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import Image from "next/image";
import { useAdminUIStore } from "@/store/useUIStore"; // adjust path as needed
import {
  ModalContentType,
  ModalRoot,
} from "@/components/molecules/modal/ModalRoot";
import { MessagePopupModal } from "@/components/molecules/modal/MessagePopupModal";
import { ProgramForm } from "@/features/programs";
import { CreateWaveForm } from "@/features/waves";
import { UpdateWaveForm } from "@/features/waves/components/UpdateWaveForm";

export type NavLink = {
  name: string;
  icon?: ReactNode;
  to: string;
};

const modalContent: ModalContentType = {
  program: ProgramForm,
  createWave: CreateWaveForm,
  messagePopup: MessagePopupModal,
  updateWave: UpdateWaveForm,
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    isSidebarOpen,
    isMinimized,
    toggleSidebar,
    closeSidebar,
    toggleMinimize,
  } = useAdminUIStore();

  const navLinks: NavLink[] = [
    { name: "dashboard", to: "/admin", icon: <LayoutDashboard size={20} /> },
    {
      name: "publication",
      to: "/admin/publication",
      icon: <BookOpen size={20} />,
    },
  ];

  // On desktop, the menu button toggles isMinimized.
  // On mobile, it toggles isSidebarOpen (overlay).
  const handleMenuClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      toggleSidebar();
    } else {
      toggleMinimize();
    }
  };

  return (
    <div className="flex h-screen bg-base-100">
      {/* Mobile overlay (visible only when sidebar is open on mobile) */}
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          flex flex-col bg-primary
          fixed lg:static inset-y-0 left-0 z-50
          transition-all duration-300 ease-in-out
          ${isMinimized ? "lg:w-20" : "lg:w-64"}
          w-64
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Owner Profile */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-base-100/10 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <Image
              src="/images/logo.png"
              width={32}
              height={32}
              alt="logo"
              className="rounded-md shrink-0"
            />
            <p
              className={`font-sans text-xl font-semibold text-base-100 leading-tight whitespace-nowrap transition-opacity duration-200 ${
                isMinimized ? "lg:opacity-0 lg:w-0" : "opacity-100"
              }`}
            >
              KesTraining
            </p>
          </div>
          {/* Close button, mobile only */}
          <button
            onClick={closeSidebar}
            className="lg:hidden p-1 rounded-md hover:bg-base-100/10 text-base-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navLinks.map((navLink) => (
            <Link
              href={navLink.to}
              key={navLink.name}
              title={isMinimized ? navLink.name : undefined}
              className={`flex gap-3 font-sans items-center text-base capitalize text-base-100/90 py-2.5 px-3 rounded-lg hover:bg-base-100 hover:text-primary transition-all duration-200 ${
                isMinimized ? "lg:justify-center" : ""
              }`}
            >
              <span className="shrink-0">{navLink.icon}</span>
              <span
                className={`font-medium whitespace-nowrap transition-all duration-200 ${
                  isMinimized ? "lg:hidden" : ""
                }`}
              >
                {navLink.name}
              </span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30  bg-primary text-base-100 md:text-black md:bg-base-100/80 backdrop-blur-md border-b border-base-300/60 shrink-0">
          <button
            onClick={handleMenuClick}
            className="hover:bg-base-200 cursor-pointer p-2 rounded-full transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <button className="btn btn-ghost btn-circle btn-sm">
              <Bell size={19} />
            </button>
            <button className="btn btn-ghost btn-circle btn-sm">
              <User size={19} />
            </button>
            <button className="hover:bg-base-300 cursor-pointer p-2 rounded-md transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-base-200/40 font-sans">
          <div className="max-w-7xl mx-auto p-8">
            {children}
            <ModalRoot modalContentMap={modalContent} />
          </div>
        </main>
      </div>
    </div>
  );
}
