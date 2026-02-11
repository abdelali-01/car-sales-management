"use client";

import { DeleteModalProvider } from "@/context/DeleteModalContext";
import { SearchProvider } from "@/context/SearchContext";
import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { RootState } from "@/store/store";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const pathname = usePathname();


  useEffect(()=>{
    if(user){
      if(user.role === 'manager'){
        if(pathname == '/admin' || pathname=== '/admin/products' || pathname === '/admin/accounts' || pathname === '/admin/signup'){
          router.push('/admin/orders');
        }
      }else if (user.role === 'sub-super'){
        if(pathname == '/admin'|| pathname === '/signup'){
          router.push('/admin/orders');
        }
      }
    }
  },[pathname , user , router]);

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

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
            {/* Page Content */}
            <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
          </div>
        </DeleteModalProvider>
      </SearchProvider>
    </div>
  );
}
