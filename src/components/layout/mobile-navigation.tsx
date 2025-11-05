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

export function MobileNavigation({
  navbarItems,
}: {
  navbarItems: NavbarItem[];
}) {
  return (
    <NavigationMenu className="fixed bottom-0 left-0 right-0 w-full max-w-none z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t lg:hidden">
      <NavigationMenuList className="grid grid-cols-4 w-full">
        {navbarItems.map(({ href, label, icon }) => (
          <NavigationMenuItem key={href}>
            <NavigationMenuLink asChild>
              <Link
                href={href}
                className={
                  navigationMenuTriggerStyle() +
                  "flex flex-col items-center justify-center gap-1 w-full h-full px-0 py-3 rounded-none border-none bg-transparent"
                }
              >
                <span className="flex flex-col items-center justify-center gap-2">
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
