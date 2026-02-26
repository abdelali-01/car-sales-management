"use client";

import { DeleteModalProvider } from "@/context/DeleteModalContext";
import { SearchProvider } from "@/context/SearchContext";
import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { RootState } from "@/store/store";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProfitReminderModal from "@/components/orders/ProfitReminderModal";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { user } = useSelector((state: RootState) => state.auth);

  // Track RTL mode reactively
  const [isRTL, setIsRTL] = useState(false);
  useEffect(() => {
    const checkDir = () => setIsRTL(document.documentElement.dir === 'rtl');
    checkDir();
    const observer = new MutationObserver(checkDir);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
    return () => observer.disconnect();
  }, []);

  // Dynamic class for main content margin based on sidebar state and direction
  const sideOffset = isMobileOpen
    ? "0"
    : isExpanded || isHovered
      ? "lg:[290px]"
      : "lg:[90px]";

  const mainContentMargin = isMobileOpen
    ? ""
    : isExpanded || isHovered
      ? isRTL ? "lg:mr-[290px]" : "lg:ml-[290px]"
      : isRTL ? "lg:mr-[90px]" : "lg:ml-[90px]";

  if (!user) return null;
  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <SearchProvider>
        <DeleteModalProvider>


          <AppSidebar />
          <Backdrop />
          {/* Main Content Area */}
          <div
            className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
          >
            {/* Header */}
            <AppHeader />
            {/* Profit Reminder Modal */}
            <ProfitReminderModal />
            {/* Page Content */}
            <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
          </div>
        </DeleteModalProvider>
      </SearchProvider>
    </div>
  );
}
