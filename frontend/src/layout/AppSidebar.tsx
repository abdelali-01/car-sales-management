"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  // CalenderIcon,
  ChatIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PlugInIcon,
  TaskIcon,
  UserCircleIcon,
} from "../icons/index";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import axios from "axios";
import Image from "next/image";
import { Car, Users, ClipboardList, UserCheck, Wallet, MessageSquareWarning } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";

type NavItem = {
  name: string; // Translation key for sidebar item
  icon: React.ReactNode;
  path?: string;
  count?: boolean;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

// ===== SUPER ADMIN NAVIGATION =====
// Overview Section
const overviewItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "sidebar.dashboard",
    path: "/"
  },
];

// Inventory Section
const inventoryItems: NavItem[] = [
  {
    icon: <Car className="w-5 h-5" />,
    name: "sidebar.offers",
    path: "/offers",
  },
];

// Sales Section
const salesItems: NavItem[] = [
  {
    icon: <Users className="w-5 h-5" />,
    name: "sidebar.visitors",
    path: "/visitors",
  },
  {
    icon: <ClipboardList className="w-5 h-5" />,
    name: "sidebar.orders",
    path: "/orders",
  },
];

// Finance Section
const financeItems: NavItem[] = [
  { icon: <UserCheck className="w-5 h-5" />, name: "sidebar.clients", path: "/clients" },
];

// Administration Section (Super Admin only)
const adminItems: NavItem[] = [
  {
    icon: <UserCircleIcon />,
    name: "sidebar.admins",
    path: "/accounts",
  },
];

// Support Section
const supportItems: NavItem[] = [
  {
    icon: <MessageSquareWarning />,
    name: "sidebar.liveSupport",
    path: "https://wa.me/213668845439",
  },
];

// ===== SUB-ADMIN NAVIGATION (no admin access) =====
const subAdminInventoryItems: NavItem[] = [
  {
    icon: <Car className="w-5 h-5" />,
    name: "sidebar.offers",
    path: "/offers",
  },
];

const subAdminSalesItems: NavItem[] = [
  {
    icon: <Users className="w-5 h-5" />,
    name: "sidebar.visitors",
    path: "/visitors",
  },
  {
    icon: <ClipboardList className="w-5 h-5" />,
    name: "sidebar.orders",
    path: "/orders",
  },
];

const subAdminFinanceItems: NavItem[] = [
  { icon: <UserCheck className="w-5 h-5" />, name: "sidebar.clients", path: "/clients" },
  { icon: <Wallet className="w-5 h-5" />, name: "sidebar.payments", path: "/payments" },
];

// ===== MANAGER NAVIGATION (orders only) =====
const managerSalesItems: NavItem[] = [
  {
    icon: <ClipboardList className="w-5 h-5" />,
    name: "sidebar.orders",
    path: "/orders"
  },
];


const AppSidebar: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const { t } = useTranslation('admin');

  // Removed unseen messages count (no messages module in auto-sales)

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others" | "Support"
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${openSubmenu?.type === menuType && openSubmenu?.index === index
                ? "menu-item-active"
                : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
            >
              <span
                className={`relative ${openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{t(nav.name)}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                    ? "rotate-180 text-brand-500"
                    : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`${isActive(nav.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{t(nav.name)}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                        }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge `}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others" | "Support";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // No submenus in new structure - just reset
    setOpenSubmenu(null);
  }, [pathname]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others" | "Support") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <div className="d-flex justify-center w-full">
          <Link href="/" >
            <Image
              src={"/bensaoud.png"}
              alt={"Bensaoud Auto"}
              width={100}
              height={100}
            />
          </Link>
        </div>

      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {/* OVERVIEW */}
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  t('sidebar.sections.overview')
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(overviewItems, "main")}
            </div>

            {/* INVENTORY - Super & Sub-Admin only */}
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  t('sidebar.sections.inventory')
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(inventoryItems, "main")}
            </div>

            {/* SALES */}
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  t('sidebar.sections.sales')
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(salesItems, "main")}
              {/* {user?.role === 'sub-super' && renderMenuItems(subAdminSalesItems, "main")}
              {user?.role === 'manager' && renderMenuItems(managerSalesItems, "main")} */}
            </div>

            {/* FINANCE - Super & Sub-Admin only */}
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  t('sidebar.sections.finance')
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(financeItems, "others")}
              {/* {user?.role === 'sub-super' && renderMenuItems(subAdminFinanceItems, "others")} */}
            </div>


            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  t('sidebar.sections.administration')
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(adminItems, "others")}
            </div>


            {/* SUPPORT */}
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  t('sidebar.sections.support')
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(supportItems, "Support")}
            </div>
          </div>
        </nav>

        {/* Language Switcher at Bottom */}
        <div className="mt-auto pt-4 pb-6 border-t border-gray-200 dark:border-gray-700">
          <LanguageSwitcher
            isExpanded={isExpanded}
            isHovered={isHovered}
            isMobileOpen={isMobileOpen}
          />
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
