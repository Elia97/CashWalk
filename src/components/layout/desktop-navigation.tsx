import { NavbarItem } from "@/app/layout";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

export function DesktopNavigation({
  navbarItems,
}: {
  navbarItems: NavbarItem[];
}) {
  const getLabelWithIcon = (label: string, Icon: LucideIcon) => {
    return (
      <span className="inline-flex items-center gap-2">
        <Icon className="w-4 h-4" />
        {label}
      </span>
    );
  };

  return (
    <NavigationMenu className="hidden lg:block">
      <NavigationMenuList>
        {navbarItems.map(({ href, label, Icon }) => (
          <NavigationMenuItem key={href}>
            <NavigationMenuLink asChild>
              <Link href={href} className={navigationMenuTriggerStyle()}>
                {getLabelWithIcon(label, Icon)}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
