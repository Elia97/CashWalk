import { NavbarItem } from "@/app/layout";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

export function MobileNavigation({
  navbarItems,
}: {
  navbarItems: NavbarItem[];
}) {
  const getLabelWithIcon = (label: string, Icon: LucideIcon) => {
    return (
      <span className="flex flex-col items-center justify-center gap-2">
        <Icon className="w-4 h-4" />
        {label}
      </span>
    );
  };

  return (
    <NavigationMenu className="fixed bottom-0 left-0 right-0 w-full max-w-none z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t lg:hidden">
      <NavigationMenuList className="grid grid-cols-4 w-full">
        {navbarItems.map(({ href, label, Icon }) => (
          <NavigationMenuItem key={href}>
            <NavigationMenuLink asChild>
              <Link
                href={href}
                className={
                  navigationMenuTriggerStyle() +
                  " flex flex-col items-center justify-center gap-1 w-full h-full px-0 py-3 rounded-none border-none bg-transparent"
                }
              >
                {getLabelWithIcon(label, Icon)}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
