"use client";

import { NavbarItem } from "@/app/layout";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import Link from "next/link";
import {
  type LucideIcon,
  ArrowRightLeft,
  ChartColumn,
  LayoutDashboard,
  Wallet,
} from "lucide-react";
import React from "react";

const iconMap: Record<string, LucideIcon> = {
  "layout-dashboard": LayoutDashboard,
  wallet: Wallet,
  "arrow-right-left": ArrowRightLeft,
  "chart-column": ChartColumn,
};

export function DesktopNavigation({
  navbarItems,
}: {
  navbarItems: NavbarItem[];
}) {
  return (
    <NavigationMenu className="hidden lg:block">
      <NavigationMenuList>
        {navbarItems.map(({ href, label, icon }) => (
          <NavigationMenuItem key={href}>
            <NavigationMenuLink asChild>
              <Link href={href} className={navigationMenuTriggerStyle()}>
                <span className="inline-flex items-center gap-2">
                  {React.createElement(iconMap[icon], { className: "w-4 h-4" })}
                  {label}
                </span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
